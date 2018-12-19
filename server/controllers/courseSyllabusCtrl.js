'use strict'

const api = require('../api')
const co = require('co')
const log = require('kth-node-log')
const { safeGet } = require('safe-utils')
const phantom= require('phantomjs-prebuilt')

let syllabusPDF = require('html-pdf')
var fs = require('fs');

const browserConfig = require('../configuration').browser
const serverConfig = require('../configuration').server

module.exports = {
  getIndex: getIndex
}
const paths2 = require('../server').getPaths()

async function  getIndex (req, res, next) {  
console.log("!!syllabusPDF!",syllabusPDF.create)
console.log("*******************************************")
  const course_semester = req.params.course_semester.split('.') 
  const courseCode = course_semester.length > 0 ? course_semester[0].split('_')[0] : ""
  const semester = course_semester.length > 0 ? course_semester[0].split('_')[1] : ""
  const lang = req.query.lang || 'sv'

  try {
    const client = api.kursplanApi.client
    const paths = api.kursplanApi.paths
    console.log("phantom", phantom)
    console.log("*******************************************")
    const resp = await client.getAsync(client.resolve("/api/kursplan/v1/syllabus/:courseCode/:semester/:language", { courseCode: courseCode, semester: semester, language:lang }), { useCache: true })
    //console.log("!!!response pdfConfig!!!!",resp.body.pdfConfig)
    
     const tempConfig = {
      //"format": "A4",        
      //"orientation": "portrait", 
      "type": "pdf"
      ,"phantomPath": "/usr/bin/phantomjs"
      ,"timeout":1000
    }
    console.log("!!!tempConfig!!!!",tempConfig)
    console.log("*******************************************")
    
    if(resp.body.syllabusHTML){
      syllabusPDF.create(resp.body.syllabusHTML.pageContentHtml, resp.body.pdfConfig).toFile('./pdfTempFile.pdf', function(err, result) {
        if (err) {
          console.log("ERROR IN syllabusPDF.create", err)
          console.log("*******************************************")
          //******TEMP********
          const backuphtml = resp.body.syllabusHTML.pageContentHtml
          res.render('courseSyllabus/index', {
            debug: 'debug' in req.query,
            html:backuphtml,
            title: courseCode.toUpperCase(),
            data: resp.statusCode === 200 ? safeGet(() => { return resp.body.name }) : '',
            error: resp.statusCode !== 200 ? safeGet(() => { return resp.body.message }) : ''
          })
        }
        else{
          try{
            fs.readFile('./pdfTempFile.pdf', function (err,data){
              res.setHeader('Content-Type', 'application/pdf')
              console.log("!!readPDFfile data!!", data)
              res.send(data)
            })
          } catch (err) {
            log.error('Error in getIndex -> read PDF file', { error: err })
            next(err)
          }
        }
      })
    }
    else{
      res.render('courseSyllabus/index', {
        debug: 'debug' in req.query,
        html:"Denna kursplan hittades inte. / No syllabus found",
        title: courseCode.toUpperCase(),
        data: resp.statusCode === 200 ? safeGet(() => { return resp.body.name }) : '',
        error: resp.statusCode !== 200 ? safeGet(() => { return resp.body.message }) : ''
      })
    }
  } catch (err) {
    log.error('Error in getIndex', { error: err })
    next(err)
  }
}

