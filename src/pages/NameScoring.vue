<template>
  <div class="name-page">
    <div class="app-container">
      <div class="top-area">
        <div class="header">
          <h1 class="title">✨ 姓名大挑战 ✨</h1>
          <p class="subtitle">看看你的名字有多少分？</p>
        </div>

        <div class="form-card">
          <div class="input-group">
            <el-input
              v-model="nameInput"
              placeholder="输入姓名..."
              clearable
              class="cartoon-input"
              @keyup.enter="handleSubmit"
            />
            <el-button
              class="cartoon-btn"
              :disabled="!canSubmit"
              :loading="loading"
              @click="handleSubmit"
            >GO!</el-button>
          </div>
          <el-alert
            v-if="notice"
            :title="notice"
            type="warning"
            :closable="false"
            show-icon
            style="margin-top: 10px; border: 2px solid #000; border-radius: 8px;"
          />
        </div>
      </div>

      <div class="content-area">
        <el-skeleton v-if="loading" :rows="4" animated class="cartoon-skeleton" />

        <div v-if="error" class="error-wrap">
          <el-alert :title="error" type="error" :closable="false" show-icon style="border: 2px solid #000;" />
        </div>

        <div v-if="data" class="result-wrap">
          <div class="score-card">
            <div class="score-header">
              <div class="score-badge">
                <span class="score-val">{{ data.description?.score || '?' }}</span>
                <span class="score-unit">分</span>
              </div>
              <div class="score-text">
                <div class="score-title">{{ data.description?.title }}</div>
                <div class="score-summary">“{{ data.jixiong }}”</div>
              </div>
            </div>
            <div class="score-desc">{{ data.description?.description }}</div>
          </div>

          <div class="info-grid">
            <div class="info-item mini-card">
              <div class="mini-label">总格</div>
              <div class="mini-val">{{ data.count }}画</div>
            </div>
            <div class="info-item mini-card">
              <div class="mini-label">三才</div>
              <div class="mini-val">{{ data.三才 }}</div>
            </div>
            <div class="info-item full-card">
              <div class="chips">
                 <span class="chip-label">五行:</span>
                 <span v-for="(w, idx) in data.wuxing" :key="idx" class="chip chip-wuxing">{{ w }}</span>
              </div>
            </div>
          </div>

          <div class="wuge-list">
            <div class="wuge-item" v-for="(item, key) in wugeList" :key="key">
              <div class="wuge-head">
                <span class="wuge-name">{{ item.name }} <small>({{ item.val }})</small></span>
                <span class="wuge-tag" :class="getXiongjiClass(item.desc?.xiongji)">{{ item.desc?.xiongji }}</span>
              </div>
              <div class="wuge-detail">{{ item.desc?.desc }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface NameScoringResponse {
  errcode: number
  errmsg: string
  notice: string
  data: {
    name: string
    count: number
    description: { score: string; title: string; description: string }
    jixiong: string
    bihua: number[]
    wuxing: string[]
    天格: number
    天格描述: { desc: string; xiongji: string; desc1: string; score: string }
    地格: number
    地格描述: { desc: string; xiongji: string; desc1: string; score: string }
    人格: number
    人格描述: { desc: string; xiongji: string; desc1: string; score: string }
    总格: number
    总格描述: { desc: string; xiongji: string; desc1: string; score: string }
    外格: number
    外格描述: { desc: string; xiongji: string; desc1: string; score: string }
    三才: string
  }
}

const API_URL = import.meta.env.DEV ? '/api/name-scoring' : 'https://52tuhu.cn/api/name-scoring/'
const nameInput = ref('')
const loading = ref(false)
const error = ref('')
const notice = ref('')
const data = ref<NameScoringResponse['data'] | null>(null)

const canSubmit = computed(() => nameInput.value.trim().length > 0)
const wugeList = computed(() => {
  if (!data.value) return []
  return [
    { name: '天格', val: data.value.天格, desc: data.value.天格描述 },
    { name: '人格', val: data.value.人格, desc: data.value.人格描述 },
    { name: '地格', val: data.value.地格, desc: data.value.地格描述 },
    { name: '外格', val: data.value.外格, desc: data.value.外格描述 },
    { name: '总格', val: data.value.总格, desc: data.value.总格描述 },
  ]
})

const handleSubmit = async () => {
  error.value = ''
  data.value = null
  notice.value = ''
  const name = nameInput.value.trim()
  if (!name) return
  loading.value = true
  try {
    const params = new URLSearchParams({ name })
    const resp = await fetch(`${API_URL}?${params.toString()}`, { method: 'GET' })
    const json = (await resp.json()) as NameScoringResponse
    notice.value = json.notice || ''
    if (json.errcode !== 0) {
      error.value = json.errmsg || '请求失败'
      return
    }
    data.value = json.data
  } catch (e: any) {
    error.value = '网络或服务异常，请稍后重试'
  } finally {
    loading.value = false
  }
}

const getXiongjiClass = (text: string | undefined) => {
  if (!text) return ''
  if (text.includes('吉')) return 'tag-ji'
  if (text.includes('凶')) return 'tag-xiong'
  return ''
}
</script>

<style scoped>
.name-page {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  background-color: #fefce8; /* soft yellow */
  background-image: radial-gradient(#fde047 2px, transparent 2px);
  background-size: 20px 20px;
  overflow: hidden;
}

.app-container {
  height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 480px;
  box-sizing: border-box;
}

.top-area {
  flex-shrink: 0;
  margin-bottom: 8px;
}

.header { text-align: center; margin-bottom: 8px; }
.title {
  font-size: 20px; font-weight: 900; color: #1f2937; margin: 0;
  text-shadow: 2px 2px 0px #fbbf24;
  transform: rotate(-2deg);
}
.subtitle { font-size: 12px; color: #4b5563; margin: 2px 0 0; font-weight: 600; }

.form-card {
  background: #fff;
  border: 3px solid #000;
  border-radius: 12px;
  padding: 8px;
  box-shadow: 3px 3px 0px #000;
}

.input-group { display: flex; gap: 6px; }
:deep(.cartoon-input .el-input__wrapper) {
  border-radius: 10px;
  border: 2px solid #000 !important;
  box-shadow: none !important;
  padding: 2px 10px;
  height: 32px;
}
:deep(.cartoon-input .el-input__inner) { font-weight: 700; color: #000; height: 32px; }
.cartoon-btn {
  border-radius: 10px !important;
  border: 2px solid #000 !important;
  background: #fbbf24 !important;
  color: #000 !important;
  font-weight: 900 !important;
  box-shadow: 2px 2px 0px #000 !important;
  transition: all 0.1s;
  height: 36px;
  padding: 0 16px;
}
.cartoon-btn:active { transform: translate(2px, 2px); box-shadow: none !important; }

.content-area {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 10px;
  /* Hide scrollbar for sleek look */
  scrollbar-width: none; 
}
.content-area::-webkit-scrollbar { display: none; }

.result-wrap {
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.score-card {
  background: #fff;
  border: 3px solid #000;
  border-radius: 12px;
  padding: 8px;
  box-shadow: 3px 3px 0px #000;
  margin-top: 8px;
  position: relative;
  overflow: hidden;
}
.score-header { display: flex; align-items: center; gap: 10px; }
.score-badge {
  width: 56px; height: 56px;
  background: #ef4444;
  border: 3px solid #000;
  border-radius: 50%;
  display: flex; flex-direction: column; justify-content: center; align-items: center;
  color: #fff;
  transform: rotate(-5deg);
  box-shadow: 2px 2px 0px #000;
}
.score-val { font-size: 22px; font-weight: 900; line-height: 1; }
.score-unit { font-size: 10px; font-weight: 700; }
.score-text { flex: 1; }
.score-title { font-size: 16px; font-weight: 900; color: #000; }
.score-summary { font-size: 12px; color: #000; background: #fbbf24; display: inline-block; padding: 1px 6px; border-radius: 4px; border: 2px solid #000; margin-top: 2px; font-weight: 700; }
.score-desc { margin-top: 6px; font-size: 12px; line-height: 1.3; color: #333; border-top: 2px dashed #000; padding-top: 6px; }

.info-grid {
  display: flex; gap: 6px; margin-top: 8px;
}
.info-item {
  background: #fff; border: 3px solid #000; border-radius: 10px; padding: 6px;
  box-shadow: 2px 2px 0px #000;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.mini-card { flex: 1; }
.mini-label { font-size: 10px; font-weight: 700; color: #666; }
.mini-val { font-size: 14px; font-weight: 900; color: #000; margin-top: 0px; }
.full-card { flex: 2; align-items: flex-start; justify-content: center; padding-left: 10px; }
.chips { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
.chip-label { font-weight: 700; font-size: 11px; margin-right: 2px;}
.chip-wuxing {
  background: #a7f3d0; border: 1.5px solid #000; border-radius: 4px;
  padding: 0 4px; font-weight: 700; font-size: 11px; color: #000;
}

.wuge-list {
  display: flex; flex-direction: column; gap: 6px; margin-top: 8px;
}
.wuge-item {
  background: #fff;
  border: 2px solid #000;
  border-radius: 10px;
  padding: 6px 8px;
  box-shadow: 2px 2px 0px #000;
  transition: transform 0.1s;
}
.wuge-item:active { transform: translate(2px, 2px); box-shadow: 1px 1px 0px #000; }
.wuge-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; }
.wuge-name { font-weight: 900; font-size: 14px; color: #000; }
.wuge-name small { font-size: 11px; color: #666; font-weight: normal; }
.wuge-tag {
  font-size: 10px; padding: 1px 4px; border-radius: 4px;
  border: 1.5px solid #000; font-weight: 700;
}
.tag-ji { background: #a7f3d0; color: #000; }
.tag-xiong { background: #fca5a5; color: #000; }
.wuge-detail { font-size: 12px; color: #333; line-height: 1.3; }

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>