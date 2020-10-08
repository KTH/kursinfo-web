'use strict'

import { observable, action, toJS } from 'mobx'
import axios from 'axios'
import { EMPTY, PROGRAMME_URL, MAX_1_MONTH, MAX_2_MONTH } from '../util/constants'
import i18n from '../../../../i18n'

const paramRegex = /\/(:[^/\s]*)/g

function _paramReplace(path, params) {
  let tmpPath = path
  const tmpArray = tmpPath.match(paramRegex)
  if (tmpArray) {
    tmpArray.forEach((element) => {
      tmpPath = tmpPath.replace(element, '/' + params[element.slice(2)])
    })
  }
  return tmpPath
}

function _webUsesSSL(url) {
  return url.startsWith('https:')
}

function isValidData(dataObject, language = 0, setEmpty = false) {
  const emptyText = setEmpty ? '' : EMPTY[language]
  return !dataObject ? emptyText : dataObject
}

function getTitleData(courseResult) {
  return {
    course_code: isValidData(courseResult.course.courseCode),
    course_title: isValidData(courseResult.course.title),
    course_other_title: isValidData(courseResult.course.titleOther),
    course_credits: isValidData(courseResult.course.credits),
    course_credits_text: isValidData(courseResult.course.creditUnitAbbr)
  }
}

/** ***************************************************************************************************************************************** */
/*                                                          BASIC COURSE DATA                                                                */
/** ***************************************************************************************************************************************** */

function getCourseDefaultInformation(courseResult, language) {
  return {
    course_code: isValidData(courseResult.course.courseCode),
    course_application_info: isValidData(courseResult.course.applicationInfo, language, true),
    course_grade_scale: isValidData(courseResult.formattedGradeScales[courseResult.course.gradeScaleCode], language), // TODO: can this be an array?
    course_level_code: isValidData(courseResult.course.educationalLevelCode),
    course_main_subject:
      courseResult.mainSubjects && courseResult.mainSubjects.length > 0
        ? courseResult.mainSubjects.join(', ')
        : EMPTY[language],
    course_recruitment_text: isValidData(courseResult.course.recruitmentText, language, true),
    course_department: isValidData(courseResult.course.department.name, language),
    course_department_link:
      isValidData(courseResult.course.department.name, language) !== EMPTY[language]
        ? '<a href="/' +
          courseResult.course.department.name.split('/')[0].toLowerCase() +
          '/" target="blank">' +
          courseResult.course.department.name +
          '</a>'
        : EMPTY[language],
    course_department_code: isValidData(courseResult.course.department.code, language),
    course_contact_name: isValidData(courseResult.course.infoContactName, language).replace('<', '').replace('>', ''),
    course_prerequisites: isValidData(courseResult.course.prerequisites, language),
    course_suggested_addon_studies: isValidData(courseResult.course.addOn, language),
    course_supplemental_information_url: isValidData(courseResult.course.supplementaryInfoUrl, language),
    course_supplemental_information_url_text: isValidData(courseResult.course.supplementaryInfoUrlName, language),
    course_supplemental_information: isValidData(courseResult.course.supplementaryInfo, language),
    course_examiners: EMPTY[language],
    course_last_exam: courseResult.course.lastExamTerm
      ? courseResult.course.lastExamTerm.term.toString().match(/.{1,4}/g)
      : [],
    course_web_link: isValidData(courseResult.socialCoursePageUrl, language),
    // New fields in kopps
    course_spossibility_to_completions: isValidData(courseResult.course.possibilityToCompletion, language),
    course_disposition: isValidData(courseResult.course.courseDeposition, language),
    course_possibility_to_addition: isValidData(courseResult.course.possibilityToAddition, language),
    course_literature: isValidData(courseResult.course.courseLiterature, language),
    course_required_equipment: isValidData(courseResult.course.requiredEquipment, language),
    course_state: isValidData(courseResult.course.state, language, true)
    // course_decision_to_discontinue: isValidData(courseResult.course.decisionToDiscontinue, language)
  }
}

//* *** Sets the end semester for older syllabuses *****/
function getSyllabusEndSemester(newerSyllabus) {
  if (newerSyllabus[1] === '1') {
    return [Number(newerSyllabus[0]) - 1, '2']
  }
  return [Number(newerSyllabus[0]), '1']
}

