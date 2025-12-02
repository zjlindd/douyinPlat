// renderer.js
import { calculatePlateValue, formatPlateNumber } from './utils/valuation.js'
import { getAllProvinces, parsePlateNumber } from './utils/provinces.js'

// 应用状态
const state = {
  plateParts: ['', '', '', '', '', '', '', ''],
  currentInputIndex: 0,
  showKeyboard: false,
  showResult: false,
  valuationResult: null
}

// 键盘数据
const letterKeys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
const numberKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

// 初始化
function init() {
  // 确保函数已暴露到全局作用域（双重保险）
  window.onKeyPress = onKeyPress
  window.onDelete = onDelete
  window.onConfirm = onConfirm
  window.skipEnergy = skipEnergy
  
  // 初始化省份键盘
  const provinces = getAllProvinces()
  const provinceCodes = provinces.map(p => ({ code: p.code, name: p.name }))
  
  const mid = Math.ceil(provinceCodes.length / 2)
  const provinceRow1 = provinceCodes.slice(0, mid)
  const provinceRow2 = provinceCodes.slice(mid)
  
  // 渲染省份键盘
  renderProvinceKeyboard(provinceRow1, provinceRow2)
  
  // 渲染字母键盘
  renderLetterKeyboard()
  
  // 渲染数字和混合键盘
  renderMixedKeyboard()
  
  // 绑定事件
  bindEvents()
}

// 渲染省份键盘
function renderProvinceKeyboard(row1, row2) {
  const row1El = document.getElementById('provinceRow1')
  const row2El = document.getElementById('provinceRow2')
  
  row1.forEach(province => {
    const btn = document.createElement('div')
    btn.className = 'key-item'
    btn.textContent = province.code
    btn.onclick = () => onKeyPress(province.code)
    row1El.appendChild(btn)
  })
  
  row2.forEach(province => {
    const btn = document.createElement('div')
    btn.className = 'key-item'
    btn.textContent = province.code
    btn.onclick = () => onKeyPress(province.code)
    row2El.appendChild(btn)
  })
}

// 渲染字母键盘
function renderLetterKeyboard() {
  const rowEl = document.getElementById('letterRow')
  letterKeys.forEach(letter => {
    const btn = document.createElement('div')
    btn.className = 'key-item'
    btn.textContent = letter
    btn.onclick = () => onKeyPress(letter)
    rowEl.appendChild(btn)
  })
}

// 渲染混合键盘
function renderMixedKeyboard() {
  const numberRowEl = document.getElementById('numberRow')
  const letterRowEl = document.getElementById('mixedLetterRow')
  
  numberKeys.forEach(num => {
    const btn = document.createElement('div')
    btn.className = 'key-item'
    btn.textContent = num
    btn.onclick = () => onKeyPress(num)
    numberRowEl.appendChild(btn)
  })
  
  letterKeys.forEach(letter => {
    const btn = document.createElement('div')
    btn.className = 'key-item'
    btn.textContent = letter
    btn.onclick = () => onKeyPress(letter)
    letterRowEl.appendChild(btn)
  })
}

// 绑定事件
function bindEvents() {
  // 绑定车牌输入框点击事件
  document.querySelectorAll('.plate-display-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const index = parseInt(e.currentTarget.dataset.index)
      focusInput(index)
    })
  })
}

// 聚焦输入框
function focusInput(index) {
  state.currentInputIndex = index
  let hint = ''
  
  if (index === 0) {
    hint = '请选择省份'
  } else if (index === 1) {
    hint = '请输入字母（A-Z，不含I、O）'
  } else if (index >= 2 && index <= 6) {
    hint = '请输入数字或字母'
  } else if (index === 7) {
    hint = '请输入F或D（可选）'
  }
  
  // 更新UI
  updateActiveInput()
  showKeyboard(index)
  updateInputHint(hint)
}

// 更新活动输入框
function updateActiveInput() {
  document.querySelectorAll('.plate-display-item').forEach((item, index) => {
    if (index === state.currentInputIndex) {
      item.classList.add('active')
    } else {
      item.classList.remove('active')
    }
  })
}

// 显示键盘
function showKeyboard(index) {
  const keyboardContainer = document.getElementById('keyboardContainer')
  keyboardContainer.style.display = 'block'
  state.showKeyboard = true
  
  // 隐藏所有键盘
  document.getElementById('provinceKeyboard').style.display = 'none'
  document.getElementById('letterKeyboard').style.display = 'none'
  document.getElementById('mixedKeyboard').style.display = 'none'
  document.getElementById('energyKeyboard').style.display = 'none'
  
  // 显示对应的键盘
  if (index === 0) {
    document.getElementById('provinceKeyboard').style.display = 'block'
  } else if (index === 1) {
    document.getElementById('letterKeyboard').style.display = 'block'
  } else if (index >= 2 && index <= 6) {
    document.getElementById('mixedKeyboard').style.display = 'block'
  } else if (index === 7) {
    document.getElementById('energyKeyboard').style.display = 'block'
  }
}

