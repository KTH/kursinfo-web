const browserConfig = require('../configuration').browser
const paths = require('../server').getPaths()

const serverConfig = require('../configuration').server

const addBaseData = (context, language) => {
  context.lang = language
  context.proxyPrefixPath = serverConfig.proxyPrefixPath
  context.initiallySelectedRoundIndex = undefined
  context.browserConfig = browserConfig
  context.paths = paths
  context.hostUrl = serverConfig.hostUrl
}

const addCourseData = (context, { filteredData, examiners, initiallySelectedSemester }) => {
  context.activeSemesters = filteredData.activeSemesters
  context.employees = filteredData.employees
  context.initiallySelectedSemester = initiallySelectedSemester
  context.courseData = filteredData.courseData

  context.courseData.courseInfo.course_examiners = examiners
}

const createCourseWebContext = ({ filteredData, courseCode, language, examiners, initiallySelectedSemester }) => {
  const context = {}

  addBaseData(context, language)
  addCourseData(context, { filteredData, examiners, initiallySelectedSemester })

  context.courseCode = courseCode
  return context
}

module.exports = { createCourseWebContext }
