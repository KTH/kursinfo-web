 'use strict'
import { observable, action } from 'mobx'
import axios from 'axios'
import { safeGet } from 'safe-utils'
import { EMPTY, PROGRAMME_URL } from "../util/constants"

const paramRegex = /\/(:[^\/\s]*)/g

function _paramReplace (path, params) {
  let tmpPath = path
  const tmpArray = tmpPath.match(paramRegex)
  tmpArray && tmpArray.forEach(element => {
    tmpPath = tmpPath.replace(element, '/' + params[element.slice(2)])
  })
  return tmpPath
}

function _webUsesSSL (url) {
  return url.startsWith('https:')
}

class RouterStore {
  @observable courseData = undefined
  @observable sellingText = undefined
  @observable canEdit = false
  @observable isCancelled = false
  @observable isCurrentSyllabus = true

  keyList ={
    teachers:[],
    responsibles:[]
  }
  user = ""

  buildApiUrl (path, params) {
    let host
    if (typeof window !== 'undefined') {
      host = this.apiHost
    } else {
      host = 'http://localhost:' + this.browserConfig.port
    }
    if (host[host.length - 1] === '/') {
      host = host.slice(0, host.length - 1)
    }
    const newPath = params ? _paramReplace(path, params) : path
    return [host, newPath].join('')
  }

  _getOptions (params) {
    // Pass Cookie header on SSR-calls
    let options
    if (typeof window === 'undefined') {
      options = {
        headers: {
          Cookie: this.cookieHeader,
          Accept: 'application/json',
          'X-Forwarded-Proto': (_webUsesSSL(this.apiHost) ? 'https' : 'http')
        },
        timeout: 10000,
        params: params
      }
    } else {
      options = {
        params: params
      }
    }
    return options
  }


  @action getCourseSellingText(courseCode,lang = 'sv'){
    return axios.get(this.buildApiUrl(this.paths.api.sellingText.uri,  {courseCode:courseCode}), this._getOptions()).then( res => {
      this.sellingText = res.data.sellingText
    }).catch(err => { 
      if (err.response) {
        throw new Error(err.message, err.response.data)
      }
      throw err
    })
  }
  

  @action getCourseEmployeesPost( key , type="multi", lang = 'sv'){

    if(this.courseData.courseRoundList.length === 0 ) return ""

    return axios.post(this.buildApiUrl(this.paths.redis.ugCache.uri, { key:key, type:type }),this._getOptions(JSON.stringify(this.keyList))).then( result => {
      //console.log('getCourseEmployeesPost', result)
      const returnValue = result.data
      let rounds = this.courseData.courseRoundList
      for(let index = 0; index < returnValue[0].length; index++){
        rounds[index].round_teacher  = returnValue[0][index] !== null ? this.createPersonHtml(JSON.parse(returnValue[0][index])) : ""
        rounds[index].round_responsibles = returnValue[1][index] !== null ? this.createPersonHtml(JSON.parse(returnValue[1][index])) : ""
      }
      this.courseData.courseRoundList = rounds
      //return result.data && result.data.length > 0 ? this.createPersonHtml(result.data) : EMPTY
    }).catch(err => { 
      if (err.response) {
        throw new Error(err.message, err.response.data)
      }
      throw err
    })
  } 

  @action getCourseEmployees( key , type="examinator", lang = 'sv'){
    return axios.get(this.buildApiUrl(this.paths.redis.ugCache.uri, { key:key, type:type })).then( result => {
    //console.log('getCourseEmployees', result)
      this.courseData.coursePlan.course_examiners = result.data && result.data.length > 0 ? this.createPersonHtml(result.data) : EMPTY
    }).catch(err => { 
      if (err.response) {
        throw new Error(err.message, err.response.data)
      }
      throw err
    })
  }

