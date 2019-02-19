 'use strict'
import { observable, action } from 'mobx'
import axios from 'axios'
import { safeGet } from 'safe-utils'
import { EMPTY, PROGRAMME_URL, MAX_1_MONTH, MAX_2_MONTH, COURSE_IMG_URL } from "../util/constants"

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
  @observable showCourseWebbLink = false
 // @observable isCurrentSyllabus = true

  roundsSyllabusIndex = []
  courseSemesters=[]
  keyList ={
    teachers:[],
    responsibles:[]
  }
  user = ""
  image = ""
  defaultIndex = 0

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
/******************************************************************************************************************************************* */
  getImage(courseCode, type="normal"){
    const image =`${Math.floor((Math.random() * 7) + 1)}_${type}.jpg`
    const response = axios.get(this.buildApiUrl(this.paths.api.setImage.uri, { courseCode: courseCode, imageName:image })).then( response =>{
      //console.log("IMAGE SET->",response, image)
    })
    .catch(err => { 
      if (err.response) {
        throw new Error(err.message, err.response.data)
      }
      throw err
    })
    return `${this.browserConfig.proxyPrefixPath.uri}${COURSE_IMG_URL}${image}`
  }


  @action getCourseAdminInfo(courseCode,imageList,lang = 'sv'){
    return axios.get(this.buildApiUrl(this.paths.api.sellingText.uri,  {courseCode:courseCode}), this._getOptions()).then( res => {
      //console.log(res.data)
      this.showCourseWebbLink = res.data.isCourseWebLink
      this.sellingText = {
          sv: res.data.sellingText_sv ? res.data.sellingText_sv : "", 
          en: res.data.sellingText_en ? res.data.sellingText_en : ""
        }
      this.image =  res.data.imageInfo /*&& res.data.imageInfo.length > 0 */? this.browserConfig.proxyPrefixPath.uri + COURSE_IMG_URL + res.data.imageInfo : this.getImage(courseCode , "normal" ) //TODO: 
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
     // console.log('getCourseEmployeesPost', result)
      const returnValue = result.data
      let rounds = this.courseData.courseRoundList
      for(let index = 0; index < returnValue[0].length; index++){
        rounds[index].round_teacher  = returnValue[0][index] !== null ? this.createPersonHtml(JSON.parse(returnValue[0][index]),'teacher') : EMPTY
        rounds[index].round_responsibles = returnValue[1][index] !== null ? this.createPersonHtml(JSON.parse(returnValue[1][index]), 'responsible') : EMPTY
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
      this.courseData.courseInfo.course_examiners = result.data && result.data.length > 0 ? this.createPersonHtml(result.data, 'examiner') : EMPTY
    }).catch(err => { 
      if (err.response) {
        throw new Error(err.message, err.response.data)
      }
      throw err
    })
  }

  @action getCurrentSemesterToShow(date=""){

    if(this.courseSemesters.length === 0)
      return 0

    let thisDate = date === "" ? new Date() :new Date(date)
    let showSemester = 0
    let returnIndex = -1
    let yearMatch = -1

    //*******Calculating current semester based on todays date ********/
    if( thisDate.getMonth()+1 >= MAX_1_MONTH && thisDate.getMonth()+1 < MAX_2_MONTH ){
      showSemester = `${thisDate.getFullYear()}2`
    }
    else{
      if(thisDate.getMonth()+1 < MAX_1_MONTH){
        showSemester = `${thisDate.getFullYear()}1`
      }
      else{
        showSemester = `${thisDate.getFullYear()+1}1`
       }
    }
      
    //*******Check if course has a round for current semester otherwise it shows the previous semester********/
      for(let index=0; index < this.courseSemesters.length; index++){
        if(this.courseSemesters[index][2]=== showSemester){
          returnIndex = index
        }
        if(thisDate.getMonth()+1 > MAX_2_MONTH && Number(this.courseSemesters[index][0])=== thisDate.getFullYear()){
          yearMatch = index
        }
        if(thisDate.getMonth()+1 < MAX_1_MONTH && Number(this.courseSemesters[index][0])=== thisDate.getFullYear()-1){
          yearMatch = index
        }
      }
     // console.log("what???",returnIndex, yearMatch ) //TODO: delete
     // console.log(thisDate, showSemester)
    //*******In case there should be no match at all, take the last senester in the list ********/
      if(returnIndex === -1 && yearMatch === -1)
        return this.courseSemesters.length-1

      return returnIndex > -1 ? returnIndex : yearMatch
  }

  //** Handeling the course information from kopps api.**//
  @action getCourseInformation(courseCode, ldapUsername, lang = 'sv', roundIndex = 0){
    return axios.get(this.buildApiUrl(this.paths.api.koppsCourseData.uri,  {courseCode:courseCode,language:lang}), this._getOptions()).then((res) => { 
      const courseResult = safeGet(() => res.data, {})
      const language = lang === 'en' ? 0 : 1

      this.isCancelled = courseResult.course.cancelled
      this.user = ldapUsername

      //*** Coruse information that is static on the course side ***//
      const courseInfo = this.getCourseDefaultInformation(courseResult, language)
      console.log("!! courseInfo: OK !!", courseInfo)

      //*** Course title data  ***//
      const courseTitleData = {
        course_code: this.isValidData(courseResult.course.courseCode),
        course_title: this.isValidData(courseResult.course.title),
        course_other_title:this.isValidData(courseResult.course.titleOther),
        course_credits:this.isValidData(courseResult.course.credits)
      }
      console.log("!!titleData: OK !!")


      //*** Get list of syllabuses and valid syllabus semesters ***//
      let coursePlan =[]
      let syllabusSemesterList = []
      const syllabuses = courseResult.publicSyllabusVersions
      if(syllabuses.length > 0){
        for(let i = 0; i < syllabuses.length; i++ ) { 
          syllabusSemesterList.push(syllabuses[i].validFromTerm.term)
          coursePlan.push(this.getCoursePlanData(courseResult, i, language))
        }
      }
      else{
        coursePlan[0] = this.getCoursePlanData(courseResult, 0, language)
      }
      console.log("!! syllabusSemesterList and coursePlan: OK !!", coursePlan)

        

      //***Get a list of rounds and a list of redis keys for using to get teachers and responsibles from ugRedis **//
      const courseRoundList = this.getRounds(courseResult.roundInfos,  courseCode, language)

      //***Sets roundsSyllabusIndex, an array used for connecting rounds with correct syllabus **//
      this.getRoundsAndSyllabusConnection(syllabusSemesterList)

      //***Get the index for start informatin based on time of year ***/
      this.defaultIndex = this.getCurrentSemesterToShow()
      //console.log("this.roundsSyllabusIndex", this.roundsSyllabusIndex, this.defaultIndex)
        
        this.courseData = {
          coursePlan,
          courseInfo,
          courseRoundList,
          courseTitleData,
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

  getCourseDefaultInformation(courseResult, language){
    return{
      course_code: this.isValidData(courseResult.course.courseCode),
      course_grade_scale: this.isValidData(courseResult.formattedGradeScales[courseResult.course.gradeScaleCode],language), //TODO: can this be an array?
      course_level_code: this.isValidData(courseResult.course.educationalLevelCode),
      course_main_subject: courseResult.mainSubjects ?  Array.isArray(courseResult.mainSubjects) ? courseResult.mainSubjects.toString() : this.isValidData(courseResult.mainSubjects) : EMPTY,
      course_recruitment_text: this.isValidData(courseResult.course.recruitmentText),
      course_department: this.isValidData(courseResult.course.department.name, language)!== EMPTY ? '<a href="https://www.kth.se/' + courseResult.course.department.name.split('/')[0].toLowerCase()+'/" target="blank">'+courseResult.course.department.name+'</a>' : EMPTY,
      course_department_code: this.isValidData(courseResult.course.department.code, language),
      course_contact_name:this.isValidData(courseResult.course.infoContactName, language),
      course_suggested_addon_studies: this.isValidData(courseResult.course.addOn, language),
      course_supplemental_information_url: this.isValidData(courseResult.course.supplementaryInfoUrl, language),
      course_supplemental_information_url_text: this.isValidData(courseResult.course.supplementaryInfoUrlName, language),
      course_supplemental_information: this.isValidData(courseResult.course.supplementaryInfo, language),
      course_examiners: EMPTY,
      course_last_exam: courseResult.course.lastExamTerm ? courseResult.course.lastExamTerm.term.toString().match(/.{1,4}/g) : []
    }
  }

  getCoursePlanData(courseResult, semester = 0, language){
    return {
      course_goals: courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0 ? this.isValidData(courseResult.publicSyllabusVersions[semester].courseSyllabus.goals, language) : EMPTY,
      course_content:  courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0 ? this.isValidData(courseResult.publicSyllabusVersions[semester].courseSyllabus.content, language): EMPTY,
      course_disposition:  courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0 ? this.isValidData(courseResult.publicSyllabusVersions[semester].courseSyllabus.disposition, language): EMPTY, 
      course_eligibility:  courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0 ? this.isValidData(courseResult.publicSyllabusVersions[semester].courseSyllabus.eligibility, language): EMPTY, 
      course_requirments_for_final_grade:  courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0 ? this.isValidData(courseResult.publicSyllabusVersions[semester].courseSyllabus.reqsForFinalGrade, language): EMPTY,
      course_literature: courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0 ? this.isValidData(courseResult.publicSyllabusVersions[semester].courseSyllabus.literature, language): EMPTY, 
      course_valid_from: courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0 ? this.isValidData(courseResult.publicSyllabusVersions[semester].validFromTerm.term).toString().match(/.{1,4}/g) : [], 
      course_required_equipment: courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0 ? this.isValidData(courseResult.publicSyllabusVersions[semester].courseSyllabus.requiredEquipment, language): EMPTY,
      course_examination: courseResult.examinationSets && Object.keys(courseResult.examinationSets).length > 0 && courseResult.examinationSets[Object.keys(courseResult.examinationSets)[0]].hasOwnProperty('examinationRounds') ? this.getExamObject(courseResult.examinationSets[Object.keys(courseResult.examinationSets)[0]].examinationRounds, courseResult.formattedGradeScales, language): EMPTY,
      course_examination_comments:  courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0 ? this.isValidData(courseResult.publicSyllabusVersions[semester].courseSyllabus.examComments, language):EMPTY,
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

  getRounds(roundInfos, courseCode, language){
    let tempList = []
    let courseRound
    let courseRoundList = []
    for( let roundInfo of roundInfos){ 
      courseRound =  this.getRound(roundInfo, language)
      courseRoundList.push(courseRound)
      if(courseRound.round_course_term && tempList.indexOf(courseRound.round_course_term.join('')) < 0){
          this.courseSemesters.push([...courseRound.round_course_term, courseRound.round_course_term.join(''), courseRoundList.length-1])
          tempList.push(courseRound.round_course_term.join(''))
      }
      this.keyList.teachers.push(`${courseCode}.${courseRound.round_course_term[0]}${courseRound.round_course_term[1]}.${courseRound.roundId}.teachers`)
      this.keyList.responsibles.push(`${courseCode}.${courseRound.round_course_term[0]}${courseRound.round_course_term[1]}.${courseRound.roundId}.courseresponsible`)
    }
    this.courseSemesters.sort()
    console.log("!!courseRound: OK !!")
    
    return courseRoundList
  }

  getRoundsAndSyllabusConnection(syllabusSemesterList){
    for(let index=0; index < this.courseSemesters.length; index++){
      if(Number(syllabusSemesterList[0]) > Number(this.courseSemesters[index][2]) /*&& this.courseSemesters.length > 1*/){
        for(let whileIndex=1; whileIndex < syllabusSemesterList.length; whileIndex++){
          if(Number(syllabusSemesterList[whileIndex]) > Number(this.courseSemesters[index][2]) )
            console.log("find other syllabus2")
          else{
           console.log("correct syllabus2")
            this.roundsSyllabusIndex[index]=whileIndex
            break
          }
        }
      }
      else{
        console.log("correct syllabus")
        console.log("syllabusSemesterList", syllabusSemesterList, this.courseSemesters)
        this.roundsSyllabusIndex[index]=0
      }
    }
  }

  getRound(roundObject, language = 0){ 
    const courseRoundModel = {
      roundId: this.isValidData(roundObject.round.ladokRoundId, language),
      round_time_slots: this.isValidData(roundObject.timeslots, language),
      round_start_date: this.isValidData(roundObject.round.firstTuitionDate, language),
      round_end_date: this.isValidData(roundObject.round.lastTuitionDate, language),
      round_target_group:  this.isValidData(roundObject.round.targetGroup, language),
      round_tutoring_form: this.isValidData(roundObject.round.tutoringForm.name, language), 
      round_tutoring_time: this.isValidData(roundObject.round.tutoringTimeOfDay.name, language), 
      round_tutoring_language: this.isValidData(roundObject.round.language, language),
      round_course_place: this.isValidData(roundObject.round.campus.label, language), 
      round_campus: this.isValidData(roundObject.round.campus.name, language),
      round_short_name: this.isValidData(roundObject.round.shortName, language),
      round_application_code: this.isValidData(roundObject.round.applicationCodes[0].applicationCode),
      round_schedule: this.isValidData(roundObject.schemaUrl),
      round_course_term: this.isValidData(roundObject.round.startTerm.term).toString().length > 0 ? roundObject.round.startTerm.term.toString().match(/.{1,4}/g) : [],
      round_periods: this.isValidData(roundObject.round.courseRoundTerms[0].formattedPeriodsAndCredits),
      round_max_seats: this.isValidData(roundObject.round.maxSeats, language),
      round_type: roundObject.round.applicationCodes.length > 0 ? this.isValidData(roundObject.round.applicationCodes[0].courseRoundType.name) : EMPTY, //TODO: Map array
      round_application_link:  this.isValidData(roundObject.admissionLinkUrl),
      round_part_of_programme: roundObject.usage.length > 0 ? this.getRoundProgramme(roundObject.usage, language) : EMPTY,
      round_state: this.isValidData(roundObject.round.state)
    }
    if(courseRoundModel.round_short_name === EMPTY)
      courseRoundModel.round_short_name = `${language === 0 ? 'Start date' : 'Startdatum'}  ${courseRoundModel.round_start_date}`
    return courseRoundModel
  }

  getRoundProgramme( programmes, language = 0 ){ //TODO
    let programmeString = ""
    programmes.forEach(programme => {
      programmeString += 
      `<p>
          <a target="_blank" 
                  href="${PROGRAMME_URL}/${programme.programmeCode}/${programme.progAdmissionTerm.term}/arskurs${programme.studyYear}${programme.specCode ? '#inr'+programme.specCode:""}">
                  ${programme.title}, ${language === 0 ? "year" : "åk"  } ${programme.studyYear}, ${programme.specCode ? programme.specCode+', ' :""}${programme.electiveCondition.abbrLabel}
        </a>
      </p>`
    })
    return programmeString
  }

  isValidData(dataObject, language = 0){
    return !dataObject ? EMPTY : dataObject
  }

  createPersonHtml(personList, type){
    let personString = ""
    personList.forEach( person  => {
      personString += `<p class = "person">
          <i class="fas fa-user-alt"></i>
          <a href="https://www.kth.se/profile/${person.username}/" target="_blank" property="teach:teacher">${person.givenName} ${person.lastName} </a> 
          
          </p>  `
          //<i class="far fa-envelope"></i>&nbsp;${person.email}
      //** Check if the logged in user is examinator or responsible and can edit course page **/
      if(this.user === person.username && ( type=== 'responsible' || type=== 'examiner')) //TODO: DELETE
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
  
  @action getBreadcrumbs () {
    return {
      url:`/student/kurser/org/${this.courseData.courseInfo.course_department_code}`, 
      label:this.courseData.courseInfo.course_department
    }
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