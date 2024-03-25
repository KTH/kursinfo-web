import React from 'react'
import { INFORM_IF_IMPORTANT_INFO_IS_MISSING } from '../util/constants'
import { useLanguage } from './useLanguage'

export const useMissingInfo = () => {
  const { languageIndex } = useLanguage()

  const isMissingInfoLabel = React.useCallback(
    possiblyMissingString => possiblyMissingString === INFORM_IF_IMPORTANT_INFO_IS_MISSING[languageIndex],
    [languageIndex]
  )

  const missingInfoLabel = React.useMemo(() => INFORM_IF_IMPORTANT_INFO_IS_MISSING[languageIndex], [languageIndex])

  return {
    isMissingInfoLabel,
    missingInfoLabel,
  }
}
