<template>
  
  <div class="input-section card">
    <div class="plate-input-container">
      <!-- 车牌显示 -->
      <div class="plate-display-wrapper">
        <!-- 前7位（必填） -->
        <div
          v-for="index in [0, 1, 2, 3, 4, 5, 6]"
          :key="index"
          class="plate-display-item"
          :class="{
            'province-item': index === 0,
            'letter-item': index === 1,
            'number-item': index >= 2 && index <= 6,
            'active': currentInputIndex === index
          }"
          @click="$emit('focus-input', index)"
        >
          <span class="plate-text">{{ plateParts[index] || (index === 0 ? '省' : '') }}</span>
        </div>
        
        <!-- 分隔线 -->
        <div class="plate-separator"></div>
        
        <!-- 第8位（可选，新能源） -->
        <div
          class="plate-display-item new-energy-item"
          :class="{
            'optional': !plateParts[7],
            'filled': plateParts[7],
            'active': currentInputIndex === 7
          }"
          @click="$emit('focus-input', 7)"
        >
          <div v-if="!plateParts[7]" class="optional-hint">
            <span class="optional-text">新</span>
            <span class="optional-label">可选</span>
          </div>
          <span v-else class="plate-text">{{ plateParts[7] }}</span>
        </div>
      </div>
    </div>

    <!-- 虚拟键盘 -->
    <div v-if="showKeyboard" class="keyboard-container">
      <!-- 省份键盘 -->
      <div v-if="currentInputIndex === 0" class="keyboard keyboard-province">
        <div class="keyboard-row">
          <div
            v-for="province in provinceRow1"
            :key="province.code"
            class="key-item"
            @click="$emit('key-press', province.code)"
          >
            {{ province.code }}
          </div>
        </div>
        <div class="keyboard-row">
          <div
            v-for="province in provinceRow2"
            :key="province.code"
            class="key-item"
            @click="$emit('key-press', province.code)"
          >
            {{ province.code }}
          </div>
        </div>
        <div class="keyboard-actions">
          <div class="key-action key-delete" @click="$emit('delete')">删除</div>
          <div class="key-action key-confirm" @click="$emit('confirm')">确认</div>
        </div>
      </div>

      <!-- 字母键盘（第二位） -->
      <div v-if="currentInputIndex === 1" class="keyboard keyboard-letter">
        <div class="keyboard-row">
          <div
            v-for="letter in letterKeys"
            :key="letter"
            class="key-item"
            @click="$emit('key-press', letter)"
          >
            {{ letter }}
          </div>
        </div>
        <div class="keyboard-actions">
          <div class="key-action key-delete" @click="$emit('delete')">删除</div>
          <div class="key-action key-confirm" @click="$emit('confirm')">确认</div>
        </div>
      </div>

      <!-- 数字+字母键盘（第3-7位） -->
      <div v-if="currentInputIndex >= 2 && currentInputIndex <= 6" class="keyboard keyboard-mixed">
        <div class="keyboard-row">
          <div
            v-for="num in numberKeys"
            :key="num"
            class="key-item"
            @click="$emit('key-press', num)"
          >
            {{ num }}
          </div>
        </div>
        <div class="keyboard-row">
          <div
            v-for="letter in letterKeys"
            :key="letter"
            class="key-item"
            @click="$emit('key-press', letter)"
          >
            {{ letter }}
          </div>
        </div>
        <div class="keyboard-actions">
          <div class="key-action key-delete" @click="$emit('delete')">删除</div>
          <div class="key-action key-confirm" @click="$emit('confirm')">确认</div>
        </div>
      </div>

      <!-- 新能源键盘（第8位） -->
      <div v-if="currentInputIndex === 7" class="keyboard keyboard-energy">
        <div class="keyboard-row">
          <div class="key-item key-energy" @click="$emit('key-press', 'F')">
            <span class="key-main">F</span>
            <span class="key-desc">非插电</span>
          </div>
          <div class="key-item key-energy" @click="$emit('key-press', 'D')">
            <span class="key-main">D</span>
            <span class="key-desc">纯电动</span>
          </div>
        </div>
        <div class="keyboard-actions">
          <div class="key-action key-delete" @click="$emit('delete')">删除</div>
          <div class="key-action key-confirm" @click="$emit('confirm')">确认</div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">

import { computed } from 'vue'
import type { Province } from '../types'

interface Props {
  plateParts: string[]
  currentInputIndex: number
  showKeyboard: boolean
  provinces: Province[]
}

const props = defineProps<Props>()

defineEmits<{
  'focus-input': [index: number]
  'key-press': [key: string]
  'delete': []
  'confirm': []
  'skip-energy': []
}>()

const letterKeys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
const numberKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

const provinceRow1 = computed(() => {
  const mid = Math.ceil(props.provinces.length / 2)
  return props.provinces.slice(0, mid)
})

const provinceRow2 = computed(() => {
  const mid = Math.ceil(props.provinces.length / 2)
  return props.provinces.slice(mid)
})

</script>

<style scoped>
/* Cartoon styles for PlateInput */
.card {
  background: #fff;
  border: 3px solid #000;
  border-radius: 12px;
  box-shadow: 3px 3px 0px #000;
  margin-bottom: 0; /* Handled by parent */
  padding: 10px;
}

.plate-input-container {
  margin-bottom: 6px;
}

.plate-display-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f3f4f6;
  border: 2px solid #000;
  box-shadow: inset 2px 2px 0px rgba(0,0,0,0.1);
  padding: 6px;
  border-radius: 8px;
  gap: 4px;
}

.plate-display-item {
  border: 2px solid #000;
  background: #fff;
  color: #000;
  box-shadow: 2px 2px 0px #000;
  border-radius: 6px;
  font-weight: 900;
  height: 40px;
  width: 32px; /* fixed width */
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.1s;
}

.plate-display-item.active {
  background: #fbbf24; /* yellow */
  transform: translate(2px, 2px);
  box-shadow: none;
  border-color: #000;
}

.plate-separator {
  background: #000;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  margin: 0 2px;
}

.new-energy-item {
  border-style: dashed;
}

.new-energy-item.filled, .new-energy-item.active {
  border-style: solid;
}

.optional-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.optional-text {
  font-size: 9px;
  font-weight: 700;
  color: #666;
}

.optional-label {
  font-size: 8px;
  color: #666;
  transform: scale(0.7);
}

/* Keyboard Styles */
.keyboard-container {
  border-top: 2px dashed #000;
  margin-top: 10px;
  padding-top: 10px;
}

.keyboard {
  background: transparent;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.keyboard-row {
  display: flex;
  justify-content: center;
  gap: 4px;
  flex-wrap: wrap;
}

.key-item {
  background: #fff;
  border: 2px solid #000;
  border-radius: 6px;
  box-shadow: 2px 2px 0px #000;
  color: #000;
  font-weight: 900;
  min-width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.1s;
}

.key-item:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0px #000;
  background: #e5e7eb;
}

.keyboard-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  gap: 8px;
}

.key-action {
  flex: 1;
  height: 36px;
  border: 2px solid #000;
  border-radius: 6px;
  box-shadow: 2px 2px 0px #000;
  font-weight: 900;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.key-action:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0px #000;
}

.key-delete {
  background: #fca5a5; /* red */
  color: #000;
}

.key-confirm {
  background: #fbbf24; /* yellow */
  color: #000;
}

.key-energy {
  width: 70px;
  flex-direction: column;
  line-height: 1.2;
}

.key-desc {
  font-size: 9px;
  font-weight: normal;
}
</style>

