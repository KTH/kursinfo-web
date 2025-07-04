/* eslint-disable import/order */
const server = require('@kth/server')

// Now read the server config etc.
const config = require('./configuration').server
require('./api')
const AppRouter = require('kth-node-express-routing').PageRouter
const { getPaths } = require('kth-node-express-routing')
const { cortinaMiddleware } = require('@kth/cortina-block')

// Expose the server and paths
server.locals.secret = new Map()
module.exports = server
module.exports.getPaths = () => getPaths()

/* ***********************
 * ******* LOGGING *******
 * ***********************
 */
const log = require('@kth/log')
const packageFile = require('../package.json')

const logConfiguration = {
  name: packageFile.name,
  app: packageFile.name,
  env: process.env.NODE_ENV,
  level: config.logging.log.level,
  console: config.logging.console,
  stdout: config.logging.stdout,
  src: config.logging.src,
}

log.init(logConfiguration)

/* **************************
 * ******* TEMPLATING *******
 * **************************
 */
const exphbs = require('express-handlebars')
const path = require('path')

server.set('views', path.join(__dirname, '/views'))
server.set('layouts', path.join(__dirname, '/views/layouts'))
server.set('partials', path.join(__dirname, '/views/partials'))
server.engine(
  'handlebars',
  exphbs.engine({
    defaultLayout: 'publicLayout',
    layoutsDir: server.settings.layouts,
    partialsDir: server.settings.partials,
  })
)
server.set('view engine', 'handlebars')
// Register handlebar helpers
require('./views/helpers')

/* ******************************
 * ******* ACCESS LOGGING *******
 * ******************************
 */
const accessLog = require('kth-node-access-log')

server.use(accessLog(config.logging.accessLog))

/* ****************************
 * ******* STATIC FILES *******
 * ****************************
 */
const browserConfig = require('./configuration').browser
const browserConfigHandler = require('kth-node-configuration').getHandler(browserConfig, getPaths())
const express = require('express')

// Files/statics routes--
// Map components HTML files as static content, but set custom cache control header, currently no-cache to force If-modified-since/Etag check.
// server.use(
//   config.proxyPrefixPath.uri + '/static/js/components',
//   express.static('./dist/js/components', { setHeaders: setCustomCacheControl })
// )
// Expose browser configurations
server.use(config.proxyPrefixPath.uri + '/static/browserConfig', browserConfigHandler)
// Map Bootstrap.
// server.use(config.proxyPrefixPath.uri + '/static/bootstrap', express.static('./node_modules/bootstrap/dist'))
// Map kth-style.
server.use(config.proxyPrefixPath.uri + '/static/kth-style', express.static('./node_modules/kth-style/dist'))
server.use(config.proxyPrefixPath.uri + '/assets', express.static('./node_modules/@kth/style/assets'))

// server.use(config.proxyPrefixPath.uri + '/static/js/app.js', express.static('./dist/js/app.js'))
// Map static content like images, css and js.
server.use(config.proxyPrefixPath.uri + '/static', express.static('./dist'))
server.use(config.proxyPrefixPath.uri + '/static/icon/favicon', express.static('./public/favicon.ico'))

// Return 404 if static file isn't found so we don't go through the rest of the pipeline
server.use(config.proxyPrefixPath.uri + '/static', (req, res, next) => {
  const error = new Error('File not found: ' + req.originalUrl)
  error.statusCode = 404
  next(error)
})

// QUESTION: Should this really be set here?
// http://expressjs.com/en/api.html#app.set
server.set('case sensitive routing', true)

/* *******************************
 * ******* REQUEST PARSING *******
 * *******************************
 */
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
server.use(cookieParser())

/* ***********************
 * ******* SESSION *******
 * ***********************
 */
const session = require('@kth/session')

const options = config.session
options.sessionOptions.secret = config.sessionSecret
server.use(session(options))

/* ************************
 * ******* LANGUAGE *******
 * ************************
 */
const { languageHandler } = require('@kth/kth-node-web-common/lib/language')

server.use(config.proxyPrefixPath.uri, languageHandler)

/* ******************************
 * ******* CORTINA BLOCKS *******
 * ******************************
 */
server.use(
  config.proxyPrefixPath.uri,
  cortinaMiddleware({
    blockApiUrl: config.blockApi.blockUrl,
    redisConfig: config.cache.cortinaBlock.redis,
    blocksConfig: config.blockApi.addBlocks,
    redisKey: config.cache.cortinaBlock.redisKey,
  })
)

/* ********************************
 * ******* CRAWLER REDIRECT *******
 * ********************************
 */
const excludePath = config.proxyPrefixPath.uri + '(?!/static).*'
const excludeExpression = new RegExp(excludePath)
server.use(
  excludeExpression,
  require('@kth/kth-node-web-common/lib/web/crawlerRedirect')({
    hostUrl: config.hostUrl,
  })
)

/* ********************************
 * ******* No index middleware ****
 * ********************************
 */
server.use(require('./utils/noIndexMiddleware.js'))

/* **********************************
 * ******* APPLICATION ROUTES *******
 * **********************************
 */
const { System, Course, noCourse, StatisticsCtrl, TimeTableApi, Employees } = require('./controllers')
const { SyllabusPdf } = require('./middleware')

// System routes
const systemRoute = AppRouter()
systemRoute.get('system.monitor', config.proxyPrefixPath.uri + '/_monitor', System.monitor)
systemRoute.get('system.about', config.proxyPrefixPath.uri + '/_about', System.about)
systemRoute.get('system.paths', config.proxyPrefixPath.uri + '/_paths', System.paths)
systemRoute.get('system.robots', '/robots.txt', System.robotsTxt)
server.use('/', systemRoute.getRouter())

// App routes
const appRoute = AppRouter()
appRoute.get('statistics.getData', config.proxyPrefixPath.uri + '/statistik', StatisticsCtrl.getIndex)
// appRoute.get(
//   'api.statistics',
//   config.proxyPrefixPath.uri + '/api/kursinfo/statistics/:documentType/:year/:language',
//   StatisticsCtrl.fetchStatistics
// )
appRoute.get(
  'api.statisticsMemo',
  config.proxyPrefixPath.uri + '/api/kursinfo/statistics/courseMemo/year/:year',
  StatisticsCtrl.fetchMemoStatistics
)

appRoute.get(
  'SyllabusPdf.getPdfProxy',
  config.proxyPrefixPath.uri + '/kursplan/:course_semester',
  SyllabusPdf.getPdfProxy(config.nodeApi.kursplanApi, config.apiKey.kursplanApi)
)
appRoute.get('system.experiment.index', config.proxyPrefixPath.uri + '/experiment/:courseCode', Course.getIndex)

appRoute.get('system.index', config.proxyPrefixPath.uri + '/:courseCode', Course.getIndex)
appRoute.get('system.home', config.proxyPrefixPath.uri + '/', noCourse.getIndex)

appRoute.get(
  'api.plannedSchemaModules',
  config.proxyPrefixPath.uri + '/api/kursinfo/plannedschemamodules/:courseCode/:semester/:applicationCode',
  TimeTableApi.getPlannedSchemaModules
)

appRoute.post('api.employees', config.proxyPrefixPath.uri + '/api/kursinfo/employees', Employees.getCourseEmployees)

server.use('/', appRoute.getRouter())

// Not found etc
server.use(noCourse.getIndex)
server.use(System.notFound)
server.use(System.final)

// Register handlebar helpers
require('./views/helpers')
