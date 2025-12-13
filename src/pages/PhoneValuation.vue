<template>
  <div class="phone-page">
    <div class="app-container">
      <!-- 水墨背景层 -->
      <div class="ink-bg"></div>
      <div class="ink-overlay"></div>

      <!-- 主要内容区域（输入态） -->
      <div class="main-content" :class="{ 'has-result': !!result }">
        <div class="header">
          <h1 class="title">手机尾号 ‧ 趣味解读</h1>
          <p class="subtitle">仅供娱乐 ‧ 探索数字魅力</p>
        </div>

        <PhoneInput
          v-model="phoneInput"
          :loading="loading"
          @query="handleQuery"
        />

        <el-skeleton v-if="loading" :rows="3" animated style="margin-top: 20px; --el-skeleton-color: rgba(255,255,255,0.2);" />

        <el-alert
          v-if="error"
          :title="error"
          type="error"
          :closable="false"
          show-icon
          style="max-width: 100%; margin: 12px auto; background: rgba(255,0,0,0.1); border: 1px solid rgba(255,0,0,0.2); color: #fff;"
        />
      </div>

      <!-- 结果弹窗层 -->
      <div v-if="result" class="result-overlay" @click.self="handleCloseResult">
        <ResultCard :analysis="result" @close="handleCloseResult" />
      </div>

      <div class="live-notice-bar">
        <div class="notice-content">
          <span class="notice-item"><i class="icon">👍</i>点赞关注免费解读</span>
          <span class="separator">|</span>
          <span class="notice-item"><i class="icon">💖</i> 3个小心心优先</span>
          <span class="separator">|</span>
          <span class="notice-item highlight"><i class="icon">🍭</i>棒棒糖插队</span>
          <span class="separator">|</span>
          <span class="notice-item highlight-vip"><i class="icon">🕶️</i>墨镜立即安排</span>
        </div>
      </div>

      <!-- 悬浮开关 -->
      <div class="floating-switch" :class="{ expanded: isSwitchExpanded }" @click="toggleSwitchExpand">
        <span class="switch-icon">🏮</span>
        <div class="switch-content" @click.stop>
          <el-switch
            v-model="isAutoMode"
            inline-prompt
            inactive-text="关"
            @change="handleAutoSwitch"
            style="--el-switch-on-color: #c0392b; --el-switch-off-color: #7f8c8d;"
          />
        </div>
      </div>

      <!-- 音乐播放控制 -->
      <div class="music-control" @click="toggleMusic" :class="{ 'is-playing': isPlaying }">
        <span class="music-icon" :class="{ spinning: isPlaying }">🎵</span>
      </div>
      <audio ref="audioRef" loop preload="auto" src="/assets/hello.mp3"></audio>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, onMounted } from 'vue'
const GlobalEP: any = (window as any).ElementPlus
import PhoneInput from '../components/phone/PhoneInput.vue'
import { defineAsyncComponent } from 'vue'
const ResultCard = defineAsyncComponent(() => import('../components/phone/ResultCard.vue'))
import { validateTailNumber, extractTailNumber } from '../utils/phone/phoneValidator'
import { analyzeTailNumber } from '../utils/phone/valuation'
import { generateSuggestion, generateBlessing } from '../utils/phone/suggestions'
import type { TailNumberAnalysis } from '../types/phone'

const loading = ref(false)
const result = ref<TailNumberAnalysis | null>(null)
const error = ref('')
const cache = ref(new Map<string, TailNumberAnalysis>())
const phoneInput = ref('')

// 音乐播放相关
const isPlaying = ref(false)
const audioRef = ref<HTMLAudioElement | null>(null)

const toggleMusic = () => {
  if (!audioRef.value) return
  
  if (isPlaying.value) {
    audioRef.value.pause()
    isPlaying.value = false
  } else {
    audioRef.value.play().then(() => {
      isPlaying.value = true
    }).catch(err => {
      console.error('播放失败:', err)
    })
  }
}