function getRoundProgramme(programmes, language = 0) {
  let programmeString = ''
  programmes.forEach((programme) => {
    programmeString += `<p>
        <a href="${PROGRAMME_URL}/${programme.programmeCode}/${programme.progAdmissionTerm.term}/arskurs${
      programme.studyYear
    }${programme.specCode ? '#inr' + programme.specCode : ''}">
          ${programme.title}, ${language === 0 ? 'year' : 'åk'} ${programme.studyYear}, ${
      programme.specCode ? programme.specCode + ', ' : ''
    }${programme.electiveCondition.abbrLabel}
      </a>
    </p>`
  })
  return programmeString
}

function getRoundPeriodes(periodeList, language = 0) {
  let periodeString = ''
  if (periodeList) {
    if (periodeList.length > 1) {
      periodeList.map((periode) => {
        periodeString += `<p class="periode-list">
                              ${
                                i18n.messages[language].courseInformation.course_short_semester[
                                  periode.term.term.toString().match(/.{1,4}/g)[1]
                                ]
                              } 
                              ${periode.term.term.toString().match(/.{1,4}/g)[0]}: 
                              ${periode.formattedPeriodsAndCredits}
                              </p>`
      })
      return periodeString
    }
    return periodeList[0].formattedPeriodsAndCredits
  }
  return EMPTY[language]
}

function getRoundSeats(max, min, language) {
  if (max === EMPTY[language] && min === EMPTY[language]) {
    return EMPTY[language]
  }
  if (max !== EMPTY[language]) {
    if (min !== EMPTY[language]) {
      return min + ' - ' + max
    }
    return 'Max: ' + max
  }
  return 'Min: ' + min
}

function getDateFormat(date, language) {
  if (date === EMPTY[language] || language === 1) {
    return date
  }
  const splitDate = date.split('-')
  return `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`
}

function getExamObject(dataObject, grades, language = 0, semester = '', courseCredit) {
  let matchingExamSemester = ''
  Object.keys(dataObject).forEach((key) => {
    if (Number(semester) >= Number(key)) {
      matchingExamSemester = key
    }
  })
  let examString = "<ul className='ul-no-padding' >"
  if (dataObject[matchingExamSemester] && dataObject[matchingExamSemester].examinationRounds.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const exam of dataObject[matchingExamSemester].examinationRounds) {
      if (exam.credits) {
        //* * Adding a decimal if it's missing in credits **/
        exam.credits =
          exam.credits !== '' && exam.credits.toString().indexOf('.') < 0 ? exam.credits + '.0' : exam.credits
      } else {
        exam.credits = '-'
      }

      examString += `<li>${exam.examCode} - 
                        ${exam.title},
                        ${language === 0 ? exam.credits : exam.credits.toString().replace('.', ',')} ${
        language === 0 ? ' credits' : courseCredit
      },  
                        ${language === 0 ? 'Grading scale' : 'betygsskala'}: ${
        grades[exam.gradeScaleCode]
      }              
                        </li>`
    }
  }
  examString += '</ul>'

  return examString
}

