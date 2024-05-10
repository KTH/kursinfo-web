const log = require('@kth/log')
const redis = require('kth-node-redis')
const connections = require('@kth/api-call').Connections

const { server: config } = require('../../configuration')
const { callApiAndPossiblyHandle404 } = require('../errorUtils')
const { extractOfferingsFromReservation } = require('./utils/extractOfferingsFromReservation')
const { convertSemesterIntoStartEndDates } = require('./utils/timeTableDateUtils')

const options = {
  log,
  https: true,
  redis,
  timeout: 5000,
  retryOnESOCKETTIMEDOUT: true,
  useApiKey: false,
}

config.timeTableApi.doNotCallPathsEndpoint = true
config.timeTableApi.connected = true

const timeTableConfig = {
  timeTableApi: config.timeTableApi,
}

const api = connections.setup(timeTableConfig, timeTableConfig, options)

/**
 *
 * @param {string} courseCode for which to fetch reservations
 * @param {Number} semester for which to fetch reservations
 * @param {string} lang 2-letter language code
 * @returns
 */
const getOfferingsWithModules = async (courseCode, semester) => {
  const { client } = api.timeTableApi

  const { start, end } = convertSemesterIntoStartEndDates(semester)

  const uri = `${config.timeTableApi.basePath}reservations/search?course_list=${encodeURIComponent(courseCode)}&start=${start}&end=${end}`

  try {
    const result = await callApiAndPossiblyHandle404({ client, uri })

    const { body } = result

    const offeringsWithModules = extractOfferingsFromReservation(body)

    return offeringsWithModules
  } catch (error) {
    log.error(error)
    throw error
  }
}

module.exports = {
  getOfferingsWithModules,
}
