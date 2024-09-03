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

const parseLadokStartPeriodIntoYearSemesterNumberArray = period => {
  const semester = period.substring(0, 2)
  const semesterNumber = { VT: 1, HT: 2 }[semester]
  const year = period.substring(2, 6)
  return [year, semesterNumber]
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
  parseLadokStartPeriodIntoYearSemesterNumberArray,
  parseSemesterIntoYearSemesterNumber,
  convertYearSemesterNumberIntoSemester,
  convertToYearSemesterNumberOrGetCurrent,
  SEMESTER_NUMBER,
}
