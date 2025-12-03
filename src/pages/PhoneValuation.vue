<template>
  <div class="phone-page">
    <div class="app-container">
      <div class="header">
        <h1 class="title">寻找10年以上过万尾号</h1>
      </div>

      <PhoneInput
        v-model="phoneInput"
        :loading="loading"
        @query="handleQuery"
      />

      <el-skeleton v-if="loading" :rows="3" animated style="margin-top: 10px;" />

      <ResultCard v-if="result" :analysis="result" />

      <el-alert
        v-if="error"
        :title="error"
        type="error"
        :closable="false"
        show-icon
        style="max-width: 100%; margin: 12px auto;"
      />

      <CelebrationAnimation
        :visible="showCelebration"
        :grade="currentGrade"
        @close="showCelebration = false"
      />

      <div class="warm-tip">
        温馨提示：手机号估值结果仅供娱乐，切勿当真！
      </div>

      <!-- 悬浮开关 -->
      <div class="floating-switch">
        <span class="switch-icon">🤖</span>
        <el-switch
          v-model="isAutoMode"
          inline-prompt
          active-text="演示"
          inactive-text="关"
          @change="handleAutoSwitch"
          style="--el-switch-on-color: #10b981; --el-switch-off-color: #ef4444;"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
const GlobalEP: any = (window as any).ElementPlus
import PhoneInput from '../components/phone/PhoneInput.vue'
import { defineAsyncComponent } from 'vue'
const ResultCard = defineAsyncComponent(() => import('../components/phone/ResultCard.vue'))
const CelebrationAnimation = defineAsyncComponent(() => import('../components/phone/CelebrationAnimation.vue'))
import { validateTailNumber, extractTailNumber } from '../utils/phone/phoneValidator'
import { analyzeTailNumber } from '../utils/phone/valuation'
import { generateSuggestion, generateBlessing } from '../utils/phone/suggestions'
import type { TailNumberAnalysis, Grade as GradeType } from '../types/phone'

const loading = ref(false)
const result = ref<TailNumberAnalysis | null>(null)
const error = ref('')
const showCelebration = ref(false)
const currentGrade = ref<GradeType | undefined>(undefined)
const cache = ref(new Map<string, TailNumberAnalysis>())
const phoneInput = ref('')

// 自动演示相关
const isAutoMode = ref(false)
let autoTimer: any = null

const generateRandomTail = () => {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

const startAutoRun = () => {
  const run = () => {
    const tail = generateRandomTail()
    phoneInput.value = tail
    handleQuery(tail)
  }
  run()
  autoTimer = setInterval(run, 5000)
}

const stopAutoRun = () => {
  if (autoTimer) {
    clearInterval(autoTimer)
    autoTimer = null
  }
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

// 监听result变化，根据级别显示不同的动画
watch(result, (newResult) => {
  if (newResult) {
    currentGrade.value = newResult.grade
    showCelebration.value = newResult.grade === 'S' || newResult.grade === 'A'
  }
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
  showCelebration.value = false

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
</script>

<style scoped>
.phone-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  background-color: #FEF9C3; /* Light yellow background */
}

.app-container {
  min-height: 100vh;
  /* background-image: url('https://i.cetsteam.com/imgs/2025/11/29/49bda7adb7f2dfcc.webp'); */
  background-color: #FEF9C3;
  background-image: radial-gradient(#FDE047 2px, transparent 2px);
  background-size: 20px 20px;
  padding: 8px 12px;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 480px;
}
.header {
  text-align: center;
  margin-bottom: 10px;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  padding-top: 35px;
}

.title {
  font-size: 28px;
  font-weight: 900;
  margin: 0 0 4px 0;
  color: #fff;
  -webkit-text-stroke: 2px #000;
  text-shadow: 3px 3px 0px #000;
  letter-spacing: 1px;
  transform: rotate(-2deg);
  display: inline-block;
}

.subtitle {
  font-size: 12px;
  margin: 0;
  opacity: 0.95;
  font-weight: 700;
  color: #000;
  background: #fff;
  padding: 2px 10px;
  border: 2px solid #000;
  border-radius: 20px;
  display: inline-block;
  box-shadow: 2px 2px 0px #000;
}

.switch-label {
  font-size: 12px;
  font-weight: 700;
  color: #000;
  background: #fff;
  padding: 2px 8px;
  border: 2px solid #000;
  border-radius: 12px;
  box-shadow: 2px 2px 0px #000;
}

.warm-tip {
  margin-top: auto;
  text-align: center;
  font-size: 12px;
  color: #000;
  padding: 8px 12px;
  background: #fff;
  border: 2px solid #000;
  border-radius: 12px;
  box-shadow: 3px 3px 0px #000;
  font-weight: 700;
  letter-spacing: 0.5px;
  line-height: 1.4;
  position: relative;
  margin-bottom: 6px;
  z-index: 1;
}

/* 移除伪元素，直接在内容里加图标更好，或者调整样式 */
.warm-tip::before {
  content: '💡';
  margin-right: 6px;
}

.warm-tip::after {
  content: none;
}

.floating-switch {
  position: fixed;
  bottom: 60px;
  right: -50px; /* 露出图标，方便点击 */
  z-index: 999;
  background: #fff;
  padding: 6px 10px 6px 14px;
  border: 2px solid #000;
  border-right: none;
  border-radius: 30px 0 0 30px;
  box-shadow: -2px 2px 0px #000;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer; /* 增加手型 */
}

.floating-switch:hover, .floating-switch:active {
  right: -2px;
  padding-right: 14px;
}

.switch-icon {
  font-size: 16px;
  margin-right: 8px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.floating-switch:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0px #000;
}

@media (max-width: 480px) {
  .app-container {
    padding: 8px 12px;
    max-width: 100%;
  }

  .title {
    font-size: 28px;
  }

  .subtitle {
    font-size: 12px;
  }

  .warm-tip {
    font-size: 12px;
    padding: 8px 12px;
  }
}
</style>
