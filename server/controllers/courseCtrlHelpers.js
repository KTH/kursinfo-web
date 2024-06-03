const { isBefore } = require('date-fns')
const { INFORM_IF_IMPORTANT_INFO_IS_MISSING } = require('../util/constants')
const { convertYearSemesterNumberIntoSemester, SEMESTER_NUMBER } = require('../util/semesterUtils')

const DATE_OF_MONTH_ON_WHICH_TO_SWITCH_TO_NEXT_SEMESTER = 20
const SPRING_BREAK_MONTH = 4
const AUTUMN_BREAK_MONTH = 10

const createSpringBreakDateForYear = year =>
  new Date(`${year}-${SPRING_BREAK_MONTH}-${DATE_OF_MONTH_ON_WHICH_TO_SWITCH_TO_NEXT_SEMESTER}`)
const createAutumnBreakDateForYear = year =>
  new Date(`${year}-${AUTUMN_BREAK_MONTH}-${DATE_OF_MONTH_ON_WHICH_TO_SWITCH_TO_NEXT_SEMESTER}`)

/**
 * Generates a semester-string based on the current year and month.
 * E.g. if its May 2024, the semester string would be `20242`
 *
 */
function generateSelectedSemesterBasedOnDate(date) {
  const year = date.getFullYear()

  const springBreakDate = createSpringBreakDateForYear(year)
  const autumnBreakDate = createAutumnBreakDateForYear(year)

  if (isBefore(date, springBreakDate)) return `${year}${SEMESTER_NUMBER.SPRING}`

  if (isBefore(date, autumnBreakDate)) return `${year}${SEMESTER_NUMBER.AUTUMN}`

  return `${year + 1}${SEMESTER_NUMBER.SPRING}`
}

const semesterExistsInArray = (needle, haystack) => haystack.some(({ semester }) => semester === needle)

const calculateInitiallySelectedSemester = (activeSemesters, startSemesterFromQuery) => {
  if (!activeSemesters || activeSemesters.length === 0) {
    return null
  }

  if (semesterExistsInArray(startSemesterFromQuery, activeSemesters)) {
    return Number(startSemesterFromQuery)
  }

  const semesterBasedOnDate = generateSelectedSemesterBasedOnDate(new Date())

  if (semesterExistsInArray(semesterBasedOnDate, activeSemesters)) {
    return Number(semesterBasedOnDate)
  }

  return convertYearSemesterNumberIntoSemester(activeSemesters.at(-1))
}

const parseOrSetEmpty = (value, language, setEmpty = false) => {
  const emptyText = setEmpty ? '' : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language]
  return value ? value : emptyText
}

const VALID_COURSE_CODE_LENGTHS = [6, 7]

/**
 *
 *
 * @param {string} courseCode
 * @returns true if the given courseCode has a length of 6 or 7 characters
 */
const isValidCourseCode = courseCode => !!courseCode && VALID_COURSE_CODE_LENGTHS.includes(courseCode.toString().length)

module.exports = {
  calculateInitiallySelectedSemester,
  generateSelectedSemesterBasedOnDate,
  parseOrSetEmpty,
  isValidCourseCode,
}
