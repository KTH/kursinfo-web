const log = require('@kth/log')

const { findAnalysesForOfferingId } = require('./docs')

/**
 * Matches analyses with course offerings.
 * @param {[]} parsedOfferings    Array of offerings’ relevant data
 * @param {[]} analyses           Collection of course analyses
 * @returns {[]}                  Array, each containing offerings and their documents.
 */
const _analysesPerCourseOffering = async (parsedOfferings, analyses) => {
  const courseOfferings = []
  await parsedOfferings.forEach(offering => {
    const { courseCode, firstSemester } = offering
    const offeringId = Number(offering.offeringId)

    const [publishedAnalysis] = findAnalysesForOfferingId(analyses, courseCode, firstSemester, offeringId)

    const courseOffering = {
      ...offering,
      courseAnalysisInfo: publishedAnalysis || {},
    }
    courseOfferings.push(courseOffering)
  })

  return courseOfferings
}

/**
 * Initiating an object with counters for different types of numbers and two arrays for courses with and without analyses
 * @returns {{}}                Object with all counters and two arrays
 */
const _initSchoolValues = () => ({
  numberOfCourses: 0,
  uniqueCourseCodeDates: [],
  uniqueCourseCodeDatesWithoutAnalysis: [],
  // analyses numbers
  numberOfUniqAnalyses: 0,
})

/**
 * Calculate total values for all analyses counters in all schools and how many courses in total for all schools
 * @param {Object} schools Object with schools objects
 * @returns {{}}           Values with counters
 */
function _calculateTotals(schools) {
  let totalNumberOfUniqAnalyses = 0
  let totalNumberOfCourses = 0

  Object.values(schools).forEach(sc => {
    totalNumberOfCourses += sc.numberOfCourses
    totalNumberOfUniqAnalyses += sc.numberOfUniqAnalyses
  })
  return {
    totalNumberOfCourses,
    totalNumberOfUniqAnalyses,
  }
}
function _hasValues(obj) {
  return Object.keys(obj).length > 0 && obj.constructor === Object
}
/**
 * TODO: Write tests for this function!
 * Compiles collection with statistics per school, and totals, for analyses.
 * @param {[]} courseOfferings  Array containing offerings and their analyses
 * @returns {{}}                Collection with statistics per school, and totals, for analyses
 */
function _countAnalysesDataPerSchool(courseOfferings) {
  const schools = {}
  const uniqueCourseAnalyses = []

  function _generateAnalysisAddends(analysis) {
    let analysisAddend = 0

    const hasAnalysis = _hasValues(analysis)
    if (hasAnalysis) {
      const { analysisFileName } = analysis
      const analysisId = analysisFileName

      const isUniqueAnalysis = !uniqueCourseAnalyses.includes(analysisId)

      if (isUniqueAnalysis) {
        uniqueCourseAnalyses.push(analysisId)
        analysisAddend = 1
      }
    }
    return { analysisAddend }
  }
  for (const courseOffering of courseOfferings) {
    const { courseCode, courseAnalysisInfo = {}, endDate, schoolMainCode: code, startDate } = courseOffering

    const courseCodeAndDates = `${courseCode}-${startDate}-${endDate}`
    const isNewSchoolCourse = !schools[code]
    const hasAnalysis = _hasValues(courseAnalysisInfo)
    if (hasAnalysis) log.error('------', { hasAnalysis, courseAnalysisInfo, school: schools[code] })

    if (isNewSchoolCourse) {
      schools[code] = _initSchoolValues()
    }

    if (!hasAnalysis) {
      schools[code].uniqueCourseCodeDatesWithoutAnalysis.push(courseCodeAndDates)
    }

    // If a course has several ladokRoundIds which start and end at same time, it counts as one course
    const hasCourseUniqueDates = !schools[code].uniqueCourseCodeDates.includes(courseCodeAndDates)

    if (hasAnalysis & hasCourseUniqueDates) {
      const { analysisAddend } = _generateAnalysisAddends(courseAnalysisInfo)
      schools[code].uniqueCourseCodeDates.push(courseCodeAndDates)

      // remove courseCode from list without analyses if it was there
      schools[code].uniqueCourseCodeDatesWithoutAnalysis = schools[code].uniqueCourseCodeDatesWithoutAnalysis.filter(
        courseId => courseId !== courseCodeAndDates
      )
      // calculate
      schools[code].numberOfUniqAnalyses += analysisAddend
    }
    // calculate number of courses
    schools[code].numberOfCourses =
      schools[code].uniqueCourseCodeDates.length + schools[code].uniqueCourseCodeDatesWithoutAnalysis.length
  }

  const dataPerSchool = {
    schools,
    ..._calculateTotals(schools),
  }
  log.error('dataPerSchool', dataPerSchool)
  return dataPerSchool
}

/**
 * Merge offerings with existing analyses and count them then to be sorted by schools
 * @param {[]} courseOfferings  Array containing offerings
 * @param {[]} analyses            Array containing existing analyses
 * @returns {{}}                Collection with statistics per school, and totals, for analyses
 */
async function analysesPerSchool(parsedOfferings, analyses) {
  // Matches analyses and analyses with course offerings.
  // Returns an object with two arrays, each containing offerings and their documents.
  const offeringsWithAnalyses = await _analysesPerCourseOffering(parsedOfferings, analyses) // prev combinedDataPerDepartment

  // Compiles statistics per school, including totals, for analyses.
  const combinedAnalysesPerSchool = await _countAnalysesDataPerSchool(offeringsWithAnalyses)
  return { offeringsWithAnalyses, combinedAnalysesPerSchool }
}

module.exports = {
  analysesPerSchool,
}
