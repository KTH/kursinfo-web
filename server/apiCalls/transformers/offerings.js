const log = require('@kth/log')

const SCHOOL_MAP = {
  ABE: 'ABE',
  CBH: 'CBH',
  STH: 'CBH',
  CHE: 'CBH',
  BIO: 'CBH',
  CSC: 'EECS',
  ECE: 'ITM',
  EECS: 'EECS',
  EES: 'EECS',
  ICT: 'EECS',
  ITM: 'ITM',
  SCI: 'SCI',
}

/**
 * Creates string of programs in list.
 * @param {[]} programs   Programs as returned by '/api/kopps/v2/courses/offerings' in 'connected_programs'.
 * @returns {string}      String with program data, separated by comma
 */
function _getProgramList(programs) {
  const programsList =
    (programs &&
      programs.map(
        ({ code, study_year: studyYear, spec_code: specCode }) =>
          `${code}${specCode ? '-' + specCode : ''}-${studyYear}`
      )) ||
    []
  const programsString = programsList.join(', ')
  // log.debug('_getProgramList returns', programsString)
  return programsString
}

function _formatTimeToLocaleDateSV(parsedTime) {
  if (!parsedTime || Number.isNaN(parsedTime)) return ''
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' }
  const formattedTime = new Date(parsedTime).toLocaleDateString('sv-SE', options)
  return formattedTime
}

/**
 * Creates object of offering to save essential informations.
 * @param {string} firstSemester   semester when course offering is started
 * @param {number} startDate       date when course offering is started
 * @param {{}} course   Each course as returned by '/api/kopps/v2/courses/offerings' in 'courses'.
 * @param {string} course.course_code - The course code
 * @param {string} course.department_name - The ddepartment name
 * @param {string} course.offering_id - The offering id
 * @returns {{}}        Object with course offering data
 */
function _formOffering(firstSemester, startDate, course) {
  return {
    firstSemester,
    startDate,
    schoolMainCode: SCHOOL_MAP[course.school_code] || '---',
    departmentName: course.department_name,
    connectedPrograms: _getProgramList(course.connected_programs),
    courseCode: course.course_code,
    offeringId: course.offering_id,
  }
}
/**
 * Finds unique semesters in object with parsed offerings.
 * @param {[]} parsedOfferings Object with two arrays, each containing offerings’ relevant data.
 * @returns {[]}               Array with found unique semesters
 */
const semestersInParsedOfferings = parsedOfferings =>
  parsedOfferings.reduce((foundSemesters, o) => {
    if (o.semester && !foundSemesters.includes(o.semester)) {
      foundSemesters.push(o.semester)
    }
    return foundSemesters
  }, [])

/**
 * @param {Object[]} chosenSemesters    Semesters strings for which data is fetched
 * @param {string} chosenSemesters[]    Semester string chosen by user
 * @returns {{}}           Array, containingoffered semesters and startDate
 */

function _findStartDateAndLastSemester(chosenSemesters, courseOfferedSemesters) {
  const offeredSemesters = Array.isArray(courseOfferedSemesters) ? courseOfferedSemesters : []

  const { start_date: offeredSemesterStartDate = '' } =
    offeredSemesters.find(os => chosenSemesters.includes(os.semester)) || {}
  const startDate = offeredSemesterStartDate ? _formatTimeToLocaleDateSV(Date.parse(offeredSemesterStartDate)) : ''

  const courseOfferingLastSemester = offeredSemesters.length
    ? offeredSemesters[offeredSemesters.length - 1].semester
    : ''

  return { courseOfferingLastSemester, startDate }
}

const _isCorrectSchool = (chosenSchool, courseSchool) =>
  chosenSchool === 'allSchools' || chosenSchool.toUpperCase() === SCHOOL_MAP[courseSchool.toUpperCase()]

