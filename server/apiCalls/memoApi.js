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
    const { body, statusCode } = client.getAsync({ uri, useCache: true })

    if (statusCode !== 200) {
      return {
        apiError: true,
        statusCode,
        courseTitleData: {
          courseCode: courseCode.toUpperCase(),
        },
      }
    }

    return { apiError: false, memoList: body }
  } catch (err) {
    log.error(
      'getPrioritizedCourseMemos is trying to connect with kurs-pm-api and failed for courseCode: ',
      courseCode,
      { err }
    )
    return undefined
  }
}

/**
 * Fetch course memos for each semester in list of semesters.
 * @param {[]} semesters Array of semesters
 * @param {string} semesters[] Semester string, f.e., 20212
 */
const getCourseMemosForStatistics = async semesters => {
  if (!semesters || !semesters.length === 0) log.error('The list of semesters are missing', { semesters })
  const { client, paths } = api.kursPmDataApi
  log.debug('Preparing params for course memos api', { semesters })
  const queryString = '?' + new URLSearchParams({ semesters }).toString()

  const uri = `${client.resolve(paths.getPdfAndWebMemosListBySemesters.uri)}${queryString}`

  try {
    log.debug('Fetching course memos from api', { uri, semesters })

    const { body } = await client.getAsync({ uri })

    log.debug('Successfull fetch from kurs-pm-data-api, getCourseMemosForStatistics', { uri })
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
