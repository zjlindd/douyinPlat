import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
const Home = () => import('../pages/Home.vue')
const PlateValuation = () => import('../pages/PlateValuation.vue')
const PhoneValuation = () => import('../pages/PhoneValuation.vue')
const NameScoring = () => import('../pages/NameScoring.vue')
const TextTexture = () => import('../pages/TextTexture.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/plate',
    name: 'PlateValuation',
    component: PlateValuation
  },
  {
    path: '/phone',
    name: 'PhoneValuation',
    component: PhoneValuation
  }
  ,
  {
    path: '/name-scoring',
    name: 'NameScoring',
    component: NameScoring
  },
  {
    path: '/text-texture',
    name: 'TextTexture',
    component: TextTexture
  }
]

const router = createRouter({
  history: import.meta.env.DEV ? createWebHistory() : createWebHashHistory(),
  routes
})

export default router
