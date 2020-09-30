'use strict'

const co = require('co')
const log = require('kth-node-log')
const redis = require('kth-node-redis')
const language = require('kth-node-web-common/lib/language')
// const { safeGet } = require('safe-utils')
const { createElement } = require('inferno-create-element')
const { renderToString } = require('inferno-server')
const { StaticRouter } = require('inferno-router')
const { toJS } = require('mobx')
const httpResponse = require('kth-node-response')
const i18n = require('../../i18n')

const courseApi = require('../apiCalls/kursinfoAdmin')
const memoApi = require('../apiCalls/memoApi')
const koppsCourseData = require('../apiCalls/koppsCourseData')

const browserConfig = require('../configuration').browser
const serverConfig = require('../configuration').server
const paths = require('../server').getPaths()
const api = require('../api')
let { appFactory, doAllAsyncBefore } = require('../../dist/js/server/app.js')

module.exports = {
  getIndex: getIndex,
  getSellingText: co.wrap(_getSellingText),
  getCourseEmployees: co.wrap(_getCourseEmployees),
  getKoppsCourseData: co.wrap(_getKoppsCourseData),
  getMemoFileList: co.wrap(_getMemoFileList)
}

async function _getMemoFileList (req, res, next) {
  const courseCode = req.params.courseCode
  log.debug('Get memo file list for: ', courseCode)

  try {
    const apiResponse = await memoApi.getFileList(courseCode)
    log.debug('Got response from kurs-pm-api for: ', courseCode)

    if (apiResponse.statusCode === 404) {
      log.debug('404 response from kurs-pm-api for: ', courseCode)
      return httpResponse.json(res, apiResponse.body)
    }

    if (apiResponse.statusCode !== 200) {
      log.debug('NOK response from kurs-pm-api for: ', courseCode)
      return httpResponse.jsonError(res, apiResponse.statusCode)
    }
    log.debug('OK response from kurs-pm-api for: ', courseCode)
    return httpResponse.json(res, apiResponse.body)
  } catch (err) {
    log.error('Exception from kurs-pm-api', { error: err })
    next(err)
  }
}

async function _getCourseEmployees (req, res, next) {
  let key = req.params.key
  const type = req.params.type
  key = key.replace(/_/g, '.')
  switch (type) {
     //* *************************************************************************************************************/
     //* *** Retuns two lists with teachers and reponsibles for each course round.
     //* *** The keys are built up with: course code.year+semester.roundId (example: SF1624.20182.1)
     //* *************************************************************************************************************/
    case 'multi':
      try {
        const roundsKeys = JSON.parse(req.body.params)
        log.debug('_getCourseEmployees with key: ' + roundsKeys)

        await redis('ugRedis', serverConfig.cache.ugRedis.redis)
          .then(function (ugClient) {
            return ugClient.multi()
            .mget(roundsKeys.teachers)
            .mget(roundsKeys.responsibles)
            .execAsync()
          })
          .then(function (returnValue) {
            return httpResponse.json(res, returnValue)
          })
          .catch(function (err) {
            throw err
          })
      } catch (err) {
        log.error('Exception calling from ugRedis - multi', { error: err })
        next(err)
      }
      break
    //* ********************************************************/
    //* *** Retuns a list with examiners. Key is course code ***/
    //* ********************************************************/
    case 'examiners':
      try {
        await redis('ugRedis', serverConfig.cache.ugRedis.redis)
        .then(function (ugClient) {
          return ugClient.getAsync(key + '.examiner')
        })
        .then(function (returnValue) {
          return httpResponse.json(res, returnValue)
        })
        .catch(function (err) {
          throw err
        })
      } catch (err) {
        log.error('Exception calling from ugRedis - examiners ', { error: err })
        next(err)
      }
  }
}

async function _getSellingText (req, res, next) {
  const courseCode = req.params.courseCode
  log.debug('Get selling text for', courseCode)

  try {
    const apiResponse = await courseApi.getSellingText(courseCode)
    log.debug('Got response from kursinfo-api for', courseCode)

    if (apiResponse.statusCode === 404) {
      log.debug('404 response from kursinfo-api for: ', courseCode)
      return httpResponse.json(res, apiResponse.body)
    }

    if (apiResponse.statusCode !== 200) {
      log.debug('NOK response from kursinfo-api for: ', courseCode)
      return httpResponse.jsonError(res, apiResponse.statusCode)
    }
    log.debug('OK response from kursinfo-api for: ', courseCode)
    return httpResponse.json(res, apiResponse.body)
  } catch (err) {
    log.error('Exception from kursinfo-api', { error: err })
    next(err)
  }
}

