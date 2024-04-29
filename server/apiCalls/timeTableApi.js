const log = require('@kth/log')
const redis = require('kth-node-redis')
const connections = require('@kth/api-call').Connections

const { convertSemesterIntoStartEndDates } = require('../utils/semesterUtils')
const { extractOfferingsFromReservation } = require('../utils/extractOfferingsFromReservation')

const { server: config } = require('../configuration')

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
 * @returns
 */
const getOfferingsWithModules = async (courseCode, semester) => {
  const { client } = api.timeTableApi

  const { start, end } = convertSemesterIntoStartEndDates(semester)

  const uri = `${config.timeTableApi.basePath}reservations/search?course_list=${encodeURIComponent(courseCode)}&start=${start}&end=${end}`

  try {
    const result = await client.getAsync({ uri })

    const { body } = result

    const offeringsWithModules = extractOfferingsFromReservation(body)

    return offeringsWithModules
  } catch (error) {
    log.error(error)
    return error
  }
}

module.exports = {
  getOfferingsWithModules,
}
