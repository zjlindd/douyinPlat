<template>
  
  <div class="result-section">
    <!-- 车牌卡片 -->
    <div class="plate-card card" :class="{ 'plate-card-green': isNewEnergy, 'plate-card-blue': !isNewEnergy }">
      <!-- 四个角的螺丝帽 -->
      <div class="plate-screw plate-screw-top-left"></div>
      <div class="plate-screw plate-screw-top-right"></div>
      <div class="plate-screw plate-screw-bottom-left"></div>
      <div class="plate-screw plate-screw-bottom-right"></div>
      
      <div class="plate-card-header">
        <div class="plate-label">车牌归属地</div>
        <div class="plate-value">{{ result.provinceName }}</div>
      </div>
      <div class="plate-card-body">
        <div class="plate-display">
          <span v-if="result.plateProvince" class="plate-province">{{ result.plateProvince }}</span>
          <span v-if="result.plateProvince" class="plate-dot">·</span>
          <span v-if="result.plateNumberPart" class="plate-number">{{ result.plateNumberPart }}</span>
          <span v-if="!result.plateProvince">{{ result.formattedPlate || result.plate }}</span>
        </div>
      </div>
    </div>

    <!-- 估值和评级信息（合并显示） -->
    <div class="valuation-rating-card card">
      <div class="valuation-info-compact">
        <div class="valuation-item-compact">
          <div class="valuation-label-compact">估值</div>
          <div class="valuation-value-compact">
            <span
              v-for="(char, index) in priceChars"
              :key="index"
              class="price-char"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >{{ char }}</span>
          </div>
        </div>
        <div class="valuation-item-compact">
          <div class="valuation-label-compact">评价</div>
          <div class="valuation-level-compact" :class="`level-${result.levelClass}`">{{ result.level }}</div>
        </div>
        <div class="valuation-item-compact">
          <div class="valuation-label-compact">评级</div>
          <div class="stars-compact">
            <span
              v-for="i in 5"
              :key="i"
              class="star-compact"
              :class="{ active: i <= result.stars }"
            >
              ⭐
            </span>
          </div>
        </div>
      </div>
      <div class="stars-comment-compact">{{ result.comment }}</div>
    </div>

    <!-- 估值分析 -->
    <div v-if="filteredFactors.length > 0" class="factors-section card">
      <div class="factors-label">估值分析</div>
      <div class="factors-list">
        <div
          v-for="(factor, index) in filteredFactors"
          :key="index"
          class="factor-tag"
        >
          {{ factor }}
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">

import { computed } from 'vue'
import type { ValuationResult } from '../types'

interface Props {
  result: ValuationResult & {
    formattedPlate: string
    plateProvince: string
    plateNumberPart: string
    levelClass: string
    provinceName: string
  }
}

const props = defineProps<Props>()

// 判断是否是新能源车牌（最后一位是F或D）
const isNewEnergy = computed(() => {
  const plate = props.result.formattedPlate || props.result.plate || ''
  const lastChar = plate.charAt(plate.length - 1).toUpperCase()
  return lastChar === 'F' || lastChar === 'D'
})

// 将价格拆分成字符数组
const priceChars = computed(() => {
  const priceStr = `¥${props.result.value.toLocaleString()}`
  return priceStr.split('')
})

// 过滤并限制估值分析标签
const filteredFactors = computed(() => {
  if (!props.result.factors) return []
  
  // 排除不重要的标签
  const ignoredKeywords = ['字母组合', '阴阳平衡']
  const factors = props.result.factors.filter(factor => {
    return !ignoredKeywords.some(keyword => factor.includes(keyword))
  })
  
  // 限制显示数量，防止超出一屏 (例如最多显示4个)
  return factors.slice(0, 4)
})

</script>

<style scoped>
/* Cartoon styles for ResultDisplay */
.card {
  background: #fff;
  border: 3px solid #000;
  border-radius: 16px;
  box-shadow: 4px 4px 0px #000;
  margin-bottom: 16px;
  padding: 12px;
  transition: transform 0.1s;
}

.card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px #000;
}

.plate-card {
  position: relative;
  background: #f3f4f6;
  border: 3px solid #000;
  padding: 16px;
  text-align: center;
}