onMounted(() => {
  // 尝试自动播放
  if (audioRef.value) {
    audioRef.value.volume = 0.6 // 设置合适音量
    const playPromise = audioRef.value.play()
    if (playPromise !== undefined) {
      playPromise.then(() => {
        isPlaying.value = true
      }).catch(error => {
        console.log('自动播放被阻止，需要用户交互:', error)
      })
    }
  }
})

// 自动演示相关
const isAutoMode = ref(false)
const isSwitchExpanded = ref(false)
let autoTimer: any = null
let isRunningLoop = false

const toggleSwitchExpand = () => {
  isSwitchExpanded.value = !isSwitchExpanded.value
}

const generateRandomTail = () => {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

// 辅助函数：延迟
const delay = (ms: number) => new Promise(resolve => {
  autoTimer = setTimeout(resolve, ms)
})

// 模拟输入效果
const simulateInput = async (text: string) => {
  phoneInput.value = ''
  for (let i = 0; i < text.length; i++) {
    if (!isAutoMode.value) return
    phoneInput.value += text[i]
    await delay(200) // 模拟打字速度
  }
}

const autoPlayLoop = async () => {
  if (isRunningLoop) return
  isRunningLoop = true
  
  while (isAutoMode.value) {
    try {
      // 1. 准备随机号码
      const tail = generateRandomTail()
      
      // 2. 模拟输入
      await simulateInput(tail)
      if (!isAutoMode.value) break
      
      // 3. 稍微停顿一下再查询
      await delay(500)
      if (!isAutoMode.value) break

      // 4. 触发查询
      handleQuery(tail)
      
      // 5. 等待结果展示 5秒
      await delay(5000)
      if (!isAutoMode.value) break
      
      // 6. 关闭弹窗
      handleCloseResult()
      
      // 7. 间隔 2秒 再开始下一轮
      await delay(2000)
    } catch (e) {
      console.error('Auto play error:', e)
      break
    }
  }
  
  isRunningLoop = false
}

const startAutoRun = () => {
  autoPlayLoop()
}

const stopAutoRun = () => {
  if (autoTimer) {
    clearTimeout(autoTimer)
    autoTimer = null
  }
  handleCloseResult()
  phoneInput.value = ''
}

const handleAutoSwitch = (val: boolean) => {
  if (val) {
    startAutoRun()
  } else {
    stopAutoRun()
  }
}

onUnmounted(() => {
  stopAutoRun()
})

const handleQuery = async (input: string) => {
  // 提取并验证尾号
  const tailNumber = extractTailNumber(input)
  
  if (!validateTailNumber(tailNumber)) {
    GlobalEP?.ElMessage?.error('请输入4位数字尾号')
    error.value = '请输入4位数字尾号'
    result.value = null
    return
  }

  error.value = ''
  loading.value = true

  try {
    if (cache.value.has(tailNumber)) {
      result.value = cache.value.get(tailNumber) as TailNumberAnalysis
    } else {
      const analysis = analyzeTailNumber(tailNumber)
      analysis.suggestion = generateSuggestion(analysis)
      analysis.blessing = generateBlessing(analysis)
      cache.value.set(tailNumber, analysis)
      result.value = analysis
    }
  } catch (err) {
    GlobalEP?.ElMessage?.error('分析失败，请重试')
    error.value = '分析失败，请重试'
    result.value = null
  } finally {
    loading.value = false
  }
}

const handleCloseResult = () => {
  result.value = null
}
</script>

<style scoped>
.phone-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  background-color: #1a1a1a;
  font-family: 'Noto Serif SC', serif;
}

.app-container {
  min-height: 100vh;
  background-color: #f5f5f0;
  position: relative;
  overflow-x: hidden;
  overflow-y: hidden; /* 改为hidden，内容通过flex布局自适应 */
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 480px;
  padding: 20px 16px 120px; /* 底部留白防止遮挡 */
}

