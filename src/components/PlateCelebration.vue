<template>
  
  <Transition name="celebration-fade">
    <div v-if="visible" class="celebration-overlay" :class="`grade-${level}`" @click="handleClick">
      <!-- 极品：满屏庆祝动画 -->
      <template v-if="level === '极品'">
        <div class="celebration-content">
          <div class="celebration-title grade-excellent">
            <span class="title-text">🎉 恭喜！</span>
            <span class="subtitle-text">发现极品车牌！</span>
          </div>
        </div>
        <div
          v-for="(item, index) in particles"
          :key="index"
          class="particle particle-fall"
          :style="getParticleStyle(item)"
        >
          {{ item.emoji }}
        </div>
      </template>

      <!-- 优秀：优雅闪光动画 -->
      <template v-else-if="level === '优秀'">
        <div class="celebration-content">
          <div class="celebration-title grade-great">
            <span class="title-text">✨ 很棒！</span>
            <span class="subtitle-text">发现优秀车牌！</span>
          </div>
        </div>
        <div
          v-for="(item, index) in sparkles"
          :key="index"
          class="sparkle"
          :style="getSparkleStyle(item)"
        >
          ✨
        </div>
      </template>

      <!-- 良好：温和动画 -->
      <template v-else-if="level === '良好'">
        <div class="celebration-content">
          <div class="celebration-title grade-good">
            <span class="title-text">👍 不错！</span>
            <span class="subtitle-text">发现良好车牌！</span>
          </div>
        </div>
        <div
          v-for="(item, index) in gentleParticles"
          :key="index"
          class="particle particle-gentle"
          :style="getGentleParticleStyle(item)"
        >
          {{ item.emoji }}
        </div>
      </template>

      <!-- 其他等级：简单提示 -->
      <template v-else>
        <div class="celebration-content">
          <div class="celebration-title grade-normal">
            <span class="title-text">🚗 普通车牌</span>
            <span class="subtitle-text">继续寻找更好的吧！</span>
          </div>
        </div>
      </template>
    </div>
  </Transition>
  
</template>

<script setup lang="ts">

import { ref, onMounted, watch, computed } from 'vue'

const props = defineProps<{
  visible: boolean
  level?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

interface Particle {
  emoji: string
  x: number
  y: number
  rotation: number
  scale: number
  speed: number
  delay: number
}

interface Sparkle {
  x: number
  y: number
  size: number
  delay: number
  duration: number
}

const particles = ref<Particle[]>([])
const sparkles = ref<Sparkle[]>([])
const gentleParticles = ref<Particle[]>([])

const emojis = ['🎀', '✨', '💎', '👍', '🌟', '🎊', '🎈', '💫', '⭐', '🎁', '🚗', '🏆', '💰']
const gentleEmojis = ['✨', '⭐', '💫', '🌟', '🚗']

const level = computed(() => props.level || '普通')

// 极品：生成满屏粒子
const generateParticles = () => {
  const count = 50
  particles.value = []
  
  for (let i = 0; i < count; i++) {
    particles.value.push({
      emoji: emojis[Math.floor(Math.random() * emojis.length)]!,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.5,
      speed: 1 + Math.random() * 2,
      delay: Math.random() * 2
    })
  }
}

// 优秀：生成闪光效果
const generateSparkles = () => {
  const count = 30
  sparkles.value = []
  
  for (let i = 0; i < count; i++) {
    sparkles.value.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.5 + Math.random() * 1,
      delay: Math.random() * 2,
      duration: 1 + Math.random() * 2
    })
  }
}

// 良好：生成温和粒子
const generateGentleParticles = () => {
  const count = 20
  gentleParticles.value = []
  
  for (let i = 0; i < count; i++) {
    gentleParticles.value.push({
      emoji: gentleEmojis[Math.floor(Math.random() * gentleEmojis.length)]!,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      rotation: Math.random() * 360,
      scale: 0.4 + Math.random() * 0.4,
      speed: 0.5 + Math.random() * 1,
      delay: Math.random() * 2
    })
  }
}

// 获取粒子样式
const getParticleStyle = (particle: Particle) => {
  return {
    left: `${particle.x}%`,
    top: `${particle.y}%`,
    transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`,
    animationDelay: `${particle.delay}s`,
    animationDuration: `${3 + particle.speed}s`
  }
}

// 获取闪光样式
const getSparkleStyle = (sparkle: Sparkle) => {
  return {
    left: `${sparkle.x}%`,
    top: `${sparkle.y}%`,
    fontSize: `${sparkle.size * 24}px`,
    animationDelay: `${sparkle.delay}s`,
    animationDuration: `${sparkle.duration}s`
  }
}

// 获取温和粒子样式
const getGentleParticleStyle = (particle: Particle) => {
  return {
    left: `${particle.x}%`,
    top: `${particle.y}%`,
    transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`,
    animationDelay: `${particle.delay}s`,
    animationDuration: `${4 + particle.speed}s`
  }
}

// 处理点击关闭
const handleClick = () => {
  emit('close')
}

