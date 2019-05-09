'use strict'

const api = require('../api')
const log = require('kth-node-log')
const { safeGet } = require('safe-utils')
const phantom = require('phantomjs-prebuilt')

let syllabusPDF = require('html-pdf')

module.exports = {
  getIndex: getIndex
}

async function getIndex (req, res, next) {
  const courseSemester = req.params.course_semester.split('.')
  const courseCode = courseSemester.length > 0 ? courseSemester[0].split('-')[0] : ''
  const semester = courseSemester.length > 0 ? courseSemester[0].split('-')[1] : ''
  const lang = req.query.lang || 'sv'

  try {
    const client = api.kursplanApi.client
    const paths = api.kursplanApi.paths

    const resp = await client.getAsync(client.resolve(paths.getSyllabusByCourseCode.uri,
                                                      { courseCode: courseCode, semester: semester, language: lang }),
                                                      { useCache: true })

    if (resp.body.syllabusHTML) {
      resp.body.pdfConfig['phantomPath'] = phantom.path
      // console.log("phantom", phantom)
      // console.log("*******************************************")

      syllabusPDF.create(resp.body.syllabusHTML.pageContentHtml, resp.body.pdfConfig).toBuffer(function (err, buffer) {
        if (err) {
          console.log('ERROR IN syllabusPDF.create', err)
          console.log('*******************************************')
          //* *****TEMP********
          const backuphtml = resp.body.syllabusHTML.pageContentHtml
          res.render('courseSyllabus/index', {
            debug: 'debug' in req.query,
            html: backuphtml,
            title: courseCode.toUpperCase(),
            data: resp.statusCode === 200 ? safeGet(() => { return resp.body.name }) : '',
            error: resp.statusCode !== 200 ? safeGet(() => { return resp.body.message }) : ''
          })
        }
        else {
          res.contentType('application/pdf')
          res.send(buffer)
        }
      })
    }
    else {
      res.render('courseSyllabus/index', {
        debug: 'debug' in req.query,
        html: '<br/>Denna kursplan hittades inte. / No syllabus found.',
        title: courseCode.toUpperCase(),
        data: resp.statusCode === 200 ? safeGet(() => { return resp.body.name }) : '',
        error: resp.statusCode !== 200 ? safeGet(() => { return resp.body.message }) : ''
      })
    }
  } catch (err) {
    log.error('Error in Syllabus/getIndex', { error: err })
    next(err)
  }
}

