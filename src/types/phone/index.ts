
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
  patternType: NumberPattern
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
  | 'ABBA'  // 镜像
  | 'ABCD'  // 顺子
  | 'DCBA'  // 倒顺子
  | 'AAAB'  // 三连号
  | 'BAAA'  // 尾三连
  | 'AABA'  // 夹心三连
  | 'ABAA'  // 夹心三连
  | 'AABC'  // 前两位重复
  | 'ABBC'  // 中对子
  | 'ABCC'  // 后对子
  | 'ABAC'  // 首尾相同
  | '1314'  // 一生一世
  | 'LOVE'  // 爱情号
  | '1688'  // 一路发发
  | 'YEAR'  // 年份号
  | 'NORMAL' // 普通


