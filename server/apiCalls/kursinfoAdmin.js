'use strict'

const api = require('../api')
const config = require('../configuration').server

module.exports = {
  getSellingText: getSellingText
}

async function getSellingText (courseCode) {
  const { client } = api.kursinfoApi
  const uri = `${config.nodeApi.kursinfoApi.proxyBasePath}/v1/sellingInfo/${encodeURIComponent(courseCode)}`
  // client.resolve(paths.getSellingTextByCourseCode.uri, { courseCode })
  return await client.getAsync({uri: uri, useCache: true})
}
