const { format, isWeekend, nextMonday } = require('date-fns')
const { parseSemesterIntoYearSemesterNumber, findMatchedPeriod, SEMESTER_NUMBER } = require('./semesterUtils')
const { isArrayWithValues } = require('./typeChecking')

const EXTENDED_SEMESTER_NUMBER = {
  ...SEMESTER_NUMBER,
  SUMMER: 3,
}

/**
 * Check if registration date occurs on a weekend and adjust to monday in that case
 * @param {Date} date
 * @returns {Date}
 */
const getDateOrNextMonday = date => {
  if (isWeekend(date)) return nextMonday(date)

  return date
}

const formatToYYYYMMDD = registrationDate => format(registrationDate, 'yyyy-MM-dd')

const computeFirstRegistrationDate = yearSemesterNumber => {
  const registrationDates = {
    [SEMESTER_NUMBER.SPRING]: '09-15',
    [SEMESTER_NUMBER.AUTUMN]: '03-15',
    [EXTENDED_SEMESTER_NUMBER.SUMMER]: '02-15',
  }

  const year =
    yearSemesterNumber.semesterNumber === SEMESTER_NUMBER.SPRING ? yearSemesterNumber.year - 1 : yearSemesterNumber.year

  const registrationDateString = `${year}-${registrationDates[yearSemesterNumber.semesterNumber]}`

  const registrationDate = getDateOrNextMonday(new Date(registrationDateString))

  return formatToYYYYMMDD(registrationDate)
}

const getYearSemesterNumberForStartDate = (matchedPeriod, startDate) => {
  if (matchedPeriod) return parseSemesterIntoYearSemesterNumber(matchedPeriod.Kod)

  return { year: startDate.getFullYear(), semesterNumber: EXTENDED_SEMESTER_NUMBER.SUMMER }
}

/**
 * Returns true if *todays date* is within the registration period for a
 * course instance starting on {startDateStringRaw}
 *
 * @param {String} startDateStringRaw string that can be parsed to a date
 * @param {PeriodItem[]} periods
 * @returns {boolean} True if today's date is within the registration period for the course instance, false otherwise.
 */
const checkIfOngoingRegistration = (startDateStringRaw, periods) => {
  if (!isArrayWithValues(periods)) return false

  const startDate = new Date(startDateStringRaw)
  if (Number.isNaN(startDate.getTime())) return false

  const startDateString = formatToYYYYMMDD(startDate)

  const matchedPeriod = findMatchedPeriod(startDateString, periods)

  const yearSemesterNumberForStartDate = getYearSemesterNumberForStartDate(matchedPeriod, startDate)

  const firstRegistrationDate = computeFirstRegistrationDate(yearSemesterNumberForStartDate)

  const formattedCurrentDate = formatToYYYYMMDD(new Date())

  return formattedCurrentDate >= firstRegistrationDate && formattedCurrentDate < startDateString
}

module.exports = { computeFirstRegistrationDate, checkIfOngoingRegistration, EXTENDED_SEMESTER_NUMBER }
