'use strict'

const api = require('../api')
const log = require('kth-node-log')

async function _getFileList(courseCode) {
  try {
    const { client, paths } = api.kursPmDataApi
    const uri = client.resolve(paths.getStoredMemoPdfListByCourseCode.uri, {
      courseCode
    })
    return client.getAsync({ uri, useCache: true })
  } catch (err) {
    log.error('_getFileList is trying to connect with kurs-pm-api and failed for courseCode: ', courseCode, { err })
  }
}

module.exports = {
  getFileList: _getFileList
}
