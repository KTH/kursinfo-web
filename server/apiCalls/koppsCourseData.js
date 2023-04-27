'use strict'

const log = require('@kth/log')
const redis = require('kth-node-redis')
const connections = require('@kth/api-call').Connections
const i18n = require('../../i18n')
const { server: config } = require('../configuration')

const HTTP_CODE_404 = 404

const koppsOpts = {
  log,
  https: true,
  redis,
  cache: config.cache,
  timeout: 5000,
  defaultTimeout: config.koppsApi.defaultTimeout,
  retryOnESOCKETTIMEDOUT: true,
  useApiKey: false, // skip key
}

config.koppsApi.doNotCallPathsEndpoint = true // skip checking _paths, because kopps doesnt have it
config.koppsApi.connected = true

const koppsConfig = {
  koppsApi: config.koppsApi,
}

const api = connections.setup(koppsConfig, koppsConfig, koppsOpts)

function createInvalidCourseCodeError(lang) {
  const errorMessage = i18n.message('error_not_found', lang)
  const error = new Error(errorMessage)
  error.statusCode = HTTP_CODE_404
  return error
}

function callKoppsAndPossiblyHandle404(client, uri, lang) {
  return new Promise((resolve, reject) => {
    client
      .getAsync({ uri, useCache: true })
      .then(({ response }) => {
        if (response.statusCode === HTTP_CODE_404) {
          const error = createInvalidCourseCodeError(lang)
          reject(error)
        }
        resolve(response)
      })
      .catch(error => reject(error))
  })
}

async function getKoppsCourseData(courseCode, lang = 'sv') {
  const { client } = api.koppsApi
  const uri = `${config.koppsApi.basePath}course/${encodeURIComponent(courseCode)}/detailedinformation?l=${lang}`
  try {
    return callKoppsAndPossiblyHandle404(client, uri, lang, courseCode)
  } catch (err) {
    log.debug('Kopps is not available', err)
    return err
  }
}

// TODO: This will be removed. Because UG Rest Api is still using ladokRoundId. So once it get replaced by application code then this will be removed.
async function getLadokRoundIdsFromApplicationCodes(courseCode, semester, applicationCodes = []) {
  const { client } = api.koppsApi
  const uri = `${config.koppsApi.basePath}course/${encodeURIComponent(courseCode)}/courseroundterms`
  try {
    const { body } = await client.getAsync({ uri, useCache: true })
    const { termsWithCourseRounds } = body
    const selectedTerm = termsWithCourseRounds.find(t => t.term.toString() === semester.toString())
    const ladokRoundIds = []
    if (selectedTerm) {
      const { rounds = [] } = selectedTerm
      if (rounds.length > 0) {
        for (const { applicationCode = '', ladokRoundId = '' } of rounds) {
          const index = applicationCodes.findIndex(x => x.toString() === applicationCode.toString())
          if (index >= 0) {
            ladokRoundIds.push(ladokRoundId.toString())
            applicationCodes.splice(index, 0)
          }
          if (applicationCodes.length === 0) {
            break
          }
        }
      }
    }
    return ladokRoundIds
  } catch (err) {
    log.error('getKoppsCourseRoundTerms has an error:' + err)
    return err
  }
}

async function getCoursesAndOfferings(semester) {
  // ?? semester
  const { client } = api.koppsApi
  const uri = `${config.koppsApi.basePath}courses/offerings?from=${semester}&skip_coordinator_info=true`
  try {
    return await client.getAsync({ uri, useCache: true })
  } catch (err) {
    log.debug('Kopps is not available', err)
    return err
  }
}

module.exports = {
  koppsApi: api,
  getCoursesAndOfferings,
  getKoppsCourseData,
  getLadokRoundIdsFromApplicationCodes,
}
