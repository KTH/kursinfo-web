'use strict'

const language = require('@kth/kth-node-web-common/lib/language')
const api = require('../api')
const memoApi = require('../apiCalls/memoApi')
const { createCourseWebContext } = require('../utils/webContextUtil')
const koppsCourseData = require('../apiCalls/koppsCourseData')
const courseApi = require('../apiCalls/kursinfoApi')
const ugRestApi = require('../apiCalls/ugRestApi')

const extractCourseCodeOrThrow = req => {
  const { courseCode } = req.params
  if (!courseCode) throw new Error('Missing parameter courseCode')
  return courseCode
}

const extractKlaroAnalyticsCookie = req => {
  if (req.cookies.klaro) {
    const consentCookiesArray = req.cookies.klaro.slice(1, -1).split(',')
    // eslint-disable-next-line prefer-destructuring
    const analyticsConsentCookieString = consentCookiesArray
      .find(cookie => cookie.includes('analytics-consent'))
      .split(':')[1]
    // eslint-disable-next-line no-const-assign

    return analyticsConsentCookieString === 'true'
  }
  return false
}

const getIndex = async (req, res, next) => {
  /** //TODO-INTEGRATION: REMOVE ------- CHECK OF CONNECTION TO KURS-PM-API ------- */
  let memoApiUp = true
  if (api.kursPmDataApi.connected && api.kursPmDataApi.connected === false) {
    memoApiUp = false
  }
  const klaroAnalyticsConsentCookie = extractKlaroAnalyticsCookie(req)

  try {
    const courseCode = extractCourseCodeOrThrow(req)
    const lang = language.getLanguage(res)

    const { startterm = '', periods = '' } = req.query || {}

    const startSemesterFromQuery = startterm ? startterm.substring(0, 5) : ''

    let memoList = []
    if (memoApiUp) {
      const memoApiResponse = await memoApi.getPrioritizedCourseMemos(courseCode)
      if (!memoApiResponse.apiError && memoApiResponse.memoList) {
        memoList = memoApiResponse.body
      }
    }

    const koppsData = await koppsCourseData.getFilteredKoppsCourseData(courseCode, language)

    const courseInfoApiData = await courseApi.getCourseInfo(courseCode)

    createCourseWebContext({
      language: lang,
      periods,
      memoList,
      koppsData,
      courseInfoApiData,
      startSemesterFromQuery,
    })
  } catch (error) {}
}