/**
 * Parses courses offerings from Kopps and returns an object with one list for course memos which are created before course starts:
 * - List containing offerings that starts with semester parameter. This is used for course memos.
 * @param {Object[]} courses      Courses as returned by '/api/kopps/v2/courses/offerings'.
 * @param {string} courses[].first_yearsemester - The start semester of a course
 * @param {Object[]} courses[].offered_semesters - The list of offered semesters of a course
 * @param {string} courses[].offered_semesters[].semester - The current semester of a course offering
 * @param {Object[]} chosenSemesters    Semesters strings for which data is fetched
 * @param {string} chosenSemesters[]    Semester string chosen by user, 5 digits in string format
 * @param {Object[]} chosenPeriods    Periods strings for which data is fetched, 0-5
 * @param {string} chosenPeriods[]    Period string chosen by user, 1 digit in string format, 0-5
 * @param {string} chosenSchool    School name, or if all schools are chosen then 'allSchools
 * @returns {[]}           Array, containing offerings’ relevant data
 */
function parseOfferingsForMemos(coursesR = [], chosenSemesters = [], chosenPeriods = [], chosenSchool = '') {
  const parsedOfferings = []
  const courses = [coursesR[0], coursesR[1]]
  if (Array.isArray(courses)) {
    courses.forEach(course => {
      // eslint-disable-next-line camelcase
      const {
        first_yearsemester: firstSemester,
        first_period: firstYearAndPeriod,
        offered_semesters: courseOfferedSemesters,
        school_code: schoolCode,
      } = course

      const firstPeriod = firstYearAndPeriod.substr(-1)

      const isStartedInChosenPeriods = chosenSemesters.includes(firstSemester) && chosenPeriods.includes(firstPeriod)
      const isCorrectSchool = _isCorrectSchool(chosenSchool, schoolCode)

      if (isStartedInChosenPeriods && isCorrectSchool) {
        const { startDate } = _findStartDateAndLastSemester(chosenSemesters, courseOfferedSemesters)
        const offering = _formOffering(firstSemester, startDate, course)
        parsedOfferings.push(offering)
      }
    })
  }
  return parsedOfferings
}

/**
 * Parses courses offerings from Kopps and returns an object with one list for course analyses which are created after course ends:
 * - List containing offerings that ends with semester parameter. This is used for course analyses.
 * @param {Object[]} courses      Courses as returned by '/api/kopps/v2/courses/offerings'.
 * @param {string} courses[].first_yearsemester - The start semester of a course
 * @param {Object[]} courses[].offered_semesters - The list of offered semesters of a course
 * @param {string} courses[].offered_semesters[].semester - The current semester of a course offering
 * @param {Object[]} chosenSemesters    Semesters strings for which data is fetched
 * @param {string} chosenSemesters[]    Semester string chosen by user, 5 digits in string format
 * @param {string} chosenSchool    School name, or if all schools are chosen then 'allSchools
 * @returns {[]}           Array, containing offerings’ relevant data
 */
function parseOfferingsForAnalysis(courses = [], chosenSemesters = [], chosenSchool = '') {
  const parsedOfferings = []
  if (Array.isArray(courses)) {
    courses.forEach(course => {
      // eslint-disable-next-line camelcase
      const {
        first_yearsemester: firstSemester,
        offered_semesters: courseOfferedSemesters,
        school_code: schoolCode,
      } = course

      const { courseOfferingLastSemester, startDate } = _findStartDateAndLastSemester(
        chosenSemesters,
        courseOfferedSemesters
      )

      const isFinishedInChosenSemesters = chosenSemesters.includes(courseOfferingLastSemester)
      const isCorrectSchool = _isCorrectSchool(chosenSchool, schoolCode)

      if (isFinishedInChosenSemesters && isCorrectSchool) {
        const offering = _formOffering(firstSemester, startDate, course)
        parsedOfferings.push(offering)
      }
    })
  }
  return parsedOfferings
}

module.exports = {
  parseOfferingsForMemos,
  parseOfferingsForAnalysis,
  semestersInParsedOfferings,
}
