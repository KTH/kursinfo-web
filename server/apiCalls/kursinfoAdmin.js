'use strict'

const api = require('../api')

module.exports = {
  getSellingText: _getSellingText
}

async function _getSellingText(courseCode) {
  try {
    const { client, paths } = api.kursinfoApi
    const uri = client.resolve(paths.getSellingTextByCourseCode.uri, { courseCode })
    return await client.getAsync({ uri: uri, useCache: true })
  } catch (err) {
    log.debug('Kursinfo-api is not available', err)
    return err
  }
}
