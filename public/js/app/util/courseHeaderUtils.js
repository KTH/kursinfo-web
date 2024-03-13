import i18n from '../../../../i18n'
import { INFORM_IF_IMPORTANT_INFO_IS_MISSING } from '../util/constants'

const LABEL_MISSING_INFO = { en: INFORM_IF_IMPORTANT_INFO_IS_MISSING[0], sv: INFORM_IF_IMPORTANT_INFO_IS_MISSING[1] }

export const createRoundLabel = (language, { round_short_name, round_funding_type, round_category }) => {
  const translation = i18n.messages[language === 'en' ? 0 : 1]

  let fundingType
  if (round_funding_type === 'PER' || round_funding_type === 'UPP' || round_funding_type === 'SAP') {
    fundingType = translation.courseRoundInformation.round_type[round_funding_type]
  } else {
    fundingType = translation.courseRoundInformation.round_category[round_category]
  }
  return ` ${round_short_name !== LABEL_MISSING_INFO[language] ? `${round_short_name}` : ''} ${fundingType}`
}

export const createRoundHeader = (
  language,
  { round_short_name, round_funding_type, round_category, round_course_term },
  courseInfo
  //   courseRoundInfo
) => {
  const roundLabel = createRoundLabel(language, { round_short_name, round_funding_type, round_category })

  return `${courseInfo?.course_short_semester[round_course_term[1]] ?? ''} ${round_course_term[0]}` + roundLabel
}
