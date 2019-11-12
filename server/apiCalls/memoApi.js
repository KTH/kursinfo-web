'use strict'

const api = require('../api')

module.exports = {
  getFileList: _getFileList
}

function _getFileList (courseCode) {
  const { client, paths } = api.kursPMApi
  const uri = client.resolve(paths.getCourseMemoListByCourseCode.uri, { courseCode })
  return client.getAsync({uri: uri, useCache: true})
}

