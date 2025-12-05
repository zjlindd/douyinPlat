<template>
  <div v-if="analysis" class="result-card ink-card">
    <div class="close-btn" @click="$emit('close')">×</div>
    <div class="ink-card-header">
      <span class="title-text">签文</span>
      <div class="grade-badge" :class="analysis.grade.toLowerCase()">
        <span class="grade-char">{{ getChineseGrade(analysis.grade) }}</span>
        <span class="grade-desc">{{ analysis.gradeInfo.name }}</span>
      </div>
    </div>

    <div class="result-scroll-area">
      <div class="result-content">
        <div class="main-info-section ink-section">
          <div class="info-grid-top">
            <div class="info-cell">
              <span class="info-label">尾号</span>
              <span class="info-value highlight-value">{{ analysis.tailNumber }}</span>
            </div>
            <div class="info-cell">
              <span class="info-label">卦象</span>
              <span class="info-value pattern-value">{{ analysis.pattern }}</span>
            </div>
          </div>
          
          <div class="price-section">
            <span class="info-label">预估身价</span>
            <div class="price-display">
              <span class="currency">¥</span>
              <span class="price-value">{{ analysis.price.toLocaleString() }}</span>
            </div>
            <div class="price-range">
              参考范围: ¥{{ analysis.priceRange[0].toLocaleString() }} - {{ analysis.priceRange[1].toLocaleString() }}
            </div>
          </div>
        </div>

        <div class="text-info-grid">
          <div class="ink-box suggestion-box">
            <div class="box-title">
              <span class="icon">📜</span>
              <span>判词</span>
            </div>
            <div class="box-content">{{ analysis.suggestion }}</div>
          </div>

          <div class="ink-box blessing-box">
            <div class="box-title">
              <span class="icon">🏮</span>
              <span>吉言</span>
            </div>
            <div class="box-content">{{ analysis.blessing }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="card-footer-tip">
        温馨提示：数字能量仅供娱乐参考，命运掌握在自己手中 
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TailNumberAnalysis, Grade } from '../../types/phone'

defineProps<{
  analysis: TailNumberAnalysis | null
}>()

defineEmits<{
  (e: 'close'): void
}>()

const getChineseGrade = (grade: Grade) => {
  const map: Record<string, string> = {
    'S': '天',
    'A': '地',
    'B': '玄',
    'C': '黄',
    'D': '凡'
  }
  return map[grade] || grade
}
</script>

<style scoped>
.result-card {
  /* 移除原本的 margin，因为现在是在弹窗里 */
  width: 100%;
  max-width: 340px; /* 限制卡片宽度 */
  position: relative;
  z-index: 10;
  animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popIn {
  from { opacity: 0; transform: scale(0.8) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

/* 新中式卡片风格 */
.ink-card {
  background: #fffdf5;
  border: 2px solid #333;
  border-radius: 8px;
  padding: 16px 16px 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmZGY1Ii8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wMykiLz4KPC9zdmc+');
  display: flex;
  flex-direction: column;
  max-height: 70vh; /* 限制最大高度，确保一屏能放下 */
}

.close-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 32px;
  height: 32px;
  background: #c0392b;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  z-index: 20;
  border: 2px solid #fff;
}

.ink-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  flex-shrink: 0;
}

.title-text {
  font-family: 'Ma Shan Zheng', cursive;
  font-size: 24px;
  color: #333;
}

.grade-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid currentColor;
}

.grade-badge.s { color: #c0392b; background: rgba(192, 57, 43, 0.1); border-color: #c0392b; }
.grade-badge.a { color: #d35400; background: rgba(211, 84, 0, 0.1); border-color: #d35400; }
.grade-badge.b { color: #f39c12; background: rgba(243, 156, 18, 0.1); border-color: #f39c12; }
.grade-badge.c { color: #27ae60; background: rgba(39, 174, 96, 0.1); border-color: #27ae60; }
.grade-badge.d { color: #7f8c8d; background: rgba(127, 140, 141, 0.1); border-color: #7f8c8d; }

.grade-char {
  font-family: 'Ma Shan Zheng', cursive;
  font-size: 20px;
}

.grade-desc {
  font-size: 12px;
  font-weight: 700;
}

.result-scroll-area {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
  /* 自定义滚动条 */
  scrollbar-width: thin;
  scrollbar-color: rgba(0,0,0,0.2) transparent;
}

.result-scroll-area::-webkit-scrollbar {
  width: 4px;
}
.result-scroll-area::-webkit-scrollbar-thumb {
  background-color: rgba(0,0,0,0.2);
  border-radius: 4px;
}

.ink-section {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(0,0,0,0.05);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
}

.info-grid-top {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px dashed rgba(0,0,0,0.1);
}

.info-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info-label {
  font-size: 12px;
  color: #888;
  margin-bottom: 4px;
  font-family: 'Noto Serif SC', serif;
}

.info-value {
  font-family: 'Noto Serif SC', serif;
  font-weight: 700;
  color: #333;
}

.highlight-value {
  font-size: 24px;
  letter-spacing: 2px;
}

.pattern-value {
  font-size: 18px;
  color: #555;
}

.price-section {
  text-align: center;
}

.price-display {
  margin: 4px 0;
  color: #c0392b;
  display: flex;
  align-items: baseline;
  justify-content: center;
}

.currency {
  font-size: 18px;
  margin-right: 4px;
}

.price-value {
  font-size: 36px;
  font-weight: 700;
  font-family: 'Noto Serif SC', serif;
  line-height: 1;
}

.price-range {
  font-size: 12px;
  color: #999;
}

.text-info-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ink-box {
  background: rgba(255, 255, 255, 0.8);
  border-left: 4px solid #333;
  padding: 10px 14px;
  border-radius: 0 4px 4px 0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.suggestion-box { border-left-color: #c0392b; }
.blessing-box { border-left-color: #d35400; }

.box-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
  font-weight: 700;
  color: #555;
  font-family: 'Noto Serif SC', serif;
}

.box-content {
  font-size: 13px;
  line-height: 1.5;
  color: #444;
  text-align: justify;
}

.card-footer-tip {
  margin-top: 10px;
  text-align: center;
  font-size: 10px;
  color: #999;
  flex-shrink: 0;
}
</style>
