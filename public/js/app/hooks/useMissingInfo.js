import React from 'react'
import { INFORM_IF_IMPORTANT_INFO_IS_MISSING } from '../util/constants'
import { useLanguage } from './useLanguage'

export const useMissingInfo = () => {
  const { currentLanguageIndex } = useLanguage()

  const isMissingInfoLabel = React.useCallback(
    possiblyMissingString => {
      const newLocal = INFORM_IF_IMPORTANT_INFO_IS_MISSING[currentLanguageIndex]
      return possiblyMissingString === newLocal
    },
    [currentLanguageIndex]
  )

  const missingInfoLabel = React.useMemo(
    () => INFORM_IF_IMPORTANT_INFO_IS_MISSING[currentLanguageIndex],
    [currentLanguageIndex]
  )

  return {
    isMissingInfoLabel,
    missingInfoLabel,
  }
}