  //** Handeling the course information from kopps api.**//
  @action getCourseInformation(courseCode, ldapUsername, lang = 'sv', roundIndex = 0){
      return axios.get(`https://api-r.referens.sys.kth.se/api/kopps/v2/course/${encodeURIComponent(courseCode)}/detailedinformation?l=${lang}`).then((res) => { //TODO: use buildApiUrl
        const courseResult = safeGet(() => res.data, {})
        const language = lang === 'en' ? 0 : 1

        this.isCancelled = courseResult.course.cancelled
        this.user = ldapUsername
      // TODO this.isCurrentSyllabus = 

    
      //*** Get list of syllabuses semesters ***//
      const syllabuses = courseResult.publicSyllabusVersions
      let syllabusSemesterList = []
      for(let i = 1; i < syllabuses.length; i++ ) { 
        syllabusSemesterList.push(syllabuses[i].validFromTerm.term)
      }

      //*** Title data  ***//
      const courseTitleData = {
        course_code: this.isValidData(courseResult.course.courseCode),
        course_title: this.isValidData(courseResult.course.title),
        course_other_title:this.isValidData(courseResult.course.titleOther),
        course_credits:this.isValidData(courseResult.course.credits)
      }
      console.log("!!titleData: OK !!")

     
      //*** Get list of syllabuses ***//
      let coursePlan = this.getCoursePlanData(courseResult, 0, language)
      console.log("!!coursePlan: OK !!")

      
      //***Get list of rounds, semesters and keys for teachers and responsibles to use in ugRedis **//
      let courseSemesters = []
      let tempList = []
      let courseRound
      let courseRoundList = []
      for( let roundInfo of courseResult.roundInfos){ 
        courseRound =  this.getRound(roundInfo, courseCode, ldapUsername)
        courseRoundList.push(courseRound)
        if(courseRound.round_course_term && tempList.indexOf(courseRound.round_course_term[0]) < 0){
            courseSemesters.push(courseRound.round_course_term)
            tempList.push(courseRound.round_course_term[0])
        }
        this.keyList.teachers.push(`${courseCode}.${courseRound.round_course_term[0]}${courseRound.round_course_term[1]}.${courseRound.roundId}.teachers`)
        this.keyList.responsibles.push(`${courseCode}.${courseRound.round_course_term[0]}${courseRound.round_course_term[1]}.${courseRound.roundId}.courseresponsible`)
      }
      courseSemesters.sort()
      console.log("!!courseRound: OK !!")

      
      this.courseData = {
        coursePlan,
        courseRoundList,
        courseTitleData,
        courseSemesters,
        syllabusSemesterList,
        language
      }
    }).catch(err => { 
      if (err.response) {
        throw new Error(err.message, err.response.data)
      }
      throw err
    })
  }