// 根据级别获取自动关闭时间（3秒）
const getAutoCloseTime = () => {
  switch (level.value) {
    case '极品':
      return 3000
    case '优秀':
      return 3000
    case '良好':
      return 3000
    default:
      return 3000
  }
}

// 监听visible变化
watch(() => props.visible, (newVal) => {
  if (newVal) {
    switch (level.value) {
      case '极品':
        generateParticles()
        break
      case '优秀':
        generateSparkles()
        break
      case '良好':
        generateGentleParticles()
        break
    }
    // 3秒后自动关闭
    setTimeout(() => {
      emit('close')
    }, getAutoCloseTime())
  }
})

onMounted(() => {
  if (props.visible) {
    switch (level.value) {
      case '极品':
        generateParticles()
        break
      case '优秀':
        generateSparkles()
        break
      case '良好':
        generateGentleParticles()
        break
    }
  }
})

</script>

<style scoped>

.celebration-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.4); /* Simple dark overlay */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
}

/* Remove grade-specific overlay backgrounds to keep it clean or use solid colors */
.celebration-overlay.grade-极品 {
  background: rgba(253, 224, 71, 0.4); /* Yellow tint */
}

.celebration-overlay.grade-优秀 {
  background: rgba(252, 165, 165, 0.4); /* Red tint */
}

.celebration-overlay.grade-良好 {
  background: rgba(147, 197, 253, 0.4); /* Blue tint */
}

.celebration-overlay.grade-normal {
  background: rgba(209, 213, 219, 0.4); /* Gray tint */
}

.celebration-content {
  position: relative;
  z-index: 10000;
  text-align: center;
  animation: celebrationBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.celebration-title {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 40px 60px;
  border-radius: 24px;
  border: 4px solid #000;
  background: #fff;
  box-shadow: 8px 8px 0px #000;
}

.celebration-title.grade-excellent {
  background: #fcd34d; /* Yellow */
  color: #000;
}

.celebration-title.grade-great {
  background: #fca5a5; /* Red */
  color: #000;
  animation: celebrationSlide 0.5s ease-out;
}

.celebration-title.grade-good {
  background: #93c5fd; /* Blue */
  color: #000;
  animation: celebrationFadeIn 0.4s ease-out;
}

.celebration-title.grade-normal {
  background: #d1d5db; /* Gray */
  color: #000;
  animation: celebrationFadeIn 0.3s ease-out;
}

.title-text {
  font-size: 64px;
  font-weight: 900;
  color: #000;
  text-shadow: 4px 4px 0px #fff;
  -webkit-text-stroke: 2px #000;
  animation: titlePulse 1.5s ease-in-out infinite;
  letter-spacing: 4px;
}

.subtitle-text {
  font-size: 32px;
  font-weight: 900;
  color: #000;
  text-shadow: 2px 2px 0px #fff;
  letter-spacing: 2px;
}

.particle {
  position: absolute;
  font-size: 32px;
  pointer-events: none;
  will-change: transform;
  /* Add a border to emojis using text-shadow */
  text-shadow: 2px 2px 0px #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
}

.particle-fall {
  animation: particleFall linear infinite;
}

.particle-gentle {
  animation: particleGentleFall linear infinite;
}

.sparkle {
  position: absolute;
  pointer-events: none;
  color: #fcd34d;
  /* Cartoon sparkle: solid border */
  text-shadow: 2px 2px 0px #000;
  animation: sparkleTwinkle ease-in-out infinite;
  will-change: transform, opacity;
  font-weight: bold;
}

@keyframes celebrationBounce {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.1) rotate(5deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes titlePulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes particleFall {
  0% {
    transform: translateY(-10px) rotate(0deg) scale(1);
    opacity: 1;
  }
  50% {
    transform: translateY(calc(100vh + 20px)) rotate(180deg) scale(0.8);
    opacity: 1; /* Keep opaque for cartoon */
  }
  100% {
    transform: translateY(calc(100vh + 50px)) rotate(360deg) scale(0.5);
    opacity: 0;
  }
}

@keyframes particleGentleFall {
  0% {
    transform: translateY(-10px) rotate(0deg) scale(1);
    opacity: 1;
  }
  50% {
    transform: translateY(calc(50vh + 20px)) rotate(90deg) scale(0.7);
    opacity: 1;
  }
  100% {
    transform: translateY(calc(100vh + 30px)) rotate(180deg) scale(0.4);
    opacity: 0;
  }
}

@keyframes sparkleTwinkle {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  25% {
    transform: scale(1.3) rotate(90deg);
  }
  50% {
    transform: scale(1) rotate(180deg);
    opacity: 0.8;
  }
  75% {
    transform: scale(1.2) rotate(270deg);
  }
}

@keyframes celebrationSlide {
  0% {
    transform: translateX(-100px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes celebrationFadeIn {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.celebration-fade-enter-active,
.celebration-fade-leave-active {
  transition: opacity 0.3s ease;
}

.celebration-fade-enter-from,
.celebration-fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .celebration-title {
    padding: 30px 40px;
    border-radius: 20px;
  }

  .title-text {
    font-size: 48px;
    letter-spacing: 2px;
  }

  .subtitle-text {
    font-size: 24px;
    letter-spacing: 1px;
  }
}
</style>