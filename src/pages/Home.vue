<template>
  <div class="home-page">
    <div v-if="!isUnlocked" class="lock-screen">
      <div class="lock-card">
        <div class="lock-icon">🔒</div>
        <h2 class="lock-title">访问受限</h2>
        <p class="lock-desc">请输入访问密码以解锁功能</p>
        <div class="lock-input-wrapper">
          <input 
            v-model="password" 
            type="tel" 
            maxlength="6" 
            placeholder="输入6位密码" 
            class="lock-input"
            @input="checkPassword"
          />
        </div>
        <p v-if="showError" class="error-msg">密码错误，请重试</p>
        <div class="contact-info">
          <p>没有密码？请联系管理员</p>
          <p class="wechat-id">微信号: 17671759692</p>
        </div>
      </div>
    </div>

    <div v-else class="home-container">
      <div class="header">
        <h1 class="main-title">估值工具集合</h1>
        <p class="subtitle">选择您需要的估值服务</p>
      </div>

    <div class="services-grid">
      <div class="service-card plate-card" @click="goToPlate">
        <div class="card-icon">🚗</div>
        <h2 class="card-title">车牌估值</h2>
        <p class="card-desc">输入车牌号，获取估值结果</p>
        <div class="card-footer">
          <span class="card-link">立即使用 →</span>
        </div>
      </div>

      <div class="service-card phone-card" @click="goToPhone">
        <div class="card-icon">📱</div>
        <h2 class="card-title">手机尾号估值</h2>
        <p class="card-desc">输入4位尾号，获取估值分析</p>
        <div class="card-footer">
          <span class="card-link">立即使用 →</span>
        </div>
      </div>

      <div class="service-card name-card" @click="goToName">
        <div class="card-icon">🧑🏻‍💼</div>
        <h2 class="card-title">姓名打分</h2>
        <p class="card-desc">输入姓名，获取评分与五格解析</p>
        <div class="card-footer">
          <span class="card-link">立即使用 →</span>
        </div>
      </div>

      <div class="service-card texture-card" @click="goToTexture">
        <div class="card-icon">🖼️</div>
        <h2 class="card-title">艺术字设计</h2>
        <p class="card-desc">输入姓名与样式，生成创意图片</p>
        <div class="card-footer">
          <span class="card-link">立即使用 →</span>
        </div>
      </div>
    </div>

    <div class="footer-tip">
      <p>温馨提示：所有估值结果仅供娱乐，切勿当真！</p>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'

const router = useRouter()
const isUnlocked = ref(false)
const password = ref('')
const showError = ref(false)

const checkPassword = () => {
  showError.value = false
  if (password.value === '921221') {
    isUnlocked.value = true
    localStorage.setItem('app_unlocked', 'true')
  } else if (password.value.length === 6) {
    showError.value = true
    password.value = ''
  }
}

const goToPlate = () => {
  router.push('/plate')
}

const goToPhone = () => {
  router.push('/phone')
}

const goToName = () => {
  router.push('/name-scoring')
}

const goToTexture = () => {
  router.push('/text-texture')
}

onMounted(() => {
  const unlocked = localStorage.getItem('app_unlocked')
  if (unlocked === 'true') {
    isUnlocked.value = true
  }

  const conn: any = (navigator as any).connection
  const isSlow = conn && (conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g')
  const run = () => {
    import('../pages/PlateValuation.vue')
    import('../pages/PhoneValuation.vue')
    import('../pages/NameScoring.vue')
    import('../pages/TextTexture.vue')
    const links = [
      { href: '/assets/5.png', as: 'image' }
    ]
    links.forEach((item) => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = item.href
      ;(link as any).as = item.as
      document.head.appendChild(link)
    })
  }
  const ric = (window as any).requestIdleCallback
  if (!isSlow && typeof ric === 'function') {
    ric(run, { timeout: 2000 })
  } else if (!isSlow) {
    setTimeout(run, 500)
  }
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background-color: #f0f9ff;
  background-image: radial-gradient(#bae6fd 2px, transparent 2px);
  background-size: 20px 20px;
}

.lock-screen {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.lock-card {
  background: #fff;
  border: 3px solid #000;
  border-radius: 16px;
  padding: 30px 20px;
  width: 100%;
  max-width: 320px;
  text-align: center;
  box-shadow: 8px 8px 0px #000;
}

.lock-icon {
  font-size: 48px;
  margin-bottom: 16px;
  animation: bounce 2s infinite;
}

.lock-title {
  font-size: 24px;
  font-weight: 900;
  color: #000;
  margin: 0 0 8px 0;
}

.lock-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
  font-weight: 600;
}

.lock-input-wrapper {
  margin-bottom: 16px;
}

.lock-input {
  width: 100%;
  height: 48px;
  border: 3px solid #000;
  border-radius: 12px;
  font-size: 20px;
  text-align: center;
  font-weight: 700;
  letter-spacing: 4px;
  outline: none;
  box-sizing: border-box;
  transition: all 0.2s;
}

.lock-input:focus {
  border-color: #38bdf8;
  box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.2);
}

.error-msg {
  color: #ef4444;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 16px;
  animation: shake 0.5s;
}

.contact-info {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 2px dashed #e5e7eb;
}

.contact-info p {
  margin: 4px 0;
  font-size: 12px;
  color: #666;
  font-weight: 600;
}

.wechat-id {
  color: #000 !important;
  font-weight: 800 !important;
  font-size: 14px !important;
  background: #fef08a;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
  border: 2px solid #000;
  margin-top: 8px !important;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.home-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.main-title {
  font-size: 32px;
  font-weight: 900;
  color: #0c4a6e;
  margin: 0 0 8px 0;
  text-shadow: 3px 3px 0px #38bdf8;
  transform: rotate(-2deg);
}

.subtitle {
  font-size: 14px;
  color: #0369a1;
  font-weight: 700;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
}

.service-card {
  background: #fff;
  border: 3px solid #000;
  border-radius: 16px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.1s;
  box-shadow: 4px 4px 0px #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-height: 140px;
  position: relative;
}

.service-card:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #000;
}

.service-card:active {
  transform: translate(4px, 4px);
  box-shadow: none;
}

/* Card Accents */
.plate-card { background: #eff6ff; }
.phone-card { background: #fdf4ff; }
.name-card { background: #fff7ed; }
.texture-card { background: #f0fdf4; }

.card-icon {
  font-size: 36px;
  margin-bottom: 8px;
  filter: drop-shadow(2px 2px 0px rgba(0,0,0,0.2));
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.card-title {
  font-size: 16px;
  font-weight: 900;
  color: #000;
  margin: 0 0 6px 0;
}

.card-desc {
  font-size: 12px;
  color: #444;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 12px;
}

.card-footer {
  margin-top: auto;
  width: 100%;
}

.card-link {
  display: block;
  width: 100%;
  padding: 6px 0;
  background: #000;
  color: #fff;
  font-weight: 700;
  border-radius: 8px;
  font-size: 12px;
  transition: all 0.2s;
}

.service-card:hover .card-link {
  background: #38bdf8;
  color: #000;
}

.footer-tip {
  text-align: center;
  color: #0369a1;
  font-size: 12px;
  margin-top: 24px;
  font-weight: 600;
  background: #fff;
  padding: 6px 12px;
  border: 2px solid #000;
  border-radius: 20px;
  box-shadow: 2px 2px 0px #000;
}

@media (max-width: 480px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .main-title { font-size: 28px; }
}
</style>
