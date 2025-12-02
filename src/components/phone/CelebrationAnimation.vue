<template>
  
  <Transition name="celebration-fade">
    <div v-if="visible" class="celebration-overlay" :class="`grade-${grade}`" @click="handleClick">
      <!-- S级：满屏庆祝动画 -->
      <template v-if="grade === 'S'">
        <div class="celebration-content">
          <div class="celebration-title grade-s">
            <span class="title-text">🎉 恭喜！</span>
            <span class="subtitle-text">发现至尊号码！</span>
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

      <!-- A级：优雅闪光动画 -->
      <template v-else-if="grade === 'A'">
        <div class="celebration-content">
          <div class="celebration-title grade-a">
            <span class="title-text">✨ 很棒！</span>
            <span class="subtitle-text">发现极品号码！</span>
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

      <!-- B级：温和动画 -->
      <template v-else-if="grade === 'B'">
        <div class="celebration-content">
          <div class="celebration-title grade-b">
            <span class="title-text">👍 不错！</span>
            <span class="subtitle-text">发现优秀号码！</span>
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

      <!-- C级：简单提示 -->
      <template v-else-if="grade === 'C'">
        <div class="celebration-content">
          <div class="celebration-title grade-c">
            <span class="title-text">📱 普通号码</span>
            <span class="subtitle-text">继续寻找更好的吧！</span>
          </div>
        </div>
      </template>

      <!-- D级：简单提示 -->
      <template v-else-if="grade === 'D'">
        <div class="celebration-content">
          <div class="celebration-title grade-d">
            <span class="title-text">📞 普通号码</span>
            <span class="subtitle-text">可以尝试其他号码</span>
          </div>
        </div>
      </template>
    </div>
  </Transition>
  
</template>

<script setup lang="ts">

import { ref, onMounted, watch, computed } from 'vue'
import { Grade } from '../../types/phone'
import type { Grade as GradeType } from '../../types/phone'

const props = defineProps<{
  visible: boolean
  grade?: GradeType
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

const emojis = ['🎀', '✨', '💎', '👍', '🌟', '🎊', '🎈', '💫', '⭐', '🎁']
const gentleEmojis = ['✨', '⭐', '💫', '🌟']

const grade = computed(() => props.grade || Grade.S)

// S级：生成满屏粒子
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

// A级：生成闪光效果
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

// B级：生成温和粒子
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

// 根据级别获取自动关闭时间
const getAutoCloseTime = () => {
  switch (grade.value) {
    case Grade.S:
      return 3000
    case Grade.A:
      return 2500
    case Grade.B:
      return 2000
    case Grade.C:
    case Grade.D:
      return 1500
    default:
      return 2000
  }
}

// 监听visible变化
watch(() => props.visible, (newVal) => {
  if (newVal) {
    switch (grade.value) {
      case Grade.S:
        generateParticles()
        break
      case Grade.A:
        generateSparkles()
        break
      case Grade.B:
        generateGentleParticles()
        break
    }
    // 根据级别自动关闭
    setTimeout(() => {
      emit('close')
    }, getAutoCloseTime())
  }
})

onMounted(() => {
  if (props.visible) {
    switch (grade.value) {
      case Grade.S:
        generateParticles()
        break
      case Grade.A:
        generateSparkles()
        break
      case Grade.B:
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
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
}

.celebration-overlay.grade-S {
  background: rgba(0, 0, 0, 0.3);
}

.celebration-overlay.grade-A {
  background: rgba(78, 205, 196, 0.2);
}

.celebration-overlay.grade-B {
  background: rgba(69, 183, 209, 0.15);
}

.celebration-overlay.grade-C {
  background: rgba(150, 206, 180, 0.1);
}

.celebration-overlay.grade-D {
  background: rgba(255, 234, 167, 0.1);
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
  transform: rotate(-2deg);
}

.celebration-title.grade-s {
  background: #FF6B6B;
}

.celebration-title.grade-a {
  background: #4ECDC4;
}

.celebration-title.grade-b {
  background: #45B7D1;
}

.celebration-title.grade-c {
  background: #96CEB4;
}

.celebration-title.grade-d {
  background: #FFEEAD;
}

.title-text {
  font-size: 64px;
  font-weight: 900;
  color: #fff;
  -webkit-text-stroke: 3px #000;
  text-shadow: 4px 4px 0px #000;
  animation: titlePulse 1.5s ease-in-out infinite;
  letter-spacing: 4px;
}

.subtitle-text {
  font-size: 32px;
  font-weight: 700;
  color: #000;
  text-shadow: none;
  letter-spacing: 2px;
  background: #fff;
  padding: 4px 12px;
  border: 2px solid #000;
  border-radius: 12px;
  box-shadow: 4px 4px 0px #000;
  align-self: center;
  transform: rotate(2deg);
}

.particle {
  position: absolute;
  font-size: 32px;
  pointer-events: none;
  will-change: transform;
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
  color: #4ECDC4;
  text-shadow: 0 0 10px rgba(78, 205, 196, 0.8),
               0 0 20px rgba(78, 205, 196, 0.6),
               0 0 30px rgba(78, 205, 196, 0.4);
  animation: sparkleTwinkle ease-in-out infinite;
  will-change: transform, opacity;
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
    filter: brightness(1);
  }
  50% {
    transform: scale(1.05);
    filter: brightness(1.2);
  }
}

@keyframes particleFall {
  0% {
    transform: translateY(-10px) rotate(0deg) scale(1);
    opacity: 1;
  }
  50% {
    transform: translateY(calc(100vh + 20px)) rotate(180deg) scale(0.8);
    opacity: 0.8;
  }
  100% {
    transform: translateY(calc(100vh + 50px)) rotate(360deg) scale(0.5);
    opacity: 0;
  }
}

@keyframes particleGentleFall {
  0% {
    transform: translateY(-10px) rotate(0deg) scale(1);
    opacity: 0.8;
  }
  50% {
    transform: translateY(calc(50vh + 20px)) rotate(90deg) scale(0.7);
    opacity: 0.6;
  }
  100% {
    transform: translateY(calc(100vh + 30px)) rotate(180deg) scale(0.4);
    opacity: 0;
  }
}

@keyframes sparkleTwinkle {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.8;
  }
  25% {
    transform: scale(1.3) rotate(90deg);
    opacity: 1;
  }
  50% {
    transform: scale(1) rotate(180deg);
    opacity: 0.6;
  }
  75% {
    transform: scale(1.2) rotate(270deg);
    opacity: 0.9;
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

  .particle {
    font-size: 24px;
  }

  .sparkle {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .celebration-title {
    padding: 24px 32px;
    border-radius: 16px;
  }

  .title-text {
    font-size: 36px;
    letter-spacing: 1px;
  }

  .subtitle-text {
    font-size: 20px;
  }

  .particle {
    font-size: 20px;
  }

  .sparkle {
    font-size: 16px;
  }
}

</style>

