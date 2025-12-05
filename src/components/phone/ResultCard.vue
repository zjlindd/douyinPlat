<template>
  
  <div v-if="analysis" class="result-card cartoon-card">
    <div class="cartoon-card-header">
      <span class="title-text">估值结果</span>
      <div class="grade-badge" :style="{ backgroundColor: analysis.gradeInfo.color }">
        {{ analysis.grade }}级 - {{ analysis.gradeInfo.name }}
      </div>
    </div>

    <div class="result-content">
      <div class="main-info-section cartoon-section">
        <div class="info-grid-top">
          <div class="info-cell">
            <span class="info-label">尾号</span>
            <span class="info-value highlight-value">{{ analysis.tailNumber }}</span>
          </div>
          <div class="info-cell">
            <span class="info-label">等级</span>
            <span class="info-value">{{ analysis.gradeInfo.name }}</span>
          </div>
        </div>
        <div class="info-divider"></div>
        <div class="price-row">
          <div class="price-left">
            <span class="info-label">估值</span>
            <span class="info-value price-value">¥{{ analysis.price.toLocaleString() }}</span>
          </div>
          <div class="price-right">
             <span class="info-value range-value">
              ¥{{ analysis.priceRange[0].toLocaleString() }}-{{ analysis.priceRange[1].toLocaleString() }}
            </span>
          </div>
        </div>
      </div>

      <div class="text-info-grid">
        <div class="cartoon-box suggestion-box">
          <div class="box-title">
            <span class="icon">💡</span>
            <span>评价</span>
          </div>
          <div class="box-content">{{ analysis.suggestion }}</div>
        </div>

        <div class="cartoon-box blessing-box">
          <div class="box-title">
            <span class="icon">✨</span>
            <span>祝福</span>
          </div>
          <div class="box-content">{{ analysis.blessing }}</div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">

import type { TailNumberAnalysis } from '../../types/phone'

defineProps<{
  analysis: TailNumberAnalysis | null
}>()

</script>

<style scoped>
/* Cartoon Styles */
.cartoon-card {
  background: #fff;
  border: 3px solid #000;
  border-radius: 16px;
  box-shadow: 4px 4px 0px #000;
  margin: 20px auto;
  padding: 12px;
  transition: transform 0.1s;
  overflow: visible;
}

.cartoon-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px #000;
}

.cartoon-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 2px dashed #000;
}

.title-text {
  font-size: 16px;
  font-weight: 900;
  color: #000;
}

.grade-badge {
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 900;
  color: #000;
  border: 2px solid #000;
  box-shadow: 1px 1px 0px #000;
}

.cartoon-section {
  background: #f3f4f6;
  border: 2px solid #000;
  border-radius: 12px;
  padding: 10px;
  margin-bottom: 10px;
}

.info-grid-top {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 6px;
}

.info-cell {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.info-divider {
  height: 1px;
  background: rgba(0,0,0,0.1);
  margin: 4px 0 8px 0;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.price-left {
  display: flex;
  flex-direction: column;
}

.price-right {
  padding-bottom: 4px;
}

.info-label {
  font-size: 12px;
  font-weight: 700;
  color: #4b5563;
  margin-bottom: 2px;
}

.info-value {
  font-size: 16px;
  font-weight: 900;
  color: #000;
  line-height: 1.2;
}

.highlight-value {
  font-size: 20px;
  letter-spacing: 1px;
}

.price-value {
  color: #ef4444;
  font-size: 24px;
  text-shadow: 1px 1px 0px #000;
  -webkit-text-stroke: 0.5px #000;
}

.range-value {
  font-size: 12px;
  color: #666;
  font-weight: 700;
}

.text-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.cartoon-box {
  border: 2px solid #000;
  border-radius: 12px;
  padding: 8px;
  box-shadow: 2px 2px 0px #000;
  display: flex;
  flex-direction: column;
}

.suggestion-box {
  background: #eff6ff; /* light blue */
}

.blessing-box {
  background: #fff1f2; /* light red */
}

.box-title {
  font-size: 12px;
  font-weight: 900;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.box-content {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  color: #1f2937;
  flex: 1;
}

.icon {
  font-size: 14px;
}

@media (max-width: 480px) {
  .price-value {
    font-size: 28px;
  }
  .highlight-value {
    font-size: 18px;
  }
}
</style>
