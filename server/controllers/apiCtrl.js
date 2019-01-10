'use strict'

const log = require('kth-node-log')
const httpResponse = require('kth-node-response')
//const language = require('../util/language')
const co = require('co')
const sellingText = require('../apiCalls/sellingText')


/**
 * Controller for api
 */
module.exports = {
  getSellingText: co.wrap(_getSellingText)
}

/**
 * return a list of all answers for a webform
 */
function * _getSellingText(req, res) {
  const courseCode = req.params.courseCode 
  try {
    const apiResponse = yield sellingText.getSellingText(courseCode)

    if (apiResponse.statusCode !== 200) {
      return httpResponse.jsonError(res, apiResponse.courseCode)
    }
    return httpResponse.json(res, apiResponse.body)
  } catch (err) {
    log.error('Exception calling from API ', { error: err })
    return err
  }
}


