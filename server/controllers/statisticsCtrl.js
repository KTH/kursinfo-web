'use strict'

const log = require('@kth/log')
const languageUtils = require('@kth/kth-node-web-common/lib/language')
const memoApi = require('../apiCalls/memoApi')
const ladokApi = require('../apiCalls/ladokApi')
const { filterOfferingsForMemos, semestersInParsedOfferings } = require('../apiCalls/transformers/offerings')

const { memosPerSchool } = require('../apiCalls/transformers/memos')

const browserConfig = require('../configuration').browser
const serverConfig = require('../configuration').server
const paths = require('../server').getPaths()
const { getServerSideFunctions } = require('../utils/serverSideRendering')
const { createStatisticsServerSideContext } = require('../ssr-context/createStatisticsServerSideContext')

// Add mapping function for school codes
function _mapSchoolCode(school) {
  const schoolMapping = {
    ABE: 'A',
    CBH: 'C',
    EES: 'J',
    ITM: 'I',
    SCI: 'S',
  }

  return schoolMapping[school] || school
}

async function getIndex(req, res, next) {
  const lang = languageUtils.getLanguage(res) || 'sv'
  try {
    const { getCompressedData, renderStaticPage } = getServerSideFunctions()
    const webContext = {
      lang,
      proxyPrefixPath: serverConfig.proxyPrefixPath,
      ...createStatisticsServerSideContext(),
    }
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
      html: view,
      title: lang === 'sv' ? 'KTH kursinformationsstatistik' : 'KTH Course Information Statistics',
      lang,
      description: lang === 'sv' ? 'KTH kursinformationsstatistik' : 'KTH Course Information Statistics',
      paths: JSON.stringify(paths), // don't remove it, it's needed for handlebars
      toolbarUrl: serverConfig.toolbar.url,
      proxyPrefix,
      theme: 'student-web',
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
        log.error(err.serverConfig.url, 'Timeout error')
      }
      log.error({ err }, 'Error in statisticsCtrl.js -> in getIndex')
    }
    next(err)
  }
}

async function _getCourseOfferings(startPeriod, organisation) {
  const startPeriods = startPeriod.join(',')

  return await ladokApi.getAllCourseRounds({ startPeriod: startPeriods, organisation }, 'en')
}

async function fetchMemoStatistics(req, res, next) {
  const { params, query } = req
  log.info(` trying to fetch course memo statistics `, { params, query })

  const { year } = params
  const { periods, seasons, school } = query
  if (!seasons) log.error('seasons must be set', seasons)
  if (!periods) log.error('periods must be set', periods)
  if (!school) log.error('school must be set', school)

  const chosenSemesters = seasons.map(season => `${season == 1 ? 'VT' : 'HT'}${year}`).sort()
  const chosenSemestersInDigits = seasons.map(season => `${year}${season}`).sort()

  const sortedPeriods = periods.sort()

  try {
    const mappedSchool = _mapSchoolCode(school)
    const courseOfferings = await _getCourseOfferings(chosenSemesters, mappedSchool)

    const parsedOfferings = filterOfferingsForMemos(courseOfferings, chosenSemestersInDigits, sortedPeriods, school)

    // // Semesters found in parsed offerings. Not necessary, startSemesters is the same.
    const semestersInMemos = semestersInParsedOfferings(parsedOfferings)

    // Course memos for semesters
    const memos = await memoApi.getCourseMemosForStatistics(semestersInMemos)

    // Compiles statistics per school, including totals, for memos.
    const { offeringsWithMemos, combinedMemosPerSchool } = await memosPerSchool(parsedOfferings, memos)

    return res.json({
      combinedMemosPerSchool, // small table // in kursinfo-admin-web combinedMemosDataPerSchool,
      documentType: 'courseMemo',
      ladokApiBasePath: serverConfig.ladokMellanlagerApi.baseUrl,
      documentsApiBasePath: `${serverConfig.nodeApi.kursPmDataApi.https ? 'https' : 'http'}://${
        serverConfig.nodeApi.kursPmDataApi.host
      }${serverConfig.nodeApi.kursPmDataApi.proxyBasePath}`,
      school,
      offeringsWithMemos, // big Table // in kursinfo-admin-web  combinedDataPerDepartment,
      periods,
      seasons,
      semesters: chosenSemesters,
      semestersInMemos,
      totalOfferings: courseOfferings.length,
      year,
    })
  } catch (error) {
    log.debug(` Exception`, { error })
    return next(error)
  }
}

module.exports = {
  getIndex,
  fetchMemoStatistics,
}
