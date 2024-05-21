const {
  convertToYearSemesterNumberOrGetCurrent,
  parseSemesterIntoYearSemesterNumber,
} = require('../../../util/semesterUtils')

const getMonthDateStringForSpring = year => ({
  start: `${year}-01-01T00:00:00`,
  end: `${year}-06-30T23:59:59`,
})

const getMonthDateStringForFall = year => ({
  start: `${year}-07-01T00:00:00`,
  end: `${year + 1}-01-31T23:59:59`,
})

const getStartEndByYearTerm = ({ year, semesterNumber }) => {
  if (semesterNumber === 1) {
    return getMonthDateStringForSpring(year)
  }

  return getMonthDateStringForFall(year)
}

/**
 *
 * @param {Number} semester
 */
const convertSemesterIntoStartEndDates = semester => {
  const yearTerm = convertToYearSemesterNumberOrGetCurrent(semester)

  return getStartEndByYearTerm(yearTerm)
}

const extractTwoDigitYear = year => {
  const [, twoDigitYearString] = year.toString().match(/.{1,2}/g)

  return Number(twoDigitYearString)
}

const seasonString = {
  1: 'VT',
  2: 'HT',
}

const convertSemesterToSeasonString = semester => {
  const { year, semesterNumber } = parseSemesterIntoYearSemesterNumber(semester)

  return `${seasonString[semesterNumber]}${extractTwoDigitYear(year)}`
}

module.exports = {
  convertSemesterIntoStartEndDates,
  convertSemesterToSeasonString,
}