async function _getKoppsCourseData (req, res, next) {
  const courseCode = req.params.courseCode
  const language = req.params.language || 'sv'
  log.debug('Get Kopps course data for: ', courseCode, language)
  try {
    const apiResponse = await koppsCourseData.getKoppsCourseData(courseCode, language)
    log.debug('Got response from Kopps API for: ', courseCode, language)
    if (apiResponse.statusCode && apiResponse.statusCode === 200) {
      log.debug('OK response from Kopps API for: ', courseCode, language)
      return httpResponse.json(res, apiResponse.body)
    } else {
      log.debug('NOK response from Kopps API for: ', courseCode, language)
      const statusCode = apiResponse.statusCode ? apiResponse.statusCode : 500
      res.status(statusCode)
      res.statusCode = statusCode
      res.send(courseCode)
    }
  } catch (err) {
    log.error('Exception from Kopps API', { error: err })
    return (err)
  }
}

//* ****************************************************************************** */
//                    COURSE PAGE SETTINGS AND RENDERING                          */
//* ****************************************************************************** */
async function getIndex (req, res, next) {
  if (process.env['NODE_ENV'] === 'development') {
    delete require.cache[require.resolve('../../dist/js/server/app.js')]
    const tmp = require('../../dist/js/server/app.js')
    appFactory = tmp.appFactory
    doAllAsyncBefore = tmp.doAllAsyncBefore
  }
  /** //TODO-INTEGRATION: REMOVE ------- CHECK OF CONNECTION TO KURS-PM-API ------- */
  let memoApiUp = true
  if (api.kursPmDataApi.connected && api.kursPmDataApi.connected === false) {
    memoApiUp = false
  }

  const courseCode = req.params.courseCode.toUpperCase()

  let lang = language.getLanguage(res) || 'sv'
  const ldapUser = req.session.authUser ? req.session.authUser.username : 'null'
  log.debug('getIndex with course code: ' + courseCode)
  try {
    // Render inferno app
    const context = {}
    const renderProps = createElement(StaticRouter, {
      location: req.url,
      context
    }, appFactory())

    renderProps.props.children.props.routerStore.setBrowserConfig(browserConfig, paths, serverConfig.hostUrl)
    renderProps.props.children.props.routerStore.__SSR__setCookieHeader(req.headers.cookie)
    try { //TODO-INTEGRATION: REMOVE
      if (memoApiUp) {
        await renderProps.props.children.props.routerStore.getCourseMemoFiles(courseCode)
      } else {
        renderProps.props.children.props.routerStore.memoApiHasConnection = false
      }
    } catch (error) {
      if (error) {
        renderProps.props.children.props.routerStore.memoApiHasConnection = false
      }
    }
    await renderProps.props.children.props.routerStore.getCourseInformation(courseCode, ldapUser, lang)
    await renderProps.props.children.props.routerStore.getCourseAdminInfo(courseCode, lang)
    await renderProps.props.children.props.routerStore.getCourseEmployeesPost(courseCode, 'multi')
    await renderProps.props.children.props.routerStore.getCourseEmployees(courseCode, 'examiners')
    // const breadcrumDepartment = await renderProps.props.children.props.routerStore.getBreadcrumbs()
    // let breadcrumbs = [
    //   { url: '/student/kurser/kurser-inom-program', label: i18n.message('page_course_programme', lang) }
    // ]
    // breadcrumbs.push(breadcrumDepartment)

    await doAllAsyncBefore({
      pathname: req.originalUrl,
      query: (req.originalUrl === undefined || req.originalUrl.indexOf('?') === -1) ? undefined : req.originalUrl.substring(req.originalUrl.indexOf('?'), req.originalUrl.length),
      routerStore: renderProps.props.children.props.routerStore,
      routes: renderProps.props.children.props.children.props.children.props.children
    })
    const html = renderToString(renderProps)

    res.render('course/index', {
      // breadcrumbsPath: breadcrumbs,
      debug: 'debug' in req.query,
      instrumentationKey: serverConfig.appInsights.instrumentationKey,
      html: html,
      title: courseCode.toUpperCase(),
      initialState: JSON.stringify(hydrateStores(renderProps)),
      lang: lang,
      description: lang === 'sv' ? 'KTH kursinformation för ' + courseCode.toUpperCase() : 'KTH course information ' + courseCode.toUpperCase()
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
      log.error({ err: err }, 'Error in getIndex')
    }

    next(err)
  }
}

function hydrateStores (renderProps) {
  // This assumes that all stores are specified in a root element called Provider

  const props = renderProps.props.children.props
  const outp = {}
  for (let key in props) {
    if (typeof props[key].initializeStore === 'function') {
      outp[key] = encodeURIComponent(JSON.stringify(toJS(props[key], true)))
    }
  }
  return outp
}
