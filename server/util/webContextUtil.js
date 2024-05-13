const browserConfig = require('../configuration').browser
const paths = require('../server').getPaths()

const serverConfig = require('../configuration').server

const addBaseData = (context, args) => {
  const { language } = args
  context.lang = language
  context.proxyPrefixPath = serverConfig.proxyPrefixPath
  context.isCancelledOrDeactivated = false
  context.initiallySelectedRoundIndex = undefined // Source
  context.browserConfig = browserConfig
  context.paths = paths
  context.hostUrl = serverConfig.hostUrl
}

const createCourseWebContext = args => {
  const context = { ...args.filteredData }

  addBaseData(context, args)

  context.courseCode = args.courseCode
  context.courseData.courseInfo.course_examiners = args.examiners

  return context
}

// TODO Benni fortsätt här imorgon
// filteredData
// look more at how Karl structured stuff, reg routeData

module.exports = {
  createCourseWebContext,
}
