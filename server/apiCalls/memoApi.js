'use strict'

const api = require('../api')

module.exports = {
  getFileList: _getFileList
}

async function _getFileList (courseCode) {
  const { client, paths } = api.kursPMApi
  const uri = client.resolve(paths.getCourseMemoListByCourseCode.uri, { courseCode })
  return await client.getAsync({uri, useCache: true})
}

