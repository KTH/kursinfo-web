'use strict'
import { observable, action, toJS } from 'mobx'
import axios from 'axios'
import { safeGet } from 'safe-utils'
import { EMPTY, PROGRAMME_URL, MAX_1_MONTH, MAX_2_MONTH, COURSE_IMG_URL } from '../util/constants'
import i18n from '../../../../i18n'
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
  courseData = undefined
  sellingText = undefined

  canEdit = false
  isCancelled = false
  showCourseWebbLink = false
  roundsSyllabusIndex = []
  activeSemesters = []
  keyList = {
    teachers: [],
    responsibles: []
  }
  user = ''
  image = ''
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

  /** ***************************************************************************************************************************************** */
  /*                                                       COLLECTED COURSE INFORMATION                                                        */
  /** ***************************************************************************************************************************************** */
  //* * Handeling the course information from kopps api.**//
  @action getCourseInformation (courseCode, ldapUsername, lang = 'sv', roundIndex = 0) {
    return axios.get(this.buildApiUrl(this.paths.api.koppsCourseData.uri, { courseCode: courseCode, language: lang }), this._getOptions()).then((res) => {
      const courseResult = safeGet(() => res.data, {})
      const language = lang === 'en' ? 0 : 1

      this.isCancelled = courseResult.course.cancelled
      this.user = ldapUsername

      //* **** Coruse information that is static on the course side *****//
      const courseInfo = this.getCourseDefaultInformation(courseResult, language)
      console.log('!! courseInfo: OK !!')

      //* **** Course title data  *****//
      const courseTitleData = this.getTitleData(courseResult)
      console.log('!!titleData: OK !!')

      //* **** Get list of syllabuses and valid syllabus semesters *****//
      let syllabusList = []
      let syllabusSemesterList = []
      let tempSyllabus = {}
      const syllabuses = courseResult.publicSyllabusVersions
      if (syllabuses.length > 0) {
        for (let index = 0; index < syllabuses.length; index++) {
          syllabusSemesterList.push([syllabuses[index].validFromTerm.term, ''])
          tempSyllabus = this.getSyllabusData(courseResult, index, language)
          if (index > 0) {
            tempSyllabus.course_valid_to = this.getSyllabusEndSemester(syllabusSemesterList[index - 1][0].toString().match(/.{1,4}/g))
            syllabusSemesterList[index][1] = Number(tempSyllabus.course_valid_to.join(''))
          }
          syllabusList.push(tempSyllabus)
        }
      } else {
        syllabusList[0] = this.getSyllabusData(courseResult, 0, language)
      }
      console.log('!! syllabusSemesterList and syllabusList: OK !!')

      //* **** Get a list of rounds and a list of redis keys for using to get teachers and responsibles from ugRedis *****//
      const roundList = this.getRounds(courseResult.roundInfos, courseCode, language)

      //* **** Sets roundsSyllabusIndex, an array used for connecting rounds with correct syllabus *****//
      this.getRoundsAndSyllabusConnection(syllabusSemesterList)

      //* **** Get the index for start informatin based on time of year *****/
      this.defaultIndex = this.getCurrentSemesterToShow()
      syllabusSemesterList = toJS(syllabusSemesterList)
      this.courseData = {
        syllabusList,
        courseInfo,
        roundList,
        courseTitleData,
        syllabusSemesterList,
        language
      }
    }).catch(err => {
      if (err.response) {
        throw err
      }
      throw err
    })
  }
  /** ***************************************************************************************************************************************** */
  /*                                                          BASIC COURSE DATA                                                                */
  /** ***************************************************************************************************************************************** */

  getTitleData (courseResult) {
    return {
      course_code: this.isValidData(courseResult.course.courseCode),
      course_title: this.isValidData(courseResult.course.title),
      course_other_title: this.isValidData(courseResult.course.titleOther),
      course_credits: this.isValidData(courseResult.course.credits)
    }
  }

  getCourseDefaultInformation (courseResult, language) {
    return {
      course_code: this.isValidData(courseResult.course.courseCode),
      course_grade_scale: this.isValidData(courseResult.formattedGradeScales[courseResult.course.gradeScaleCode], language), // TODO: can this be an array?
      course_level_code: this.isValidData(courseResult.course.educationalLevelCode),
      course_main_subject: courseResult.mainSubjects && courseResult.mainSubjects.length > 0 ? courseResult.mainSubjects.join(', ') : EMPTY[language],
      course_recruitment_text: this.isValidData(courseResult.course.recruitmentText, language),
      course_department: this.isValidData(courseResult.course.department.name, language),
      course_department_link: this.isValidData(courseResult.course.department.name, language) !== EMPTY[language] ? '<a href="/' + courseResult.course.department.name.split('/')[0].toLowerCase() + '/" target="blank">' + courseResult.course.department.name + '</a>' : EMPTY[language],
      course_department_code: this.isValidData(courseResult.course.department.code, language),
      course_contact_name: this.isValidData(courseResult.course.infoContactName, language).replace('<', '').replace('>', ''),
      course_prerequisites: this.isValidData(courseResult.course.prerequisites, language),
      course_suggested_addon_studies: this.isValidData(courseResult.course.addOn, language),
      course_supplemental_information_url: this.isValidData(courseResult.course.supplementaryInfoUrl, language),
      course_supplemental_information_url_text: this.isValidData(courseResult.course.supplementaryInfoUrlName, language),
      course_supplemental_information: this.isValidData(courseResult.course.supplementaryInfo, language),
      course_examiners: EMPTY[language],
      course_last_exam: courseResult.course.lastExamTerm ? courseResult.course.lastExamTerm.term.toString().match(/.{1,4}/g) : []
    }
  }

  /** ***************************************************************************************************************************************** */
  /*                                                                SYLLABUS                                                                   */
  /** ***************************************************************************************************************************************** */

  getSyllabusData (courseResult, semester = 0, language) {
    // console.log("courseResult.examinationSets",courseResult.examinationSets)

    return {
      course_goals: courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0 ? this.isValidData(courseResult.publicSyllabusVersions[semester].courseSyllabus.goals, language) : EMPTY[language],
      course_content: courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0 ? this.isValidData(courseResult.publicSyllabusVersions[semester].courseSyllabus.content, language) : EMPTY[language],
      course_disposition: courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0 ? this.isValidData(courseResult.publicSyllabusVersions[semester].courseSyllabus.disposition, language) : EMPTY[language],
      course_eligibility: courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0 ? this.isValidData(courseResult.publicSyllabusVersions[semester].courseSyllabus.eligibility, language) : EMPTY[language],
      course_requirments_for_final_grade: courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0 ? this.isValidData(courseResult.publicSyllabusVersions[semester].courseSyllabus.reqsForFinalGrade, language) : EMPTY[language],
      course_literature: courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0 ? this.isValidData(courseResult.publicSyllabusVersions[semester].courseSyllabus.literature, language) : EMPTY[language],
      course_literature_comment: courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0 ? this.isValidData(courseResult.publicSyllabusVersions[semester].courseSyllabus.literatureComment, language) : EMPTY[language],
      course_valid_from: courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0 ? this.isValidData(courseResult.publicSyllabusVersions[semester].validFromTerm.term).toString().match(/.{1,4}/g) : [],
      course_valid_to: [],
      course_required_equipment: courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0 ? this.isValidData(courseResult.publicSyllabusVersions[semester].courseSyllabus.requiredEquipment, language) : EMPTY[language],
      course_examination: courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0 && courseResult.examinationSets && Object.keys(courseResult.examinationSets).length > 0 ? this.getExamObject(courseResult.examinationSets, courseResult.formattedGradeScales, language, courseResult.publicSyllabusVersions[semester].validFromTerm.term) : EMPTY[language],
      course_examination_comments: courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0 ? this.isValidData(courseResult.publicSyllabusVersions[semester].courseSyllabus.examComments, language) : EMPTY[language]
    }
  }

  //* *** Sets the end semester for older syllabuses *****/
  getSyllabusEndSemester (newerSyllabus) {
    if (newerSyllabus[1] === '1') {
      return [Number(newerSyllabus[0]) - 1, '2']
    } else {
      return [Number(newerSyllabus[0]), '1']
    }
  }

  //* *** Default syllabus might change when the dates set in MAX_(semester)_DAY and MAX_(semester)_MONTH is passed ****/
  @action getCurrentSemesterToShow (date = '') {
    if (this.activeSemesters.length === 0) {
      return 0
    }
    let thisDate = date === '' ? new Date() : new Date(date)
    let showSemester = 0
    let returnIndex = -1
    let yearMatch = -1

    //* ***** Calculating current semester based on todays date ******/
    if (thisDate.getMonth() + 1 >= MAX_1_MONTH && thisDate.getMonth() + 1 < MAX_2_MONTH) {
      showSemester = `${thisDate.getFullYear()}2`
    } else {
      if (thisDate.getMonth() + 1 < MAX_1_MONTH) {
        showSemester = `${thisDate.getFullYear()}1`
      } else {
        showSemester = `${thisDate.getFullYear() + 1}1`
      }
    }
    //* ***** Check if course has a round for current semester otherwise it shows the previous semester *****/
    for (let index = 0; index < this.activeSemesters.length; index++) {
      if (this.activeSemesters[index][2] === showSemester) {
        returnIndex = index
      }
      if (thisDate.getMonth() + 1 > MAX_2_MONTH && Number(this.activeSemesters[index][0]) === thisDate.getFullYear()) {
        yearMatch = index
      }
      if (thisDate.getMonth() + 1 < MAX_1_MONTH && Number(this.activeSemesters[index][0]) === thisDate.getFullYear() - 1) {
        yearMatch = index
      }
    }
    //* **** In case there should be no match at all, take the last senester in the list ******/
    if (returnIndex === -1 && yearMatch === -1) {
      return this.activeSemesters.length - 1
    }
    return returnIndex > -1 ? returnIndex : yearMatch
  }

  getExamObject (dataObject, grades, language = 0, semester = '') {
    var matchingExamSemester = ''
    Object.keys(dataObject).forEach(function (key) {
      if (Number(semester) >= Number(key)) {
        matchingExamSemester = key
      }
    })
    let examString = "<ul class='ul-no-padding' >"
    if (dataObject[matchingExamSemester] && dataObject[matchingExamSemester].examinationRounds.length > 0) {
      for (let exam of dataObject[matchingExamSemester].examinationRounds) {
        //* * Adding a decimal if it's missing in credits **/
        exam.credits = exam.credits !== EMPTY[language] && exam.credits.toString().length === 1 ? exam.credits + '.0' : exam.credits

        examString += `<li>${exam.examCode} - 
                          ${exam.title},
                          ${language === 0 ? exam.credits : exam.credits.toString().replace('.', ',')} ${language === 0 ? ' credits' : ' hp'},  
                          ${language === 0 ? 'Grading scale' : 'Betygskala'}: ${grades[exam.gradeScaleCode]}              
                          </li>`
      }
    }
    examString += '</ul>'
    // console.log('!!getExamObject is ok!!')
    return examString
  }

  /** ***************************************************************************************************************************************** */
  /*                                                                ROUNDS                                                                     */
  /** ***************************************************************************************************************************************** */

  getRounds (roundInfos, courseCode, language) {
    let tempList = []
    let courseRound
    let courseRoundList = {}
    for (let roundInfo of roundInfos) {
      courseRound = this.getRound(roundInfo, language)

      if (courseRound.round_course_term && tempList.indexOf(courseRound.round_course_term.join('')) < 0) {
        tempList.push(courseRound.round_course_term.join(''))
        this.activeSemesters.push([...courseRound.round_course_term, courseRound.round_course_term.join(''), 0])
        courseRoundList[courseRound.round_course_term.join('')] = []
      }
      courseRoundList[courseRound.round_course_term.join('')].push(courseRound)
      this.keyList.teachers.push(`${courseCode}.${courseRound.round_course_term[0]}${courseRound.round_course_term[1]}.${courseRound.roundId}.teachers`)
      this.keyList.responsibles.push(`${courseCode}.${courseRound.round_course_term[0]}${courseRound.round_course_term[1]}.${courseRound.roundId}.courseresponsible`)
    }
    this.activeSemesters.sort()

    console.log('!!courseRound2: OK !!')
    return courseRoundList
  }

  getRoundsAndSyllabusConnection (syllabusSemesterList) {
    for (let index = 0; index < this.activeSemesters.length; index++) {
      if (Number(syllabusSemesterList[0][0]) > Number(this.activeSemesters[index][2])) {
        for (let whileIndex = 1; whileIndex < syllabusSemesterList.length; whileIndex++) {
          if (Number(syllabusSemesterList[whileIndex][0]) > Number(this.activeSemesters[index][2])) {
            console.log('find other syllabus2')
          } else {
            this.roundsSyllabusIndex[index] = whileIndex
            break
          }
        }
      } else {
        this.roundsSyllabusIndex[index] = 0
      }
    }
  }

  getRound (roundObject, language = 0) {
    const courseRoundModel = {
      roundId: this.isValidData(roundObject.round.ladokRoundId, language),
      round_time_slots: this.isValidData(roundObject.timeslots, language),
      round_start_date: this.getDateFormat(this.isValidData(roundObject.round.firstTuitionDate, language), language),
      round_end_date: this.getDateFormat(this.isValidData(roundObject.round.lastTuitionDate, language), language),
      round_target_group: this.isValidData(roundObject.round.targetGroup, language),
      round_tutoring_form: this.isValidData(roundObject.round.tutoringForm.name, language),
      round_tutoring_time: this.isValidData(roundObject.round.tutoringTimeOfDay.name, language),
      round_tutoring_language: this.isValidData(roundObject.round.language, language),
      round_course_place: this.isValidData(roundObject.round.campus.label, language),
      round_campus: this.isValidData(roundObject.round.campus.name, language),
      round_short_name: this.isValidData(roundObject.round.shortName, language),
      round_application_code: this.isValidData(roundObject.round.applicationCodes[0].applicationCode, language),
      round_schedule: this.isValidData(roundObject.schemaUrl, language),
      round_course_term: this.isValidData(roundObject.round.startTerm.term, language).toString().length > 0 ? roundObject.round.startTerm.term.toString().match(/.{1,4}/g) : [],
      round_periods: this.getRoundPeriodes(roundObject.round.courseRoundTerms, language),
      round_seats: this.getRoundSeats(this.isValidData(roundObject.round.maxSeats, language), this.isValidData(roundObject.round.minSeats, language), language),
      round_type: roundObject.round.applicationCodes.length > 0 ? this.isValidData(roundObject.round.applicationCodes[0].courseRoundType.name, language) : EMPTY[language], // TODO: Map array
      round_application_link: this.isValidData(roundObject.admissionLinkUrl, language),
      round_part_of_programme: roundObject.usage.length > 0 ? this.getRoundProgramme(roundObject.usage, language) : EMPTY[language],
      round_state: this.isValidData(roundObject.round.state, language)
    }
    if (courseRoundModel.round_short_name === EMPTY[language]) {
      courseRoundModel.round_short_name = `${language === 0 ? 'Start date' : 'Startdatum'}  ${courseRoundModel.round_start_date}`
    }
    return courseRoundModel
  }

  getRoundProgramme (programmes, language = 0) {
    let programmeString = ''
    programmes.forEach(programme => {
      programmeString +=
        `<p>
          <a target="_blank" 
                  href="${PROGRAMME_URL}/${programme.programmeCode}/${programme.progAdmissionTerm.term}/arskurs${programme.studyYear}${programme.specCode ? '#inr' + programme.specCode : ''}">
                  ${programme.title}, ${language === 0 ? 'year' : 'åk'} ${programme.studyYear}, ${programme.specCode ? programme.specCode + ', ' : ''}${programme.electiveCondition.abbrLabel}
        </a>
      </p>`
    })
    return programmeString
  }

  getRoundPeriodes (periodeList, language = 0) {
    var periodeString = ''
    if (periodeList) {
      if (periodeList.length > 1) {
        periodeList.map(periode => {
          return periodeString += `<p class="periode-list">
                                ${i18n.messages[language].courseInformation.course_short_semester[periode.term.term.toString().match(/.{1,4}/g)[1]]} 
                                ${periode.term.term.toString().match(/.{1,4}/g)[0]}: 
                                ${periode.formattedPeriodsAndCredits}
                                </p>`
        })
        return periodeString
      } else {
        return periodeList[0].formattedPeriodsAndCredits
      }
    }
    return EMPTY[language]
  }

  getRoundSeats (max, min, language) {
    if (max === EMPTY[language] && min === EMPTY[language]) {
      return EMPTY[language]
    }
    if (max !== EMPTY[language]) {
      if (min !== EMPTY[language]) {
        return min + ' - ' + max
      }
    } else {
      return 'Max: ' + max
    }
    return 'Min: ' + min
  }

  getDateFormat (date, language) {
    if (date === EMPTY[language] || language === 1) {
      return date
    }
    const splitDate = date.split('-')
    return `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`
  }

  /** ***************************************************************************************************************************************** */
  /*                                                                ADMIN                                                                      */
  /** ***************************************************************************************************************************************** */
  getImage (courseCode, type = 'normal') {
    const image = `${Math.floor((Math.random() * 7) + 1)}_${type}.jpg`
    const response = axios.get(this.buildApiUrl(this.paths.api.setImage.uri, { courseCode: courseCode, imageName: image })).then(response => {
      // console.log("IMAGE SET->",response, image)
    })
      .catch(err => {
        if (err.response) {
          throw new Error(err.message, err.response.data)
        }
        throw err
      })
    return `${this.browserConfig.proxyPrefixPath.uri}${COURSE_IMG_URL}${image}`
  }

  @action getCourseAdminInfo (courseCode, imageList, lang = 'sv') {
    return axios.get(this.buildApiUrl(this.paths.api.sellingText.uri, { courseCode: courseCode }), this._getOptions()).then(res => {
      this.showCourseWebbLink = res.data.isCourseWebLink
      this.sellingText = res.data.sellingText
      this.image = res.data.imageInfo /* && res.data.imageInfo.length > 0 */ ? this.browserConfig.proxyPrefixPath.uri + COURSE_IMG_URL + res.data.imageInfo : this.getImage(courseCode, 'normal') // TODO:
    }).catch(err => {
      if (err.response) {
        throw new Error(err.message, err.response.data)
      }
      throw err
    })
  }

  /** ***************************************************************************************************************************************** */
  /*                                            UG REDIS - examiners, teachers and responsibles                                                */
  /** ***************************************************************************************************************************************** */
  @action getCourseEmployeesPost (key, type = 'multi', lang = 'sv') {

    if (Object.getOwnPropertyNames(this.courseData.roundList).length === 0) return ''

    return axios.post(this.buildApiUrl(this.paths.redis.ugCache.uri, { key: key, type: type }), this._getOptions(JSON.stringify(this.keyList))).then(result => {
      const returnValue = result.data
      const emptyString = EMPTY[this.courseData.language]
      let roundList = this.courseData.roundList
      let roundId = 0
      let toTeacherObject
      let toResponsiblepObject
      const thisStore = this

      Object.keys(roundList).forEach(function (key) {
        let rounds = roundList[key]

        for (let index = 0; index < rounds.length; index++) {
          toTeacherObject = JSON.parse(returnValue[0][roundId])
          toResponsiblepObject = JSON.parse(returnValue[1][roundId])

          rounds[index].round_teacher = toTeacherObject !== null && toTeacherObject.length > 0 ? thisStore.createPersonHtml(toTeacherObject, 'teacher') : emptyString
          rounds[index].round_responsibles = toResponsiblepObject !== null && toResponsiblepObject.length > 0 ? thisStore.createPersonHtml(toResponsiblepObject, 'responsible') : emptyString
          roundId++
        }
        thisStore.courseData.roundList[key] = rounds
      })
    }).catch(err => {
      if (err.response) {
        throw new Error(err.message, err.response.data)
      }
      throw err
    })
  }

  @action getCourseEmployees (key, type = 'examinator', lang = 0) {
    return axios.get(this.buildApiUrl(this.paths.redis.ugCache.uri, { key: key, type: type })).then(result => {
      this.courseData.courseInfo.course_examiners = result.data && result.data.length > 0 ? this.createPersonHtml(result.data, 'examiner') : EMPTY[this.courseData.language]
    }).catch(err => {
      if (err.response) {
        throw new Error(err.message, err.response.data)
      }
      throw err
    })
  }

  isValidData (dataObject, language = 0) {
    return !dataObject ? EMPTY[language] : dataObject
  }

  createPersonHtml (personList, type) {
    let personString = ''
    personList.forEach(person => {
      personString +=
          `<p class = "person">
          <i class="fas fa-user-alt"></i>
            <a href="/profile/${person.username}/" target="_blank" property="teach:teacher">
              ${person.givenName} ${person.lastName} 
            </a> 
          </p>  `
      if (this.user === person.username && (type === 'responsible' || type === 'examiner')) {
        this.canEdit = true
      }
    })

    return personString
  }
  /** ***********************************************************************************************************************/

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
      url: `/student/kurser/org/${this.courseData.courseInfo.course_department_code}`,
      label: this.courseData.courseInfo.course_department
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
      this.cookieHeader = cookieHeader || ''
    }
  }

  @action getBrowserInfo () {
    var navAttrs = ['appCodeName', 'appName', 'appMinorVersion', 'cpuClass',
      'platform', 'opsProfile', 'userProfile', 'systemLanguage',
      'userLanguage', 'appVersion', 'userAgent', 'onLine', 'cookieEnabled']
    var docAttrs = ['referrer', 'title', 'URL']
    var value = { document: {}, navigator: {} }

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
