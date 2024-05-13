'use strict'

const log = require('@kth/log')
const languageUtils = require('@kth/kth-node-web-common/lib/language')
const memoApi = require('../apiCalls/memoApi')

const ugRestApi = require('../apiCalls/ugRestApi')

const serverConfig = require('../configuration').server
const api = require('../api')
const { createBreadcrumbs } = require('../utils/breadcrumbUtil')
const { getServerSideFunctions } = require('../utils/serverSideRendering')

const { INFORM_IF_IMPORTANT_INFO_IS_MISSING } = require('../util/constants')
const { getFilteredData: getFilteredData } = require('../apiCalls/filteredData')
const { createCourseWebContext } = require('../util/webContextUtil')

const extractUpperCaseCourseCodeOrThrow = req => {
  const { courseCode } = req.params
  if (!courseCode) throw new Error('Missing parameter courseCode')
  return courseCode.toUpperCase()
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

const checkIsMemoApiUp = () => {
  if (api.kursPmDataApi.connected && api.kursPmDataApi.connected === false) {
    return false
  }
  return true
}

const getMemoList = async courseCode => {
  /** //TODO-INTEGRATION: REMOVE ------- CHECK OF CONNECTION TO KURS-PM-API ------- */
  const isMemoApiUp = checkIsMemoApiUp()
  if (isMemoApiUp) {
    const memoApiResponse = await memoApi.getPrioritizedCourseMemos(courseCode)
    if (memoApiResponse && memoApiResponse.body) {
      return memoApiResponse.body
    }
  }
  return {}
}

const getUgRestApiResponse = async courseCode => {
  const apiMemoData = {
    courseCode,
    semester: '',
    applicationCodes: [],
  }
  // TODO Benni if UG answers with 500, this breaks our page
  const ugRestApiResponse = await ugRestApi.getCourseEmployees(apiMemoData)

  return ugRestApiResponse
}

const extractStartSemesterFromQuery = req => {
  const { startterm = '' } = req.query || {}
  const startSemesterFromQuery = startterm ? startterm.substring(0, 5) : ''
  return startSemesterFromQuery
}

const getLanguageOrDefault = res => languageUtils.getLanguage(res) || 'sv'

/* ****************************************************************************** */
/*                    COURSE PAGE SETTINGS AND RENDERING                          */
/* ****************************************************************************** */
async function getIndex(req, res, next) {
  const courseCode = extractUpperCaseCourseCodeOrThrow(req)
  const language = getLanguageOrDefault(res)

  const klaroAnalyticsConsentCookie = extractKlaroAnalyticsCookie(req)

  const { getCompressedData, renderStaticPage } = getServerSideFunctions()

  try {
    const startSemesterFromQuery = extractStartSemesterFromQuery(req)

    const memoList = await getMemoList(courseCode)

    const filteredData = await getFilteredData({ courseCode, language, memoList, startSemesterFromQuery })

    const ugRestApiResponse = await getUgRestApiResponse(courseCode)

    const examiners = ugRestApiResponse.examiners || INFORM_IF_IMPORTANT_INFO_IS_MISSING[language]

    const webContext = createCourseWebContext({
      courseCode,
      language,
      filteredData,
      examiners,
    })

    const compressedData = getCompressedData(webContext)

    const { uri: proxyPrefix } = serverConfig.proxyPrefixPath

    const view = renderStaticPage({
      applicationStore: {},
      location: req.url,
      basename: proxyPrefix,
      context: webContext,
    })

    const breadcrumbsList = createBreadcrumbs(language, courseCode)

    res.render('course/index', {
      compressedData,
      html: view,
      title: courseCode.toUpperCase(),
      lang: language,
      description:
        language === 'sv'
          ? 'KTH kursinformation för ' + courseCode.toUpperCase()
          : 'KTH course information ' + courseCode.toUpperCase(),
      klaroAnalyticsConsentCookie,
      toolbarUrl: serverConfig.toolbar.url,
      proxyPrefix,
      theme: 'student-web',
      breadcrumbsList,
    })
  } catch (err) {
    const errorCodesThatShouldNotBeLogged = [403, 404]
    let statusCode
    if (err.response) {
      statusCode = err.response.status
    } else {
      statusCode = err.status || err.statusCode || 500
    }

    if (!errorCodesThatShouldNotBeLogged.includes(statusCode)) {
      if (err.code === 'ECONNABORTED' && err.config) {
        log.error(err.config.url, 'Timeout error')
      }
      log.error({ err }, 'Error in getIndex')
    }

    next(err)
  }
}

module.exports = {
  getIndex,
}