function getRounds(roundObject, language = 0) {
  const courseRoundModel = {
    roundId: isValidData(roundObject.round.ladokRoundId, language),
    round_time_slots: isValidData(roundObject.timeslots, language),
    round_start_date: getDateFormat(isValidData(roundObject.round.firstTuitionDate, language), language),
    round_end_date: getDateFormat(isValidData(roundObject.round.lastTuitionDate, language), language),
    round_target_group: isValidData(roundObject.round.targetGroup, language),
    round_tutoring_form: isValidData(roundObject.round.tutoringForm.name, language),
    round_tutoring_time: isValidData(roundObject.round.tutoringTimeOfDay.name, language),
    round_tutoring_language: isValidData(roundObject.round.language, language),
    round_course_place: isValidData(roundObject.round.campus.label, language),
    round_campus: isValidData(roundObject.round.campus.name, language),
    round_short_name: isValidData(roundObject.round.shortName, language),
    round_application_code: isValidData(roundObject.round.applicationCodes[0].applicationCode, language),
    round_schedule: isValidData(roundObject.schemaUrl, language),
    round_course_term:
      isValidData(roundObject.round.startTerm.term, language).toString().length > 0
        ? roundObject.round.startTerm.term.toString().match(/.{1,4}/g)
        : [],
    round_periods: getRoundPeriodes(roundObject.round.courseRoundTerms, language),
    round_seats: getRoundSeats(
      isValidData(roundObject.round.maxSeats, language),
      isValidData(roundObject.round.minSeats, language),
      language
    ),
    round_type:
      roundObject.round.applicationCodes.length > 0
        ? isValidData(roundObject.round.applicationCodes[0].courseRoundType.name, language)
        : EMPTY[language], // TODO: Map array
    round_application_link: isValidData(roundObject.admissionLinkUrl, language),
    round_part_of_programme:
      roundObject.usage.length > 0 ? getRoundProgramme(roundObject.usage, language) : EMPTY[language],
    round_state: isValidData(roundObject.round.state, language),
    round_comment: isValidData(roundObject.commentsToStudents, language, true),
    round_category:
      roundObject.round.applicationCodes.length > 0
        ? isValidData(roundObject.round.applicationCodes[0].courseRoundType.category, language)
        : EMPTY[language]
  }
  if (courseRoundModel.round_short_name === EMPTY[language]) {
    courseRoundModel.round_short_name = `${language === 0 ? 'Start date' : 'Startdatum'}  ${
      courseRoundModel.round_start_date
    }`
  }

  return courseRoundModel
}

/** ***************************************************************************************************************************************** */
/*                                                                SYLLABUS                                                                   */
/** ***************************************************************************************************************************************** */

function getSyllabusData(courseResult, semester = 0, language) {
  return {
    course_goals:
      courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0
        ? isValidData(courseResult.publicSyllabusVersions[semester].courseSyllabus.goals, language)
        : EMPTY[language],
    course_content:
      courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0
        ? isValidData(courseResult.publicSyllabusVersions[semester].courseSyllabus.content, language)
        : EMPTY[language],
    course_disposition:
      courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0
        ? isValidData(courseResult.publicSyllabusVersions[semester].courseSyllabus.disposition, language)
        : EMPTY[language],
    course_eligibility:
      courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0
        ? isValidData(courseResult.publicSyllabusVersions[semester].courseSyllabus.eligibility, language)
        : EMPTY[language],
    course_requirments_for_final_grade:
      courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0
        ? isValidData(courseResult.publicSyllabusVersions[semester].courseSyllabus.reqsForFinalGrade, language, true)
        : '',
    course_literature:
      courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0
        ? isValidData(courseResult.publicSyllabusVersions[semester].courseSyllabus.literature, language)
        : EMPTY[language],
    course_literature_comment:
      courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0
        ? isValidData(courseResult.publicSyllabusVersions[semester].courseSyllabus.literatureComment, language)
        : EMPTY[language],
    course_valid_from:
      courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0
        ? isValidData(courseResult.publicSyllabusVersions[semester].validFromTerm.term)
            .toString()
            .match(/.{1,4}/g)
        : [],
    course_valid_to: [],
    course_required_equipment:
      courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0
        ? isValidData(courseResult.publicSyllabusVersions[semester].courseSyllabus.requiredEquipment, language)
        : '',
    course_examination:
      courseResult.publicSyllabusVersions &&
      courseResult.publicSyllabusVersions.length > 0 &&
      courseResult.examinationSets &&
      Object.keys(courseResult.examinationSets).length > 0
        ? getExamObject(
            courseResult.examinationSets,
            courseResult.formattedGradeScales,
            language,
            courseResult.publicSyllabusVersions[semester].validFromTerm.term,
            courseResult.course.creditUnitAbbr
          )
        : EMPTY[language],
    course_examination_comments:
      courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0
        ? isValidData(courseResult.publicSyllabusVersions[semester].courseSyllabus.examComments, language, true)
        : '',
    // New fields in kopps
    course_ethical:
      courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0
        ? isValidData(courseResult.publicSyllabusVersions[semester].courseSyllabus.ethicalApproach, language, true)
        : '',
    course_establishment:
      courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0
        ? isValidData(courseResult.publicSyllabusVersions[semester].courseSyllabus.establishment, language, true)
        : '',
    course_additional_regulations:
      courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0
        ? isValidData(
            courseResult.publicSyllabusVersions[semester].courseSyllabus.additionalRegulations,
            language,
            true
          )
        : '',
    course_transitional_reg:
      courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0
        ? isValidData(
            courseResult.publicSyllabusVersions[semester].courseSyllabus.transitionalRegulations,
            language,
            true
          )
        : '',
    course_decision_to_discontinue:
      courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0
        ? isValidData(courseResult.publicSyllabusVersions[semester].courseSyllabus.decisionToDiscontinue, language)
        : ''
  }
  //
}

