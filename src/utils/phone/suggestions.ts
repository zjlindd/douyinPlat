
import { Grade, type TailNumberAnalysis } from '../../types/phone'

/**
 * 生成使用建议（唯美风格）
 */
export function generateSuggestion(analysis: TailNumberAnalysis): string {
  const { grade, pattern, patternType } = analysis

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

  // 基于等级的唯美建议
  switch (grade) {
    case Grade.S:
      return '稀世之珍，如星辰璀璨。建议作为主号长久使用，尽显非凡气度。'
    case Grade.A:
      return '百里挑一，优选佳号。易记且悦耳，助您在社交场合从容自信。'
    case Grade.B:
      return '独具匠心，特色良号。既便于记忆又富有韵味，适合日常长久相伴。'
    case Grade.C:
    case Grade.D:
    default:
      return '简约归真，质朴之选。通讯联络的忠实伙伴，平平淡淡才是真。'
  }
}

/**
 * 生成祝福语（唯美风格）
 */
export function generateBlessing(analysis: TailNumberAnalysis): string {
  const { tailNumber, grade } = analysis
  const digits = tailNumber.split('')

  const has8 = digits.includes('8')
  const has6 = digits.includes('6')
  const has9 = digits.includes('9')

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

  // 优先基于数字寓意的唯美祝福
  if (has8 && has6) {
    return '愿顺遂与繁荣常伴左右，生活如诗般美好，事业如虹般绚烂。'
  }
  if (has8) {
    return '数字流转间藏着无限生机，愿财源如泉涌，富贵且安康。'
  }
  if (has6) {
    return '愿您的人生路途一帆风顺，所遇皆良人，所行皆坦途。'
  }
  if (has9) {
    return '长长久久，岁岁年年。愿这份美好与幸运，经得起时光的打磨。'
  }

  // 基于等级的通用唯美祝福
  switch (grade) {
    case Grade.S:
      return '愿此号如鸿运当头，助您鹏程万里，心想事成，万事胜意。'
    case Grade.A:
      return '愿这份幸运化作生活的点点星光，照亮前行的路，温暖归途。'
    case Grade.B:
      return '愿每一次拨通，都传递着温暖与喜悦，连接起世间的美好。'
    default:
      return '愿生活明朗，万物可爱，每一次通话都带来好消息。'
  }
}


