'use strict'

const { createApiClient } = require('om-kursen-ladok-client')
const serverConfig = require('../configuration').server

function getLadokCourseData(courseCode) {
  const client = createApiClient(serverConfig.ladokMellanlagerApi)
  const course = client.getLatestCourseVersion(courseCode)
  return course
}

module.exports = {
  getLadokCourseData,
}