function createPersonHtml(personList) {
  let personString = ''
  personList.forEach((person) => {
    personString += `<p class = "person">
        <i class="fas fa-user-alt"></i>
          <a href="/profile/${person.username}/" property="teach:teacher">
            ${person.givenName} ${person.lastName} 
          </a> 
        </p>  `
  })

  return personString
}

class RouterStore {
  @observable courseCode = '' // Set from request parameters

  @observable sellingText = { en: '', sv: '' } // Set from kursinfo-admin-api

  @observable imageFromAdmin = '' // Set from kursinfo-admin-api

  @observable showCourseWebbLink = true // is set from kursinfo-admin ( not in use )

  @observable memoList = {} // Retrieved from kurs-pm-data-api

  @observable isCancelled = false // Retrieved from koppsCourseData, used to show an Alert on the course page

  @observable isDeactivated = false // Retrieved from koppsCourseData, used to show an Alert on the course page

  @observable keyList = {
    // key list to get information from ugRedis
    teachers: [],
    responsibles: []
  }

  @observable activeSemesters = [] // Computes syllabus to show based on todays date

  @observable roundsSyllabusIndex = [] // handles connection to syllabuses for active rounds

  @observable defaultIndex = 0

  @observable activeRoundIndex = 0

  @observable activeSemesterIndex = 0

  @observable activeSemester = 0

  @observable activeSyllabusIndex = 0

  @observable dropdownsOpen = {
    roundsDropdown: false,
    semesterDropdown: false
  }

  @observable roundInfoFade = false

  @observable syllabusInfoFade = false

  @observable showRoundData = false

  @observable roundDisabled = true

  @observable roundSelected = false

  @observable semesterSelectedIndex = 0

  @observable roundSelectedIndex = 0

  courseData = {
    courseInfo: {
      course_application_info: []
    },
    syllabusSemesterList: []
  }

  @action getCourseEmployees = () => {
    // console.log(this.paths.redis.ugCache.uri)
    // console.log(this.courseCode)
    // console.log(this.semester)
    // console.log(this.ladokRoundIds)
    // return axios
    //   .post(
    //     this.buildApiUrl(this.paths.redis.ugCache.uri, { key: key, type: type }),
    //     this._getOptions(JSON.stringify(this.keyList))
    //   )
    //   .then((result) => {
  }

  user = ''

  memoApiHasConnection = true

  buildApiUrl(path, params) {
    let host
    if (typeof window !== 'undefined') {
      host = this.apiHost
    } else {
      host = 'http://127.0.0.1:' + this.browserConfig.port
    }
    if (host[host.length - 1] === '/') {
      host = host.slice(0, host.length - 1)
    }
    const newPath = params ? _paramReplace(path, params) : path
    return [host, newPath].join('')
  }

  _getOptions(params) {
    // Pass Cookie header on SSR-calls
    let options
    if (typeof window === 'undefined') {
      options = {
        headers: {
          Cookie: this.cookieHeader,
          Accept: 'application/json',
          'X-Forwarded-Proto': _webUsesSSL(this.apiHost) ? 'https' : 'http'
        },
        timeout: 5000,
        params
      }
    } else {
      options = {
        params
      }
    }
    return options
  }

