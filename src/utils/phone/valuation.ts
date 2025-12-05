
import { Grade, type GradeInfo, type TailNumberAnalysis, type NumberPattern } from '../../types/phone'

// 等级信息配置
const GRADE_INFO: Record<Grade, GradeInfo> = {
  [Grade.S]: {
    level: Grade.S,
    name: '至尊',
    color: '#FF6B6B',
    minPrice: 8000,
    maxPrice: 16000
  },
  [Grade.A]: {
    level: Grade.A,
    name: '极品',
    color: '#4ECDC4',
    minPrice: 3500,
    maxPrice: 8000
  },
  [Grade.B]: {
    level: Grade.B,
    name: '优秀',
    color: '#45B7D1',
    minPrice: 800,
    maxPrice: 3500
  },
  [Grade.C]: {
    level: Grade.C,
    name: '普通',
    color: '#96CEB4',
    minPrice: 150,
    maxPrice: 800
  },
  [Grade.D]: {
    level: Grade.D,
    name: '普通',
    color: '#FFEAA7',
    minPrice: 0,
    maxPrice: 150
  }
}

/**
 * 检测数字模式
 */
function detectPattern(tailNumber: string): { pattern: NumberPattern; description: string } {
  const digits = tailNumber.split('').map(Number)
  const [a, b, c, d] = digits

  // 1. 特殊寓意号码 (优先匹配)
  if (tailNumber === '1314') return { pattern: '1314', description: '一生一世' }
  if (tailNumber === '1688') return { pattern: '1688', description: '一路发发' }
  if (tailNumber === '5200' || tailNumber === '5201' || tailNumber.startsWith('520')) return { pattern: 'LOVE', description: '爱情号' }
  
  // 2. 结构模式
  // AAAA: 四连号 (如 8888)
  if (a === b && b === c && c === d) {
    return { pattern: 'AAAA', description: '四连号' }
  }

  // ABCD / DCBA
  const isAscending = digits[0]! + 1 === digits[1]! && digits[1]! + 1 === digits[2]! && digits[2]! + 1 === digits[3]!
  const isDescending = digits[0]! - 1 === digits[1]! && digits[1]! - 1 === digits[2]! && digits[2]! - 1 === digits[3]!
  
  if (isAscending) return { pattern: 'ABCD', description: '步步高升' }
  if (isDescending) return { pattern: 'DCBA', description: '倒顺子' }

  // AABB: 对子 (如 6688)
  if (a === b && c === d && a !== c) {
    return { pattern: 'AABB', description: '双双对对' }
  }

  // ABAB: 交替重复 (如 6868)
  if (a === c && b === d && a !== b) {
    return { pattern: 'ABAB', description: '交替号' }
  }

  // ABBA: 镜像 (如 1221)
  if (a === d && b === c && a !== b) {
    return { pattern: 'ABBA', description: '镜像号' }
  }

  // BAAA: 尾三连 (如 1888) - 价值很高
  if (a !== b && b === c && c === d) {
    return { pattern: 'BAAA', description: '尾三连' }
  }

  // AAAB: 头三连 (如 8881)
  if (a === b && b === c && c !== d) {
    return { pattern: 'AAAB', description: '头三连' }
  }

  // AABA: 夹心 (如 8818)
  if (a === b && b === d && a !== c) {
    return { pattern: 'AABA', description: '夹心号' }
  }

  // ABAA: 夹心 (如 8188)
  if (a === c && c === d && a !== b) {
    return { pattern: 'ABAA', description: '夹心号' }
  }

  // AABC: 前对子
  if (a === b && b !== c && c !== d && a !== c) {
    return { pattern: 'AABC', description: '前对子' }
  }

  // ABBC: 中对子
  if (a !== b && b === c && c !== d && b !== d && a !== c) {
    return { pattern: 'ABBC', description: '中对子' }
  }

  // ABCC: 后对子
  if (a !== b && b !== c && c === d && a !== c && b !== d) {
    return { pattern: 'ABCC', description: '后对子' }
  }

  // 年份号 (19xx, 20xx)
  if ((a === 1 && b === 9) || (a === 2 && b === 0)) {
    return { pattern: 'YEAR', description: '年份号' }
  }

  return { pattern: 'NORMAL', description: '普通' }
}

/**
 * 计算特殊数字加成
 */
function calculateSpecialBonus(tailNumber: string): number {
  let bonus = 1.0
  const digits = tailNumber.split('')

  // 统计特殊数字
  const count8 = digits.filter(d => d === '8').length
  const count6 = digits.filter(d => d === '6').length
  const count9 = digits.filter(d => d === '9').length
  const count4 = digits.filter(d => d === '4').length

  // 包含8、6、9的加成
  if (count8 > 0) bonus += 0.25 * count8
  if (count6 > 0) bonus += 0.2 * count6
  if (count9 > 0) bonus += 0.2 * count9

  // 包含4的减成
  if (count4 > 0) bonus -= 0.15 * count4

  // 全偶数加成
  const allEven = digits.every(d => Number(d) % 2 === 0)
  if (allEven && digits.length === 4) bonus += 0.15

  // 全奇数加成
  const allOdd = digits.every(d => Number(d) % 2 === 1)
  if (allOdd && digits.length === 4) bonus += 0.1

  return Math.max(0.5, bonus) // 最低不低于0.5倍
}

/**
 * 根据模式确定等级
 */
function getGradeByPattern(pattern: NumberPattern): Grade {
  switch (pattern) {
    case 'AAAA':
    case '1314':
    case '1688':
    case 'LOVE':
    case 'ABCD':
      return Grade.S
    case 'ABAB':
    case 'AABB':
    case 'BAAA': // 尾三连价值很高，如1888
    case 'ABBA':
    case 'DCBA':
      return Grade.A
    case 'AAAB':
    case 'AABA':
    case 'ABAA':
      return Grade.B
    case 'AABC':
    case 'ABBC':
    case 'ABCC':
    case 'YEAR':
    case 'ABAC':
      return Grade.C
    case 'NORMAL':
      // 普通模式需要进一步判断
      return Grade.C
    default:
      return Grade.D
  }
}

/**
 * 分析手机尾号并计算估值
 */
export function analyzeTailNumber(tailNumber: string): TailNumberAnalysis {
  const { pattern, description } = detectPattern(tailNumber)
  let grade = getGradeByPattern(pattern)

  // 对于普通模式，根据特殊数字进一步判断
  if (pattern === 'NORMAL') {
    const bonus = calculateSpecialBonus(tailNumber)
    if (bonus >= 1.3) {
      grade = Grade.B
    } else if (bonus >= 1.1) {
      grade = Grade.C
    } else {
      grade = Grade.D
    }
  }

  const gradeInfo = GRADE_INFO[grade]
  const basePrice = (gradeInfo.minPrice + gradeInfo.maxPrice) / 2
  const bonus = calculateSpecialBonus(tailNumber)
  const finalPrice = Math.round(basePrice * bonus)

  // 确保价格在范围内
  const price = Math.max(
    gradeInfo.minPrice,
    Math.min(gradeInfo.maxPrice, finalPrice)
  )

  return {
    tailNumber,
    pattern: description,
    patternType: pattern,
    grade,
    gradeInfo,
    price,
    priceRange: [gradeInfo.minPrice, gradeInfo.maxPrice],
    suggestion: '',
    blessing: ''
  }
}


