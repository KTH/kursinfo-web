'use strict'

const log = require('@kth/log')
const api = require('../api')

async function getPrioritizedCourseMemos(courseCode) {
  try {
    const { client, paths } = api.kursPmDataApi
    log.debug('Fetching info about course memos for course ', courseCode)

    const uri = client.resolve(paths.getPrioritizedWebOrPdfMemosByCourseCode.uri, {
      courseCode,
    })
    return client.getAsync({ uri, useCache: true })
  } catch (err) {
    log.error(
      'getPrioritizedCourseMemos is trying to connect with kurs-pm-api and failed for courseCode: ',
      courseCode,
      { err }
    )
  }
}

/**
 * TODO: Write tests for this function!
 * TODO: Remove 'numberOfUniqPdfMemos' and 'numberOfUniqMemos'.
 * Fetch course memos for semester from '/api/kurs-pm-data/v1/webAndPdfPublishedMemosBySemester/'.
 * @param {string} semester Semester to get course analyses for
 * @returns {{}}            Course memos collected under course codes
 */
const getCourseMemosForStatistics = async (year, seasons) => {
  const { client, paths } = api.kursPmDataApi
  log.debug('Fetching info about course memos', { year, seasons })
  const queryString = '?' + new URLSearchParams(seasons).toString()

  const uri = client.resolve(paths.getPrioritizedWebOrPdfMemosBySemesters.uri, {
    year,
  })

  // const uri = `/api/kurs-pm-data/v1/webAndPdfPublishedMemosBySemester/${semester}`
  try {
    const { body } = await client.getAsync({ uri: `${uri}${queryString}` })

    log.debug('getCourseMemosForStatistics returns', body)
    return body
  } catch (err) {
    log.error(err)
    throw err
  }
}

module.exports = {
  getCourseMemosForStatistics,
  getPrioritizedCourseMemos,
}
