<template>
  <div class="wallpaper-gallery">
    <div class="header-overlay">
      <button class="back-btn" @click="goBack">
        <span class="icon">←</span> 返回
      </button>
      <div class="counter">{{ currentIndex + 1 }} / {{ wallpapers.length }}</div>
    </div>

    <div 
      class="carousel-container" 
      ref="carouselRef" 
      @scroll="handleScroll"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
      @mousedown="handleTouchStart"
      @mouseup="handleTouchEnd"
    >
      <div 
        v-for="(url, index) in wallpapers" 
        :key="index" 
        class="carousel-item"
      >
        <img :src="url" loading="lazy" alt="疯狂动物城壁纸" class="wallpaper-img" />
      </div>
    </div>

    <div class="instruction-overlay" v-if="showInstruction">
      <div class="hand-icon">👆</div>
      <p>左右滑动切换壁纸</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const carouselRef = ref<HTMLElement | null>(null)
const currentIndex = ref(0)
const showInstruction = ref(true)
let autoPlayInterval: number | null = null
let isInteracting = false

const wallpapers = [
  'https://i.ibb.co/67HY1Rgn/640-26.jpg',
  'https://i.ibb.co/1YTDVP7S/640-37.jpg',
  'https://i.ibb.co/2YqJqhmx/640-15.jpg',
  'https://i.ibb.co/1GXcqD0X/640-9.jpg',
  'https://i.ibb.co/DH448YVP/640-8.jpg',
  'https://i.ibb.co/XxMMD4Qs/640-6.jpg',
  'https://i.ibb.co/HpX1356X/640-1.jpg',
  'https://i.ibb.co/qLTNBcjm/640-16.jpg',
  'https://i.ibb.co/tTf9PqB0/640-42.jpg',
  'https://i.ibb.co/TSGCZB5/640-45.jpg',
  'https://i.ibb.co/GfGXQ5PX/640-46.jpg',
  'https://i.ibb.co/JwBGxKH1/640-48.jpg',
  'https://i.ibb.co/tTs0GjRq/640-49.jpg',
  'https://i.ibb.co/VYcB7shQ/640-50.jpg',
  'https://i.ibb.co/v4TMW0yC/640-52.jpg',
  'https://i.ibb.co/Kxh486mf/640-53.jpg',
  'https://i.ibb.co/1tfdL3Yq/640.jpg',
  'https://i.ibb.co/0pGg2HhW/640-56.jpg',
  'https://i.ibb.co/4RLXRwHF/640-9.jpg',
  'https://i.ibb.co/HL5d1bvF/640-7.jpg',
  'https://i.ibb.co/sT5xBYk/640-5.jpg',
  'https://i.ibb.co/nq0Z4gvj/640-4.jpg',
  'https://i.ibb.co/218Y7GrY/640-3.jpg',
  'https://i.ibb.co/8LnTCYL9/640-2.jpg',
  'https://i.ibb.co/B5vRKT61/640-40.jpg',
  'https://i.ibb.co/S7mfzpXj/640-39.jpg'
]

const goBack = () => {
  router.back()
}

const handleScroll = () => {
  if (showInstruction.value) {
    showInstruction.value = false
  }
  
  if (carouselRef.value) {
    const scrollLeft = carouselRef.value.scrollLeft
    const width = carouselRef.value.clientWidth
    currentIndex.value = Math.round(scrollLeft / width)
  }
}

// 触摸开始，暂停自动轮播
const handleTouchStart = () => {
  isInteracting = true
  stopAutoPlay()
}

// 触摸结束，恢复自动轮播
const handleTouchEnd = () => {
  isInteracting = false
  startAutoPlay()
}

const startAutoPlay = () => {
  if (autoPlayInterval) clearInterval(autoPlayInterval)
  autoPlayInterval = setInterval(() => {
    if (carouselRef.value && !isInteracting) {
      const width = carouselRef.value.clientWidth
      const nextIndex = (currentIndex.value + 1) % wallpapers.length
      
      carouselRef.value.scrollTo({
        left: nextIndex * width,
        behavior: 'smooth'
      })
      
      // 如果滚动到了第一张，需要瞬间切换（可选，这里简单处理为循环滚动）
    }
  }, 4000) as unknown as number
}

const stopAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  }
}

onMounted(() => {
  document.body.style.overflow = 'hidden'
  // 自动隐藏提示
  setTimeout(() => {
    showInstruction.value = false
  }, 3000)
  
  // 启动自动轮播
  startAutoPlay()
})

onUnmounted(() => {
  document.body.style.overflow = ''
  stopAutoPlay()
})
</script>

<style scoped>
.wallpaper-gallery {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  z-index: 1000;
  overflow: hidden;
}

.header-overlay {
  position: absolute;
  top: env(safe-area-inset-top, 20px);
  left: 0;
  width: 100%;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
  pointer-events: none; /* 让点击穿透 */
}

.back-btn {
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  backdrop-filter: blur(4px);
  pointer-events: auto; /* 恢复点击 */
  display: flex;
  align-items: center;
  gap: 4px;
}

.counter {
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  backdrop-filter: blur(4px);
}

.carousel-container {
  width: 100%;
  height: 100%;
  display: flex;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

/* 隐藏滚动条 */
.carousel-container::-webkit-scrollbar {
  display: none;
}

.carousel-item {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  scroll-snap-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.wallpaper-img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 保持比例，完整显示 */
  /* 如果想要全屏填充（可能会裁剪），可以使用 object-fit: cover */
}

.instruction-overlay {
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  pointer-events: none;
  animation: fadeOut 0.5s ease-out 3s forwards;
}

.hand-icon {
  font-size: 24px;
  animation: swipe 1.5s infinite;
}

@keyframes swipe {
  0% { transform: translateX(-10px); }
  50% { transform: translateX(10px); }
  100% { transform: translateX(-10px); }
}

@keyframes fadeOut {
  to { opacity: 0; }
}
</style>
