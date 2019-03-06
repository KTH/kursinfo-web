/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

process.env['LDAP_URI'] = 'ldaps://mockuser@mockdomain.com@mockldapdomain.com'
process.env['LDAP_PASSWORD'] = 'mockldappassword'
process.env['NODE_ENV'] = 'development'
process.env['REDIS_URI'] = 'redis://localhost:6379'
const expect = require('chai').expect
const nock = require('nock')
const mockery = require('mockery')
const httpMocks = require('node-mocks-http')


const mockLogger = {}
mockLogger.debug = mockLogger.info = mockLogger.error = mockLogger.warn = console.log
mockLogger.init = () => {}

mockery.registerMock('kth-node-log', mockLogger)
mockery.enable({
  warnOnReplace: false,
  warnOnUnregistered: false
})

const paths = require('../mocks/apipaths.json')

const api = nock('https://api-r.referens.sys.kth.se/api/kursinfo')
  .get('/_paths')
  .reply(200, paths)
  .get('/_checkAPIkey')
  .reply(200, {})

describe('Index page', function () { 
  before((done) => {
    require('../../server/api')
    setTimeout(() => {
      done()
    }, 500)
    
  })
 it('should get the index page', done => {
     /*api.get('/v1/getSellingText/1624').reply(200, {
      id: '123',
      name: 'asdasd'
    })*/
    const ctrl = require('../../server/controllers/courseCtrl')
    
    const { req, res } = httpMocks.createMocks()
    res.render = function (view, data) {
      expect(data).to.be.not.undefined
      done()
    }
    ctrl.getIndex(req, res, console.log)
  })
})
