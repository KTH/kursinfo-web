import React from 'react'
import i18n from '../../../../i18n'
import { useWebContext } from '../context/WebContext'

export const useLanguage = () => {
  const [{ lang }] = useWebContext()

  const translation = React.useMemo(() => {
    return i18n.getLanguageByShortname(lang)
  }, [lang])

  const currentLanguageIsEnglish = React.useMemo(() => {
    return lang === 'en'
  }, [lang])

  const currentLanguageIndex = React.useMemo(() => {
    return currentLanguageIsEnglish ? 0 : 1
  }, [currentLanguageIsEnglish])

  return {
    translation,
    currentLanguageIsEnglish,
    currentLanguageIndex,
    currentLanguageShortname: lang,
  }
}
