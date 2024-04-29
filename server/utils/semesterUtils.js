/**
 *
 * @param {number} term
 * @returns
 */
const parseTermIntoYearTermArray = term => {
  const yearTermArrayStrings = term.toString().match(/.{1,4}/g)

  return yearTermArrayStrings.map(str => Number(str))
}

const parseTermIntoYearTerm = term => {
  const [year, termNumber] = parseTermIntoYearTermArray(term)

  return {
    year,
    termNumber,
  }
}

const SPRING_MONTHS = [0, 1, 2, 3, 4, 5]

const getTermNumberByMonth = month => {
  if (SPRING_MONTHS.includes(month)) {
    return 1
  }
  return 2
}

const isAFiveDigitNumber = semester => semester.toString().length === 5

const getCurrentYearAndTermNumber = () => {
  const now = new Date()
  const termNumber = getTermNumberByMonth(now.getMonth())

  return {
    year: now.getFullYear(),
    termNumber,
  }
}

const getMonthDateStringForSpring = year => ({
  start: `${year}-01-01T00:00:00`,
  end: `${year}-06-30T23:59:59`,
})

const getMonthDateStringForFall = year => ({
  start: `${year}-07-01T00:00:00`,
  end: `${year + 1}-01-31T23:59:59`,
})

const getStartEndByYearTerm = ({ year, termNumber }) => {
  if (termNumber === 1) {
    return getMonthDateStringForSpring(year)
  }

  return getMonthDateStringForFall(year)
}

const convertToYearTermOrGetCurrent = semester => {
  if (!isAFiveDigitNumber(semester)) {
    return getCurrentYearAndTermNumber()
  }

  return parseTermIntoYearTerm(semester)
}

/**
 *
 * @param {Number} semester
 */
const convertSemesterIntoStartEndDates = semester => {
  const yearTerm = convertToYearTermOrGetCurrent(semester)

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
  const { year, termNumber } = parseTermIntoYearTerm(semester)

  return `${seasonString[termNumber]}${extractTwoDigitYear(year)}`
}

module.exports = {
  convertSemesterIntoStartEndDates,
  convertSemesterToSeasonString,
}
