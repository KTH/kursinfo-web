const log = require('@kth/log')

const { firstPublishData, publishData } = require('./dates')

/**
 * Matches analyses and memos with course offerings.
 * @param {[]} parsedOfferings Array of offerings’ relevant data
 * @param {{}} memos           Collection of course memos
 * @returns {[]}               Array, each containing offerings and their documents.
 */
const memosPerCourseOffering = (parsedOfferings, memos) => {
  const courseOfferings = []
  const found1 = [] // debug
  const found2 = [] // debug
  const courseMemoInfos = []
  parsedOfferings.forEach(offering => {
    const { courseCode, firstSemester } = offering
    const offeringId = Number(offering.offeringId)
    let courseMemoInfo = {}
    const courseMemosForSemester = memos.filter(
      memo => memo.courseCode === courseCode && memo.semester === firstSemester
    )
    const memosForOfferingId = courseMemosForSemester.filter(memo => memo.ladokRoundIds.includes(String(offeringId)))
    // if (memos[courseCode] && memos[courseCode][firstSemester] && memos[courseCode][firstSemester][offeringId]) {
    //   courseMemoInfo = memos[courseCode][firstSemester][offeringId]
    if (memosForOfferingId.length === 1) {
      found1.push(memosForOfferingId)

      const [publishedMemo] = memosForOfferingId
      courseMemoInfo = publishedMemo
      // TODO publish date need to be taken from version 1
      courseMemoInfo.publishedData = publishData(offering.startDate, courseMemoInfo.lastChangeDate)
      courseMemoInfos.push(courseMemoInfo)
    }
    if (memosForOfferingId.length > 1) {
      found2.push(memosForOfferingId)
      const firstVersion = memosForOfferingId.find(memo => memo.version === 1)
      const latestVersion = memosForOfferingId.find(memo => memo.version !== 1)

      courseMemoInfo = latestVersion
      // TODO publish date need to be taken from version 1
      courseMemoInfo.publishedData = firstPublishData(
        offering.startDate,
        latestVersion.lastChangeDate,
        firstVersion.lastChangeDate
      )
      courseMemoInfos.push(courseMemoInfo)
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
//    const isEmpty = Object.keys(courseMemoInfo).length === 0 && courseMemoInfo.constructor === Object

function _setAndcountCourses(courseOfferings) {
  const schools = {}
  let totalNumberOfCoursesAllSchools = 0

  courseOfferings.forEach(courseOffering => {
    const { courseCode, endDate, schoolMainCode: schoolCode, startDate } = courseOffering
    const uniqueCourseId = `${courseCode}-${startDate}-${endDate}`
    const school = schools[schoolCode]

    if (schools[schoolCode]) {
      if (!schools[schoolCode].courseCodes.includes(courseCode)) {
        schools[schoolCode].courseCodes.push(courseCode)
        totalNumberOfCoursesAllSchools++
        schools[schoolCode].numberOfCourses += 1
      }
    } else {
      totalNumberOfCoursesAllSchools++
      schools[schoolCode] = {
        numberOfCourses: 1,
        courseCodes: [courseCode],
      }
    }
  })

  const dataPerSchool = {
    schools,
    totalNumberOfCoursesAllSchools,
  }
  return dataPerSchool
}
/**
 * TODO: Write tests for this function!
 * Compiles collection with statistics per school, and totals, for memos.
 * @param {[]} courseOfferings  Array containing offerings and their memos
 * @returns {{}}                Collection with statistics per school, and totals, for memos
 */
function _countMemosDataPerSchool(courseOfferings) {
  const schools = {}
  const uniqueCourseMemoPublished = []
  const uniqueCourseMemoPdf = []
  let totalNumberOfCourses = 0
  let totalNumberOfWebMemos = 0
  let totalNumberOfPdfMemos = 0
  let totalNumberOfMemosPublishedBeforeStart = 0
  let totalNumberOfMemosPublishedBeforeDeadline = 0

  courseOfferings.forEach(courseOffering => {
    const { schoolMainCode: schoolCode, courseCode, courseMemoInfo } = courseOffering

    if (schoolCode) {
      let numberOfMemoPdf = 0
      let numberOfMemoPublished = 0
      let numberOfMemosPublishedBeforeStart = 0
      let numberOfMemosPublishedBeforeDeadline = 0
      const isEmpty = Object.keys(courseMemoInfo).length === 0 && courseMemoInfo.constructor === Object

      if (!isEmpty) {
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
      if (schools[schoolCode]) {
        if (!schools[schoolCode].courseCodes.includes(courseCode)) {
          schools[schoolCode].courseCodes.push(courseCode)
          totalNumberOfCourses++
          schools[schoolCode].numberOfCourses += 1
          schools[schoolCode].numberOfUniqMemos += numberOfMemoPublished
          schools[schoolCode].numberOfUniqPdfMemos += numberOfMemoPdf
          schools[schoolCode].numberOfMemosPublishedBeforeStart += numberOfMemosPublishedBeforeStart
          schools[schoolCode].numberOfMemosPublishedBeforeDeadline += numberOfMemosPublishedBeforeDeadline
        } else {
          schools[schoolCode].numberOfUniqMemos += numberOfMemoPublished
          schools[schoolCode].numberOfUniqPdfMemos += numberOfMemoPdf
          schools[schoolCode].numberOfMemosPublishedBeforeStart += numberOfMemosPublishedBeforeStart
          schools[schoolCode].numberOfMemosPublishedBeforeDeadline += numberOfMemosPublishedBeforeDeadline
        }
      } else {
        totalNumberOfCourses++
        schools[schoolCode] = {
          numberOfCourses: 1,
          courseCodes: [courseCode],
          numberOfUniqMemos: numberOfMemoPublished,
          numberOfUniqPdfMemos: numberOfMemoPdf,
          numberOfMemosPublishedBeforeStart,
          numberOfMemosPublishedBeforeDeadline,
        }
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
  const combinedMemosPerSchool = _countMemosDataPerSchool(offeringsWithMemos)
  return { offeringsWithMemos, combinedMemosPerSchool }
}

module.exports = {
  memosPerCourseOffering,
  memosPerSchool,
}
