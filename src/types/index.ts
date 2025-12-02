
// 省份信息类型
export interface Province {
  code: string
  name: string
  fullName: string
}

// 车牌解析结果类型
export interface PlateParseResult {
  isValid: boolean
  province: Province | null
  city: string | null
  plate: string
  provinceCode?: string
}

// 估值结果类型
export interface ValuationResult {
  value: number
  level: string
  stars: number
  comment: string
  factors: string[]
  plate: string
  isRare?: boolean
  animationLevel?: number
}