// 更新输入提示
function updateInputHint(hint) {
  const hintEl = document.getElementById('inputHint')
  if (hint) {
    hintEl.textContent = hint
    hintEl.style.display = 'block'
  } else {
    hintEl.style.display = 'none'
  }
}

// 按键输入
function onKeyPress(key) {
  const index = state.currentInputIndex
  const plateParts = [...state.plateParts]
  let inputSuccess = false
  
  // 验证输入
  if (index === 0) {
    if (key && key.length === 1) {
      plateParts[0] = key
      inputSuccess = true
    }
  } else if (index === 1) {
    if (key && /^[A-Z]$/.test(key) && key !== 'I' && key !== 'O') {
      plateParts[1] = key
      inputSuccess = true
    }
  } else if (index >= 2 && index <= 6) {
    if (key && (/^[0-9]$/.test(key) || (/^[A-Z]$/.test(key) && key !== 'I' && key !== 'O'))) {
      plateParts[index] = key
      inputSuccess = true
    }
  } else if (index === 7) {
    if (key === 'F' || key === 'D') {
      plateParts[7] = key
      inputSuccess = true
    }
  }
  
  if (inputSuccess) {
    state.plateParts = plateParts
    updatePlateDisplay()
    
    // 自动跳转到下一个输入框
    moveToNext()
  }
}

// 更新车牌显示
function updatePlateDisplay() {
  state.plateParts.forEach((part, index) => {
    const textEl = document.querySelector(`.plate-text[data-part="${index}"]`)
    const itemEl = document.querySelector(`.plate-display-item[data-index="${index}"]`)
    
    if (textEl) {
      if (part) {
        textEl.textContent = part
        textEl.style.display = 'inline-block'
        
        // 隐藏可选提示
        if (index === 7) {
          const optionalHint = itemEl.querySelector('.optional-hint')
          if (optionalHint) {
            optionalHint.style.display = 'none'
          }
          itemEl.classList.add('filled')
          itemEl.classList.remove('optional')
        }
      } else {
        if (index === 0) {
          textEl.textContent = '省'
        } else {
          textEl.textContent = ''
        }
        
        if (index === 7) {
          const optionalHint = itemEl.querySelector('.optional-hint')
          if (optionalHint) {
            optionalHint.style.display = 'flex'
          }
          itemEl.classList.remove('filled')
          itemEl.classList.add('optional')
        }
      }
    }
  })
}

// 移动到下一个输入框
function moveToNext() {
  const index = state.currentInputIndex
  const plateParts = state.plateParts
  
  if (plateParts[index]) {
    let nextIndex = index + 1
    
    if (nextIndex > 7) {
      hideKeyboard()
      return
    }
    
    if (nextIndex === 7) {
      let allFilled = true
      for (let i = 0; i < 7; i++) {
        if (!plateParts[i]) {
          allFilled = false
          break
        }
      }
      if (!allFilled) {
        return
      }
    }
    
    let hint = ''
    if (nextIndex === 0) {
      hint = '请选择省份'
    } else if (nextIndex === 1) {
      hint = '请输入字母（A-Z，不含I、O）'
    } else if (nextIndex >= 2 && nextIndex <= 6) {
      hint = '请输入数字或字母'
    } else if (nextIndex === 7) {
      hint = '请输入F或D（可选）'
    }
    
    state.currentInputIndex = nextIndex
    updateActiveInput()
    showKeyboard(nextIndex)
    updateInputHint(hint)
  }
}

// 删除
function onDelete() {
  const index = state.currentInputIndex
  const plateParts = [...state.plateParts]
  let deleteSuccess = false
  
  if (plateParts[index]) {
    plateParts[index] = ''
    deleteSuccess = true
  } else if (index > 0) {
    plateParts[index - 1] = ''
    deleteSuccess = true
    state.currentInputIndex = index - 1
    updateActiveInput()
    showKeyboard(index - 1)
  }
  
  if (deleteSuccess) {
    state.plateParts = plateParts
    updatePlateDisplay()
  }
}

// 确认
function onConfirm() {
  const plateParts = state.plateParts
  let allFilled = true
  for (let i = 0; i < 7; i++) {
    if (!plateParts[i]) {
      allFilled = false
      break
    }
  }
  
  if (allFilled) {
    hideKeyboard()
    setTimeout(() => {
      queryValuation()
    }, 100)
  } else {
    hideKeyboard()
  }
}

