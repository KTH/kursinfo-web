import React from 'react'
import { useLanguage } from './useLanguage'
import { useMissingInfo } from './useMissingInfo'

// Matches fundingType to roundType key that holds the suffix we want to display
const FUNDING_TYPE_TO_ROUND_TYPE_SUFFIX_MAPPING = {
  UPP: 'UPP',
  PER: 'PER',
  SAP: 'SAP',
  ORD: 'ORD',
  IND: 'ORD',
  EXA: 'ORD',
  SÖ: 'ORD',
  LHS: 'ORD',
  B: 'ORD',
  FOR: 'ORD',
  GYM: 'ORD',
  EIS: 'ORD',
  SU: 'ORD',
  BDR: 'ORD',
  UFH: 'ORD',
  KPL: 'ORD',
  UPS: 'ORD',
  FOA: 'VU',
  MH: 'VU',
  LL: 'VU',
}

const getRoundType = roundFundingType => FUNDING_TYPE_TO_ROUND_TYPE_SUFFIX_MAPPING[roundFundingType]

export const useRoundUtils = () => {
  const { translation } = useLanguage()
  const { isMissingInfoLabel } = useMissingInfo()

  const createRoundLabel = React.useMemo(
    () =>
      ({ round_short_name, round_funding_type }) => {
        const roundTypeKey = getRoundType(round_funding_type)
        const roundTypeSuffix = translation.courseRoundInformation.round_type_suffix[roundTypeKey]

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
