'use strict'

const api = require('../api')

async function _getFileList(courseCode) {
  const { client, paths } = api.kursPmDataApi
  const uri = client.resolve(paths.getStoredMemoPdfListByCourseCode.uri, {
    courseCode
  })
  return client.getAsync({ uri, useCache: true })
}

module.exports = {
  getFileList: _getFileList
}
