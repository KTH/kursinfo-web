'use strict'

const log = require('@kth/log')
const api = require('../api')

/**
 * Fetch course analyses for each semester in list of semesters.
 * @param {[]} semesters Array of semesters
 * @param {string} semesters[] Semester string, f.e., 20212
 */
const getCourseAnalysesForStatistics = async semesters => {
  if (!semesters || !semesters.length === 0) log.error('The list of semesters are missing', { semesters })
  const { client, paths } = api.kursutvecklingApi
  log.debug('Preparing params for course analyses api', { semesters })
  const queryString = '?' + new URLSearchParams({ semesters }).toString()

  const uri = `${client.resolve(paths.getCourseAnalysesForSemestersList.uri)}${queryString}`

  try {
    log.debug('Fetching course analyses from api', { uri, semesters })

    const { body } = await client.getAsync({ uri })

    log.debug('Successfull fetch from getCourseAnalysesForStatistics returns', { uri })
    return body
  } catch (err) {
    log.error(err)
    throw err
  }
}

module.exports = {
  getCourseAnalysesForStatistics,
}
