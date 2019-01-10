'use strict'

const api = require('../api')

module.exports = {
  getSellingText: getSellingText
}

function getSellingText (courseCode) {
  const paths = api.nodeApi.paths
  const client = api.nodeApi.client
  const uri = client.resolve(paths.getSellingTextByCourseCode.uri,{ courseCode: courseCode })
  return client.getAsync({uri: uri})
}
