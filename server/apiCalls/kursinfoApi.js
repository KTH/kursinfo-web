'use strict'

const log = require('@kth/log')
const api = require('../api')

async function _getCourseInfo(courseCode) {
  try {
    const { client, paths } = api.kursinfoApi
    const uri = client.resolve(paths.getCourseInfoByCourseCode.uri, { courseCode })
    const res = await client.getAsync({ uri }, { useCache: false })

    if (res.body) {
      const { sellingText, courseDisposition, supplementaryInfo, imageInfo } = res.body
      return { sellingText, courseDisposition, supplementaryInfo, imageInfo }
    }
    return { sellingText: {}, imageInfo: '', supplementaryInfo: {}, courseDisposition: {} }
  } catch (err) {
    log.error('Kursinfo-api is not available', err)
    return err
  }
}

module.exports = {
  getCourseInfo: _getCourseInfo,
}
