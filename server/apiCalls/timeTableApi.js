const log = require('@kth/log')
const { convertSemesterIntoStartEndDates } = require('../utils/semesterUtils')
const { extractOfferingsFromReservation } = require('../utils/extractOfferingsFromReservation')

const connections = require('@kth/api-call').Connections

const options = {
  log,
  https: true,
  timeout: 5000,
  retryOnESOCKETTIMEDOUT: true,
  useApiKey: false,
}

// https://api-r.referens.sys.kth.se/api/timetable/v1/

const config = {
  timeTableApi: {
    https: true,
    host: 'api-r.referens.sys.kth.se',
    basePath: '/api/timetable/v1/',
    defaultTimeout: 60000,
    doNotCallPathsEndpoint: true,
    connected: true,
  },
}

const api = connections.setup(config, config, options)

/**
 * TODO Benni
 * - put config into serverSettings an .env file
 * - calculate from/to for semester DONE
 * - figure out which reservations to look at DONE
 * - dont forget to experiment with redis
 */

// modules: ['module_p2_A1', 'module_p2_C2', 'module_p2_E1']

// Questions

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

    // const onlyReservationWithOfferings = body.map(({ offerings }) => ({
    //   offerings,
    // }))

    // const offeringsWithModules = body
    //   .filter(
    //     ({ offerings }) =>
    //       offerings && offerings.length > 0 && offerings.some(({ modules }) => modules && modules.length > 0)
    //   )
    //   .map(({ offerings }) => offerings)

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