  getCoursePlanData(courseResult, semester = 0, language){
    return {
      course_code: this.isValidData(courseResult.course.courseCode),
      course_title: this.isValidData(courseResult.course.title),
      course_other_title:this.isValidData(courseResult.course.titleOther),
      course_main_subject: courseResult.mainSubjects ?  Array.isArray(courseResult.mainSubjects) ? courseResult.mainSubjects.map(sub => sub + " ") : this.isValidData(courseResult.mainSubjects) : EMPTY,
      course_credits:this.isValidData(courseResult.course.credits),
      course_grade_scale: this.isValidData(courseResult.formattedGradeScales[courseResult.course.gradeScaleCode],language), //TODO: can this be an array?
      course_level_code: this.isValidData(courseResult.course.educationalLevelCode),
      course_recruitment_text: this.isValidData(courseResult.course.recruitmentText),
      course_goals: courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0 ? this.isValidData(courseResult.publicSyllabusVersions[0].courseSyllabus.goals, language) : EMPTY,
      course_content:  courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0 ? this.isValidData(courseResult.publicSyllabusVersions[0].courseSyllabus.content, language): EMPTY,
      course_disposition:  courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0 ? this.isValidData(courseResult.publicSyllabusVersions[0].courseSyllabus.disposition, language): EMPTY, 
      course_eligibility:  courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0 ? this.isValidData(courseResult.publicSyllabusVersions[0].courseSyllabus.eligibility, language): EMPTY, 
      course_requirments_for_final_grade:  courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0 ? this.isValidData(courseResult.publicSyllabusVersions[0].courseSyllabus.reqsForFinalGrade, language): EMPTY,
      course_literature: courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0 ? this.isValidData(courseResult.publicSyllabusVersions[0].courseSyllabus.literature, language): EMPTY, 
      course_valid_from: courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0 ? this.isValidData(courseResult.publicSyllabusVersions[0].validFromTerm.term).toString().match(/.{1,4}/g) : [], 
      course_required_equipment: courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0 ? this.isValidData(courseResult.publicSyllabusVersions[0].courseSyllabus.requiredEquipment, language): EMPTY,
      course_examination: courseResult.examinationSets && Object.keys(courseResult.examinationSets).length > 0 && courseResult.examinationSets[Object.keys(courseResult.examinationSets)[0]].hasOwnProperty('examinationRounds') ? this.getExamObject(courseResult.examinationSets[Object.keys(courseResult.examinationSets)[0]].examinationRounds, courseResult.formattedGradeScales, language): EMPTY,
      course_examination_comments:  courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0 ? this.isValidData(courseResult.publicSyllabusVersions[0].courseSyllabus.examComments, language):EMPTY,
      //*---Not in course plan (syllabus) --*/
      course_department: this.isValidData(courseResult.course.department.name, language),
      course_department_code: this.isValidData(courseResult.course.department.code, language),
      course_contact_name:this.isValidData(courseResult.course.infoContactName, language),
      course_suggested_addon_studies: this.isValidData(courseResult.course.addOn, language),
      course_supplemental_information_url: this.isValidData(courseResult.course.supplementaryInfoUrl, language),
      course_supplemental_information_url_text: this.isValidData(courseResult.course.supplementaryInfoUrlName, language),
      course_supplemental_information: this.isValidData(courseResult.course.supplementaryInfo, language),
      course_examiners: courseResult.examiners ?  Array.isArray(courseResult.examiners) ? this.createPersonHtml(courseResult.examiners): "" : EMPTY,
      course_last_exam: courseResult.course.lastExamTerm ? courseResult.course.lastExamTerm.term.toString().match(/.{1,4}/g) : []
    }
  }

  getExamObject(dataObject, grades, language = 0){
    let examString = ""
    if(dataObject.length > 0){
      for(let exam of dataObject){
       examString += `<li>${exam.examCode} - 
                      ${exam.title},
                      ${exam.credits},  
                      Betygskala: ${grades[exam.gradeScaleCode]}             
                      </li>`
      }
    }
    console.log("!!getExamObject is ok!!")
    return examString 
  }

  getRound(roundObject, courseCode, ldapUsername, language = 0){ 
    const courseRoundModel = {
      roundId: this.isValidData(roundObject.round.ladokRoundId, language),
      round_time_slots: this.isValidData(roundObject.timeslots, language),
      round_start_date: this.isValidData(roundObject.round.firstTuitionDate, language),
      round_end_date: this.isValidData(roundObject.round.lastTuitionDate, language),
      round_target_group:  this.isValidData(roundObject.round.targetGroup, language),
      round_tutoring_form: this.isValidData(roundObject.round.tutoringForm.name, language), //ASK FOR CHANGE???
      round_tutoring_time: this.isValidData(roundObject.round.tutoringTimeOfDay.name, language), 
      round_tutoring_language: this.isValidData(roundObject.round.language, language),
      round_campus: this.isValidData(roundObject.round.campus.label, language), 
      round_course_place: this.isValidData(roundObject.round.campus.name, language),
      round_short_name: this.isValidData(roundObject.round.shortName, language),
      round_application_code: this.isValidData(roundObject.round.applicationCodes[0].applicationCode),
      round_schedule: this.isValidData(roundObject.schemaUrl),
      round_course_term: this.isValidData(roundObject.round.startTerm.term).toString().length > 0 ? roundObject.round.startTerm.term.toString().match(/.{1,4}/g) : [],
      round_periods: this.isValidData(roundObject.round.courseRoundTerms[0].formattedPeriodsAndCredits),
      round_max_seats: this.isValidData(roundObject.round.maxSeats, language),
      round_type: roundObject.round.applicationCodes.length > 0 ? this.isValidData(roundObject.round.applicationCodes[0].courseRoundType.name) : EMPTY, //TODO: Map array
      round_application_link:  this.isValidData(roundObject.admissionLinkUrl),
      round_part_of_programme: roundObject.usage.length > 0 ? this.getRoundProgramme(roundObject.usage, language) : EMPTY
    }
    return courseRoundModel
  }

