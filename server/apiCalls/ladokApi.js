'use strict'

const { createApiClient } = require('om-kursen-ladok-client')
const serverConfig = require('../configuration').server

async function getCourseAndActiveRounds(courseCode, language) {
  const client = createApiClient(serverConfig.ladokMellanlagerApi)
  const [course, rounds] = await Promise.all([
    client.getLatestCourseVersion(courseCode, language),
    client.getActiveCourseRounds(courseCode, language),
  ])
  return { course, rounds }
}

module.exports = {
  getCourseAndActiveRounds,
}
