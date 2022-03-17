'use strict'

const log = require('@kth/log')
const api = require('../api')

async function getPrioritizedCourseMemos(courseCode) {
  try {
    const { client, paths } = api.kursPmDataApi
    log.debug('Fetching info about course memos for course ', courseCode)

    const uri = client.resolve(paths.getPrioritizedWebOrPdfMemosByCourseCode.uri, {
      courseCode
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

module.exports = {
  getPrioritizedCourseMemos
}
