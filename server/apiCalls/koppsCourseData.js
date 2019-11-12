'use strict'
const log = require('kth-node-log')
const config = require('../configuration').server
const BasicAPI = require('kth-node-api-call').BasicAPI

const koppsApi = new BasicAPI({
  hostname: config.koppsApi.host,
  basePath: config.koppsApi.basePath,
  https: true,
  json: true,
  // Kopps is a public API and needs no API-key
  defaultTimeout: config.koppsApi.defaultTimeout,
  retryOnESOCKETTIMEDOUT: true,
  redis: {
    client: config.cache.koppsApi.redis,
    prefix: 'koppsApi',
    expire: config.cache.koppsApi.expireTime
  }
})

module.exports = {
  getKoppsCourseData: getKoppsCourseData
}

async function getKoppsCourseData (courseCode, lang = 'sv') {
  try {
    return await koppsApi.getAsync({uri: `course/${encodeURIComponent(courseCode)}/detailedinformation?l=${lang}`, useCache: true})
  } catch (err) {
    log.debug('Kopps is not available')
    throw err
  }
}
