'use strict'

const api = require('../api')
const co = require('co')
const log = require('kth-node-log')
const redis = require('kth-node-redis')
const language = require('kth-node-web-common/lib/language')
const { safeGet } = require('safe-utils')
const { createElement } = require('inferno-create-element')
const { renderToString } = require('inferno-server')
const { StaticRouter, BrowserRouter } = require('inferno-router')
const { toJS } = require('mobx')
const httpResponse = require('kth-node-response')

const sellingText = require('../apiCalls/sellingText')

const browserConfig = require('../configuration').browser
const serverConfig = require('../configuration').server
const paths = require('../server').getPaths()


let { appFactory, doAllAsyncBefore } = require('../../dist/js/server/app.js')


module.exports = {
  getIndex: getIndex,
  getSellingText: co.wrap(_getSellingText),
  getCourseEmployees: co.wrap(_getCourseEmployees)
}

//** TODO Function for SF1624.20182.9.teachers, SF1624.20182.9.courseresponsible, SF1624.examiner */


function * _getCourseEmployees(req, res) {
  let key = req.params.key
  const type = req.params.type
   key = key.replace(/_/g,'.')
   switch(type){
     //**************************************************************************************************************/
     //**** Retuns two lists with teachers and reponsibles for each course round. 
     //**** The keys are built up with: course code.year+semester.roundId (example: SF1624.20182.1)
     //**************************************************************************************************************/
     case "multi":
      try {
        const roundsKeys = JSON.parse(req.body.params)
        yield redis( "ugRedis", serverConfig.cache.ugRedis.redis)
          .then(function(ugClient) { 
            return ugClient.multi()
            .mget(roundsKeys.teachers)
            .mget(roundsKeys.responsibles)
            .execAsync()
          })
          .then(function(returnValue) {
           // console.log("ugRedis - multi -VALUE",returnValue)
            return httpResponse.json(res, returnValue)
          })
          .catch(function(err) {
            console.log("ugRedis - error:: ", err)
          })
      } catch (err) {
        log.error('Exception calling from ugRedis - multi', { error: err })
          return err
      }
    break;
    //*********************************************************/
    //**** Retuns a list with examiners. Key is course code ***/
    //*********************************************************/
    case "examiners":
    try {
      yield redis( "ugRedis", serverConfig.cache.ugRedis.redis)
        .then(function(ugClient) { 
          return ugClient.getAsync(key+".examiner")
        })
        .then(function(returnValue) {
          return httpResponse.json(res, returnValue)
        })
        .catch(function(err) {
          console.log("ugRedis - examiners error: ", err)
        })
    } catch (err) {
      log.error('Exception calling from ugRedis - examiners ', { error: err })
        return err
      }
    }    
  }
  

function * _getSellingText(req, res) {
  const courseCode = req.params.courseCode
   
  try {
    const apiResponse = yield sellingText.getSellingText(courseCode)
    //console.log("_getSellingText", apiResponse)

    if (apiResponse.statusCode === 404) {
      return httpResponse.json(res, apiResponse.body)
    }

    if (apiResponse.statusCode !== 200) {
      return httpResponse.jsonError(res, apiResponse.statusCode)
    }
    return httpResponse.json(res, apiResponse.body)
  } catch (err) {
    log.error('Exception calling from API ', { error: err })
    return err
  }
}



async function  getIndex (req, res, next) {
  if (process.env['NODE_ENV'] === 'development') {
    delete require.cache[require.resolve('../../dist/js/server/app.js')]
    const tmp = require('../../dist/js/server/app.js')
    appFactory = tmp.appFactory
    doAllAsyncBefore = tmp.doAllAsyncBefore
  }
  const courseCode = req.params.courseCode.toUpperCase()
  let lang = language.getLanguage(res) || 'sv'
  const ldapUser = req.session.authUser ? req.session.authUser.username : 'null'
  try {
    // Render inferno app
    const context = {}
    const renderProps = createElement(StaticRouter, {
      location: req.url,
      context
    }, appFactory())

  
    renderProps.props.children.props.routerStore.setBrowserConfig(browserConfig, paths, serverConfig.hostUrl)
    renderProps.props.children.props.routerStore.__SSR__setCookieHeader(req.headers.cookie)
    await renderProps.props.children.props.routerStore.getCourseInformation(courseCode, ldapUser, lang)
    await renderProps.props.children.props.routerStore.getCourseSellingText(courseCode, lang)
    await renderProps.props.children.props.routerStore.getCourseEmployeesPost(courseCode, 'multi') 
    await renderProps.props.children.props.routerStore.getCourseEmployees(courseCode, 'examiners')

    await doAllAsyncBefore({
      pathname: req.originalUrl,
      query: (req.originalUrl === undefined || req.originalUrl.indexOf('?') === -1) ? undefined : req.originalUrl.substring(req.originalUrl.indexOf('?'), req.originalUrl.length),
      routerStore: renderProps.props.children.props.routerStore,
      routes: renderProps.props.children.props.children.props.children.props.children
    })

    const html = renderToString(renderProps)

    res.render('course/index', {
      debug: 'debug' in req.query,
      html:html,
      title: courseCode.toUpperCase(),
      initialState: JSON.stringify(hydrateStores(renderProps))
      //data: resp.statusCode === 200 ? safeGet(() => { return resp.body.name }) : '',
      //error: resp.statusCode !== 200 ? safeGet(() => { return resp.body.message }) : ''
    })
  } catch (err) {
    log.error('Error in getIndex', { error: err })

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
