/**
 *
 * TODO Benni: Dubbelkolla och fyll på här.
 *
 * In this file following terms are used:
 * - year = 2024
 * - termNumber/semesterNumber = 2
 * - term/semester = 20242
 * - yearTermArray = [2024, 2]
 * - yearTerm = {year: 2024, termNumber: 2}
 */

// TODO Benni: unit tests?
// TODO Benni: choose term or semester and stick with that

/**
 * 1. vi kör på yearTerm som default
 * 2. vi lägger till omformateringsfunktioner som behövs här (gäller i första hand course_valid_to/course_valid_from)
 *
 */

/**
 * Takes a yearTerm and returns a yearTerm representing the term previous to the given term
 *
 * @param {Object} yearTerm
 * @returns
 */
const calcPreviousSemester = ({ year, termNumber }) => {
  if (termNumber === 2) {
    return {
      year,
      termNumber: 1,
    }
  }

  return {
    year: year - 1,
    termNumber: 2,
  }
}

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

const parseYearTermIntoTerm = ({ year, termNumber }) => Number(`${year}${termNumber}`)

const SPRING_MONTHS = [0, 1, 2, 3, 4, 5]

const getTermNumberByMonth = month => {
  if (SPRING_MONTHS.includes(month)) {
    return 1
  }
  return 2
}

const getCurrentYearAndTermNumber = () => {
  const now = new Date()
  const termNumber = getTermNumberByMonth(now.getMonth())

  return {
    year: now.getFullYear(),
    termNumber,
  }
}

const isAFiveDigitNumber = semester => semester.toString().length === 5

const convertToYearTermOrGetCurrent = semester => {
  if (!isAFiveDigitNumber(semester)) {
    return getCurrentYearAndTermNumber()
  }

  return parseTermIntoYearTerm(semester)
}

module.exports = {
  calcPreviousSemester,
  parseTermIntoYearTermArray,
  parseTermIntoYearTerm,
  parseYearTermIntoTerm,
  convertToYearTermOrGetCurrent,
}