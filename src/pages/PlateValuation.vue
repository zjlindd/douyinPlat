<template>
  <div class="plate-valuation-page">
    <div class="container">
      <!-- 标题区域 -->
      <header class="header">
        <h1 class="main-title">寻找至尊车牌</h1>
        <p class="subtitle">💝 小心心参与 🍭 棒棒糖插队 👍 88个赞或关注参与</p>
      </header>

      <!-- 车牌输入区域 -->
      <main class="main-content">
        <section v-if="!showResult" class="input-section">
          <PlateInput
            :plate-parts="plateParts"
            :current-input-index="currentInputIndex"
            :show-keyboard="showKeyboard"
            :provinces="provinces"
            @focus-input="handleFocusInput"
            @key-press="handleKeyPress"
            @delete="handleDelete"
            @confirm="handleConfirm"
            @skip-energy="handleSkipEnergy"
          />
        </section>

        <!-- 结果区域 -->
        <section v-if="showResult && valuationResult" class="result-section">
          <ResultDisplay
            :result="valuationResult"
          />
          
          <div class="action-buttons">
            <button class="btn-retry" @click="handleRetry">再测一个</button>
          </div>
        </section>

        <!-- 温馨提示 -->
        <footer class="tip-section">
          <p class="tip-text">温馨提示：车牌估值结果仅供娱乐，切勿当真！</p>
        </footer>
      </main>

      <!-- 庆祝动画 -->
      <PlateCelebration
        :visible="showCelebration"
        :level="currentLevel"
        @close="showCelebration = false"
      />

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
import { ref, onMounted, onUnmounted } from 'vue'
import { calculatePlateValue, formatPlateNumber } from '../utils/valuation'
import { getAllProvinces, parsePlateNumber } from '../utils/provinces'
import type { Province, ValuationResult } from '../types'
import PlateInput from '../components/PlateInput.vue'
import { defineAsyncComponent } from 'vue'
const ResultDisplay = defineAsyncComponent(() => import('../components/ResultDisplay.vue'))
const PlateCelebration = defineAsyncComponent(() => import('../components/PlateCelebration.vue'))

// 应用状态
const plateParts = ref<string[]>(['', '', '', '', '', '', '', ''])
const currentInputIndex = ref<number>(0)
const showKeyboard = ref<boolean>(false)
const showResult = ref<boolean>(false)
const valuationResult = ref<(ValuationResult & { 
  formattedPlate: string
  plateProvince: string
  plateNumberPart: string
  levelClass: string
  provinceName: string
}) | null>(null)

// 庆祝动画状态
const showCelebration = ref(false)
const currentLevel = ref<string>('')

// 省份数据
const provinces = ref<Province[]>([])

// 自动演示相关
const isAutoMode = ref(false)
let autoTimer: any = null

