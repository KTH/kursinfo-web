'use strict'
const log = require('kth-node-log')
const config = require('../configuration').server
const BasicAPI = require('kth-node-api-call').BasicAPI
const redis = require('kth-node-redis')

const cacheConfig = {
  koppsApi: config.cache.koppsApi
}
const koppsApi = new BasicAPI({
  log,
  hostname: config.koppsApi.host,
  basePath: config.koppsApi.basePath,
  https: true,
  json: true,
  // Kopps is a public API and needs no API-key
  defaultTimeout: config.koppsApi.defaultTimeout,
  // retryOnESOCKETTIMEDOUT: true,
  timeout: 5000,
  redis,
  // {
  //   client: config.cache.koppsApi.redis,
  //   prefix: 'koppsApi',
  //   expire: config.cache.koppsApi.expireTime
  // },
  cache: cacheConfig
})

module.exports = {
  getKoppsCourseData: getKoppsCourseData
}

async function getKoppsCourseData (courseCode, lang = 'sv') {
  try {
    return await koppsApi.getAsync({uri: `course/${encodeURIComponent(courseCode)}/detailedinformation?l=${lang}`, useCache: true})
  } catch (err) {
    log.debug('Kopps is not available', err)
    return (err)
  }
}
