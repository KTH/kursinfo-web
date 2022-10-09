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
 * @param {number} firstSemester   semester when course offering is started
 * @param {number} startDate       date when course offering is started
 * @param {{}} course   Each course as returned by '/api/kopps/v2/courses/offerings' in 'courses'.
 * @returns {{}}        Object with course offering data
 */
function _formOffering(firstSemester, startDate, course) {
  return {
    semester: firstSemester,
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
 * Parses offerings from Kopps and returns an object with two lists:
 * - One list containing offerings that starts with semester parameter. This is used for course memos.
 * - One list containing offerings that ends with semester parameter. This is used for course analyses.
 * @param {{}} courses      Courses as returned by '/api/kopps/v2/courses/offerings'.
 * @param {[]} semesters    Semesters numbers for which data is fetched
 * @returns {{}}            Object with two arrays, each containing offerings’ relevant data
 */
function parseOfferings(courses, semesters, documentType) {
  const parsedOfferings = []
  // {
  //   forAnalyses: [],
  //   forMemos: [],
  // }

  if (Array.isArray(courses.body)) {
    courses.body.forEach(course => {
      // eslint-disable-next-line camelcase
      const { first_yearsemester: firstSemester, offered_semesters } = course
      // eslint-disable-next-line camelcase
      const offeredSemesters = Array.isArray(offered_semesters) ? offered_semesters : []

      const { start_date: offeredSemesterStartDate = '' } =
        offeredSemesters.find(os => semesters.includes(os.semester)) || {}
      const startDate = offeredSemesterStartDate ? _formatTimeToLocaleDateSV(Date.parse(offeredSemesterStartDate)) : ''
      const courseOfferingLastSemester = offeredSemesters.length
        ? offeredSemesters[offeredSemesters.length - 1].semester
        : ''

      const isRelevant =
        documentType === 'courseMemo'
          ? semesters.includes(firstSemester)
          : semesters.includes(courseOfferingLastSemester)

      if (isRelevant) parsedOfferings.push(_formOffering(firstSemester, startDate, course))
    })
  }
  // log.debug('_parseOfferings returns', courseOfferingsWithoutAnalysis)
  return parsedOfferings
}

module.exports = {
  parseOfferings,
}