const generateRandomPlate = () => {
  if (provinces.value.length === 0) return
  
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  
  const newParts = ['', '', '', '', '', '', '', '']
  
  // 1. Province
  const randomProv = provinces.value[Math.floor(Math.random() * provinces.value.length)]
  newParts[0] = randomProv.code
  
  // 2. City Code
  newParts[1] = letters.charAt(Math.floor(Math.random() * letters.length))
  
  // 3. Rest 5 chars
  for (let i = 2; i <= 6; i++) {
    newParts[i] = chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  newParts[7] = '' 
  
  plateParts.value = newParts
}

const startAutoRun = () => {
  const run = () => {
    generateRandomPlate()
    queryValuation()
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
    // 关闭键盘和结果页，进入自动模式
    showKeyboard.value = false
    startAutoRun()
  } else {
    stopAutoRun()
    // 重置为空
    plateParts.value = ['', '', '', '', '', '', '', '']
    showResult.value = false
  }
}

onUnmounted(() => {
  stopAutoRun()
})

// 初始化
onMounted(() => {
  provinces.value = getAllProvinces()
})

// 聚焦输入框
const handleFocusInput = (index: number) => {
  currentInputIndex.value = index
  showKeyboard.value = true
}

// 按键输入
const handleKeyPress = (key: string) => {
  const index = currentInputIndex.value
  const parts = [...plateParts.value]
  let inputSuccess = false
  
  // 验证输入
  if (index === 0) {
    if (key && key.length === 1) {
      parts[0] = key
      inputSuccess = true
    }
  } else if (index === 1) {
    if (key && /^[A-Z]$/.test(key) && key !== 'I' && key !== 'O') {
      parts[1] = key
      inputSuccess = true
    }
  } else if (index >= 2 && index <= 6) {
    if (key && (/^[0-9]$/.test(key) || (/^[A-Z]$/.test(key) && key !== 'I' && key !== 'O'))) {
      parts[index] = key
      inputSuccess = true
    }
  } else if (index === 7) {
    if (key === 'F' || key === 'D') {
      parts[7] = key
      inputSuccess = true
    }
  }
  
  if (inputSuccess) {
    const prev = plateParts.value
    const changed = prev[currentInputIndex.value] !== parts[currentInputIndex.value]
    if (changed) {
      for (let i = currentInputIndex.value + 1; i <= 7; i++) {
        parts[i] = ''
      }
    }
    plateParts.value = parts

    // 新能源位（第8位）选中后优化交互：
    if (index === 7) {
      // 如果前7位已完整，则自动查询
      let allFilled = true
      for (let i = 0; i < 7; i++) {
        if (!parts[i]) {
          allFilled = false
          break
        }
      }
      if (allFilled) {
        showKeyboard.value = false
        setTimeout(() => {
          queryValuation()
        }, 100)
      } else {
        // 未填写完整时，保持面板不关闭，聚焦到第一个未填项
        for (let i = 0; i < 7; i++) {
          if (!parts[i]) {
            currentInputIndex.value = i
            break
          }
        }
        showKeyboard.value = true
      }
      return
    }

    // 其他位按原逻辑：自动跳转到下一个输入框
    moveToNext()
  }
}

// 移动到下一个输入框
const moveToNext = () => {
  const index = currentInputIndex.value
  const parts = plateParts.value
  
  if (parts[index]) {
    let nextIndex = index + 1
    
    if (nextIndex > 7) {
      showKeyboard.value = false
      return
    }
    
    if (nextIndex === 7) {
      let allFilled = true
      for (let i = 0; i < 7; i++) {
        if (!parts[i]) {
          allFilled = false
          break
        }
      }
      if (!allFilled) {
        return
      }
    }
    
    currentInputIndex.value = nextIndex
    showKeyboard.value = true
  }
}

// 删除
const handleDelete = () => {
  const index = currentInputIndex.value
  const parts = [...plateParts.value]
  let deleteSuccess = false
  
  if (parts[index]) {
    parts[index] = ''
    deleteSuccess = true
  } else if (index > 0) {
    parts[index - 1] = ''
    deleteSuccess = true
    currentInputIndex.value = index - 1
    handleFocusInput(index - 1)
  }
  
  if (deleteSuccess) {
    plateParts.value = parts
  }
}

// 确认
const handleConfirm = () => {
  const parts = plateParts.value
  let allFilled = true
  for (let i = 0; i < 7; i++) {
    if (!parts[i]) {
      allFilled = false
      break
    }
  }
  
  if (allFilled) {
    showKeyboard.value = false
    setTimeout(() => {
      queryValuation()
    }, 100)
  } else {
    // 未填写完整时不关闭面板，并聚焦到第一个未填项
    for (let i = 0; i < 7; i++) {
      if (!parts[i]) {
        currentInputIndex.value = i
        break
      }
    }
    showKeyboard.value = true
  }
}

// 跳过新能源标识
const handleSkipEnergy = () => {
  currentInputIndex.value = 0
  showKeyboard.value = false
}

// 获取完整车牌号
const getPlateNumber = (): string | null => {
  const parts = plateParts.value
  let plate = ''
  
  for (let i = 0; i < 7; i++) {
    if (parts[i]) {
      plate += parts[i]
    } else {
      return null
    }
  }
  
  if (parts[7]) {
    plate += parts[7]
  }
  
  return plate
}

// 查询估值
const queryValuation = () => {
  const plateNumber = getPlateNumber()
  
  if (!plateNumber) {
    alert('请输入完整的车牌号')
    return
  }
  
  try {
    const result = calculatePlateValue(plateNumber)
    const formattedPlate = formatPlateNumber(plateNumber)
    const plateInfo = parsePlateNumber(plateNumber)
    const locationName = plateInfo.city || (plateInfo.province ? plateInfo.province.fullName : '未知地区')
    
    const levelClassMap: Record<string, string> = {
      '神豪': 'excellent',
      '土豪': 'great',
      '老板': 'good',
      '精英': 'medium',
      '平民': 'normal',
      '大众': 'common'
    }
    
    const plateForDisplay = formattedPlate || plateNumber || ''
    const plateProvince = plateForDisplay.length >= 2 ? plateForDisplay.substring(0, 2) : ''
    const plateNumberPart = plateForDisplay.length > 2 ? plateForDisplay.substring(2) : ''
    
    let finalValue = result.value || 0
    const hasAnimation = result.isRare || (result.animationLevel && result.animationLevel > 0)
    if (hasAnimation) {
      finalValue = finalValue * 10
    }
    
    const resultData: ValuationResult & { 
      formattedPlate: string
      plateProvince: string
      plateNumberPart: string
      levelClass: string
      provinceName: string
    } = {
      ...result,
      formattedPlate: formattedPlate || plateNumber,
      plateProvince: plateProvince,
      plateNumberPart: plateNumberPart,
      levelClass: levelClassMap[result.level] || 'common',
      provinceName: locationName
    }
    
    valuationResult.value = resultData
    showResult.value = true
    
    // 显示庆祝动画
    currentLevel.value = result.level
    showCelebration.value = true
  } catch (error) {
    console.error('估值计算错误:', error)
    alert('估值计算失败: ' + ((error as Error).message || '未知错误'))
  }
}

// 重试/再测一个
const handleRetry = () => {
  showResult.value = false
  // Reset input to first empty or first position?
  // Let's keep the previous input but maybe highlight the first one or just show it.
  // Maybe clear the plate? Usually users want to clear.
  // Let's clear all.
  plateParts.value = ['', '', '', '', '', '', '', '']
  currentInputIndex.value = 0
  showKeyboard.value = true
}
</script>

<style scoped>
.plate-valuation-page {
  min-height: 100vh;
  width: 100%;
  background-color: #fefce8; /* soft yellow */
  background-image: radial-gradient(#fde047 2px, transparent 2px);
  background-size: 20px 20px;
  overflow-x: hidden;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}

/* 标题区域 */
.header {
  text-align: center;
  margin-bottom: 20px;
}

.main-title {
  font-size: 24px; 
  font-weight: 900; 
  color: #1f2937; 
  margin: 0 0 4px 0;
  text-shadow: 2px 2px 0px #fbbf24;
  transform: rotate(-2deg);
  line-height: 1.2;
  background: none;
  -webkit-text-fill-color: initial;
  animation: none;
}

.subtitle {
  font-size: 13px;
  color: #000;
  font-weight: 700;
  background: #fff;
  display: inline-block;
  padding: 4px 8px;
  border: 2px solid #f60707;
  border-radius: 16px;
  box-shadow: 2px 2px 0px #000;
  margin-top: 10px;
  line-height: 1.4;
  font-weight: bold;
}

.floating-switch {
  position: fixed;
  bottom: 60px;
  right: -86px;
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
}

.floating-switch:hover {
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

/* Deep overrides for components to enforce cartoon style */
/* Most styles are now directly in the components */

:deep(.input-section) {
  background: #fff !important;
  margin-bottom: 10px !important; /* Reduce space below input */
}

/* Tip Section */
.tip-section {
  text-align: center;
  padding: 0 10px;
}

.tip-text {
  font-size: 10px;
  color: #000;
  background: #fff;
  display: inline-block;
  padding: 6px 12px;
  border-radius: 12px;
  border: 2px solid #000;
  box-shadow: 2px 2px 0px #000;
  font-weight: 700;
  line-height: 1.4;
}

/* Action Buttons */
.action-buttons {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}

.btn-retry {
  background: #fbbf24; /* yellow */
  color: #000;
  border: 2px solid #000;
  border-radius: 12px;
  padding: 10px 30px;
  font-size: 16px;
  font-weight: 900;
  box-shadow: 3px 3px 0px #000;
  cursor: pointer;
  transition: all 0.1s;
  width: 40%;
  max-width: 300px;
}

.btn-retry:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0px #000;
}

</style>
