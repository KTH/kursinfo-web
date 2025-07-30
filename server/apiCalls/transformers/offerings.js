const { isCorrectSchool, SCHOOL_MAP } = require('./schools')

/**
 * Creates string of programs in list.
 * @param {[]} programs   Programs as returned by courseOfferings[].delAvProgram.
 * @returns {string}      String with program data, separated by comma
 */
function _getProgramList(programs) {
  const programsList =
    (programs &&
      programs.map(
        ({ kod: code, arskurs: studyYear, inriktning: specCode }) =>
          `${code}${specCode ? '-' + specCode : ''}-${studyYear}`
      )) ||
    []
  const programsString = programsList.join(', ')
  // log.debug('_getProgramList returns', programsString)
  return programsString
}

/**
 * Creates object of offering to save essential informations.
 * @param {string} firstSemester   semester when course offering is started (We use startPeriod from ladok)
 * @param {number} startDate       date when course offering is started
 * @param {{}} courseOffering   Each courseOffering as returned by 'SokUtbildningsTillfalleSlimItem' in 'courses'.
 * @param {string} courseOffering.kod - The course code
 * @param {string} courseOffering.organisation.name - The ddepartment name
 * @returns {{}}        Object with course offering data
 */
function _formOffering(firstSemester, startDate, endDate, course) {
  return {
    endDate,
    firstSemester,
    startDate,
    schoolMainCode: SCHOOL_MAP[course.schoolCode] || 'Others',
    departmentName: course?.organisation?.name,
    connectedPrograms: _getProgramList(course.delAvProgram),
    courseCode: course.kod,
  }
}
/**
 * Finds unique semesters in object with parsed offerings.
 * @param {[]} parsedOfferings Array containing offerings’ relevant data.
 * @returns {[]}               Array with found unique semesters
 */
const semestersInParsedOfferings = parsedOfferings => {
  const foundSemesters = []
  parsedOfferings.forEach(({ firstSemester }) => {
    if (firstSemester && !foundSemesters.includes(firstSemester)) {
      foundSemesters.push(firstSemester)
    }
  })
  return foundSemesters
}

function _sortOfferedSemesters(offeredSemesters) {
  return offeredSemesters.sort((a, b) => new Date(a.end_date) - new Date(b.end_date))
}

/**
 * Parses courses offerings from ladok and returns an object with one list for course memos which are created before course starts:
 * - List containing offerings that starts with semester parameter. This is used for course memos.
 * @param {Object[]} courseOfferings      CourseOfferings as returned by 'SokUtbildningsTillfalleSlimItem'.
 * @param {string} courseOfferings[].first_yearsemester - The start semester of a course
 * @param {Object[]} courseOfferings[].offered_semesters - The list of offered semesters of a course
 * @param {string} courseOfferings[].offered_semesters[].end_date - The end date of a course offering
 * @param {string} courseOfferings[].offered_semesters[].semester - The current semester of a course offering
 * @param {string} courseOfferings[].offered_semesters[].start_date - The start date of a course offering
 * @param {Object[]} chosenSemesters    Semesters strings for which data is fetched
 * @param {string} chosenSemesters[]    Semester string chosen by user, 5 digits in string format
 * @param {Object[]} chosenPeriods    Periods strings for which data is fetched, 0-5
 * @param {string} chosenPeriods[]    Period string chosen by user, 1 digit in string format, 0-5
 * @param {string} chosenSchool    School name, or if all schools are chosen then 'allSchools
 * @returns {[]}           Array, containing offerings’ relevant data
 */
function filterOfferingsForMemos(courseOfferings = [], chosenSemesters = [], chosenPeriods = [], chosenSchool = '') {
  const parsedOfferings = []
  if (Array.isArray(courseOfferings)) {
    courseOfferings.forEach(course => {
      // eslint-disable-next-line camelcase
      const { schoolCode, tillfalleskod: courseRoundApplicationCode } = course

      const firstSemester = course?.startperiod?.inDigits
      const startDate = course?.forstaUndervisningsdatum?.date
      const endDate = course?.sistaUndervisningsdatum?.date
      const firstPeriodNumber = course?.forstaUndervisningsdatum?.period
      const firstPerioLabel = firstPeriodNumber ? `P${firstPeriodNumber}` : undefined
      const isStartedInChosenPeriods =
        chosenSemesters.includes(String(firstSemester)) && chosenPeriods.includes(String(firstPeriodNumber))
      const isChosenSchool = isCorrectSchool(chosenSchool, schoolCode)

      if (isStartedInChosenPeriods && isChosenSchool) {
        const offering = _formOffering(firstSemester, startDate, endDate, course)
        parsedOfferings.push({ ...offering, period: firstPerioLabel, courseRoundApplicationCode })
      }
    })
  }
  return parsedOfferings
}

module.exports = {
  filterOfferingsForMemos,
  semestersInParsedOfferings,
  sortOfferedSemesters: _sortOfferedSemesters,
}
