const _ = require('lodash')
const { publishData } = require('./dates')

/**
 * Matches analyses and memos with course offerings.
 * @param {[]} parsedOfferings Array of offerings’ relevant data
 * @param {{}} memos           Collection of course memos
 * @returns {[]}               Array, each containing offerings and their documents.
 */
const memosPerCourseOffering = (parsedOfferings, memos) => {
  const courseOfferings = []

  parsedOfferings.forEach(offering => {
    const { courseCode, semester } = offering
    const offeringId = Number(offering.offeringId)
    let courseMemoInfo = {}
    if (memos[courseCode] && memos[courseCode][semester] && memos[courseCode][semester][offeringId]) {
      courseMemoInfo = memos[courseCode][semester][offeringId]
      courseMemoInfo.publishedData = publishData(offering.startDate, courseMemoInfo.lastChangeDate)
    }
    const courseOffering = {
      ...offering,
      courseMemoInfo,
    }
    courseOfferings.push(courseOffering)
  })

  // log.debug('_documentsPerCourseOffering returns', courseOfferings)
  return courseOfferings
}

/**
 * TODO: Write tests for this function!
 * Compiles collection with statistics per school, and totals, for memos.
 * @param {[]} courseOfferings  Array containing offerings and their memos
 * @returns {{}}                Collection with statistics per school, and totals, for memos
 */
function memosDataPerSchool(courseOfferings) {
  const schools = {}
  const uniqueCourseMemoPublished = []
  const uniqueCourseMemoPdf = []
  let totalNumberOfCourses = 0
  let totalNumberOfWebMemos = 0
  let totalNumberOfPdfMemos = 0
  let totalNumberOfMemosPublishedBeforeStart = 0
  let totalNumberOfMemosPublishedBeforeDeadline = 0

  courseOfferings.forEach(courseOffering => {
    const { schoolMainCode, courseCode, courseMemoInfo } = courseOffering

    let numberOfMemoPdf = 0
    let numberOfMemoPublished = 0
    let numberOfMemosPublishedBeforeStart = 0
    let numberOfMemosPublishedBeforeDeadline = 0
    if (!_.isEmpty(courseMemoInfo)) {
      if (courseMemoInfo.isPdf) {
        if (!uniqueCourseMemoPdf.includes(courseMemoInfo.memoId)) {
          uniqueCourseMemoPdf.push(courseMemoInfo.memoId)
          numberOfMemoPdf = 1
          if (courseMemoInfo.publishedData) {
            numberOfMemosPublishedBeforeStart = courseMemoInfo.publishedData.publishedBeforeStart ? 1 : 0
            numberOfMemosPublishedBeforeDeadline = courseMemoInfo.publishedData.publishedBeforeDeadline ? 1 : 0
          }
        }
      } else if (!uniqueCourseMemoPublished.includes(courseMemoInfo.memoId)) {
        uniqueCourseMemoPublished.push(courseMemoInfo.memoId)
        numberOfMemoPublished = 1
        if (courseMemoInfo.publishedData) {
          numberOfMemosPublishedBeforeStart = courseMemoInfo.publishedData.publishedBeforeStart ? 1 : 0
          numberOfMemosPublishedBeforeDeadline = courseMemoInfo.publishedData.publishedBeforeDeadline ? 1 : 0
        }
      }
    }
    if (schools[schoolMainCode]) {
      if (!schools[schoolMainCode].courseCodes.includes(courseCode)) {
        schools[schoolMainCode].courseCodes.push(courseCode)
        totalNumberOfCourses++
        schools[schoolMainCode].numberOfCourses += 1
        schools[schoolMainCode].numberOfUniqMemos += numberOfMemoPublished
        schools[schoolMainCode].numberOfUniqPdfMemos += numberOfMemoPdf
        schools[schoolMainCode].numberOfMemosPublishedBeforeStart += numberOfMemosPublishedBeforeStart
        schools[schoolMainCode].numberOfMemosPublishedBeforeDeadline += numberOfMemosPublishedBeforeDeadline
      } else {
        schools[schoolMainCode].numberOfUniqMemos += numberOfMemoPublished
        schools[schoolMainCode].numberOfUniqPdfMemos += numberOfMemoPdf
        schools[schoolMainCode].numberOfMemosPublishedBeforeStart += numberOfMemosPublishedBeforeStart
        schools[schoolMainCode].numberOfMemosPublishedBeforeDeadline += numberOfMemosPublishedBeforeDeadline
      }
    } else {
      totalNumberOfCourses++
      schools[schoolMainCode] = {
        numberOfCourses: 1,
        courseCodes: [courseCode],
        numberOfUniqMemos: numberOfMemoPublished,
        numberOfUniqPdfMemos: numberOfMemoPdf,
        numberOfMemosPublishedBeforeStart,
        numberOfMemosPublishedBeforeDeadline,
      }
    }
  })

  Object.values(schools).forEach(sc => {
    totalNumberOfWebMemos += sc.numberOfUniqMemos
    totalNumberOfPdfMemos += sc.numberOfUniqPdfMemos
    totalNumberOfMemosPublishedBeforeStart += sc.numberOfMemosPublishedBeforeStart
    totalNumberOfMemosPublishedBeforeDeadline += sc.numberOfMemosPublishedBeforeDeadline
  })
  const dataPerSchool = {
    schools,
    totalNumberOfCourses,
    totalNumberOfWebMemos,
    totalNumberOfPdfMemos,
    totalNumberOfMemosPublishedBeforeStart,
    totalNumberOfMemosPublishedBeforeDeadline,
  }
  // log.debug('_dataPerSchool returns', dataPerSchool)
  return dataPerSchool
}

function memosPerSchool(parsedOfferings, memos) {
  // Matches analyses and memos with course offerings.
  // Returns an object with two arrays, each containing offerings and their documents.
  const offeringsWithMemos = memosPerCourseOffering(parsedOfferings, memos) // prev combinedDataPerDepartment

  // Compiles statistics per school, including totals, for memos.
  const combinedMemosPerSchool = memosDataPerSchool(offeringsWithMemos)
  return { offeringsWithMemos, combinedMemosPerSchool }
}

module.exports = {
  memosDataPerSchool,
  memosPerCourseOffering,
  memosPerSchool,
}
