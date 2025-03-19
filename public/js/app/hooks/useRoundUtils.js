import React from 'react'
import { useLanguage } from './useLanguage'
import { useMissingInfo } from './useMissingInfo'

// Matches funding type to round type key that holds the suffix we want to display
const FUNDING_TYPE_TO_ROUND_TYPE_MAPPING = {
  UPP: 'UPP',
  IND: 'ORD',
  EXA: 'ORD',
  SÖ: 'ORD',
  LHS: 'ORD',
  PER: 'PER',
  ORD: 'ORD',
  B: 'ORD',
  FOR: 'ORD',
  GYM: 'ORD',
  EIS: 'ORD',
  SU: 'ORD',
  BDR: 'ORD',
  UFH: 'ORD',
  KPL: 'ORD',
  UPS: 'ORD',
  SAP: 'SAP',
  FOA: 'VU',
  MH: 'VU',
  LL: 'VU',
}

const getRoundType = roundFundingType => FUNDING_TYPE_TO_ROUND_TYPE_MAPPING[roundFundingType]

export const useRoundUtils = () => {
  const { translation } = useLanguage()
  const { isMissingInfoLabel } = useMissingInfo()

  const createRoundLabel = React.useMemo(
    () =>
      ({ round_short_name, round_funding_type }) => {
        const roundTypeKey = getRoundType(round_funding_type)
        const roundTypeSuffix = translation.courseRoundInformation.round_type[roundTypeKey]

        return `${!isMissingInfoLabel(round_short_name) ? `${round_short_name}` : ''} ${roundTypeSuffix}`
      },
    [translation, isMissingInfoLabel]
  )

  const createRoundHeader = React.useMemo(
    () =>
      ({ round_short_name, round_funding_type, round_course_term }) => {
        const roundLabel = createRoundLabel({ round_short_name, round_funding_type })

        const [roundYear, roundPeriod] = round_course_term
        const semesterStringOrEmpty = translation.courseInformation.course_short_semester[roundPeriod] ?? ''

        return `${semesterStringOrEmpty}${roundYear} ${roundLabel}`
      },
    [createRoundLabel, translation.courseInformation.course_short_semester]
  )

  return {
    createRoundHeader,
    createRoundLabel,
  }
}
