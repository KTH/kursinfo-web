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
const { getFilteredData } = require('../apiCalls/getFilteredData')
const { createCourseWebContext } = require('../util/webContextUtil')
const { HttpError } = require('../HttpError')
const { calculateInitiallySelectedSemester, isValidCourseCode } = require('./courseCtrlHelpers')

const extractUpperCaseCourseCodeOrThrow = req => {
  const { courseCode } = req.params
  if (!courseCode) throw new HttpError(400, 'Missing parameter courseCode')
  if (!isValidCourseCode(courseCode)) throw new HttpError(400, `Invalid course code: ${courseCode}`)
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

const getExaminersForCourseCode = async courseCode => {
  try {
    const ugRestApiResponse = await ugRestApi.getCourseEmployees({
      courseCode,
      semester: '',
      applicationCodes: [],
    })

    return ugRestApiResponse.examiners
  } catch (error) {
    // Error is already logged further down. Here we just want to make sure our page still renders.
    return ''
  }
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
  try {
    const courseCode = extractUpperCaseCourseCodeOrThrow(req)
    const language = getLanguageOrDefault(res)

    const klaroAnalyticsConsentCookie = extractKlaroAnalyticsCookie(req)

    const { getCompressedData, renderStaticPage } = getServerSideFunctions()

    const startSemesterFromQuery = extractStartSemesterFromQuery(req)

    const memoList = await getMemoList(courseCode)

    const filteredData = await getFilteredData({ courseCode, language, memoList, startSemesterFromQuery })

    const initiallySelectedSemester = calculateInitiallySelectedSemester(
      filteredData.activeSemesters,
      startSemesterFromQuery
    )

    const possibleExaminers = await getExaminersForCourseCode(courseCode)

    const examiners = possibleExaminers || INFORM_IF_IMPORTANT_INFO_IS_MISSING[language]

    const webContext = createCourseWebContext({
      courseCode,
      language,
      filteredData,
      examiners,
      initiallySelectedSemester,
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
    const errorCodesThatShouldNotBeLogged = [400, 403, 404]
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
