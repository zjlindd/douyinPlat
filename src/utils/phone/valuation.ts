
import { Grade, type GradeInfo, type TailNumberAnalysis, type NumberPattern } from '../../types/phone'

// 等级信息配置
const GRADE_INFO: Record<Grade, GradeInfo> = {
  [Grade.S]: {
    level: Grade.S,
    name: '至尊',
    color: '#FF6B6B',
    minPrice: 5000,
    maxPrice: 10000
  },
  [Grade.A]: {
    level: Grade.A,
    name: '极品',
    color: '#4ECDC4',
    minPrice: 2000,
    maxPrice: 5000
  },
  [Grade.B]: {
    level: Grade.B,
    name: '优秀',
    color: '#45B7D1',
    minPrice: 500,
    maxPrice: 2000
  },
  [Grade.C]: {
    level: Grade.C,
    name: '普通',
    color: '#96CEB4',
    minPrice: 100,
    maxPrice: 500
  },
  [Grade.D]: {
    level: Grade.D,
    name: '普通',
    color: '#FFEAA7',
    minPrice: 0,
    maxPrice: 100
  }
}

/**
 * 检测数字模式
 */
function detectPattern(tailNumber: string): { pattern: NumberPattern; description: string } {
  const digits = tailNumber.split('').map(Number)
  const [a, b, c, d] = digits

  // AAAA: 四连号 (如 8888)
  if (a === b && b === c && c === d) {
    return { pattern: 'AAAA', description: '四连号' }
  }

  // ABAB: 交替重复 (如 6868)
  if (a === c && b === d && a !== b) {
    return { pattern: 'ABAB', description: '交替重复' }
  }

  // AABB: 对子 (如 6688)
  if (a === b && c === d && a !== c) {
    return { pattern: 'AABB', description: '对子' }
  }

  // ABCD: 顺子 (如 1234, 9876)
  if (digits.length === 4) {
    const isAscending = digits[0]! + 1 === digits[1]! && digits[1]! + 1 === digits[2]! && digits[2]! + 1 === digits[3]!
    const isDescending = digits[0]! - 1 === digits[1]! && digits[1]! - 1 === digits[2]! && digits[2]! - 1 === digits[3]!
    if (isAscending || isDescending) {
      return { pattern: 'ABCD', description: '顺子' }
    }
  }

  // AAAB: 三连号 (如 8881)
  if (a === b && b === c && c !== d) {
    return { pattern: 'AAAB', description: '三连号' }
  }

  // AABC: 前两位重复 (如 8812)
  if (a === b && a !== c && c !== d) {
    return { pattern: 'AABC', description: '前两位重复' }
  }

  // ABAC: 首尾相同 (如 8182)
  if (a === c && a !== b && b !== d) {
    return { pattern: 'ABAC', description: '首尾相同' }
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
  if (count8 > 0) bonus += 0.2 * count8
  if (count6 > 0) bonus += 0.2 * count6
  if (count9 > 0) bonus += 0.2 * count9

  // 包含4的减成
  if (count4 > 0) bonus -= 0.1 * count4

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
    case 'ABAB':
    case 'AABB':
    case 'ABCD':
      return Grade.S
    case 'AAAB':
    case 'AABC':
    case 'ABAC':
      return Grade.A
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
    grade,
    gradeInfo,
    price,
    priceRange: [gradeInfo.minPrice, gradeInfo.maxPrice],
    suggestion: '',
    blessing: ''
  }
}