  getRoundProgramme( programmes, language = 0 ){ //TODO
    let programmeString = ""
    programmes.forEach(programme => {
      programmeString += 
      `<a target="_blank" 
                  href="${PROGRAMME_URL}/${programme.programmeCode}/${programme.progAdmissionTerm.term}/arskurs${programme.studyYear}">
                  ${programme.title}, ${language === "sv" ? "åk" : "year" } ${programme.studyYear},${programme.electiveCondition.abbrLabel}
       </a><br/>`
    })
    return programmeString
  }

  isValidData(dataObject, language = 0){
    return !dataObject ? EMPTY : dataObject
  }

  createPersonHtml(personList){
    let personString = ""
    personList.forEach( person  => {
      personString += `<p class = "person"><i class="icon-user"></i> <a href="https://www.kth.se/profile/${person.username}/" target="_blank" property="teach:teacher">${person.givenName} ${person.lastName}, </a> <i class="icon-envelope-alt"></i> ${person.email}</p>  `
      //Check if the logged in user is examinator or responsible and can edit course page
      if(this.user === person.username) //TODO: DELETE
        this.canEdit = true
    })
    return personString
  }
/*************************************************************************************************************************/

  @action getLdapUserByUsername (params) {
    return axios.get(this.buildApiUrl(this.paths.api.searchLdapUser.uri, params), this._getOptions()).then((res) => {
      return res.data
    }).catch(err => {
      if (err.response) {
        throw new Error(err.message, err.response.data)
      }
      throw err
    })
  }
  
  @action clearBreadcrumbs () {
    this.breadcrumbs.replace([])
  }
  
  @action hasBreadcrumbs () {
    return this.breadcrumbs.length > 0
  }

  @action setBrowserConfig (config, paths, apiHost, profileBaseUrl) {
    this.browserConfig = config
    this.paths = paths
    this.apiHost = apiHost
    this.profileBaseUrl = profileBaseUrl
  }

  @action __SSR__setCookieHeader (cookieHeader) {
    if (typeof window === 'undefined') {
      this.cookieHeader = cookieHeader
    }
  }

  @action doSetLanguage (lang) {
    this.language = lang
  }

  @action getBrowserInfo () {
    var navAttrs = ['appCodeName', 'appName', 'appMinorVersion', 'cpuClass',
      'platform', 'opsProfile', 'userProfile', 'systemLanguage',
      'userLanguage', 'appVersion', 'userAgent', 'onLine', 'cookieEnabled']
    var docAttrs = ['referrer', 'title', 'URL']
    var value = {document: {}, navigator: {}}
  
    for (let i = 0; i < navAttrs.length; i++) {
      if (navigator[navAttrs[i]] || navigator[navAttrs[i]] === false) {
        value.navigator[navAttrs[i]] = navigator[navAttrs[i]]
      }
    }
  
    for (let i = 0; i < docAttrs.length; i++) {
      if (document[docAttrs[i]]) {
        value.document[docAttrs[i]] = document[docAttrs[i]]
      }
    }
    return value
  }

  initializeStore (storeName) {
    const store = this
   
    if (typeof window !== 'undefined' && window.__initialState__ && window.__initialState__[storeName]) {
      /* TODO: 
      const util = globalRegistry.getUtility(IDeserialize, 'kursinfo-web')
      const importData = JSON.parse(decodeURIComponent(window.__initialState__[storeName]))
      console.log("importData",importData, "util",util)
      for (let key in importData) {
        // Deserialize so we get proper ObjectPrototypes
        // NOTE! We need to escape/unescape each store to avoid JS-injection
        store[key] = util.deserialize(importData[key])
      }
      delete window.__initialState__[storeName]*/

      const tmp = JSON.parse(decodeURIComponent(window.__initialState__[storeName]))
      for (let key in tmp) {
        store[key] = tmp[key]
        delete tmp[key]
      }
  
      // Just a nice helper message
      if (Object.keys(window.__initialState__).length === 0) {
        window.__initialState__ = 'Mobx store state initialized'
      }
    }
  }
}

export default RouterStore