const { utcToZonedTime, format } = require('date-fns-tz')
const { sv, en } = require('date-fns/locale')
const { INFORM_IF_IMPORTANT_INFO_IS_MISSING } = require('./constants')

const locales = { sv, en }

function getDateFormat(date, language) {
  if (date === INFORM_IF_IMPORTANT_INFO_IS_MISSING[language] || language === 'sv') {
    return date
  }
  const splitDate = date.split('-')
  return `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`
}

function formatVersionDate(language = 'sv', date) {
  const unixTime = Date.parse(date)
  if (unixTime) {
    const timeZone = 'Europe/Berlin'
    const zonedDate = utcToZonedTime(new Date(unixTime), timeZone)
    return format(zonedDate, 'Ppp', { locale: locales[language] })
  }
  return null
}

module.exports = { formatVersionDate, getDateFormat }