// 跳过新能源标识
function skipEnergy() {
  state.currentInputIndex = 0
  hideKeyboard()
}

// 将需要在HTML中调用的函数暴露到全局作用域（在所有函数定义之后）
window.onKeyPress = onKeyPress
window.onDelete = onDelete
window.onConfirm = onConfirm
window.skipEnergy = skipEnergy

// 隐藏键盘
function hideKeyboard() {
  document.getElementById('keyboardContainer').style.display = 'none'
  document.getElementById('inputHint').style.display = 'none'
  state.showKeyboard = false
}

// 获取完整车牌号
function getPlateNumber() {
  const parts = state.plateParts
  let plate = ''
  
  for (let i = 0; i < 7; i++) {
    if (parts[i]) {
      plate += parts[i]
    } else {
      return null
    }
  }
  
  if (parts[7]) {
    plate += parts[7]
  }
  
  return plate
}

// 查询估值
function queryValuation() {
  const plateNumber = getPlateNumber()
  
  if (!plateNumber) {
    alert('请输入完整的车牌号')
    return
  }
  
  try {
    const result = calculatePlateValue(plateNumber)
    const formattedPlate = formatPlateNumber(plateNumber)
    const plateInfo = parsePlateNumber(plateNumber)
    const locationName = plateInfo.city || (plateInfo.province ? plateInfo.province.fullName : '未知地区')
    
    const levelClassMap = {
      '极品': 'excellent',
      '优秀': 'great',
      '良好': 'good',
      '中等': 'medium',
      '一般': 'normal',
      '普通': 'common'
    }
    
    const plateForDisplay = formattedPlate || plateNumber || ''
    const plateProvince = plateForDisplay.length >= 2 ? plateForDisplay.substring(0, 2) : ''
    const plateNumberPart = plateForDisplay.length > 2 ? plateForDisplay.substring(2) : ''
    
    let finalValue = result.value || 0
    const hasAnimation = result.isRare || (result.animationLevel && result.animationLevel > 0)
    if (hasAnimation) {
      finalValue = finalValue * 10
    }
    
    const valuationResult = {
      value: finalValue,
      level: result.level || '普通',
      stars: result.stars || 1,
      comment: result.comment || '普通车牌号',
      factors: result.factors || ['普通车牌'],
      plate: result.plate || plateNumber,
      formattedPlate: formattedPlate || plateNumber,
      plateProvince: plateProvince,
      plateNumberPart: plateNumberPart,
      levelClass: levelClassMap[result.level] || 'common',
      provinceName: locationName
    }
    
    state.valuationResult = valuationResult
    state.showResult = true
    
    displayResult(valuationResult)
  } catch (error) {
    console.error('估值计算错误:', error)
    alert('估值计算失败: ' + (error.message || '未知错误'))
  }
}

// 显示结果
function displayResult(result) {
  const resultSection = document.getElementById('resultSection')
  resultSection.style.display = 'block'
  
  // 显示归属地
  document.getElementById('provinceName').textContent = result.provinceName
  
  // 显示车牌号
  const plateDisplay = document.getElementById('plateDisplay')
  if (result.plateProvince) {
    plateDisplay.innerHTML = `<span class="plate-province">${result.plateProvince}</span><span class="plate-dot">·</span><span class="plate-number">${result.plateNumberPart}</span>`
  } else {
    plateDisplay.textContent = result.formattedPlate || result.plate
  }
  
  // 显示估值
  document.getElementById('valuationValue').textContent = `¥${result.value.toLocaleString()}`
  
  // 显示评价
  const levelEl = document.getElementById('valuationLevel')
  levelEl.textContent = result.level
  levelEl.className = `valuation-level-compact level-${result.levelClass}`
  
  // 显示星级
  const starsContainer = document.getElementById('starsContainer')
  starsContainer.innerHTML = ''
  for (let i = 0; i < 5; i++) {
    const star = document.createElement('span')
    star.className = `star-compact ${i < result.stars ? 'active' : ''}`
    star.textContent = '⭐'
    starsContainer.appendChild(star)
  }
  
  // 显示评论
  document.getElementById('valuationComment').textContent = result.comment
  
  // 显示分析因素
  if (result.factors && result.factors.length > 0) {
    const factorsSection = document.getElementById('factorsSection')
    const factorsList = document.getElementById('factorsList')
    factorsList.innerHTML = ''
    result.factors.forEach(factor => {
      const tag = document.createElement('div')
      tag.className = 'factor-tag'
      tag.textContent = factor
      factorsList.appendChild(tag)
    })
    factorsSection.style.display = 'block'
  }
  
  // 滚动到结果区域
  resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init)

