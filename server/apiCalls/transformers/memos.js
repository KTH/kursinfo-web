const { firstPublishData, publishData } = require('./dates')
const { findMemosForOfferingId } = require('./docs')

/**
 * Matches analyses and memos with course offerings.
 * @param {[]} parsedOfferings Array of offerings’ relevant data
 * @param {[]} memos           Collection of course memos
 * @returns {[]}               Array, each containing offerings and their documents.
 */
const _memosPerCourseOffering = async (parsedOfferings, memos) => {
  const courseOfferings = []
  await parsedOfferings.forEach(offering => {
    const { courseCode, firstSemester } = offering
    const offeringId = Number(offering.offeringId)
    let courseMemoInfo = {}
    const memosForOfferingId = findMemosForOfferingId(memos, courseCode, firstSemester, offeringId)

    if (memosForOfferingId.length === 1) {
      const [publishedMemo] = memosForOfferingId
      courseMemoInfo = publishedMemo
      courseMemoInfo.publishedData = publishData(offering.startDate, courseMemoInfo.lastChangeDate)
    }
    // TODO: first version of PDF file first date
    if (memosForOfferingId.length > 1) {
      const firstVersion = memosForOfferingId.find(memo => memo.version === 1)

      courseMemoInfo = firstVersion
      // publish date need to be taken from version 1
      courseMemoInfo.publishedData = firstPublishData(
        offering.startDate,
        firstVersion.lastChangeDate,
        firstVersion.lastChangeDate
      )
    }
    const courseOffering = {
      ...offering,
      courseMemoInfo,
    }
    courseOfferings.push(courseOffering)
  })

  return courseOfferings
}

/**
 * Initiating an object with counters for different types of numbers and two arrays for courses with and without memos
 * @returns {{}}                Object with all counters and two arrays
 */
const _initSchoolValues = () => ({
  numberOfCourses: 0,
  uniqueCourseCodeDates: [],
  uniqueCourseCodeDatesWithoutMemo: [],
  // memos numbers
  numberOfUniqWebAndPdfMemos: 0,
  numberOfUniqWebMemos: 0,
  numberOfUniqPdfMemos: 0,
  numberOfMemosPublishedBeforeStart: 0,
  numberOfMemosPublishedBeforeDeadline: 0,
})

/**
 * Calculate total values for all memos counters in all schools and how many courses in total for all schools
 * @param {Object} schools Object with schools objects
 * @returns {{}}           Values with counters
 */
function _calculateTotals(schools) {
  let totalNumberOfWebMemos = 0
  let totalNumberOfPdfMemos = 0
  let totalNumberOfMemosPublishedBeforeStart = 0
  let totalNumberOfMemosPublishedBeforeDeadline = 0
  let totalCourses = 0

  Object.values(schools).forEach(sc => {
    totalCourses += sc.numberOfCourses
    totalNumberOfWebMemos += sc.numberOfUniqWebMemos
    totalNumberOfPdfMemos += sc.numberOfUniqPdfMemos
    totalNumberOfMemosPublishedBeforeStart += sc.numberOfMemosPublishedBeforeStart
    totalNumberOfMemosPublishedBeforeDeadline += sc.numberOfMemosPublishedBeforeDeadline
  })
  return {
    totalCourses,
    totalNumberOfWebMemos,
    totalNumberOfPdfMemos,
    totalNumberOfMemosPublishedBeforeStart,
    totalNumberOfMemosPublishedBeforeDeadline,
  }
}
function _hasValues(obj) {
  return Object.keys(obj).length > 0 && obj.constructor === Object
}
/**
 * TODO: Write tests for this function!
 * Compiles collection with statistics per school, and totals, for memos.
 * @param {[]} courseOfferings  Array containing offerings and their memos
 * @returns {{}}                Collection with statistics per school, and totals, for memos
 */
