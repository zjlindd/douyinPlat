
// utils/valuation.ts
// 车牌估值算法

import type { ValuationResult } from '../types'

/**
 * 车牌估值算法
 */
export function calculatePlateValue(plateNumber: string): ValuationResult {
  if (!plateNumber || !plateNumber.trim()) {
    return {
      value: 0,
      level: '无效',
      stars: 0,
      comment: '请输入有效的车牌号',
      factors: [],
      plate: plateNumber
    }
  }

  // 标准化车牌号（去除空格，转大写）
  const plate = plateNumber.trim().toUpperCase().replace(/\s/g, '')
  
  // 验证车牌格式（简单验证：7-8位字符）
  if (plate.length < 7 || plate.length > 8) {
    return {
      value: 0,
      level: '格式错误',
      stars: 0,
      comment: '车牌格式不正确',
      factors: [],
      plate: plate
    }
  }

  let baseValue = 3000 // 基础价值（降低普通号估值）
  let multiplier = 1.0 // 基础倍数（降低普通号估值）
  let factors: string[] = [] // 影响因素
  let positivePoints = 0 // 积极因素得分

  // 提取数字部分和字母部分
  const numbersPart = plate.substring(2) // 第3位开始的部分
  const lettersPart = plate.substring(0, 2) + plate.substring(2).replace(/\d/g, '') // 字母部分

  // 1. 连号检测（优化：支持2连号、3连号及以上）
  // 1.1 检测2连号（如：88, 66, 99等）
  let tempPlate = plate
  // 先标记3连号及以上，避免重复计算
  const triplePlusPattern = /(\d)\1{2,}/g
  const triplePlusMatches = plate.match(triplePlusPattern) || []
  triplePlusMatches.forEach(match => {
    tempPlate = tempPlate.replace(match, 'X'.repeat(match.length))
  })
  // 在剩余部分查找2连号
  const doubleInRemainder = tempPlate.match(/(\d)\1{1}(?!\1)/g)
  if (doubleInRemainder) {
    doubleInRemainder.forEach(match => {
      const digit = parseInt(match[0])
      if (digit === 8) {
        multiplier += 0.4
        positivePoints += 15
        factors.push(`2个8（双8，吉祥数字）`)
      } else if (digit === 6) {
        multiplier += 0.3
        positivePoints += 12
        factors.push(`2个6（双6，顺利数字）`)
      } else if (digit === 9) {
        multiplier += 0.25
        positivePoints += 10
        factors.push(`2个9（双9，长久数字）`)
      } else {
        multiplier += 0.15
        positivePoints += 8
        factors.push(`2个${digit}（双号，易记）`)
      }
    })
  }

  // 1.2 检测3连号及以上（如：888, 666, 999等）
  const consecutivePattern = /(\d)\1{2,}/g
  const consecutiveMatches = plate.match(consecutivePattern)
  if (consecutiveMatches) {
    consecutiveMatches.forEach(match => {
      const digit = parseInt(match[0])
      const length = match.length
      
      // 8越多越值钱，6次之，9也不错
      if (digit === 8) {
        if (length >= 5) {
          multiplier += length * 2.0 // 5连号及以上价值极高
          positivePoints += length * 80
          factors.push(`${length}个8（超级连号，价值极高）`)
        } else if (length === 4) {
          multiplier += 3.5 // 4连号
          positivePoints += 120
          factors.push(`4个8（四连8，价值很高）`)
        } else {
          multiplier += 2.0 // 3连号
          positivePoints += 60
          factors.push(`3个8（三连8，吉祥数字）`)
        }
      } else if (digit === 6) {
        if (length >= 5) {
          multiplier += length * 1.5
          positivePoints += length * 60
          factors.push(`${length}个6（超级连号，价值很高）`)
        } else if (length === 4) {
          multiplier += 2.5
          positivePoints += 90
          factors.push(`4个6（四连6，价值很高）`)
        } else {
          multiplier += 1.5
          positivePoints += 45
          factors.push(`3个6（三连6，顺利数字）`)
        }
      } else if (digit === 9) {
        if (length >= 5) {
          multiplier += length * 1.3
          positivePoints += length * 50
          factors.push(`${length}个9（超级连号，价值很高）`)
        } else if (length === 4) {
          multiplier += 2.0
          positivePoints += 75
          factors.push(`4个9（四连9，价值很高）`)
        } else {
          multiplier += 1.2
          positivePoints += 40
          factors.push(`3个9（三连9，长久数字）`)
        }
      } else {
        if (length >= 5) {
          multiplier += length * 1.0
          positivePoints += length * 40
          factors.push(`${length}个${digit}（超级连号，价值较高）`)
        } else if (length === 4) {
          multiplier += 1.5
          positivePoints += 50
          factors.push(`4个${digit}（四连号，价值较高）`)
        } else {
          multiplier += 0.8
          positivePoints += 25
          factors.push(`3个${digit}（三连号，价值较高）`)
        }
      }
    })
  }

  // 2. 顺子检测（优化：支持数字顺子和字母顺子）
  // 2.1 数字顺子检测（如：123, 567, 789等）- 支持3-7位顺子
  const detectNumberSequence = (str: string): Array<{ seq: string; start: number; length: number }> => {
    const sequences: Array<{ seq: string; start: number; length: number }> = []
    for (let i = 0; i < str.length - 2; i++) {
      for (let len = 3; len <= Math.min(7, str.length - i); len++) {
        const sub = str.substring(i, i + len)
        let isSequence = true
        for (let j = 1; j < len; j++) {
          const prev = parseInt(sub[j - 1])
          const curr = parseInt(sub[j])
          if (curr !== prev + 1) {
            isSequence = false
            break
          }
        }
        if (isSequence && len >= 3) {
          sequences.push({ seq: sub, start: i, length: len })
          break // 找到最长顺子后跳出
        }
      }
    }
    return sequences
  }
  
  const numberSequences = detectNumberSequence(plate.substring(2))
  if (numberSequences.length > 0) {
    // 找到最长的顺子
    const longestSeq = numberSequences.reduce((a, b) => a.length > b.length ? a : b)
    const length = longestSeq.length
    if (length >= 5) {
      multiplier += 1.5 // 5位及以上顺子
      positivePoints += 70
      factors.push(`${length}位数字顺子（超级顺子，价值很高）`)
    } else if (length === 4) {
      multiplier += 1.2 // 4位顺子
      positivePoints += 50
      factors.push(`4位数字顺子（步步高升，价值很高）`)
    } else {
      multiplier += 0.8 // 3位顺子
      positivePoints += 30
      factors.push('数字顺子（寓意步步高升）')
    }
  }

  // 2.2 字母顺子检测（如：ABC, XYZ等）
  const letterSequencePattern = /(?:ABC|BCD|CDE|DEF|EFG|FGH|GHI|HIJ|IJK|JKL|KLM|LMN|MNO|NOP|OPQ|PQR|QRS|RST|STU|TUV|UVW|VWX|WXY|XYZ)/i
  if (letterSequencePattern.test(plate)) {
    const matches = plate.match(/(?:ABC|BCD|CDE|DEF|EFG|FGH|GHI|HIJ|JKL|KLM|LMN|MNO|NOP|PQR|QRS|RST|STU|TUV|UVW|VWX|WXY|XYZ)/gi)
    if (matches) {
      matches.forEach(match => {
        multiplier += 0.6
        positivePoints += 25
        factors.push(`字母顺子${match.toUpperCase()}（独特组合）`)
      })
    }
  }

  // 2.3 倒序顺子检测（如：321, 987等）
  const reverseSequencePattern = /(?:210|321|432|543|654|765|876|987|098)/g
  if (reverseSequencePattern.test(plate)) {
    multiplier += 0.7
    positivePoints += 30
    factors.push('倒序顺子（独特组合）')
  }

  // 3. 豹子号（全部相同数字，如：8888888）
  const allSamePattern = /^(\d)\1{6,}$/
  if (allSamePattern.test(plate)) {
    const digit = parseInt(plate[0])
    if (digit === 8) {
      multiplier += 10.0 // 8的豹子号价值极高
      positivePoints += 500
      factors.push('豹子号8888888（超级稀有，价值百万级）')
    } else if (digit === 6 || digit === 9) {
      multiplier += 8.0
      positivePoints += 400
      factors.push(`豹子号（超级稀有，价值数十万）`)
    } else {
      multiplier += 6.0
      positivePoints += 300
      factors.push('豹子号（超级稀有，价值很高）')
    }
  }

  // 4. 特殊组合（如：520, 1314等）
  if (plate.includes('520')) {
    multiplier += 1.0
    positivePoints += 50
    factors.push('520（我爱你，寓意美好）')
  }
  if (plate.includes('1314')) {
    multiplier += 1.2
    positivePoints += 60
    factors.push('1314（一生一世，寓意美好）')
  }
  if (plate.includes('888')) {
    multiplier += 2.0 // 888组合价值很高
    positivePoints += 100
    factors.push('888（发发发，价值很高）')
  }

  // 5. 字母组合检测（优化：扩展更多有意义的字母组合）
  // 5.1 VIP等特殊标识
  const vipPattern = /VIP/i
  if (vipPattern.test(plate)) {
    multiplier += 1.0
    positivePoints += 40
    factors.push('VIP（尊贵标识）')
  }

  // 5.2 字母连号（如：AAA, BBB, CCC等）
  const letterConsecutivePattern = /([A-Z])\1{2,}/i
  const letterConsecutiveMatches = plate.match(letterConsecutivePattern)
  if (letterConsecutiveMatches) {
    letterConsecutiveMatches.forEach(match => {
      const letter = match[0].toUpperCase()
      const length = match.length
      if (length >= 4) {
        multiplier += 1.5
        positivePoints += 60
        factors.push(`${length}个${letter}（字母连号，价值很高）`)
      } else {
        multiplier += 0.8
        positivePoints += 30
        factors.push(`3个${letter}（字母三连，独特）`)
      }
    })
  }

  // 5.3 字母双号（如：AA, BB等）
  const letterDoublePattern = /([A-Z])\1(?!\1)/i
  const letterDoubleMatches = plate.match(letterDoublePattern)
  if (letterDoubleMatches && !letterConsecutiveMatches) {
    letterDoubleMatches.forEach(match => {
      const letter = match[0].toUpperCase()
      multiplier += 0.3
      positivePoints += 12
      factors.push(`2个${letter}（字母双号，易记）`)
    })
  }

  // 5.4 特殊字母组合（如：LOVE, WIN, TOP等）
  const specialWords: Record<string, { multiplier: number; points: number; desc: string }> = {
    'LOVE': { multiplier: 1.2, points: 50, desc: 'LOVE（爱情寓意）' },
    'WIN': { multiplier: 1.0, points: 40, desc: 'WIN（胜利寓意）' },
    'TOP': { multiplier: 0.9, points: 35, desc: 'TOP（顶级寓意）' },
    'MAX': { multiplier: 0.9, points: 35, desc: 'MAX（最大寓意）' },
    'ACE': { multiplier: 0.8, points: 30, desc: 'ACE（王牌寓意）' },
    'ONE': { multiplier: 0.7, points: 25, desc: 'ONE（第一寓意）' }
  }
  for (const [word, config] of Object.entries(specialWords)) {
    if (plate.includes(word)) {
      multiplier += config.multiplier
      positivePoints += config.points
      factors.push(config.desc)
      break // 只匹配第一个
    }
  }

  // 5.5 字母对称（如：ABA, ABCBA等）
  const letterReversed = lettersPart.split('').reverse().join('')
  if (lettersPart.length >= 3 && lettersPart === letterReversed) {
    multiplier += 0.6
    positivePoints += 25
    factors.push('字母对称（美观独特）')
  }

  // 6. 对称号（如：1234321）
  const reversed = plate.split('').reverse().join('')
  if (plate === reversed && plate.length >= 5) {
    multiplier += 0.7
    positivePoints += 25
    factors.push('对称号（平衡美观）')
  }

  // 7. 重复模式（如：ABABAB）
  const repeatPattern = /^(.{2,3})\1{2,}$/
  if (repeatPattern.test(plate)) {
    multiplier += 0.6
    positivePoints += 20
    factors.push('重复模式（规律美观）')
  }

  // 8. 全数字检测（优化：检测是否全是数字）
  const numbersOnlyPattern = /^\d+$/
  const numbersOnlyPart = plate.substring(2) // 第3位开始的部分
  if (numbersOnlyPattern.test(numbersOnlyPart)) {
    multiplier += 0.3
    positivePoints += 15
    factors.push('全数字组合（简洁易记）')
    
    // 如果全数字且没有重复，额外加分
    const uniqueDigits = new Set(numbersOnlyPart.split(''))
    if (uniqueDigits.size === numbersOnlyPart.length) {
      multiplier += 0.2
      positivePoints += 10
      factors.push('数字无重复（独特）')
    }
  }

  // 9. 地区代码影响（优化：京A车牌特殊处理）
  const regionCode = plate.substring(0, 2)
  const isJingA = regionCode === '京A'
  
  // 京A车牌特殊处理（价值极高）
  if (isJingA) {
    baseValue += 2000 // 京A基础价值加成更高
    positivePoints += 100
    multiplier += 0.5 // 京A基础倍数加成
    
    // 京A特殊组合检测
    const numbersPart = plate.substring(2)
    let jingASpecialFound = false
    
    // 京A豹子号（如：11111, 22222, 88888等）- 优先检测
    const jingAAllSamePattern = /^(\d)\1{4,}$/
    if (jingAAllSamePattern.test(numbersPart)) {
      jingASpecialFound = true
      const digit = parseInt(numbersPart[0])
      if (digit === 8) {
        multiplier += 8.0 // 京A88888价值极高，可遇不可求
        positivePoints += 500
        factors.push('京A88888（可遇不可求，超级富豪专属，价值百万级）')
      } else if (digit === 1 || digit === 2 || digit === 3) {
        multiplier += 4.0 // 京A11111, 22222, 33333精品号
        positivePoints += 300
        factors.push(`京A${numbersPart}（精品号，超级富豪拥有，价值极高）`)
      } else if (digit === 6 || digit === 9) {
        multiplier += 3.5 // 京A66666, 99999精品号
        positivePoints += 250
        factors.push(`京A${numbersPart}（精品号，超级富豪拥有，价值极高）`)
      } else {
        multiplier += 2.5
        positivePoints += 180
        factors.push(`京A${numbersPart}（精品号，价值极高）`)
      }
    }
    
    // 京A顺子号（如：12345, 56789等）- 如果不是豹子号才检测
    if (!jingASpecialFound) {
      const jingASequencePattern = /^(?:01234|12345|23456|34567|45678|56789|67890)$/
      if (jingASequencePattern.test(numbersPart)) {
        jingASpecialFound = true
        multiplier += 3.0 // 京A顺子号价值很高
        positivePoints += 200
        factors.push(`京A${numbersPart}（精品顺子号，超级富豪拥有，价值极高）`)
      }
    }
    
    // 京A其他精品组合（如：12345等）- 如果还没匹配到特殊组合
    if (!jingASpecialFound) {
      if (numbersPart === '12345' || numbersPart === '56789' || numbersPart === '23456') {
        multiplier += 2.5
        positivePoints += 180
        factors.push(`京A${numbersPart}（精品顺子号，超级富豪拥有）`)
      }
    }
    
    factors.push('京A车牌（首都精品，价值极高）')
  } else {
    // 其他一线城市（提高估值）
    const tier1Cities = ['沪A', '粤A', '粤B', '浙A']
    if (tier1Cities.includes(regionCode)) {
      baseValue += 1500 // 提高一线城市基础价值（从800增加到1500）
      positivePoints += 80 // 提高积极得分（从30增加到80）
      multiplier += 0.3 // 增加基础倍数加成
      factors.push('一线城市（价值更高，稀缺资源）')
      
      // 一线城市特殊组合额外加成（精品号码估值放大10倍）
      const numbersPart = plate.substring(2)
      
      // 一线城市豹子号
      const tier1AllSamePattern = /^(\d)\1{4,}$/
      if (tier1AllSamePattern.test(numbersPart)) {
        const digit = parseInt(numbersPart[0])
        if (digit === 8) {
          multiplier += 40.0 // 一线城市88888（放大10倍：4.0 -> 40.0）
          positivePoints += 2500 // 放大10倍：250 -> 2500
          factors.push(`${regionCode}${numbersPart}（一线城市精品号，价值极高，超级稀缺）`)
        } else if (digit === 6 || digit === 9) {
          multiplier += 25.0 // 放大10倍：2.5 -> 25.0
          positivePoints += 1800 // 放大10倍：180 -> 1800
          factors.push(`${regionCode}${numbersPart}（一线城市精品号，价值极高，超级稀缺）`)
        } else {
          multiplier += 18.0 // 放大10倍：1.8 -> 18.0
          positivePoints += 1200 // 放大10倍：120 -> 1200
          factors.push(`${regionCode}${numbersPart}（一线城市精品号，价值极高）`)
        }
      }
      
      // 一线城市顺子号
      const tier1SequencePattern = /^(?:01234|12345|23456|34567|45678|56789|67890)$/
      if (tier1SequencePattern.test(numbersPart)) {
        multiplier += 18.0 // 放大10倍：1.8 -> 18.0
        positivePoints += 1200 // 放大10倍：120 -> 1200
        factors.push(`${regionCode}${numbersPart}（一线城市顺子号，价值极高，超级稀缺）`)
      }
    }
  }

  // 10. 谐音组合和特殊数字组合检测（新增：根据车牌号选择理论优化）
  // numbersPart 已在函数开始处声明，这里直接使用
  
  // 10.1 财运谐音组合
  const wealthCombinations: Record<string, { multiplier: number; points: number; desc: string }> = {
    '168': { multiplier: 1.5, points: 80, desc: '168（一路发，财运亨通）' },
    '518': { multiplier: 1.2, points: 60, desc: '518（我要发，财运好）' },
    '618': { multiplier: 1.3, points: 70, desc: '618（顺要发，财运好）' },
    '886': { multiplier: 1.1, points: 50, desc: '886（发发顺，财运好）' },
    '668': { multiplier: 1.2, points: 60, desc: '668（顺顺发，财运好）' },
    '688': { multiplier: 1.3, points: 70, desc: '688（顺发发，财运好）' },
    '889': { multiplier: 1.1, points: 50, desc: '889（发发久，财运好）' },
    '998': { multiplier: 1.0, points: 45, desc: '998（久久发，财运好）' }
  }
  
  for (const [combo, config] of Object.entries(wealthCombinations)) {
    if (plate.includes(combo)) {
      multiplier += config.multiplier
      positivePoints += config.points
      factors.push(config.desc)
      break // 只匹配第一个
    }
  }
  
  // 10.2 事业谐音组合
  const careerCombinations: Record<string, { multiplier: number; points: number; desc: string }> = {
    '213': { multiplier: 1.2, points: 60, desc: '213（易成功，事业顺利）' },
    '369': { multiplier: 1.1, points: 55, desc: '369（事业顺，步步高）' },
    '789': { multiplier: 1.0, points: 50, desc: '789（事业顺，财气不减）' }
  }
  
  for (const [combo, config] of Object.entries(careerCombinations)) {
    if (plate.includes(combo) && !factors.find(f => f.includes(combo))) {
      multiplier += config.multiplier
      positivePoints += config.points
      factors.push(config.desc)
      break
    }
  }
  
  // 10.3 固定搭配检测（11、22、33、44、66、77、88、99）
  const fixedPairsPattern = /(11|22|33|44|66|77|88|99)/g
  const fixedPairsMatches = plate.match(fixedPairsPattern)
  if (fixedPairsMatches) {
    fixedPairsMatches.forEach(pair => {
      const digit = parseInt(pair[0])
      if (digit === 8) {
        multiplier += 0.5
        positivePoints += 25
        if (!factors.find(f => f.includes('双8'))) {
          factors.push(`${pair}（双8，吉祥数字）`)
        }
      } else if (digit === 6) {
        multiplier += 0.4
        positivePoints += 20
        if (!factors.find(f => f.includes('双6'))) {
          factors.push(`${pair}（双6，顺利数字）`)
        }
      } else if (digit === 9) {
        multiplier += 0.35
        positivePoints += 18
        if (!factors.find(f => f.includes('双9'))) {
          factors.push(`${pair}（双9，长久数字）`)
        }
      } else {
        multiplier += 0.2
        positivePoints += 10
        if (!factors.find(f => f.includes('固定搭配'))) {
          factors.push(`${pair}（固定搭配，吉利）`)
        }
      }
    })
  }
  
  // 10.4 数字总和检测（吉利数字总和）
  const digitSum = numbersPart.split('').reduce((sum, char) => {
    const num = parseInt(char)
    return sum + (isNaN(num) ? 0 : num)
  }, 0)
  
  const luckySums = [1, 3, 5, 7, 8, 9, 11, 13, 15, 17, 23, 24, 31, 33, 35, 37, 39, 41, 45, 48]
  if (luckySums.includes(digitSum)) {
    multiplier += 0.4
    positivePoints += 20
    factors.push(`数字总和${digitSum}（吉利数字总和）`)
  }
  
  // 10.5 阴阳平衡检测（单数和双数都有）
  const digits = numbersPart.split('').filter(c => /\d/.test(c)).map(c => parseInt(c))
  const oddCount = digits.filter(d => d % 2 === 1).length
  const evenCount = digits.filter(d => d % 2 === 0).length
  
  if (oddCount > 0 && evenCount > 0 && digits.length >= 3) {
    multiplier += 0.3
    positivePoints += 15
    factors.push('阴阳平衡（单双数搭配，能量平衡）')
  }
  
  // 10.6 天、地、人三才检测（五位数：中间一位数不全大于两边的数）
  if (numbersPart.length === 5 && /^\d+$/.test(numbersPart)) {
    const middle = parseInt(numbersPart[2])
    const left = parseInt(numbersPart[1])
    const right = parseInt(numbersPart[3])
    
    // 中间数不全大于前后数（符合三才理论）
    if (!(middle > left && middle > right)) {
      multiplier += 0.3
      positivePoints += 15
      factors.push('三才平衡（天地人和谐）')
    }
  }
  
  // 10.7 字母与数字结合（如HY666、FU888）
  const letterNumberCombos: Record<string, { multiplier: number; points: number; desc: string }> = {
    'HY': { multiplier: 0.8, points: 40, desc: 'HY（好运，寓意好）' },
    'FU': { multiplier: 0.9, points: 45, desc: 'FU（福气，寓意好）' }
  }
  
  for (const [combo, config] of Object.entries(letterNumberCombos)) {
    if (plate.includes(combo) && !factors.find(f => f.includes(config.desc))) {
      multiplier += config.multiplier
      positivePoints += config.points
      factors.push(config.desc)
      break
    }
  }

  // 11. 积极因素加分（降低普通车牌的加分）
  // 检查是否有任何重复数字
  const hasRepeat = /(\d).*\1/.test(plate)
  if (hasRepeat && !factors.find(f => f.includes('连号') || f.includes('重复') || f.includes('双'))) {
    positivePoints += 5 // 降低加分
    factors.push('数字重复（易记）')
  }

  // 检查是否有特殊数字（0-9中任意数字）
  const hasSpecialDigit = /[0689]/.test(plate)
  if (hasSpecialDigit && !factors.find(f => f.includes('8') || f.includes('6') || f.includes('9') || f.includes('吉祥'))) {
    positivePoints += 3 // 降低加分
    factors.push('包含吉祥数字')
  }

  // 检查字母是否好听
  const niceLetters = /[AEFHKLMNPRSTUVWXYZ]/i.test(plate)
  if (niceLetters && !factors.find(f => f.includes('字母') || f.includes('HY') || f.includes('FU'))) {
    positivePoints += 2 // 降低加分
    factors.push('字母组合（个性化）')
  }

  // 计算最终价值（降低普通号估值）
  const calculatedValue = baseValue * multiplier
  const finalValue = Math.round(calculatedValue + positivePoints * 50) // 降低积极因素权重
  let displayValue = finalValue
  
  // 确定等级和星级（更积极的评价体系，取悦用户）
  let level, stars, comment
  
  // 调整阈值，让大部分车牌都能得到较高评价，同时提高罕见车牌估值
  // 同时确定动画等级（1-5级）
  let animationLevel = 0
  
  if (finalValue >= 100000) {
    level = '极品'
    stars = 5
    comment = '🌟 超级罕见车牌，价值百万级，极具收藏价值！'
    animationLevel = 5 // 最高级动画
  } else if (finalValue >= 50000) {
    level = '极品'
    stars = 5
    comment = '🌟 罕见车牌，价值数十万，极具收藏价值！'
    animationLevel = 4 // 第四级动画
  } else if (finalValue >= 30000) {
    level = '优秀'
    stars = 4
    comment = '✨ 非常不错的车牌号，价值很高，很有特色！'
    animationLevel = 3 // 第三级动画
  } else if (finalValue >= 20000) {
    level = '优秀'
    stars = 4
    comment = '✨ 非常不错的车牌号，很有特色！'
    animationLevel = 2 // 第二级动画
  } else if (finalValue >= 10000) {
    level = '良好'
    stars = 3
    comment = '👍 不错的车牌号，组合很好！'
    animationLevel = 1 // 第一级动画
  } else if (finalValue >= 6000) {
    level = '良好'
    stars = 3
    comment = '👍 车牌号不错，有独特之处！'
    animationLevel = 0 // 无动画
  } else if (finalValue >= 4000) {
    level = '中等'
    stars = 2
    comment = '👍 车牌号还可以，有亮点！'
    animationLevel = 0 // 无动画
  } else {
    level = '一般'
    stars = 1
    comment = '👍 车牌号不错，简洁易记！'
    animationLevel = 0 // 无动画
  }

  // 针对极品车牌放大展示价值（用户需求：再扩大10倍）
  if (level === '极品') {
    displayValue = finalValue * 10
    factors.push('极品车牌价值放大展示（十倍加成）')
  }
  
  // 过滤掉地区特色介绍
  factors = factors.filter(factor => !factor.includes('地区特色'))

  // 确保至少有3个积极因素（取悦用户）
  if (factors.length < 3) {
    const defaultPositiveFactors = [
      '简洁明了（好记）',
      '个性独特（与众不同）',
      '易读易记（实用）',
      '组合合理（美观）',
      '数字搭配（协调）'
    ]
    // 随机选择补充因素，确保至少有3个
    while (factors.length < 3) {
      const randomFactor = defaultPositiveFactors[Math.floor(Math.random() * defaultPositiveFactors.length)]
      if (!factors.includes(randomFactor)) {
        factors.push(randomFactor)
      }
    }
  }

  return {
    value: displayValue,
    level: level,
    stars: stars,
    comment: comment,
    factors: factors,
    plate: plate,
    isRare: animationLevel > 0, // 有动画等级就触发
    animationLevel: animationLevel // 动画等级（0-5）
  }
}

/**
 * 格式化车牌号显示（去除空格，连续显示）
 */
export function formatPlateNumber(plateNumber: string): string {
  if (!plateNumber) return ''
  const plate = plateNumber.trim().toUpperCase().replace(/\s/g, '')
  
  // 直接返回去除空格后的车牌号，连续显示
  return plate
}