/* 水墨背景层 */
.ink-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('https://images.unsplash.com/photo-1515096788709-a3cf4ce0a4a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80');
  background-size: cover;
  background-position: center;
  opacity: 0.15;
  z-index: 0;
  pointer-events: none;
  filter: grayscale(100%) contrast(1.2);
}

.ink-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, transparent 0%, rgba(20, 20, 20, 0.8) 100%);
  z-index: 0;
  pointer-events: none;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 垂直居中 */
  position: relative;
  z-index: 1;
  padding-bottom: 60px; /* 视觉重心上移一点 */
  transition: all 0.3s ease;
}

.main-content.has-result {
  filter: blur(2px);
  opacity: 0.5;
  pointer-events: none;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
}

.title {
  font-family: 'Ma Shan Zheng', cursive;
  font-size: 30px; /* 加大标题 */
  font-weight: 400;
  margin: 0 0 12px 0;
  color: #c0392b;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  letter-spacing: 4px;
}

.subtitle {
  font-size: 16px;
  margin: 0;
  color: #555;
  font-weight: 400;
  letter-spacing: 2px;
  opacity: 0.8;
}

/* 结果弹窗层 */
.result-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* 直播互动公告栏 */
.live-notice-bar {
  margin-top: auto;
  width: 100%;
  height: 40px;
  background: rgba(192, 57, 43, 0.1); /* 红色背景 */
  border: 1px solid rgba(192, 57, 43, 0.3);
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  z-index: 1;
}

.notice-content {
  display: flex;
  align-items: center;
  white-space: nowrap;
  animation: scroll-left 15s linear infinite;
  padding-left: 100%; /* 从右侧开始 */
}

.notice-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #fc0d0d;
  font-weight: 500;
}

.notice-item .icon {
  margin-right: 4px;
  font-style: normal;
}

.notice-item.highlight {
  color: #d35400;
  font-weight: bold;
}

.notice-item.highlight-vip {
  color: #c0392b;
  font-weight: bold;
  font-size: 15px;
}

.separator {
  margin: 0 12px;
  color: #ccc;
  font-size: 12px;
}

@keyframes scroll-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}

/* 悬浮开关样式调整 */
.floating-switch {
  position: fixed;
  right: 0;
  bottom: 40px;
  transform-origin: right bottom;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 10px 6px 10px 14px;
  border-radius: 30px 0 0 30px;
  box-shadow: -2px 2px 8px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  z-index: 100;
  border: 1px solid rgba(192, 57, 43, 0.2);
  border-right: none;
  width: 50px; /* 收起时的宽度，只显示灯笼 */
  height: 50px;
  box-sizing: border-box;
  overflow: hidden;
  white-space: nowrap;
}

.floating-switch.expanded {
  width: 120px; /* 展开后的宽度 */
  padding-right: 12px;
}

.floating-switch:hover {
  background: #fff;
  box-shadow: -2px 4px 12px rgba(192, 57, 43, 0.15);
}

.switch-icon {
  font-size: 24px;
  margin-right: 0;
  flex-shrink: 0;
  filter: grayscale(0.1);
  transition: all 0.3s ease;
  line-height: 1;
}

.floating-switch.expanded .switch-icon {
  margin-right: 8px;
}

.switch-content {
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.3s ease;
  pointer-events: none;
}

.floating-switch.expanded .switch-content {
  opacity: 1;
  transform: translateX(0);
  pointer-events: auto;
}

/* 音乐播放器样式调整 */
.music-control {
  position: fixed;
  top: 20px;
  right: 10px;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 2px solid #c0392b; /* 中国红边框 */
  transition: all 0.3s ease;
}

.music-control:hover {
  transform: scale(1.1);
  background: #fff;
}

.music-control.is-playing {
  background: #fff;
  box-shadow: 0 0 20px rgba(192, 57, 43, 0.4);
}

.music-icon {
  font-size: 9px;
  color: #c0392b;
}

.spinning {
  animation: spin 4s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