  /** ***************************************************************************************************************************************** */
  /*                                                       COLLECTED COURSE INFORMATION                                                        */
  /** ***************************************************************************************************************************************** */
  //* * Handeling the course information from kopps api.**//
  // @action getCourseInformation(courseCode, ldapUsername, lang = 'sv', roundIndex = 0) {
  //   return axios.get(this.buildApiUrl(this.paths.api.koppsCourseData.uri, { courseCode: courseCode, language: lang }), this._getOptions()).then((res) => {
  @action getCourseInformation(res, courseCode, ldapUsername, lang = 'sv') {
    // const courseResult = safeGet(() => res.data, {})
    const courseResult = res.body
    const language = lang === 'en' ? 0 : 1

    // this.isCancelled = courseResult.course.cancelled
    // this.isDeactivated = courseResult.course.deactivated
    this.user = ldapUsername

    //* **** Coruse information that is static on the course side *****//
    const courseInfo = getCourseDefaultInformation(courseResult, language)

    //* **** Course title data  *****//
    const courseTitleData = getTitleData(courseResult)

    //* **** Get list of syllabuses and valid syllabus semesters *****//
    const syllabusList = []
    let syllabusSemesterList = []
    let tempSyllabus = {}
    const syllabuses = courseResult.publicSyllabusVersions
    if (syllabuses.length > 0) {
      for (let index = 0; index < syllabuses.length; index + 1) {
        syllabusSemesterList.push([syllabuses[index].validFromTerm.term, ''])
        tempSyllabus = getSyllabusData(courseResult, index, language)
        if (index > 0) {
          tempSyllabus.course_valid_to = getSyllabusEndSemester(
            syllabusSemesterList[index - 1][0].toString().match(/.{1,4}/g)
          )
          syllabusSemesterList[index][1] = Number(tempSyllabus.course_valid_to.join(''))
        }
        syllabusList.push(tempSyllabus)
      }
    } else {
      syllabusList[0] = getSyllabusData(courseResult, 0, language)
    }

    //* **** Get a list of rounds and a list of redis keys for using to get teachers and responsibles from ugRedis *****//
    const roundList = getRounds(courseResult.roundInfos, courseCode, language)

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
    // }).catch(err => {
    //   // The request was made and the server responded with a status code
    //   // that falls out of the range of 2xx
    //   if (err.response) {
    //     throw err
    //   // The request was made but no response was received
    //   // `error.request` is an instance of http.ClientRequest
    //   } else if (err.request) {
    //     throw new Error(err.message, err.request)
    //   }
    //   throw err
    // })
  }

  //* *** Default syllabus might change when the dates set in MAX_(semester)_DAY and MAX_(semester)_MONTH is passed ****/
  @action getCurrentSemesterToShow(date = '') {
    if (this.activeSemesters.length === 0) {
      return 0
    }
    const thisDate = date === '' ? new Date() : new Date(date)
    let showSemester = 0
    let returnIndex = -1
    let yearMatch = -1

    //* ***** Calculating current semester based on todays date ******/
    if (thisDate.getMonth() + 1 >= MAX_1_MONTH && thisDate.getMonth() + 1 < MAX_2_MONTH) {
      showSemester = `${thisDate.getFullYear()}2`
    } else {
      showSemester =
        thisDate.getMonth() + 1 < MAX_1_MONTH ? `${thisDate.getFullYear()}1` : `${thisDate.getFullYear() + 1}1`
    }
    //* ***** Check if course has a round for current semester otherwise it shows the previous semester *****/
    for (let index = 0; index < this.activeSemesters.length; index + 1) {
      if (this.activeSemesters[index][2] === showSemester) {
        returnIndex = index
      }
      if (thisDate.getMonth() + 1 > MAX_2_MONTH && Number(this.activeSemesters[index][0]) === thisDate.getFullYear()) {
        yearMatch = index
      }
      if (
        thisDate.getMonth() + 1 < MAX_1_MONTH &&
        Number(this.activeSemesters[index][0]) === thisDate.getFullYear() - 1
      ) {
        yearMatch = index
      }
    }
    //* **** In case there should be no match at all, take the last senester in the list ******/
    if (returnIndex === -1 && yearMatch === -1) {
      return this.activeSemesters.length - 1
    }
    return returnIndex > -1 ? returnIndex : yearMatch
  }

  /** ***************************************************************************************************************************************** */
  /*                                                                ROUNDS                                                                     */
  /** ***************************************************************************************************************************************** */

