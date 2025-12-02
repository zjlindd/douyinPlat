
/**
 * 验证尾号格式（4位数字）
 * @param tailNumber 尾号
 * @returns 是否有效
 */
export function validateTailNumber(tailNumber: string): boolean {
  // 移除所有非数字字符
  const cleaned = tailNumber.replace(/\D/g, '')
  
  // 检查是否为4位数字
  return cleaned.length === 4
}

/**
 * 提取并格式化尾号（确保是4位数字）
 * @param input 输入内容
 * @returns 4位尾号数字
 */
export function extractTailNumber(input: string): string {
  const cleaned = input.replace(/\D/g, '')
  // 如果输入的是完整手机号，取后4位；如果已经是4位，直接返回
  return cleaned.slice(-4)
}


