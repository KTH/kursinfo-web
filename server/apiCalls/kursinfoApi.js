'use strict'

const log = require('@kth/log')
const api = require('../api')

async function _getCourseInfo(courseCode) {
  try {
    const { client, paths } = api.kursinfoApi
    const uri = client.resolve(paths.getCourseInfoByCourseCode.uri, { courseCode })
    const res = await client.getAsync({ uri }, { useCache: false })

    const defaultValues = {
      sellingText: { sv: '', en: '' },
      imageInfo: '',
      supplementaryInfo: { sv: '', en: '' },
      courseDisposition: { sv: '', en: '' },
    }

    if (res.statusCode === 200 && res.body) {
      const { body } = res
      return {
        sellingText: body.sellingText ?? defaultValues.sellingText,
        courseDisposition: body.courseDisposition ?? defaultValues.courseDisposition,
        supplementaryInfo: body.supplementaryInfo ?? defaultValues.supplementaryInfo,
        imageInfo: body.imageInfo ?? defaultValues.imageInfo,
      }
    }

    return defaultValues
  } catch (err) {
    log.error('Kursinfo-api is not available', err)
    return err
  }
}

module.exports = {
  getCourseInfo: _getCourseInfo,
}
