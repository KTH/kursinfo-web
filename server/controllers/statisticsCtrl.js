'use strict'

const log = require('@kth/log')
const languageUtils = require('@kth/kth-node-web-common/lib/language')
// const httpResponse = require('@kth/kth-node-response')
// const courseApi = require('../apiCalls/kursinfoAdmin')
const memoApi = require('../apiCalls/memoApi')
const koppsCourseData = require('../apiCalls/koppsCourseData')
const { parseOfferings } = require('../apiCalls/transformers/offerings')

// const ugRedisApi = require('../apiCalls/ugRedisApi')

const browserConfig = require('../configuration').browser
const serverConfig = require('../configuration').server
const paths = require('../server').getPaths()
// const api = require('../api')
const { getServerSideFunctions } = require('../utils/serverSideRendering')
const { createStatisticsServerSideContext } = require('../ssr-context/createStatisticsServerSideContext')

// const { fetchStatistic } = require('../statisticTransformer')

async function getIndex(req, res, next) {
  const lang = languageUtils.getLanguage(res) || 'sv'
  try {
    const { getCompressedData, renderStaticPage } = getServerSideFunctions()
    const webContext = { lang, proxyPrefixPath: serverConfig.proxyPrefixPath, ...createStatisticsServerSideContext() }
    webContext.setBrowserConfig(browserConfig, paths, serverConfig.hostUrl)
    webContext.setLanguage(lang)
    const compressedData = getCompressedData(webContext)

    const { uri: proxyPrefix } = serverConfig.proxyPrefixPath

    const view = renderStaticPage({
      applicationStore: {},
      location: req.url,
      basename: proxyPrefix,
      context: webContext,
    })
    res.render('course/index', {
      compressedData,
      instrumentationKey: serverConfig?.appInsights?.instrumentationKey,
      html: view,
      title: lang === 'sv' ? 'KTH kursinformationsstatistik' : 'KTH Course Information Statistics',
      lang,
      description: lang === 'sv' ? 'KTH kursinformationsstatistik' : 'KTH Course Information Statistics',
      paths: JSON.stringify(paths), // don't remove it, it's needed for handlebars
    })
  } catch (err) {
    const excludedStatusCodes = [403, 404]
    let statusCode
    if (err.response) {
      statusCode = err.response.status
    } else {
      statusCode = err.status || err.statusCode || 500
    }

    if (!excludedStatusCodes.includes(statusCode)) {
      if (err.code === 'ECONNABORTED' && err.config) {
        log.error(err.config.url, 'Timeout error')
      }
      log.error({ err }, 'Error in statisticsCtrl.js -> in getIndex')
    }
    next(err)
  }
}

async function fetchMemoStatistics(req, res, next) {
  const { params, query } = req
  const { year } = params
  const { seasons } = query
  const sortedSemesters = seasons.map(season => Number(`${year}${season}`)).sort()
  const [earliestSemester] = sortedSemesters
  try {
    log.info(` trying to fetch course memo statistics `, { params, query })
    // TODO: FETCH DATA FROM KOOPPS AND FROM KURS-PM/KURSANALYS API depending on document type
    const courses = await koppsCourseData.getCoursesAndOfferings(earliestSemester)
    // Object with one array, containing offerings’ relevant data for memo
    const parsedOfferings = parseOfferings(courses, sortedSemesters, 'courseMemo')
    // Semesters found in parsed offerings.
    const semestersInMemos = semestersInParsedOfferings(parsedOfferings)

    const memos = await memoApi.getCourseMemosForStatistics(year, seasons)
    // Course memos for semesters
    const courseMemoData = await _fetchCourseMemos(semestersInMemos)

    return res.json(memos)
  } catch (error) {
    log.debug(` Exception`, { error })
    next(error)
  }
}

async function fetchAnalysisStatistics(req, res, next) {
  const { params, query } = req

  try {
    log.info(` trying to fetch statistics `, { params, query })
    // TODO: FETCH DATA FROM KOOPPS AND FROM KURS-PM/KURSANALYS API depending on document type
    const apiResponse = { data: 'Hello, results arrived' } // await koppsApi.getSearchResults(searchParamsStr, lang)
    return res.json(apiResponse)
  } catch (error) {
    log.debug(` Exception`, { error })
    next(error)
  }
}

module.exports = {
  getIndex,
  fetchAnalysisStatistics,
  fetchMemoStatistics,
}
