const log = require('@kth/log')

const connections = require('@kth/api-call').Connections

const options = {
  log,
  https: true,
  timeout: 5000,
  retryOnESOCKETTIMEDOUT: true,
  useApiKey: false,
}

// TODO Benni, dont forget to experiment with redis

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
 * - calculate from/to for semester
 * - figure out which reservations to look at
 */

/**
 *
 * @param {string} courseCode for which to fetch reservations
 * @param {Number} semester for which to fetch reservations
 * @returns
 */
const getReservationsByCourseCodeAndSemester = async (courseCode, semester) => {
  const { client } = api.timeTableApi

  const uri = `${config.timeTableApi.basePath}reservations/search?course_list=${encodeURIComponent(courseCode)}&start=2024-01-01T00:00:00&end=2024-01-31T23:59:59`

  try {
    const result = await client.getAsync({ uri })

    return result
  } catch (error) {
    log.error(error)
    return error
  }
}

module.exports = {
  //   getPlannedModularSchedule,
  getReservationsByCourseCodeAndSemester,
}