function _countMemosDataPerSchool(courseOfferings) {
  const schools = {}
  const uniqueCourseMemoPdf = []
  const uniqueCourseMemoWeb = []

  function _generateMemoAddends(memo) {
    let pdfMemoAddend = 0
    let webMemoAddend = 0
    let beforeCourseStartAddend = 0
    let beforeDeadlineAddend = 0

    const hasMemo = _hasValues(memo)
    if (hasMemo) {
      const { courseMemoFileName, memoEndPoint, publishedData = {} } = memo
      const memoId = courseMemoFileName || memoEndPoint

      const isUniquePdf = memo.isPdf && !uniqueCourseMemoPdf.includes(memoId)
      const isUniqueWeb = !memo.isPdf && !uniqueCourseMemoWeb.includes(memoId)
      if (isUniquePdf) {
        uniqueCourseMemoPdf.push(memoId)
        pdfMemoAddend = 1
      }

      if (isUniqueWeb) {
        uniqueCourseMemoWeb.push(memoId)
        webMemoAddend = 1
      }

      if (isUniquePdf || isUniqueWeb) {
        const { publishedBeforeDeadline, publishedBeforeStart } = publishedData
        beforeCourseStartAddend = publishedBeforeStart ? 1 : 0
        beforeDeadlineAddend = publishedBeforeDeadline ? 1 : 0
      }
    }
    return { beforeCourseStartAddend, beforeDeadlineAddend, pdfMemoAddend, webMemoAddend }
  }
  for (const courseOffering of courseOfferings) {
    const { courseCode, courseMemoInfo = {}, endDate, schoolMainCode: code, startDate } = courseOffering

    const courseCodeAndDates = `${courseCode}-${startDate}-${endDate}`
    const isNewSchoolCourse = !schools[code]
    const hasMemo = _hasValues(courseMemoInfo)
    if (isNewSchoolCourse) {
      schools[code] = _initSchoolValues()
    }

    // If a course has several ladokRoundIds which start and end at same time, it counts as one course
    const hasCourseUniqueDates =
      !schools[code].uniqueCourseCodeDates.includes(courseCodeAndDates) &&
      !schools[code].uniqueCourseCodeDatesWithoutMemo.includes(courseCodeAndDates)

    if (!hasMemo && hasCourseUniqueDates) {
      schools[code].uniqueCourseCodeDatesWithoutMemo.push(courseCodeAndDates)
    }

    if (hasMemo && hasCourseUniqueDates) {
      const { pdfMemoAddend, webMemoAddend, beforeCourseStartAddend, beforeDeadlineAddend } =
        _generateMemoAddends(courseMemoInfo)
      schools[code].uniqueCourseCodeDates.push(courseCodeAndDates)

      // remove courseCode from list without memos if it was there
      schools[code].uniqueCourseCodeDatesWithoutMemo = schools[code].uniqueCourseCodeDatesWithoutMemo.filter(
        courseId => courseId !== courseCodeAndDates
      )
      // calculate
      schools[code].numberOfUniqWebMemos += webMemoAddend
      schools[code].numberOfUniqPdfMemos += pdfMemoAddend
      schools[code].numberOfMemosPublishedBeforeStart += beforeCourseStartAddend
      schools[code].numberOfMemosPublishedBeforeDeadline += beforeDeadlineAddend
    }
    // sum pdf and web memos
    schools[code].numberOfUniqWebAndPdfMemos = schools[code].numberOfUniqWebMemos + schools[code].numberOfUniqPdfMemos
    // calculate number of courses
    schools[code].numberOfCourses =
      schools[code].uniqueCourseCodeDates.length + schools[code].uniqueCourseCodeDatesWithoutMemo.length
  }

  const dataPerSchool = {
    schools,
    ..._calculateTotals(schools),
  }
  return dataPerSchool
}

/**
 * Merge offerings with existing memos and count them then to be sorted by schools
 * @param {[]} courseOfferings  Array containing offerings
 * @param {[]} memos            Array containing existing memos
 * @returns {{}}                Collection with statistics per school, and totals, for memos
 */
async function memosPerSchool(parsedOfferings, memos) {
  // Matches analyses and memos with course offerings.
  // Returns an object with two arrays, each containing offerings and their documents.
  const offeringsWithMemos = await _memosPerCourseOffering(parsedOfferings, memos) // prev combinedDataPerDepartment

  // Compiles statistics per school, including totals, for memos.
  const combinedMemosPerSchool = await _countMemosDataPerSchool(offeringsWithMemos)
  return { offeringsWithMemos, combinedMemosPerSchool }
}

module.exports = {
  countMemosDataPerSchool: _countMemosDataPerSchool,
  memosPerSchool,
  memosPerCourseOffering: _memosPerCourseOffering,
}
