
import type { TailNumberAnalysis } from '../../types/phone'
import { SUGGESTIONS_POOL, BLESSINGS_POOL } from './suggestion_data'

/**
 * 根据尾号获取池中的文案
 */
function getFromPool(pool: string[], tailNumber: string): string {
  // 使用尾号作为种子，确保同一个号码获取到的文案是固定的
  const index = parseInt(tailNumber, 10) % pool.length
  return pool[index] || pool[0]
}

/**
 * 生成使用建议（唯美风格）
 */
export function generateSuggestion(analysis: TailNumberAnalysis): string {
  const { pattern, patternType, tailNumber } = analysis

  // 优先基于特殊模式的建议
  if (patternType === '1314') {
    return '一生一世，誓言永恒。此号寓意深情隽永，适合作为情侣主号，见证长情告白。'
  }
  if (patternType === 'LOVE') {
    return '爱意满满，浪漫天成。此号蕴含甜蜜气息，愿您的生活充满温情与感动。'
  }
  if (patternType === '1688') {
    return '一路发发，财运亨通。此号吉祥如意，适合经商或创业使用，助您事业腾飞。'
  }
  if (patternType === 'YEAR') {
    return '岁月如歌，铭记此刻。此号如时光胶囊，珍藏专属记忆，适合作为纪念号使用。'
  }
  if (patternType === 'BAAA' || patternType === 'AAAB') {
    return '三阳开泰，气势非凡。此号重复律动，易记且朗朗上口，彰显独特个性。'
  }
  if (patternType === 'ABBA') {
    return '镜像之美，回环往复。此号结构精巧，给人以对称和谐之感，品味独到。'
  }
  if (pattern.includes('四连号')) {
    return '四星连珠，世所罕见。此号珍稀如钻，值得作为传家之宝长久珍藏。'
  }
  if (pattern.includes('顺子')) {
    return '步步高升，顺风顺水。此号音韵流畅，寓意事业生活节节向上。'
  }
  if (pattern.includes('AABB') || pattern.includes('ABAB')) {
    return '成双成对，和谐对称。此号朗朗上口，给人以平衡稳重之感。'
  }

  // 使用100句唯美判词池
  return getFromPool(SUGGESTIONS_POOL, tailNumber)
}

/**
 * 生成祝福语（唯美风格）
 */
export function generateBlessing(analysis: TailNumberAnalysis): string {
  const { tailNumber } = analysis

  // 优先基于特殊模式的唯美祝福
  if (analysis.patternType === '1314' || analysis.patternType === 'LOVE') {
    return '愿得一人心，白首不相离。愿这份爱意如星河长明，温暖岁岁年年。'
  }
  if (analysis.patternType === '1688') {
    return '愿财源广进达三江，生意兴隆通四海，每一步都走在繁花似锦的路上。'
  }
  if (analysis.patternType === 'YEAR') {
    return '愿时光温柔以待，每一刻都值得被铭记，岁岁平安，年年有余。'
  }

  // 使用100句唯美吉言池
  return getFromPool(BLESSINGS_POOL, tailNumber)
}


