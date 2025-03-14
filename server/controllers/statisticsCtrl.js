'use strict'

const log = require('@kth/log')
const languageUtils = require('@kth/kth-node-web-common/lib/language')
const memoApi = require('../apiCalls/memoApi')
const koppsCourseData = require('../apiCalls/koppsCourseData')
const { filterOfferingsForMemos, semestersInParsedOfferings } = require('../apiCalls/transformers/offerings')

const { memosPerSchool } = require('../apiCalls/transformers/memos')

const browserConfig = require('../configuration').browser
const serverConfig = require('../configuration').server
const paths = require('../server').getPaths()
const { getServerSideFunctions } = require('../utils/serverSideRendering')
const { createStatisticsServerSideContext } = require('../ssr-context/createStatisticsServerSideContext')

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

async function _getCoursesPerSemester(semester) {
  // TODO: FETCH DATA FROM KOOPPS AND FROM KURS-PM/KURSANALYS API depending on document type
  const { body: courses } = await koppsCourseData.getCoursesAndOfferings(semester)
  // Object with one array, containing offerings’ relevant data for memo

  return courses
}

async function _getCourses(semesters) {
  const courses = []
  for await (const semester of semesters) {
    const courseOfferingsPerSemester = await _getCoursesPerSemester(semester)
    courses.push(...courseOfferingsPerSemester)
  }
  return courses
}

async function fetchMemoStatistics(req, res, next) {
  const { params, query } = req
  log.info(` trying to fetch course memo statistics `, { params, query })

  const { year } = params
  const { periods, seasons, school } = query
  if (!seasons) log.error('seasons must be set', seasons)
  if (!periods) log.error('periods must be set', periods)
  if (!school) log.error('school must be set', school)

  const chosenSemesters = seasons.map(season => `${year}${season}`).sort()
  const sortedPeriods = periods.sort()

  try {
    const courses = await _getCourses(chosenSemesters)

    const parsedOfferings = filterOfferingsForMemos(courses, chosenSemesters, sortedPeriods, school)

    // // Semesters found in parsed offerings. Not necessary, startSemesters is the same.
    const semestersInMemos = semestersInParsedOfferings(parsedOfferings)

    // Course memos for semesters
    const memos = await memoApi.getCourseMemosForStatistics(semestersInMemos)

    // Compiles statistics per school, including totals, for memos.
    const { offeringsWithMemos, combinedMemosPerSchool } = await memosPerSchool(parsedOfferings, memos)

    return res.json({
      combinedMemosPerSchool, // small table // in kursinfo-admin-web combinedMemosDataPerSchool,
      documentType: 'courseMemo',
      koppsApiBasePath: `${serverConfig.koppsApi.https ? 'https' : 'http'}://${serverConfig.koppsApi.host}${
        serverConfig.koppsApi.basePath
      }`,
      documentsApiBasePath: `${serverConfig.nodeApi.kursPmDataApi.https ? 'https' : 'http'}://${
        serverConfig.nodeApi.kursPmDataApi.host
      }${serverConfig.nodeApi.kursPmDataApi.proxyBasePath}`,
      school,
      offeringsWithMemos, // big Table // in kursinfo-admin-web  combinedDataPerDepartment,
      periods,
      seasons,
      semesters: chosenSemesters,
      semestersInMemos,
      totalOfferings: courses.length,
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
