'use strict'
const log = require('@kth/log')
const { createApiClient } = require('@kth/om-kursen-ladok-client')

const serverConfig = require('../configuration').server

const client = createApiClient(serverConfig.ladokMellanlagerApi)

async function getCourseAndRounds(courseCode, language) {
  try {
    const [course, rounds] = await Promise.all([
      client.getLatestCourseVersion(courseCode, language),
      client.getActiveAndFutureCourseRounds(courseCode, language),
    ])
    return { course, rounds }
  } catch (error) {
    log.error(error.message)
    return undefined
  }
}

async function getExaminationModules(courseUid, language) {
  try {
    const examinationModules = await client.getExaminationModulesByUtbildningsinstansUid(courseUid, language)
    return examinationModules
  } catch (error) {
    log.error(error.message)
    return undefined
  }
}

async function getLadokSyllabus(courseCode, semester, lang) {
  try {
    const course = await client.getCourseSyllabus(courseCode, semester, lang)

    return course
  } catch (error) {
    log.error(error.message)
    return undefined
  }
}

async function getPeriods() {
  try {
    const periods = await client.getPeriods()

    return periods
  } catch (error) {
    log.error(error.message)
    return undefined
  }
}

module.exports = {
  getCourseAndRounds,
  getExaminationModules,
  getLadokSyllabus,
  getPeriods,
}
