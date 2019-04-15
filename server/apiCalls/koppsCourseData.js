'use strict'

const config = require('../configuration').server
const BasicAPI = require('kth-node-api-call').BasicAPI

const koppsApi = new BasicAPI({
  hostname: config.koppsApi.host,
  basePath: config.koppsApi.basePath,
  https: config.koppsApi.https,
  json: true,
  // Kopps is a public API and needs no API-key
  defaultTimeout: 10000 // config.koppsApi.defaultTimeout // TODO
})


module.exports = {
  getKoppsCourseData: getKoppsCourseData
}

function * getKoppsCourseData (courseCode, lang = 'sv') {

  try {
    return yield koppsApi.getAsync(`course/${encodeURIComponent(courseCode)}/detailedinformation?l=${lang}`)
  } catch (err) {
    console.log('Error in getKoppsCourseData:', err)
    return (err)
  }
}
