'use strict'

const co = require('co')
const log = require('kth-node-log')
const redis = require('kth-node-redis')
const language = require('kth-node-web-common/lib/language')
const ReactDOMServer = require('react-dom/server')
const { toJS } = require('mobx')
const httpResponse = require('kth-node-response')

const courseApi = require('../apiCalls/kursinfoAdmin')
const memoApi = require('../apiCalls/memoApi')
const koppsCourseData = require('../apiCalls/koppsCourseData')

const browserConfig = require('../configuration').browser
const serverConfig = require('../configuration').server
const paths = require('../server').getPaths()
const api = require('../api')

function _staticRender(context, location) {
  if (process.env.NODE_ENV === 'development') {
    delete require.cache[require.resolve('../../dist/app.js')]
  }
  const { staticRender } = require('../../dist/app.js')
  return staticRender(context, location)
}

// async function _getMemoFileList(req, res, next) {
//   const { courseCode } = req.params
//   log.debug('Get memo file list for: ', courseCode)

//   try {
//     const apiResponse = await memoApi.getFileList(courseCode)
//     log.debug('Got response from kurs-pm-api for: ', courseCode)

//     if (apiResponse.statusCode === 404) {
//       log.debug('404 response from kurs-pm-api for: ', courseCode)
//       return httpResponse.json(res, apiResponse.body)
//     }

//     if (apiResponse.statusCode !== 200) {
//       log.debug('NOK response from kurs-pm-api for: ', courseCode)
//       return httpResponse.jsonError(res, apiResponse.statusCode)
//     }
//     log.debug('OK response from kurs-pm-api for: ', courseCode)
//     return httpResponse.json(res, apiResponse.body)
//   } catch (err) {
//     next(err)
//   }
// }

// async function _getCourseEmployees(req, res, next) {
async function _getCourseEmployees(key, type, roundsKeys) {
  // let key = req.params.key
  // const type = req.params.type
  key = key.replace(/_/g, '.')
  switch (type) {
    //* *************************************************************************************************************/
    //* *** Retuns two lists with teachers and reponsibles for each course round.
    //* *** The keys are built up with: course code.year+semester.roundId (example: SF1624.20182.1)
    //* *************************************************************************************************************/
    case 'multi':
      try {
        // const roundsKeys = JSON.parse(req.body.params)
        log.debug('_getCourseEmployees with key: ' + roundsKeys)

        await redis('ugRedis', serverConfig.cache.ugRedis.redis)
          .then(function (ugClient) {
            return ugClient.multi().mget(roundsKeys.teachers).mget(roundsKeys.responsibles).execAsync()
          })
          .then(function (returnValue) {
            // return httpResponse.json(res, returnValue)
            return returnValue
          })
          .catch(function (err) {
            throw err
          })
      } catch (err) {
        // log.error('Exception calling from ugRedis - multi', { error: err })
        throw err
        // next(err)
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
        // log.error('Exception calling from ugRedis - examiners ', { error: err })
        throw err
        // next(err)
      }
  }
}

async function _getCourseEmployeesPost(roundsKeys, key, type = 'multi', lang = 'sv') {
  return _getCourseEmployees(key, type, roundsKeys)
  // return axios
  //   .post(
  //     this.buildApiUrl(this.paths.redis.ugCache.uri, { key: key, type: type }),
  //     this._getOptions(JSON.stringify(this.keyList))
  //   )
  //   .then((result) => {
}

// async function _getSellingText(req, res, next) {
//   const courseCode = req.params.courseCode
//   log.debug('Get selling text for', courseCode)

//   try {
//     const apiResponse = await courseApi.getSellingText(courseCode)
//     log.debug('Got response from kursinfo-api for', courseCode)

//     if (apiResponse.statusCode === 404) {
//       log.debug('404 response from kursinfo-api for: ', courseCode)
//       return httpResponse.json(res, apiResponse.body)
//     }

//     if (apiResponse.statusCode !== 200) {
//       log.debug('NOK response from kursinfo-api for: ', courseCode)
//       return httpResponse.jsonError(res, apiResponse.statusCode)
//     }
//     log.debug('OK response from kursinfo-api for: ', courseCode)
//     return httpResponse.json(res, apiResponse.body)
//   } catch (err) {
//     // log.error('Exception from kursinfo-api', { error: err })
//     next(err)
//   }
// }

