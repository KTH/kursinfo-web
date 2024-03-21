import React from 'react'
import { useLanguage } from './useLanguage'
import { useIsMissingInfo } from './useIsMissingInfo'

export const useFormatCredits = () => {
  const { currentLanguageIsEnglish } = useLanguage()
  const { isMissingInfo } = useIsMissingInfo()

  const createLocaleCreditString = React.useCallback(
    credits => {
      const creditString = credits.toFixed(1)

      const localeCredits = currentLanguageIsEnglish ? creditString : creditString.replace('.', ',')

      return localeCredits
    },
    [currentLanguageIsEnglish]
  )

  const createLocaleCreditUnit = React.useCallback(
    creditUnitAbbr => {
      return currentLanguageIsEnglish ? 'credits' : creditUnitAbbr
    },
    [currentLanguageIsEnglish]
  )

  const ensureCreditIsNumber = credits => {
    return +credits
  }

  const formatCredits = React.useCallback(
    (credits, creditUnitAbbr) => {
      if (!credits || isMissingInfo(credits) || isNaN(credits)) return ''

      const creditAsNumber = ensureCreditIsNumber(credits)

      const localeCredits = createLocaleCreditString(creditAsNumber)

      const localeCreditUnit = createLocaleCreditUnit(creditUnitAbbr)

      return `${localeCredits} ${localeCreditUnit}`
    },
    [createLocaleCreditString, createLocaleCreditUnit]
  )

  return {
    formatCredits,
  }
}