  getRounds(roundInfos, courseCode, language) {
    const tempList = []
    let courseRound
    const courseRoundList = {}
    let memoId = ''
    // eslint-disable-next-line no-restricted-syntax
    for (const roundInfo of roundInfos) {
      courseRound = this.getRound(roundInfo, language)
      memoId = courseCode + '_' + courseRound.round_course_term.join('') + '_' + courseRound.roundId
      // courseRound.memoFile =
      if (courseRound.round_course_term && tempList.indexOf(courseRound.round_course_term.join('')) < 0) {
        tempList.push(courseRound.round_course_term.join(''))
        this.activeSemesters.push([...courseRound.round_course_term, courseRound.round_course_term.join(''), 0])
        courseRoundList[courseRound.round_course_term.join('')] = []
      }

      if (this.memoList[memoId]) {
        courseRound.round_memoFile = {
          fileName: this.memoList[memoId].courseMemoFileName,
          fileDate: getDateFormat(this.memoList[memoId].pdfMemoUploadDate, language)
        }
      }
      courseRoundList[courseRound.round_course_term.join('')].push(courseRound)
      this.keyList.teachers.push(
        `${courseCode}.${courseRound.round_course_term[0]}${courseRound.round_course_term[1]}.${courseRound.roundId}.teachers`
      )
      this.keyList.responsibles.push(
        `${courseCode}.${courseRound.round_course_term[0]}${courseRound.round_course_term[1]}.${courseRound.roundId}.courseresponsible`
      )
    }
    this.activeSemesters.sort()
    this.keyList.teachers.sort()
    this.keyList.responsibles.sort()

    return courseRoundList
  }

  getRoundsAndSyllabusConnection(syllabusSemesterList) {
    for (let index = 0; index < this.activeSemesters.length; index + 1) {
      if (Number(syllabusSemesterList[0][0]) > Number(this.activeSemesters[index][2])) {
        for (let whileIndex = 1; whileIndex < syllabusSemesterList.length; whileIndex + 1) {
          if (!(Number(syllabusSemesterList[whileIndex][0]) > Number(this.activeSemesters[index][2]))) {
            this.roundsSyllabusIndex[index] = whileIndex
            break
          }
        }
      } else {
        this.roundsSyllabusIndex[index] = 0
      }
    }
  }

  /** ***************************************************************************************************************************************** */
  /*                                                                ADMIN                                                                      */
  /** ***************************************************************************************************************************************** */

  // @action getCourseAdminInfo(res, courseCode, lang = 'sv') {
  //   // return axios
  //   //   .get(this.buildApiUrl(this.paths.api.sellingText.uri, { courseCode: courseCode }), this._getOptions())
  //   //   .then((res) => {
  //   this.showCourseWebbLink = true // res.data.isCourseWebLink
  //   this.sellingText = res.sellingText
  //   this.imageFromAdmin = res.imageInfo
  //   // })
  //   // .catch((err) => {
  //   //   if (err.response) {
  //   //     throw new Error(err.message, err.response.data)
  //   //   }
  //   //   throw err
  //   // })
  // }

  /** ***************************************************************************************************************************************** */
  /*                                                    COURSE MEMO FILES  - kurs-pm-api                                                                    */
  /** ***************************************************************************************************************************************** */

  // @action getCourseMemoFiles(courseCode, lang = 'sv') {
  //   //TODO-INTEGRATION: REMOVE
  //   return axios
  //     .get(this.buildApiUrl(this.paths.api.memoData.uri, { courseCode }), this._getOptions())
  //     .then((res) => {
  //       this.showCourseWebbLink = true // res.data.isCourseWebLink
  //       this.memoList = res.data
  //     })
  //     .catch((err) => {
  //       if (err.response) {
  //         throw new Error(err.message, err.response.data)
  //       }
  //       throw err
  //     })
  // }

