import React from 'react'
import { useLanguage } from './useLanguage'
import { useMissingInfo } from './useMissingInfo'

export const useRoundUtils = () => {
  const { translation } = useLanguage()
  const { isMissingInfoLabel } = useMissingInfo()

  const createRoundLabel = React.useMemo(
    () =>
      ({ round_short_name, round_funding_type, round_category }) => {
        let fundingType
        if (round_funding_type === 'PER' || round_funding_type === 'UPP' || round_funding_type === 'SAP') {
          fundingType = translation.courseRoundInformation.round_type[round_funding_type]
        } else {
          fundingType = translation.courseRoundInformation.round_category[round_category]
        }
        return `${!isMissingInfoLabel(round_short_name) ? `${round_short_name}` : ''} ${fundingType}`
      },
    [translation, isMissingInfoLabel]
  )

  const createRoundHeader = React.useMemo(
    () =>
      ({ round_short_name, round_funding_type, round_category, round_course_term }) => {
        const roundLabel = createRoundLabel({ round_short_name, round_funding_type, round_category })

        const [roundYear, roundPeriod] = round_course_term
        const semesterStringOrEmpty = translation.courseInformation.course_short_semester[roundPeriod] ?? ''

        return `${semesterStringOrEmpty}${roundYear} ${roundLabel}`
      },
    [createRoundLabel]
  )

  return {
    createRoundHeader,
    createRoundLabel,
  }
}
