const { parseOrSetEmpty } = require('../controllers/courseCtrlHelpers')

// Used for most Ladok objects that have Sv/En props
const getNameInLanguage = (obj, lang = 'sv') => (lang === 'en' ? obj?.en : obj?.sv)

const getNameInLanguageOrSetEmpty = (obj, lang = 'sv') => {
  const v = lang === 'en' ? obj?.en : obj?.sv
  return parseOrSetEmpty(v, lang)
}

module.exports = {
  getNameInLanguage,
  getNameInLanguageOrSetEmpty,
}
