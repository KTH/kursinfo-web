const i18n = require('../../i18n')
const serverConfig = require('../configuration').server
const browserConfig = require('../configuration').browser
const serverPaths = require('../server').getPaths()
const { parseRounds, createSemestersAndSyllabusConnection, getSemesterIndexToShow } = require('./courseDataUtils')

const addBaseData = (context, args) => {
  const { language } = args

  context.lang = language
  context.paths = serverPaths
  context.proxyPrefixPath = serverConfig.proxyPrefixPath
  context.hostUrl = serverConfig.hostUrl // called apiHost in kursinfo-admin-web
  context.browserConfig = browserConfig
}

function addCourseData(context, courseDetails) {
  context.routeData = context.routeData ?? {}

  context.routeData.courseData = {
    courseCode: courseDetails?.courseTitleData?.courseCode,
    courseTitle: courseDetails?.courseTitleData?.courseTitle,
    courseCredits: courseDetails?.courseTitleData?.courseCredits,
  }

  // setting courseCode to context root for easier access in frontend than context.routeData.courseData
  context.courseCode = courseDetails?.courseTitleData?.courseCode
  context.koppsApiError = courseDetails?.apiError
}

function _hasSemesterInArray(semesterNumber, semesters) {
  if (!semesterNumber) return false
  return semesters?.some(s => s[2] === semesterNumber)
}

function chooseSemesterAndSyllabusFromActiveSemesters({
  externalSemester,
  useStartSemesterFromQuery,
  activeSemesters,
  activeSemestersIndexesWithValidSyllabusesIndexes,
  context,
}) {
  const defaultSemesterIndex = getSemesterIndexToShow(
    useStartSemesterFromQuery ? externalSemester : '',
    activeSemesters
  )

  context.defaultIndex = defaultSemesterIndex

  if (useStartSemesterFromQuery) {
    context.activeSemester = externalSemester
    context.activeSemesterIndex = defaultSemesterIndex
    context.semesterSelectedIndex = defaultSemesterIndex
    context.activeSyllabusIndex = activeSemestersIndexesWithValidSyllabusesIndexes[defaultSemesterIndex]
  }
}

const createCourseWebContext = args => {
  const context = {}
  addBaseData(context, args)

  if (args.koppsData) {
    const { roundList, activeSemesters, keyList } = parseRounds(
      args.koppsData.roundInfos,
      args.koppsData.courseTitleData?.course_code,
      args.language,
      args.memoList
    )

    context.keyList = keyList
    // context.activeSemesters = activeSemesters

    const useStartSemesterFromQuery = args.startSemesterFromQuery
      ? _hasSemesterInArray(args.startSemesterFromQuery, activeSemesters)
      : false

    const courseData = {
      syllabusList: args.koppsData.syllabusData.syllabusList,
      courseInfo: args.koppsData.courseInfo,
      roundList,
      courseTitleData: args.koppsData.courseTitleData,
      syllabusSemesterList: args.koppsData.syllabusData.syllabusSemesterList,
      language: args.language,
    }

    context.courseData = courseData

    context.isCancelled = args.koppsData.courseStatus.isCancelled
    context.isDeactivated = args.koppsData.courseStatus.isDeactivated

    const activeSemestersIndexesWithValidSyllabusesIndexes = createSemestersAndSyllabusConnection(
      args.koppsData.syllabusData.syllabusList,
      activeSemesters
    )

    context.activeSemestersIndexesWithValidSyllabusesIndexes = activeSemestersIndexesWithValidSyllabusesIndexes

    chooseSemesterAndSyllabusFromActiveSemesters({
      externalSemester: args.startSemesterFromQuery,
      useStartSemesterFromQuery,
      activeSemesters,
      activeSemestersIndexesWithValidSyllabusesIndexes,
      context,
    })
  }

  //   addCourseData(context, args.courseDetails)

  context.hasStartPeriodFromQuery = !!Number(args.periods)
}

module.exports = {
  createCourseWebContext,
}
