const { isCorrectSchool, SCHOOL_MAP } = require('./schools')

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

/**
 * Creates object of offering to save essential informations.
 * @param {string} firstSemester   semester when course offering is started
 * @param {number} startDate       date when course offering is started
 * @param {{}} course   Each course as returned by '/api/kopps/v2/courses/offerings' in 'courses'.
 * @param {string} course.course_code - The course code
 * @param {string} course.department_name - The ddepartment name
 * @returns {{}}        Object with course offering data
 */
function _formOffering(firstSemester, startDate, endDate, course) {
  return {
    endDate,
    firstSemester,
    startDate,
    schoolMainCode: SCHOOL_MAP[course.school_code] || 'Others',
    departmentName: course.department_name,
    connectedPrograms: _getProgramList(course.connected_programs),
    courseCode: course.course_code,
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
 * @param {Object[]} courseOfferedSemesters    Courses offerings
 * @param {Object} courseOfferedSemesters[]    Course offering
 * @returns {{}}           Array, containing offered semesters and startDate
 */
function _findCourseStartEndDates(courseOfferedSemesters) {
  const offeredSemesters = Array.isArray(courseOfferedSemesters) ? courseOfferedSemesters : []
  const sortedArray = _sortOfferedSemesters(offeredSemesters)

  const firstOffering = sortedArray.at(0) ?? {}
  const lastOffering = sortedArray.at(-1) ?? {}

  const { start_date: courseStartDate = '' } = firstOffering
  const { semester: lastSemester = '', end_date: courseEndDate = '', end_week: courseEndWeek } = lastOffering

  return { endDate: courseEndDate, endWeek: courseEndWeek, lastSemester, startDate: courseStartDate }
}

/**
 * Parses courses offerings from Kopps and returns an object with one list for course memos which are created before course starts:
 * - List containing offerings that starts with semester parameter. This is used for course memos.
 * @param {Object[]} courses      Courses as returned by '/api/kopps/v2/courses/offerings'.
 * @param {string} courses[].first_yearsemester - The start semester of a course
 * @param {Object[]} courses[].offered_semesters - The list of offered semesters of a course
 * @param {string} courses[].offered_semesters[].end_date - The end date of a course offering
 * @param {string} courses[].offered_semesters[].semester - The current semester of a course offering
 * @param {string} courses[].offered_semesters[].start_date - The start date of a course offering
 * @param {Object[]} chosenSemesters    Semesters strings for which data is fetched
 * @param {string} chosenSemesters[]    Semester string chosen by user, 5 digits in string format
 * @param {Object[]} chosenPeriods    Periods strings for which data is fetched, 0-5
 * @param {string} chosenPeriods[]    Period string chosen by user, 1 digit in string format, 0-5
 * @param {string} chosenSchool    School name, or if all schools are chosen then 'allSchools
 * @returns {[]}           Array, containing offerings’ relevant data
 */
function filterOfferingsForMemos(courses = [], chosenSemesters = [], chosenPeriods = [], chosenSchool = '') {
  const parsedOfferings = []
  // const courses = [coursesR[0], coursesR[1]]
  if (Array.isArray(courses)) {
    courses.forEach(course => {
      // eslint-disable-next-line camelcase
      const {
        first_yearsemester: firstSemester,
        first_period: firstYearAndPeriod,
        offered_semesters: courseOfferedSemesters,
        school_code: schoolCode,
        course_round_applications: courseRoundApplications,
      } = course

      const firstPeriodNumber = firstYearAndPeriod.substr(-1)
      const firstPerioLabel = firstYearAndPeriod.substr(-2)
      const isStartedInChosenPeriods =
        chosenSemesters.includes(String(firstSemester)) && chosenPeriods.includes(String(firstPeriodNumber))
      const isChosenSchool = isCorrectSchool(chosenSchool, schoolCode)

      if (isStartedInChosenPeriods && isChosenSchool) {
        const { endDate, startDate } = _findCourseStartEndDates(courseOfferedSemesters)
        const offering = _formOffering(firstSemester, startDate, endDate, course)
        parsedOfferings.push({ ...offering, period: firstPerioLabel, courseRoundApplications })
      }
    })
  }
  return parsedOfferings
}

module.exports = {
  filterOfferingsForMemos,
  findCourseStartEndDates: _findCourseStartEndDates,
  semestersInParsedOfferings,
  sortOfferedSemesters: _sortOfferedSemesters,
}
