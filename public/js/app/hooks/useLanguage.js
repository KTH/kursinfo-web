import React from 'react'
import i18n from '../../../../i18n'
import { useWebContext } from '../context/WebContext'

export const useLanguage = () => {
  const [{ lang }] = useWebContext()

  const translation = React.useMemo(() => i18n.getLanguageByShortname(lang), [lang])

  const isLanguageEnglish = React.useMemo(() => lang === 'en', [lang])

  const languageIndex = React.useMemo(() => (isLanguageEnglish ? 0 : 1), [isLanguageEnglish])

  return {
    translation,
    isLanguageEnglish,
    languageIndex,
    languageShortname: lang,
  }
}
