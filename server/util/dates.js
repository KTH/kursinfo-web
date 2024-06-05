const { toZonedTime, format } = require('date-fns-tz')
const { sv, en } = require('date-fns/locale')
const { INFORM_IF_IMPORTANT_INFO_IS_MISSING } = require('./constants')

const locales = { sv, en }

const formatToLocaleDate = date => {
  if (date === '') return null
  const timestamp = Date.parse(date)
  const parsedDate = new Date(timestamp)
  const options = { day: 'numeric', month: 'short', year: 'numeric' }
  const languageTag = 'en-GB'

  return parsedDate.toLocaleDateString(languageTag, options)
}

function getDateFormat(date, language) {
  if (date === INFORM_IF_IMPORTANT_INFO_IS_MISSING[language] || language === 'sv') {
    return date
  }
  return formatToLocaleDate(date)
}

function formatVersionDate(language = 'sv', date) {
  const unixTime = Date.parse(date)
  if (unixTime) {
    const timeZone = 'Europe/Berlin'
    const zonedDate = toZonedTime(new Date(unixTime), timeZone)
    return format(zonedDate, 'Ppp', { locale: locales[language] })
  }
  return null
}

module.exports = { formatVersionDate, getDateFormat }
