'use strict'

const api = require('../api')

module.exports = {
  getFileList: _getFileList
}

function _getFileList (courseCode) {
  const paths = api.kursPMApi.paths
  const client = api.kursPMApi.client
  const uri = client.resolve(paths.getCourseMemoListByCourseCode.uri, { courseCode: courseCode })
  return client.getAsync({uri: uri})
}

