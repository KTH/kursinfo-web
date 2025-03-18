'use strict'

const { createApiClient } = require('@kth/om-kursen-ladok-client')

const serverConfig = require('../configuration').server

const client = createApiClient(serverConfig.ladokMellanlagerApi)

async function getCourseAndActiveRounds(courseCode, language) {
  const [course, rounds] = await Promise.all([
    client.getLatestCourseVersion(courseCode, language),
    client.getActiveCourseRounds(courseCode, language),
  ])
  return { course, rounds }
}

async function getExaminationModules(courseUid, language) {
  try {
    const examinationModules = await client.getExaminationModulesByUtbildningsinstansUid(courseUid, language)
    return examinationModules
  } catch (error) {
    throw new Error(error.message)
  }
}

async function getLadokSyllabus(courseCode, semester, lang) {
  try {
    const course = await client.getCourseSyllabus(courseCode, semester, lang)

    return course
  } catch (error) {
    throw new Error(error.message)
  }
}

async function getPeriods() {
  try {
    const periods = await client.getPeriods()

    return periods
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = {
  getCourseAndActiveRounds,
  getExaminationModules,
  getLadokSyllabus,
  getPeriods,
}