  /** ***************************************************************************************************************************************** */
  /*                                            UG REDIS - examiners, teachers and responsibles                                                */
  /** ***************************************************************************************************************************************** */
  @action getCourseEmployeesPost(result) {
    // if (Object.getOwnPropertyNames(this.courseData.roundList).length === 0) return ''

    // return axios
    //   .post(
    //     this.buildApiUrl(this.paths.redis.ugCache.uri, { key: key, type: type }),
    //     this._getOptions(JSON.stringify(this.keyList))
    //   )
    //   .then((result) => {
    const returnValue = result.data
    const emptyString = EMPTY[this.courseData.language]
    const { roundList } = this.courseData
    let roundId = 0
    let toTeacherObject
    let toResponsiblepObject
    const thisStore = this

    Object.keys(roundList).forEach((key) => {
      const rounds = roundList[key]

      for (let index = 0; index < rounds.length; index + 1) {
        toTeacherObject = JSON.parse(returnValue[0][roundId])
        toResponsiblepObject = JSON.parse(returnValue[1][roundId])

        rounds[index].round_teacher =
          toTeacherObject !== null && toTeacherObject.length > 0
            ? createPersonHtml(toTeacherObject, 'teacher')
            : emptyString
        rounds[index].round_responsibles =
          toResponsiblepObject !== null && toResponsiblepObject.length > 0
            ? createPersonHtml(toResponsiblepObject, 'responsible')
            : emptyString
        roundId += 1
      }
      thisStore.courseData.roundList[key] = rounds
    })
    // })
    // .catch((err) => {
    //   if (err.response) {
    //     throw new Error(err.message, err.response.data)
    //   }
    //   throw err
    // })
  }

  // eslint-disable-next-line class-methods-use-this
  @action getCourseEmployees(/* key, type = 'examinator', lang = 0 */) {
    return {}
    // return axios
    //   .get(this.buildApiUrl(this.paths.redis.ugCache.uri, { key: key, type: type }))
    //   .then((result) => {
    //     this.courseData.courseInfo.course_examiners =
    //       result.data && result.data.length > 0
    //         ? this.createPersonHtml(result.data, 'examiner')
    //         : EMPTY[this.courseData.language]
    //   })
    //   .catch((err) => {
    //     if (err.response) {
    //       throw new Error(err.message, err.response.data)
    //     }
    //     throw err
    //   })
  }

  /** ********************************************************************************************************************** */

  @action getLdapUserByUsername(params) {
    return axios
      .get(this.buildApiUrl(this.paths.api.searchLdapUser.uri, params), this._getOptions())
      .then((res) => {
        return res.data
      })
      .catch((err) => {
        if (err.response) {
          throw new Error(err.message, err.response.data)
        }
        throw err
      })
  }

  @action getBreadcrumbs() {
    if (!this.courseData) {
      this.courseData = {}
      this.courseData.courseInfo = {}
    }
    return {
      url: `/student/kurser/org/${this.courseData.courseInfo.course_department_code}`,
      label: this.courseData.courseInfo.course_department
    }
  }

  @action setBrowserConfig(config, paths, apiHost, profileBaseUrl) {
    this.browserConfig = config
    this.paths = paths
    this.apiHost = apiHost
    this.profileBaseUrl = profileBaseUrl
  }

  // eslint-disable-next-line camelcase
  @action __SSR__setCookieHeader(cookieHeader) {
    if (typeof window === 'undefined') {
      this.cookieHeader = cookieHeader || ''
    }
  }

  // eslint-disable-next-line class-methods-use-this
  @action getBrowserInfo() {
    const navAttrs = [
      'appCodeName',
      'appName',
      'appMinorVersion',
      'cpuClass',
      'platform',
      'opsProfile',
      'userProfile',
      'systemLanguage',
      'userLanguage',
      'appVersion',
      'userAgent',
      'onLine',
      'cookieEnabled'
    ]
    const docAttrs = ['referrer', 'title', 'URL']
    const value = { document: {}, navigator: {} }

    for (let i = 0; i < navAttrs.length; i + 1) {
      if (navigator[navAttrs[i]] || navigator[navAttrs[i]] === false) {
        value.navigator[navAttrs[i]] = navigator[navAttrs[i]]
      }
    }

    for (let i = 0; i < docAttrs.length; i + 1) {
      if (document[docAttrs[i]]) {
        value.document[docAttrs[i]] = document[docAttrs[i]]
      }
    }
    return value
  }

  initializeStore(storeName) {
    const store = this

    if (typeof window !== 'undefined' && window.__initialState__ && window.__initialState__[storeName]) {
      const tmp = JSON.parse(decodeURIComponent(window.__initialState__[storeName]))

      Object.keys(tmp).map((key) => {
        store[key] = tmp[key]
        delete tmp[key]
      })

      // Just a nice helper message
      if (Object.keys(window.__initialState__).length === 0) {
        window.__initialState__ = 'Mobx store state initialized'
      }
    }
  }
}

export default RouterStore