async function _getKoppsCourseData(req, res, next) {
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
    // log.error('Exception from Kopps API', { error: err })
    return err
  }
}

function _getBreadcrumbs(courseData) {
  if (!courseData) {
    courseData = {}
    courseData.courseInfo = {}
  }
  return {
    url: `/student/kurser/org/${courseData.courseInfo.course_department_code}`,
    label: courseData.courseInfo.course_department
  }
}

//* ****************************************************************************** */
//                    COURSE PAGE SETTINGS AND RENDERING                          */
//* ****************************************************************************** */
async function getIndex(req, res, next) {
  /** //TODO-INTEGRATION: REMOVE ------- CHECK OF CONNECTION TO KURS-PM-API ------- */
  let memoApiUp = true
  if (api.kursPmDataApi.connected && api.kursPmDataApi.connected === false) {
    memoApiUp = false
  }

  const courseCode = req.params.courseCode.toUpperCase()

  const lang = language.getLanguage(res) || 'sv'
  log.debug('getIndex with course code: ' + courseCode)
  try {
    const context = {}
    const renderProps = _staticRender(context, req.url)
    const { routerStore } = renderProps.props.children.props

    routerStore.setBrowserConfig(browserConfig, paths, serverConfig.hostUrl)
    routerStore.__SSR__setCookieHeader(req.headers.cookie)

    routerStore.courseCode = courseCode

    const courseApiResponse = await courseApi.getSellingText(courseCode)
    if (courseApiResponse.body) {
      const { sellingText, imageInfo /*, isCourseWebLink */ } = courseApiResponse.body
      routerStore.sellingText = sellingText
      routerStore.imageFromAdmin = imageInfo || ''
      /* routerStore.showCourseWebbLink = isCourseWebLink */
    }

    //TODO-INTEGRATION: REMOVE
    if (memoApiUp) {
      const memoApiResponse = await memoApi.getFileList(courseCode)
      if (memoApiResponse.body) {
        routerStore.memoList = memoApiResponse.body
        /* routerStore.showCourseWebbLink = memoApiResponse.body.isCourseWebLink */
      } else {
        routerStore.memoApiHasConnection = false
      }
    } else {
      routerStore.memoApiHasConnection = false
    }

    // await renderProps.props.children.props.routerStore.getCourseInformation(courseCode, ldapUser, lang)
    // await renderProps.props.children.props.routerStore.getCourseAdminInfo(courseCode, lang)
    // await renderProps.props.children.props.routerStore.getCourseEmployeesPost(courseCode, 'multi')
    // await renderProps.props.children.props.routerStore.getCourseEmployees(courseCode, 'examiners')
    // const breadcrumDepartment = await renderProps.props.children.props.routerStore.getBreadcrumbs()
    // let breadcrumbs = [
    //   { url: '/student/kurser/kurser-inom-program', label: i18n.message('page_course_programme', lang) }
    // ]
    // breadcrumbs.push(breadcrumDepartment)

    const html = ReactDOMServer.renderToString(renderProps)

    res.render('course/index', {
      // breadcrumbsPath: breadcrumbs,
      debug: 'debug' in req.query,
      instrumentationKey: serverConfig.appInsights.instrumentationKey,
      html: html,
      title: courseCode.toUpperCase(),
      initialState: JSON.stringify(hydrateStores(renderProps)),
      lang: lang,
      description:
        lang === 'sv'
          ? 'KTH kursinformation för ' + courseCode.toUpperCase()
          : 'KTH course information ' + courseCode.toUpperCase()
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
        // log.error(err.config.url, 'Timeout error')
      }
      // log.error({ err: err }, 'Error in getIndex')
    }

    next(err)
  }
}

function hydrateStores(renderProps) {
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

module.exports = {
  getIndex,
  // getSellingText: co.wrap(_getSellingText),
  // getCourseEmployees: co.wrap(_getCourseEmployees),
  getKoppsCourseData: co.wrap(_getKoppsCourseData)
  // getMemoFileList: co.wrap(_getMemoFileList)
}
