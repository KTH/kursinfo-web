/**
 * semester: 20242 (Number) -> Autumn 2024
 * yearSemesterNubmer: {
 *    year: number
 *    semesterNumber: number
 * }
 *
 */

const SEMESTER_NUMBER = {
  SPRING: 1,
  AUTUMN: 2,
}

/**
 * Takes a yearSemesterNumber and returns a yearSemesterNumber representing the semester previous to the given semester
 *
 * @param {Object} yearSemesterNumber
 * @returns
 */
const calcPreviousSemester = ({ year, semesterNumber }) => {
  if (semesterNumber === 2) {
    return {
      year,
      semesterNumber: 1,
    }
  }

  return {
    year: year - 1,
    semesterNumber: 2,
  }
}

/**
 *
 * @param {number} semester
 * @returns
 */
const parseSemesterIntoYearSemesterNumberArray = semester => {
  const yearSemesterNumberArrayStrings = semester.toString().match(/.{1,4}/g)

  return yearSemesterNumberArrayStrings.map(str => Number(str))
}

const parseSemesterIntoYearSemesterNumber = semester => {
  const [year, semesterNumber] = parseSemesterIntoYearSemesterNumberArray(semester)

  return {
    year,
    semesterNumber,
  }
}

const convertYearSemesterNumberIntoSemester = ({ year, semesterNumber }) => Number(`${year}${semesterNumber}`)

const SPRING_MONTHS = [0, 1, 2, 3, 4, 5]

const getSemesterNumberByMonth = month => {
  if (SPRING_MONTHS.includes(month)) {
    return 1
  }
  return 2
}

const getCurrentYearAndSemesterNumber = () => {
  const now = new Date()
  const semesterNumber = getSemesterNumberByMonth(now.getMonth())

  return {
    year: now.getFullYear(),
    semesterNumber,
  }
}

const getSemester = (dateStr, language) => {
  const [yearStr, monthStr] = dateStr.split('-')
  const year = parseInt(yearStr, 10)
  const month = parseInt(monthStr, 10)

  if (month >= 1 && month <= 7) {
    return `${language === 'sv' ? 'VT' : 'Spring'} ${year}`
  } else if (month >= 8 && month <= 12) {
    return `${language === 'sv' ? 'HT' : 'Autumn'} ${year}`
  }

  throw new Error('Invalid date format or value')
}

// I want global isNaN
// eslint-disable-next-line no-restricted-globals
const isFiveDigitNumber = semester => semester.toString().length === 5 && !isNaN(semester)

const convertToYearSemesterNumberOrGetCurrent = semester => {
  if (!isFiveDigitNumber(semester)) {
    return getCurrentYearAndSemesterNumber()
  }

  return parseSemesterIntoYearSemesterNumber(semester)
}

module.exports = {
  calcPreviousSemester,
  parseSemesterIntoYearSemesterNumberArray,
  parseSemesterIntoYearSemesterNumber,
  convertYearSemesterNumberIntoSemester,
  convertToYearSemesterNumberOrGetCurrent,
  getCurrentYearAndSemesterNumber,
  getSemester,
  SEMESTER_NUMBER,
}
