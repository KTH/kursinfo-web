'use strict'

const { createApiClient } = require('om-kursen-ladok-client')
const { server: serverConfig } = require('../configuration')
// const serverConfig = require('../configuration').server
const client = createApiClient(serverConfig.ladokMellanlagerApi)

function formatExaminationTitles(examinationModules, lang) {
  const liStrs = examinationModules.map(
    m =>
      `<li>${m.examCode} - ${m.title}, ${m.credits} ${lang === 'sv' ? 'hp' : 'credits'}, ${lang === 'sv' ? 'Betygsskala' : 'Grading scale'}: ${m.gradeScaleCode}</li>`
  )
  const titles = examinationModules.map(
    m => `<h4>${m.examCode} - ${m.title}, ${m.credits} ${lang === 'sv' ? 'hp' : 'credits'}</h4>`
  )
  const formatted = { liStrs: liStrs.join(), titles: titles.join() }
  return formatted
}

async function getCourseAndActiveRounds(courseCode, language) {
  // const client = createApiClient(serverConfig.ladokMellanlagerApi)
  const [course, rounds] = await Promise.all([
    client.getLatestCourseVersion(courseCode, language),
    client.getActiveCourseRounds(courseCode, language),
  ])
  return { course, rounds }
}

async function getExaminationModules(instansUid, lang) {
  try {
    const examinationModules = await client.getModuler(instansUid)
    const formattedModules = formatExaminationTitles(examinationModules, lang)
    return formattedModules
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = {
  getCourseAndActiveRounds,
  getExaminationModules,
}
