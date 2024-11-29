'use strict'

const { createApiClient } = require('om-kursen-ladok-client')
const { server: serverConfig } = require('../configuration')
// const serverConfig = require('../configuration').server
const client = createApiClient(serverConfig.ladokMellanlagerApi)

async function getCourseAndActiveRounds(courseCode, language) {
  // const client = createApiClient(serverConfig.ladokMellanlagerApi)
  const [course, rounds] = await Promise.all([
    client.getLatestCourseVersion(courseCode, language),
    client.getActiveCourseRounds(courseCode, language),
  ])
  return { course, rounds }
}

async function getExaminationModules(utbildningstillfalleUid, language) {
  try {
    const examinationModules = await client.getExaminationModulesByUtbildningstillfalleUid(
      utbildningstillfalleUid,
      language
    )
    return examinationModules
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = {
  getCourseAndActiveRounds,
  getExaminationModules,
}
