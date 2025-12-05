<template>
  
  <div class="phone-input-container" :class="{ valid: isValid }">
    <el-input
      v-model="phoneValue"
      placeholder="请输入4位尾号"
      size="large"
      maxlength="4"
      clearable
      @keyup.enter="handleQuery"
      @input="handleInput"
      class="phone-input"
    >
      <template #prefix>
        <span class="input-label">尾号</span>
      </template>
      <template #suffix>
        <div class="suffix-decoration">
          <span v-if="isValid" class="seal-text">吉</span>
        </div>
      </template>
    </el-input>
  </div>
  
</template>

<script setup lang="ts">

import { ref, watch } from 'vue'
import { validateTailNumber } from '../../utils/phone/phoneValidator'

const props = defineProps<{
  loading?: boolean
  modelValue?: string
}>()

const emit = defineEmits<{
  query: [tailNumber: string]
  'update:modelValue': [value: string]
}>()

const phoneValue = ref(props.modelValue || '')
const isValid = ref(false)
let debounceTimer: any

watch(() => props.modelValue, (newVal) => {
  if (newVal !== undefined && newVal !== phoneValue.value) {
    phoneValue.value = newVal
    isValid.value = validateTailNumber(newVal)
  }
})

// 只允许输入数字
const handleInput = (value: string) => {
  const cleanValue = value.replace(/\D/g, '').slice(0, 4)
  phoneValue.value = cleanValue
  emit('update:modelValue', cleanValue)
  
  isValid.value = validateTailNumber(phoneValue.value)
  if (debounceTimer) clearTimeout(debounceTimer)
  if (isValid.value && phoneValue.value.length === 4) {
    debounceTimer = setTimeout(() => {
      emit('query', phoneValue.value)
    }, 250)
  }
}

const handleQuery = () => {
  if (!phoneValue.value.trim()) {
    return
  }
  
  if (!validateTailNumber(phoneValue.value)) {
    return
  }
  
  emit('query', phoneValue.value)
}

</script>
<style scoped>

.phone-input-container {
  width: 90%;
  margin: 0 auto;
  padding: 0;
  margin-top: 20px;
  position: relative;
  z-index: 10;
}

.phone-input {
  width: 100%;
}

:deep(.el-input__wrapper) {
  width: 100%;
  height: 60px;
  padding: 0 20px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(192, 57, 43, 0.3);
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 4px 20px rgba(192, 57, 43, 0.15);
  border-color: #c0392b;
  background: #fff;
}

.input-label {
  font-family: 'Noto Serif SC', serif;
  font-weight: 700;
  color: #333;
  font-size: 16px;
  padding-right: 12px;
  border-right: 1px solid #ddd;
  margin-right: 4px;
}

:deep(.el-input__inner) {
  font-family: 'Noto Serif SC', serif;
  font-weight: 700;
  letter-spacing: 4px;
  font-size: 24px;
  color: #c0392b;
  background: transparent;
  height: 100%;
  text-align: center;
}

:deep(.el-input__inner::placeholder) {
  color: #bbb;
  font-weight: 400;
  font-size: 16px;
  letter-spacing: 1px;
}

.suffix-decoration {
  display: flex;
  align-items: center;
}

.seal-text {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 2px solid #c0392b;
  color: #c0392b;
  font-family: 'Ma Shan Zheng', cursive;
  border-radius: 4px;
  font-size: 16px;
  transform: rotate(15deg);
  opacity: 0.8;
}

</style>
