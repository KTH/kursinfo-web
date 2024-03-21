import React from 'react'
import { INFORM_IF_IMPORTANT_INFO_IS_MISSING } from '../util/constants'
import { useLanguage } from './useLanguage'

export const useIsMissingInfo = () => {
  const { currentLanguageIndex } = useLanguage()

  const isMissingInfo = React.useCallback(
    possiblyMissingString => {
      const newLocal = INFORM_IF_IMPORTANT_INFO_IS_MISSING[currentLanguageIndex]
      return possiblyMissingString === newLocal
    },
    [currentLanguageIndex]
  )

  return {
    isMissingInfo,
  }
}
