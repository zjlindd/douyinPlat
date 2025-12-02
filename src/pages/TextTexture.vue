<template>
  <div class="texture-page">
    <div class="app-container">
      <div class="top-area">
        <div class="header">
          <h1 class="title">🎨 艺术字工坊 🎨</h1>
          <p class="subtitle">让名字变身创意画作</p>
        </div>

        <div class="form-card">
          <div class="form-row">
            <el-input v-model="text" placeholder="输入文字 (如: 张三)" class="cartoon-input flex-2" />
            <el-select v-model="font" placeholder="字体" class="cartoon-select flex-1">
              <el-option label="书法体" value="dongfangdakai" />
              <el-option label="普惠体" value="puhuiti" />
              <el-option label="黑体" value="siyuanheiti_m" />
              <el-option label="快乐体" value="kuaileti" />
              <el-option label="文艺体" value="wenyiti" />
              <el-option label="酷黑体" value="kuheiti" />
              <el-option label="仿宋" value="fangzhengfangsong" />
              <el-option label="楷体" value="fangzhengkaiti" />
            </el-select>
          </div>
          
          <div class="form-row mt-2">
            <el-input v-model="prompt" placeholder="创意描述 (如: 水果, 鲜花)" class="cartoon-input flex-2" />
            <el-select v-model="style" placeholder="选择风格" class="cartoon-select flex-1">
              <el-option label="默认风格" value="material" />
              <el-option label="瀑布流水" value="waterfall" />
              <el-option label="雪域高原" value="snow_plateau" />
              <el-option label="原始森林" value="forest" />
              <el-option label="天空遨游" value="sky" />
              <el-option label="国风建筑" value="chinese_building" />
              <el-option label="奇幻卡通" value="cartoon" />
              <el-option label="乐高积木" value="lego" />
              <el-option label="繁花盛开" value="flower" />
              <el-option label="亚克力" value="acrylic" />
              <el-option label="大理石" value="marble" />
              <el-option label="绒线毛毡" value="felt" />
              <el-option label="复古油画" value="oil_painting" />
              <el-option label="水彩" value="watercolor_painting" />
              <el-option label="中国画" value="chinese_painting" />
              <el-option label="工笔画" value="claborate_style_painting" />
              <el-option label="城市夜景" value="city_night" />
              <el-option label="湖光山色" value="mountain_lake" />
              <el-option label="秋日落叶" value="autumn_leaves" />
              <el-option label="青龙献瑞" value="green_dragon" />
              <el-option label="赤龙呈祥" value="red_dragon" />
            </el-select>
          </div>

          <el-button
            class="cartoon-btn mt-3"
            :loading="loading"
            @click="generate"
          >✨ 开始施法 ✨</el-button>
        </div>
      </div>

      <div class="content-area">
        <el-alert v-if="error" :title="error" type="error" :closable="false" show-icon class="cartoon-alert mb-3" />
        
        <div v-if="statusMsg" class="status-card mb-3">
          <div class="status-icon">⏳</div>
          <div class="status-text">{{ statusMsg }}</div>
          <el-progress :percentage="progress" :show-text="false" stroke-width="12" class="cartoon-progress" />
        </div>

        <div v-if="images.length" class="images-grid">
          <div v-for="(img, i) in images" :key="i" class="image-item">
            <div class="image-frame">
              <el-image :src="img" fit="cover" class="result-img" :preview-src-list="images" :initial-index="i" />
            </div>
            <div class="image-actions">
              <button class="action-btn" @click="downloadImage(img, i)">
                📥 保存图片
              </button>
            </div>
          </div>
        </div>
        
        <div v-else-if="!loading && !statusMsg" class="empty-state">
          <div class="empty-icon">🖼️</div>
          <p>输入文字和灵感<br>打造你的专属艺术字</p>
        </div>

        <pre v-if="rawJson" class="debug-info">{{ rawJson }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const text = ref('')
const font = ref('dongfangdakai')
const prompt = ref('')
const style = ref('material')
const loading = ref(false)
const error = ref('')
const statusMsg = ref('')
const progress = ref(0)
const images = ref<string[]>([])
const rawJson = ref('')
// hidden params
const ratio = ref('1:1')
const shortSize = ref(704)
const count = ref(1)
const alpha = ref(false)

const generate = async () => {
  if (!text.value) {
    error.value = '请输入文字'
    return
  }
  if (!prompt.value) {
    error.value = '请输入创意描述'
    return
  }

  error.value = ''
  images.value = []
  rawJson.value = ''
  loading.value = true
  statusMsg.value = ''
  progress.value = 0
  try {
    const key = import.meta.env.VITE_DASHSCOPE_API_KEY || 'sk-027b75e2c81047cfa20e0cbbb28af2b9'
    if (!key) {
      error.value = '缺少 API Key，请在 .env.local 配置 VITE_DASHSCOPE_API_KEY 后重启开发服务'
      return
    }

    const body = {
      model: 'wordart-texture',
      input: {
        text: { text_content: text.value, font_name: font.value, output_image_ratio: ratio.value },
        prompt: prompt.value,
        texture_style: style.value
      },
      parameters: { image_short_size: shortSize.value, n: count.value, alpha_channel: alpha.value }
    }

    const resp = await fetch('/api/wordart-texture', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${key}`,
        'X-DashScope-Async': 'enable'
      },
      body: JSON.stringify(body)
    })
    
    const json = await resp.json()
    const urls = json?.output?.images || json?.images || json?.output?.image_urls || []
    const taskId = json?.output?.task_id || json?.task_id || ''
    
    if (Array.isArray(urls) && urls.length) {
      images.value = urls
      progress.value = 100
    } else if (taskId) {
      statusMsg.value = '正在施法中...'
      await pollTask(taskId, key)
    } else {
      rawJson.value = JSON.stringify(json, null, 2)
      error.value = json.message || '生成失败'
    }
  } catch (e: any) {
    error.value = '生成失败，请稍后重试'
  } finally {
    loading.value = false
    if (images.value.length) statusMsg.value = ''
    if (images.value.length) progress.value = 100
  }
}

const pollTask = async (taskId: string, key: string) => {
  for (let i = 0; i < 12; i++) {
    await new Promise((r) => setTimeout(r, 1000))
    progress.value = Math.round(((i + 1) / 12) * 100)
    const res = await fetch(`/api/dashscope-task/${taskId}`, {
      headers: { Accept: 'application/json', Authorization: `Bearer ${key}` }
    })
    const tj = await res.json()
    const status = tj?.output?.task_status || tj?.task_status
    if (status === 'SUCCEEDED') {
      const results = tj?.output?.results || []
      const urls = Array.isArray(results) ? results.map((r: any) => r.url).filter(Boolean) : []
      if (urls.length) images.value = urls
      statusMsg.value = ''
      progress.value = 100
      return
    }
    if (status === 'FAILED') {
      error.value = '生成失败'
      statusMsg.value = ''
      progress.value = 0
      return
    }
  }
  rawJson.value = '任务超时，请稍后重试'
  statusMsg.value = ''
  progress.value = 0
}

const downloadImage = async (url: string, index: number) => {
  try {
    const res = await fetch(url)
    const blob = await res.blob()
    const a = document.createElement('a')
    const objectUrl = URL.createObjectURL(blob)
    a.href = objectUrl
    a.download = `text-texture-${Date.now()}-${index + 1}.jpg`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(objectUrl)
  } catch (e) {
    window.open(url, '_blank')
  }
}
</script>

<style scoped>
.texture-page {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  background-color: #f0f9ff; /* sky blue tint */
  background-image: radial-gradient(#bae6fd 2px, transparent 2px);
  background-size: 20px 20px;
  overflow: hidden;
}

.app-container {
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 480px;
  box-sizing: border-box;
}

.top-area { flex-shrink: 0; margin-bottom: 12px; }

.header { text-align: center; margin-bottom: 12px; }
.title {
  font-size: 24px; font-weight: 900; color: #0c4a6e; margin: 0;
  text-shadow: 2px 2px 0px #38bdf8;
  transform: rotate(-2deg);
}
.subtitle { font-size: 13px; color: #0369a1; margin: 4px 0 0; font-weight: 600; }

.form-card {
  background: #fff;
  border: 3px solid #000;
  border-radius: 16px;
  padding: 12px;
  box-shadow: 4px 4px 0px #000;
}

.form-row { display: flex; gap: 8px; }
.mt-2 { margin-top: 8px; }
.mt-3 { margin-top: 12px; }
.mb-3 { margin-bottom: 12px; }
.flex-1 { flex: 1; }
.flex-2 { flex: 2; }

/* Cartoon Inputs */
:deep(.cartoon-input .el-input__wrapper),
:deep(.cartoon-select .el-input__wrapper) {
  border-radius: 12px;
  border: 2px solid #000 !important;
  box-shadow: none !important;
  padding: 4px 12px;
  background: #fff;
}
:deep(.el-input__inner) { font-weight: 700; color: #000; }

/* Cartoon Button */
.cartoon-btn {
  width: 100%;
  height: 44px;
  border-radius: 12px !important;
  border: 2px solid #000 !important;
  background: #38bdf8 !important; /* sky-400 */
  color: #000 !important;
  font-weight: 900 !important;
  font-size: 16px !important;
  box-shadow: 2px 2px 0px #000 !important;
  transition: all 0.1s;
}
.cartoon-btn:active { transform: translate(2px, 2px); box-shadow: none !important; }

.content-area {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px;
  scrollbar-width: none;
}
.content-area::-webkit-scrollbar { display: none; }

/* Status Card */
.status-card {
  background: #fff;
  border: 3px solid #000;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 3px 3px 0px #000;
  display: flex; flex-direction: column; align-items: center;
}
.status-icon { font-size: 24px; margin-bottom: 4px; animation: spin 2s linear infinite; }
.status-text { font-weight: 700; margin-bottom: 8px; }
:deep(.cartoon-progress .el-progress-bar__outer) {
  border: 2px solid #000;
  background-color: #fff;
  border-radius: 6px;
}
:deep(.cartoon-progress .el-progress-bar__inner) {
  background-color: #38bdf8;
  border-radius: 4px;
}

/* Cartoon Alert */
.cartoon-alert { border: 2px solid #000; border-radius: 8px; font-weight: 700; }

/* Images Grid */
.images-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
.image-item {
  background: #fff;
  border: 3px solid #000;
  border-radius: 16px;
  padding: 12px;
  box-shadow: 4px 4px 0px #000;
  transition: transform 0.1s;
}
.image-frame {
  border: 2px solid #000;
  border-radius: 8px;
  overflow: hidden;
  background: #f0f9ff;
}
.result-img { display: block; width: 100%; height: 200px; object-fit: cover; }

.image-actions { margin-top: 12px; display: flex; justify-content: center; }
.action-btn {
  background: #a7f3d0;
  border: 2px solid #000;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 800;
  color: #000;
  cursor: pointer;
  box-shadow: 2px 2px 0px #000;
  transition: all 0.1s;
}
.action-btn:active { transform: translate(2px, 2px); box-shadow: none; }

/* Empty State */
.empty-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  height: 200px;
  text-align: center;
  opacity: 0.6;
}
.empty-icon { font-size: 48px; margin-bottom: 12px; filter: grayscale(1); }
.empty-state p { font-weight: 700; color: #0369a1; line-height: 1.5; }

.debug-info { font-size: 10px; color: #666; background: #eee; padding: 8px; margin-top: 20px; overflow: auto; }

@keyframes spin { 100% { transform: rotate(360deg); } }
</style>