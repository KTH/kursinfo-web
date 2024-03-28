// Be aware that this entire file, or most of it, is replicated in multiple apps, so changes here should probably be synced to the other apps.
// See https://confluence.sys.kth.se/confluence/x/6wYJDQ for more information.
import React from 'react'
import i18n from '../../../../i18n'
import { useWebContext } from '../context/WebContext'

export const useLanguage = () => {
  const [{ lang }] = useWebContext()

  const translation = React.useMemo(() => i18n.getLanguageByShortname(lang), [lang])

  const isEnglish = React.useMemo(() => lang === 'en', [lang])

  const languageIndex = React.useMemo(() => (isEnglish ? 0 : 1), [isEnglish])

  return {
    translation,
    isEnglish,
    languageIndex,
    languageShortname: lang,
  }
}
