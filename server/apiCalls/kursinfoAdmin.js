'use strict'

const api = require('../api')

module.exports = {
  getSellingText: getSellingText
}

async function getSellingText (courseCode) {
  const { client, paths } = api.kursinfoApiCached
  const uri = client.resolve(paths.getSellingTextByCourseCode.uri, { courseCode })
  return await client.getAsync({uri: uri})
}

/* async function setImage (sendObject, courseCode) {
  const paths = api.kursinfoApi.paths
  const client = api.kursinfoApi.client
  const uri = client.resolve(paths.postImageInfo.uri, {courseCode: courseCode})
  return await client.postAsync({uri: uri, body: sendObject})
} */
