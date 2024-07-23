import React from 'react'
import { useLanguage } from './useLanguage'
import { useMissingInfo } from './useMissingInfo'

export const useFormatCredits = () => {
  const { isEnglish } = useLanguage()
  const { isMissingInfoLabel } = useMissingInfo()

  const createLocaleCreditString = React.useCallback(
    credits => {
      const creditString = credits.toFixed(1)

      const localeCredits = isEnglish ? creditString : creditString.replace('.', ',')

      return localeCredits
    },
    [isEnglish]
  )

  const createLocaleCreditUnit = React.useCallback(
    (creditUnitAbbr, preparatory) => (isEnglish && !preparatory ? 'credits' : creditUnitAbbr),
    [isEnglish]
  )

  const ensureCreditIsNumber = credits => +credits

  const formatCredits = React.useCallback(
    (credits, creditUnitAbbr, preparatory) => {
      // I want to use global isNaN as it works differently
      // eslint-disable-next-line no-restricted-globals
      if (!credits || isMissingInfoLabel(credits) || isNaN(credits)) return ''

      const creditAsNumber = ensureCreditIsNumber(credits)

      const localeCredits = createLocaleCreditString(creditAsNumber)
      const localeCreditUnit = createLocaleCreditUnit(creditUnitAbbr, preparatory)

      return `${localeCredits} ${localeCreditUnit}`
    },
    [createLocaleCreditString, createLocaleCreditUnit]
  )

  return {
    formatCredits,
  }
}
