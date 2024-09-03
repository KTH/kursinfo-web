'use strict'

const { createApiClient } = require('om-kursen-ladok-client')
const serverConfig = require('../configuration').server

async function getLadokCourseData(courseCode) {
  const client = createApiClient(serverConfig.ladokMellanlagerApi)
  const course = await client.getLatestCourseVersion(courseCode)
  return course
}

async function getActiveCourseRoundsByCourseCode(courseCode) {
  const client = createApiClient(serverConfig.ladokMellanlagerApi)
  const rounds = await client.getActiveCourseRounds(courseCode)
  return rounds
}

async function getCourseAndActiveRounds(courseCode) {
  const client = createApiClient(serverConfig.ladokMellanlagerApi)
  const [course, rounds] = await Promise.all([
    client.getLatestCourseVersion(courseCode),
    client.getActiveCourseRounds(courseCode),
  ])
  return { course, rounds }
}

module.exports = {
  getLadokCourseData,
  getActiveCourseRoundsByCourseCode,
  getCourseAndActiveRounds,
}