.plate-card-green {
  background: #d1fae5; /* light green */
}

.plate-card-blue {
  background: #dbeafe; /* light blue */
}

.plate-screw {
  width: 10px;
  height: 10px;
  background: #fff;
  border: 2px solid #000;
  border-radius: 50%;
  position: absolute;
  box-shadow: 1px 1px 0px #000;
}

.plate-screw::after {
  content: '+';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -55%);
  font-size: 10px;
  line-height: 1;
  font-weight: bold;
  color: #000;
}

.plate-screw-top-left { top: 6px; left: 6px; }
.plate-screw-top-right { top: 6px; right: 6px; }
.plate-screw-bottom-left { bottom: 6px; left: 6px; }
.plate-screw-bottom-right { bottom: 6px; right: 6px; }

.plate-card-header {
  margin-bottom: 6px;
  border-bottom: 2px dashed #000;
  padding-bottom: 6px;
}

.plate-label {
  font-size: 10px;
  font-weight: 700;
  color: #000;
  background: #fff;
  display: inline-block;
  padding: 2px 6px;
  border: 2px solid #000;
  border-radius: 10px;
  margin-bottom: 2px;
}

.plate-value {
  font-size: 14px;
  font-weight: 900;
  color: #000;
}

.plate-display {
  font-family: 'Arial Black', sans-serif;
  font-size: 24px;
  font-weight: 900;
  color: #000;
  letter-spacing: 2px;
  text-shadow: 2px 2px 0px rgba(0,0,0,0.1);
  background: #fff;
  border: 2px solid #000;
  border-radius: 6px;
  padding: 8px 12px;
  display: inline-block;
  box-shadow: 2px 2px 0px #000;
}

.plate-province { color: #000; }
.plate-dot { margin: 0 4px; color: #000; }
.plate-number { color: #000; }

/* Valuation Rating Card */
.valuation-info-compact {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 12px;
}

.valuation-item-compact {
  text-align: center;
}

.valuation-label-compact {
  font-size: 12px;
  font-weight: 700;
  color: #000;
  margin-bottom: 4px;
}

.valuation-value-compact {
  font-size: 24px;
  font-weight: 900;
  color: #ef4444; /* red */
  text-shadow: 2px 2px 0px #000;
  -webkit-text-stroke: 1px #000; /* black stroke */
}

.price-char {
  display: inline-block;
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) backwards;
}

.valuation-level-compact {
  font-size: 18px;
  font-weight: 900;
  padding: 4px 12px;
  border-radius: 20px;
  border: 2px solid #000;
  box-shadow: 2px 2px 0px #000;
  display: inline-block;
}

.level-excellent { background: #fcd34d; color: #000; } /* yellow */
.level-great { background: #fca5a5; color: #000; } /* red */
.level-good { background: #93c5fd; color: #000; } /* blue */
.level-medium { background: #86efac; color: #000; } /* green */
.level-normal { background: #d1d5db; color: #000; } /* gray */
.level-common { background: #f3f4f6; color: #000; }

.stars-compact {
  display: flex;
  gap: 2px;
}

.star-compact {
  font-size: 16px;
  filter: grayscale(100%);
  transition: filter 0.3s;
}

.star-compact.active {
  filter: grayscale(0%);
  text-shadow: 1px 1px 0px #000;
}

.stars-comment-compact {
  background: #fff;
  border: 2px solid #000;
  padding: 8px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #000;
  text-align: center;
  position: relative;
}

.stars-comment-compact::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 10px;
  height: 10px;
  background: #fff;
  border-left: 2px solid #000;
  border-top: 2px solid #000;
}

/* Factors Section */
.factors-label {
  font-weight: 900;
  font-size: 14px;
  margin-bottom: 8px;
  color: #000;
  text-decoration: underline;
  text-decoration-thickness: 3px;
  text-decoration-color: #fbbf24;
  text-align: left;
}

.factors-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: flex-start;
}

.factor-tag {
  background: #fff;
  border: 2px solid #000;
  border-radius: 16px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 700;
  color: #000;
  box-shadow: 2px 2px 0px #000;
  transition: transform 0.1s;
  white-space: nowrap;
}

.factor-tag:hover {
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 0px #000;
  background: #fef3c7;
}

@keyframes popIn {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>

