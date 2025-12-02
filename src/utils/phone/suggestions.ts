
import { Grade, type TailNumberAnalysis } from '../../types/phone'

/**
 * 生成使用建议
 */
export function generateSuggestion(analysis: TailNumberAnalysis): string {
  const { grade, tailNumber, pattern } = analysis
  const digits = tailNumber.split('')

  const suggestions: string[] = []

  // 根据等级给出建议
  switch (grade) {
    case Grade.S:
      suggestions.push('这是一个非常稀有的尾号，具有很高的收藏价值。')
      suggestions.push('建议长期持有，不要轻易更换。')
      suggestions.push('适合作为主号码使用，彰显身份和品味。')
      break
    case Grade.A:
      suggestions.push('这是一个优质的尾号，具有良好的记忆性和辨识度。')
      suggestions.push('适合商务人士使用，给人留下深刻印象。')
      suggestions.push('建议作为常用号码，便于他人记忆。')
      break
    case Grade.B:
      suggestions.push('这是一个不错的尾号，具有一定的特色。')
      suggestions.push('适合日常使用，既好记又有一定特色。')
      suggestions.push('可以考虑长期使用，避免频繁更换。')
      break
    case Grade.C:
      suggestions.push('这是一个普通的尾号，但使用起来也很方便。')
      suggestions.push('适合日常通讯使用，简单实用。')
      break
    case Grade.D:
      suggestions.push('这是一个普通的尾号，主要功能是通讯。')
      suggestions.push('适合日常使用，无需特别关注。')
      break
  }

  // 根据模式给出特定建议
  if (pattern.includes('四连号')) {
    suggestions.push('四连号非常稀有，建议妥善保管，避免丢失。')
  } else if (pattern.includes('顺子')) {
    suggestions.push('顺子号码易于记忆，适合商务场合使用。')
  } else if (pattern.includes('对子')) {
    suggestions.push('对子号码朗朗上口，便于口头传达。')
  }

  // 根据数字特点给出建议
  const has8 = digits.includes('8')
  const has6 = digits.includes('6')
  const has9 = digits.includes('9')
  const has4 = digits.includes('4')

  if (has8 && has6) {
    suggestions.push('包含8和6，寓意"发顺"，非常适合商务使用。')
  }
  if (has9) {
    suggestions.push('包含9，寓意"长久"，适合长期使用。')
  }
  if (has4) {
    suggestions.push('虽然包含4，但整体组合仍然不错，无需过分在意。')
  }

  return suggestions.join(' ')
}

/**
 * 生成祝福语
 */
export function generateBlessing(analysis: TailNumberAnalysis): string {
  const { tailNumber, grade, pattern } = analysis
  const digits = tailNumber.split('')

  const blessings: string[] = []

  // 根据等级生成祝福
  switch (grade) {
    case Grade.S:
      blessings.push('🎉 恭喜您拥有如此珍贵的尾号！')
      blessings.push('愿这个号码为您带来好运和成功！')
      break
    case Grade.A:
      blessings.push('✨ 您的尾号非常优质！')
      blessings.push('愿它为您带来美好的未来！')
      break
    case Grade.B:
      blessings.push('🌟 您的尾号很不错！')
      blessings.push('愿它伴随您一路顺风！')
      break
    case Grade.C:
    case Grade.D:
      blessings.push('💫 愿这个号码为您带来好运！')
      blessings.push('祝您使用愉快！')
      break
  }

  // 根据数字寓意生成祝福
  const has8 = digits.includes('8')
  const has6 = digits.includes('6')
  const has9 = digits.includes('9')

  if (has8) {
    blessings.push('8代表"发"，祝您财源广进！')
  }
  if (has6) {
    blessings.push('6代表"顺"，祝您事事顺利！')
  }
  if (has9) {
    blessings.push('9代表"久"，祝您长长久久！')
  }
  if (has8 && has6) {
    blessings.push('8和6组合，寓意"发顺"，祝您事业顺利，财源滚滚！')
  }

  // 根据模式生成祝福
  if (pattern.includes('四连号')) {
    blessings.push('四连号寓意"四平八稳"，祝您生活稳定，事业有成！')
  } else if (pattern.includes('顺子')) {
    blessings.push('顺子号码寓意"一帆风顺"，祝您前程似锦！')
  } else if (pattern.includes('对子')) {
    blessings.push('对子号码寓意"成双成对"，祝您好事成双！')
  }

  return blessings.join(' ')
}


