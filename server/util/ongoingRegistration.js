const { format, isWeekend, nextMonday } = require('date-fns')
const { parseSemesterIntoYearSemesterNumber, findMatchedPeriod, SEMESTER_NUMBER } = require('./semesterUtils')

const EXTENDED_SEMESTER_NUMBER = {
  ...SEMESTER_NUMBER,
  SUMMER: 3,
}

/**
 * Check if registration date occurs on a weekend and adjust to monday in that case
 * @param {*} date
 * @returns
 */
const getDateOrNextMonday = date => {
  if (isWeekend(date)) return nextMonday(date)

  return date
}

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

  return format(registrationDate, 'yyyy-MM-dd')
}

const getYearSemesterNumberForStartDate = (matchedPeriod, startDate) => {
  if (matchedPeriod) return parseSemesterIntoYearSemesterNumber(matchedPeriod.Kod)

  const date = new Date(startDate)

  return { year: date.getFullYear(), semesterNumber: EXTENDED_SEMESTER_NUMBER.SUMMER }
}

const checkIfOngoingRegistration = (startDate, periods) => {
  const matchedPeriod = findMatchedPeriod(startDate, periods)

  const yearSemesterNumberForStartDate = getYearSemesterNumberForStartDate(matchedPeriod, startDate)
  const firstRegistrationDate = computeFirstRegistrationDate(yearSemesterNumberForStartDate)

  const currentDate = new Date()
  const [formattedCurrentDate] = currentDate.toISOString().split('T')

  return formattedCurrentDate >= firstRegistrationDate && formattedCurrentDate < startDate
}

module.exports = { computeFirstRegistrationDate, checkIfOngoingRegistration, EXTENDED_SEMESTER_NUMBER }
