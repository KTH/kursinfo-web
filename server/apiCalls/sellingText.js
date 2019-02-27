'use strict'

const api = require('../api')

module.exports = {
  getSellingText: getSellingText,
  setImage: setImage
}

function getSellingText (courseCode) {
  const paths = api.kursinfoApi.paths
  const client = api.kursinfoApi.client
  const uri = client.resolve(paths.getSellingTextByCourseCode.uri,{ courseCode: courseCode })
  return client.getAsync({uri: uri})
}

async function setImage (sendObject, courseCode) {
  const paths = api.kursinfoApi.paths
  const client = api.kursinfoApi.client
  const uri = client.resolve(paths.postImageInfo.uri,{courseCode: courseCode})
  return await client.postAsync({uri: uri, body: sendObject})
}
