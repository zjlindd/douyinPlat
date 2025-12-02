
// 等级枚举
export const Grade = {
  S: 'S',
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D'
} as const

export type Grade = typeof Grade[keyof typeof Grade]

// 等级信息
export interface GradeInfo {
  level: Grade
  name: string
  color: string
  minPrice: number
  maxPrice: number
}

// 尾号分析结果
export interface TailNumberAnalysis {
  tailNumber: string
  pattern: string
  grade: Grade
  gradeInfo: GradeInfo
  price: number
  priceRange: [number, number]
  suggestion: string
  blessing: string
}

// 数字模式类型
export type NumberPattern = 
  | 'AAAA'  // 四连号
  | 'ABAB'  // 交替重复
  | 'AABB'  // 对子
  | 'ABCD'  // 顺子
  | 'AAAB'  // 三连号
  | 'AABC'  // 前两位重复
  | 'ABAC'  // 首尾相同
  | 'NORMAL' // 普通


