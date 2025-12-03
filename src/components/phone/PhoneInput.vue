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
        <el-icon><Phone /></el-icon>
      </template>
      <template #suffix>
        <el-icon :class="['valid-icon', { visible: isValid }]"><CircleCheckFilled /></el-icon>
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
  width: 85%;
  margin: 0 auto;
  padding: 0 12px;
  margin-top: 10px
}

.phone-input {
  width: 100%;
}

.phone-input-container.valid :deep(.el-input__wrapper) {
  width: 100%;
  border: 2px solid #000;
  box-shadow: 2px 2px 0px #000;
  background: #f0fdf4; /* light green bg when valid */
}

:deep(.el-input__wrapper) {
  width: 100%;
  height: 46px;
  padding: 0 16px;
  border-radius: 12px;
  background: #fff;
  border: 2px solid #000;
  box-shadow: 3px 3px 0px #000;
  transition: all 0.1s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 1px 1px 0px #000;
  transform: translate(2px, 2px);
}

:deep(.el-input__prefix),
:deep(.el-input__suffix) {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
}

:deep(.el-input__prefix) {
  margin-right: 8px;
  color: #000;
  font-size: 18px;
}

:deep(.el-input__suffix) {
  margin-left: 8px;
}

:deep(.el-input__inner) {
  font-weight: 900;
  letter-spacing: 2px;
  font-size: 18px;
  color: #000;
  background: transparent;
  height: 100%;
}

:deep(.el-input__inner::placeholder) {
  color: #9ca3af;
  font-weight: 500;
  letter-spacing: 0;
  font-size: 14px;
}

.valid-icon {
  color: #059669;
  font-size: 20px;
  opacity: 0;
  transition: opacity 0.2s ease, transform 0.2s ease;
  transform: scale(0.8);
}
.valid-icon.visible {
  opacity: 1;
  transform: scale(1);
}

</style>
