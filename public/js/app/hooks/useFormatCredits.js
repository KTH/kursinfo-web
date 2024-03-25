import React from 'react'
import { useLanguage } from './useLanguage'
import { useMissingInfo } from './useMissingInfo'

export const useFormatCredits = () => {
  const { isLanguageEnglish } = useLanguage()
  const { isMissingInfoLabel } = useMissingInfo()

  const createLocaleCreditString = React.useCallback(
    credits => {
      const creditString = credits.toFixed(1)

      const localeCredits = isLanguageEnglish ? creditString : creditString.replace('.', ',')

      return localeCredits
    },
    [isLanguageEnglish]
  )

  const createLocaleCreditUnit = React.useCallback(
    creditUnitAbbr => (isLanguageEnglish ? 'credits' : creditUnitAbbr),
    [isLanguageEnglish]
  )

  const ensureCreditIsNumber = credits => +credits

  const formatCredits = React.useCallback(
    (credits, creditUnitAbbr) => {
      // I want to use global isNaN as it works differently
      // eslint-disable-next-line no-restricted-globals
      if (!credits || isMissingInfoLabel(credits) || isNaN(credits)) return ''

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
