'use strict'

const log = require('@kth/log')
const languageUtils = require('@kth/kth-node-web-common/lib/language')
const httpResponse = require('@kth/kth-node-response')
const courseApi = require('../apiCalls/kursinfoAdmin')
const memoApi = require('../apiCalls/memoApi')
const koppsCourseData = require('../apiCalls/koppsCourseData')
const ugRedisApi = require('../apiCalls/ugRedisApi')

const browserConfig = require('../configuration').browser
const serverConfig = require('../configuration').server
const paths = require('../server').getPaths()
const api = require('../api')
const { getServerSideFunctions } = require('../utils/serverSideRendering')
const { createServerSideContext } = require('../ssr-context/createServerSideContext')

const {
  INFORM_IF_IMPORTANT_INFO_IS_MISSING,
  INFORM_IF_IMPORTANT_INFO_IS_MISSING_ABOUT_MIN_FIELD_OF_STUDY,
  PROGRAMME_URL,
  MAX_1_MONTH,
  MAX_2_MONTH,
} = require('../util/constants')
const { formatVersionDate, getDateFormat } = require('../util/dates')
const i18n = require('../../i18n')

function isValidData(dataObject, language, setEmpty = false) {
  const emptyText = setEmpty ? '' : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language]
  return !dataObject ? emptyText : dataObject
}

function isValidContact(infoContactName, language) {
  const courseContactName = isValidData(infoContactName, language)
  if (courseContactName === INFORM_IF_IMPORTANT_INFO_IS_MISSING[language]) return courseContactName

  let cleanFormat = courseContactName.replace('<', '') // two lines because of CodeQuality
  cleanFormat = courseContactName.replace('>', '')
  return cleanFormat
}

async function getCourseEmployees(req, res, next) {
  const apiMemoData = req.body
  const courseEmployees = await ugRedisApi.getCourseEmployees(apiMemoData)
  res.send(courseEmployees)
}

async function getKoppsCourseData(req, res, next) {
  const { courseCode } = req.params
  const language = req.params.language || 'sv'
  log.debug('Get Kopps course data for: ', courseCode, language)
  try {
    const apiResponse = await koppsCourseData.getKoppsCourseData(courseCode, language)
    log.debug('Got response from Kopps API for: ', courseCode, language)
    if (apiResponse.statusCode && apiResponse.statusCode === 200) {
      log.debug('OK response from Kopps API for: ', courseCode, language)
      return httpResponse.json(res, apiResponse.body)
    }
    log.debug('NOK response from Kopps API for: ', courseCode, language)
    const statusCode = apiResponse.statusCode ? apiResponse.statusCode : 500
    res.status(statusCode)
    res.statusCode = statusCode
    res.send(courseCode)
  } catch (err) {
    return err
  }
}

function _getCourseDefaultInformation(courseResult, language) {
  return {
    course_code: isValidData(courseResult.course.courseCode),
    course_application_info: isValidData(courseResult.course.applicationInfo, language, true),
    course_grade_scale: isValidData(courseResult.formattedGradeScales[courseResult.course.gradeScaleCode], language),
    course_level_code: isValidData(courseResult.course.educationalLevelCode),
    course_main_subject:
      courseResult.mainSubjects && courseResult.mainSubjects.length > 0
        ? courseResult.mainSubjects.join(', ')
        : INFORM_IF_IMPORTANT_INFO_IS_MISSING_ABOUT_MIN_FIELD_OF_STUDY[language],
    course_recruitment_text: isValidData(courseResult.course.recruitmentText, language, true),
    course_department: isValidData(courseResult.course.department.name, language),
    course_department_link:
      isValidData(courseResult.course.department.name, language) !== INFORM_IF_IMPORTANT_INFO_IS_MISSING[language]
        ? '<a href="/' +
          courseResult.course.department.name.split('/')[0].toLowerCase() +
          '/" target="blank">' +
          courseResult.course.department.name +
          '</a>'
        : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    course_department_code: isValidData(courseResult.course.department.code, language),
    course_contact_name: isValidContact(courseResult.course.infoContactName, language),
    course_prerequisites: isValidData(courseResult.course.prerequisites, language),
    course_suggested_addon_studies: isValidData(courseResult.course.addOn, language),
    course_supplemental_information_url: isValidData(courseResult.course.supplementaryInfoUrl, language),
    course_supplemental_information_url_text: isValidData(courseResult.course.supplementaryInfoUrlName, language),
    course_supplemental_information: isValidData(courseResult.course.supplementaryInfo, language),
    course_examiners: INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    course_last_exam: courseResult.course.lastExamTerm
      ? courseResult.course.lastExamTerm.term.toString().match(/.{1,4}/g)
      : [],
    course_web_link: isValidData(courseResult.socialCoursePageUrl, language),
    course_spossibility_to_completions: isValidData(courseResult.course.possibilityToCompletion, language),
    course_disposition: isValidData(courseResult.course.courseDeposition, language),
    course_possibility_to_addition: isValidData(courseResult.course.possibilityToAddition, language),
    course_literature: isValidData(courseResult.course.courseLiterature, language),
    course_required_equipment: isValidData(courseResult.course.requiredEquipment, language),
    course_state: isValidData(courseResult.course.state, language, true),
  }
}

function _getTitleData(courseResult) {
  return {
    course_code: isValidData(courseResult.course.courseCode),
    course_title: isValidData(courseResult.course.title),
    course_other_title: isValidData(courseResult.course.titleOther),
    course_credits: isValidData(courseResult.course.credits),
    course_credits_text: isValidData(courseResult.course.creditUnitAbbr),
  }
}

function getExamObject(dataObject, grades, language = 0, semester = '', courseCredit) {
  var matchingExamSemester = ''
  Object.keys(dataObject).forEach(key => {
    if (Number(semester) >= Number(key)) {
      matchingExamSemester = key
    }
  })
  let examString = "<ul class='ul-no-padding' >"
  if (dataObject[matchingExamSemester] && dataObject[matchingExamSemester].examinationRounds.length > 0) {
    for (let exam of dataObject[matchingExamSemester].examinationRounds) {
      if (exam.credits) {
        //* * Adding a decimal if it's missing in credits **/
        exam.credits =
          exam.credits !== '' && exam.credits.toString().indexOf('.') < 0 ? exam.credits + '.0' : exam.credits
      } else {
        exam.credits = '-'
      }

      examString += `<li>${exam.examCode} - 
                        ${exam.title},
                        ${language === 'en' ? exam.credits : exam.credits.toString().replace('.', ',')} ${
        language === 'en' ? ' credits' : courseCredit
      },  
                        ${language === 'en' ? 'grading scale' : 'betygsskala'}: ${
        grades[exam.gradeScaleCode]
      }              
                        </li>`
    }
  }
  examString += '</ul>'
  return examString
}

function _getSyllabusData(courseResult, semester = 0, language) {
  return {
    course_goals:
      courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0
        ? isValidData(courseResult.publicSyllabusVersions[semester].courseSyllabus.goals, language)
        : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    course_content:
      courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0
        ? isValidData(courseResult.publicSyllabusVersions[semester].courseSyllabus.content, language)
        : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    course_disposition:
      courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0
        ? isValidData(courseResult.publicSyllabusVersions[semester].courseSyllabus.disposition, language)
        : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    course_eligibility:
      courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0
        ? isValidData(courseResult.publicSyllabusVersions[semester].courseSyllabus.eligibility, language)
        : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    course_requirments_for_final_grade:
      courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0
        ? isValidData(courseResult.publicSyllabusVersions[semester].courseSyllabus.reqsForFinalGrade, language, true)
        : '',
    course_literature:
      courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0
        ? isValidData(courseResult.publicSyllabusVersions[semester].courseSyllabus.literature, language)
        : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    course_literature_comment:
      courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0
        ? isValidData(courseResult.publicSyllabusVersions[semester].courseSyllabus.literatureComment, language)
        : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
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
        : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    course_examination_comments:
      courseResult.publicSyllabusVersions && courseResult.publicSyllabusVersions.length > 0
        ? isValidData(courseResult.publicSyllabusVersions[semester].courseSyllabus.examComments, language, true)
        : '',
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
        : '',
  }
  //
}

//* *** Sets the end semester for older syllabuses *****/
function _getSyllabusEndSemester(newerSyllabus) {
  if (newerSyllabus[1] === '1') {
    return [Number(newerSyllabus[0]) - 1, '2']
  }
  return [Number(newerSyllabus[0]), '1']
}

function _getRoundProgramme(programmes, language = 0) {
  let programmeString = ''
  programmes.forEach(programme => {
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

function _getRoundPeriodes(periodeList, language = 'sv') {
  var periodeString = ''
  if (periodeList) {
    if (periodeList.length > 1) {
      periodeList.map(
        periode =>
          (periodeString += `<p class="periode-list">
                              ${
                                i18n.messages[language === 'en' ? 0 : 1].courseInformation.course_short_semester[
                                  periode.term.term.toString().match(/.{1,4}/g)[1]
                                ]
                              } 
                              ${periode.term.term.toString().match(/.{1,4}/g)[0]}: 
                              ${periode.formattedPeriodsAndCredits}
                              </p>`)
      )
      return periodeString
    } else {
      return periodeList[0].formattedPeriodsAndCredits
    }
  }
  return INFORM_IF_IMPORTANT_INFO_IS_MISSING[language]
}

function _getRoundSeatsMsg(max, min) {
  if (!max && !min) {
    return ''
  }
  if (max) {
    if (min) {
      return min + ' - ' + max
    }
    return 'Max: ' + max
  }
  return min ? 'Min: ' + min : ''
}

function _getRound(roundObject, language = 'sv') {
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
    round_study_pace: isValidData(roundObject.round.studyPace, language),
    round_course_term:
      isValidData(roundObject.round.startTerm.term, language).toString().length > 0
        ? roundObject.round.startTerm.term.toString().match(/.{1,4}/g)
        : [],
    round_periods: _getRoundPeriodes(roundObject.round.courseRoundTerms, language),
    round_seats:
      _getRoundSeatsMsg(
        isValidData(roundObject.round.maxSeats, language, true),
        isValidData(roundObject.round.minSeats, language, true)
      ) || '',
    round_selection_criteria: isValidData(
      roundObject.round[language === 'en' ? 'selectionCriteriaEn' : 'selectionCriteriaSv'],
      language,
      true
    ),
    round_type:
      roundObject.round.applicationCodes.length > 0
        ? isValidData(roundObject.round.applicationCodes[0].courseRoundType.name, language)
        : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    round_funding_type:
      roundObject.round.applicationCodes.length > 0
        ? isValidData(roundObject.round.applicationCodes[0].courseRoundType.code, language)
        : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    round_application_link: isValidData(roundObject.admissionLinkUrl, language),
    round_part_of_programme:
      roundObject.usage.length > 0
        ? _getRoundProgramme(roundObject.usage, language)
        : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    round_state: isValidData(roundObject.round.state, language),
    round_comment: isValidData(roundObject.commentsToStudents, language, true),
    round_category:
      roundObject.round.applicationCodes.length > 0
        ? isValidData(roundObject.round.applicationCodes[0].courseRoundType.category, language)
        : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
  }
  if (courseRoundModel.round_short_name === INFORM_IF_IMPORTANT_INFO_IS_MISSING[language]) {
    courseRoundModel.round_short_name = `${language === 0 ? 'Start' : 'Start'}  ${courseRoundModel.round_start_date}`
  }

  return courseRoundModel
}

function _getRounds(roundInfos, courseCode, language, webContext) {
  const { activeSemesters: initActives, memoList, keyList: initkeyList } = { ...webContext }
  const tempList = []
  let courseRound
  const courseRoundList = {}
  for (let roundInfo of roundInfos) {
    courseRound = _getRound(roundInfo, language)
    const { round_course_term: yearAndTermArr, roundId: ladokRoundId } = courseRound
    const semester = yearAndTermArr.join('')

    if (yearAndTermArr && tempList.indexOf(semester) < 0) {
      tempList.push(semester)
      initActives.push([...yearAndTermArr, semester, 0])
      courseRoundList[semester] = []
    }

    const hasMemoForThisRound = !!(memoList[semester] && memoList[semester][ladokRoundId])
    if (hasMemoForThisRound) {
      const { isPdf, courseMemoFileName, lastChangeDate } = memoList[semester][ladokRoundId]
      if (isPdf) {
        courseRound['round_memoFile'] = {
          fileName: courseMemoFileName,
          fileDate: lastChangeDate ? formatVersionDate(language, lastChangeDate) : '',
        }
      }
    }
    courseRoundList[semester].push(courseRound)
    initkeyList.teachers.push(`${courseCode}.${semester}.${ladokRoundId}.teachers`)
    initkeyList.responsibles.push(`${courseCode}.${semester}.${ladokRoundId}.courseresponsible`)
  }
  initkeyList.teachers.sort()
  initkeyList.responsibles.sort()

  return { courseRoundList, activeSemesters: initActives.sort(), keyList: initkeyList }
}

function _getRoundsAndSyllabusConnection(syllabusSemesterList, webContext) {
  for (let index = 0; index < webContext.activeSemesters.length; index++) {
    if (Number(syllabusSemesterList[0][0]) > Number(webContext.activeSemesters[index][2])) {
      for (let whileIndex = 1; whileIndex < syllabusSemesterList.length; whileIndex++) {
        if (Number(syllabusSemesterList[whileIndex][0]) < Number(webContext.activeSemesters[index][2])) {
          webContext.roundsSyllabusIndex[index] = whileIndex
          break
        }
      }
    } else {
      webContext.roundsSyllabusIndex[index] = 0
    }
  }
}

function _generateSemesterBasedOnDate(thisDate) {
  let generatedSemester = 0
  if (thisDate.getMonth() + 1 >= MAX_1_MONTH && thisDate.getMonth() + 1 < MAX_2_MONTH) {
    generatedSemester = `${thisDate.getFullYear()}2`
  } else {
    generatedSemester =
      thisDate.getMonth() + 1 < MAX_1_MONTH ? `${thisDate.getFullYear()}1` : `${thisDate.getFullYear() + 1}1`
  }
  return generatedSemester
}

function _hasSemesterInArray(semesterNumber, semesters) {
  if (!semesterNumber) return false
  return semesters?.some(s => s[2] === semesterNumber)
}

//* *** Default syllabus might change when the dates set in MAX_(semester)_DAY and MAX_(semester)_MONTH is passed ****/
function _getSemesterIndexToShow(externalSemesterNumber, activeSemesters) {
  if (activeSemesters.length === 0) {
    return 0
  }
  const thisDate = new Date()
  let returnIndex = -1
  let yearMatch = -1

  //* ***** Calculating current semester based on todays date ******/
  const semesterNumber = externalSemesterNumber || _generateSemesterBasedOnDate(thisDate)

  //* ***** Check if course has a round for current semester otherwise it shows the previous semester *****/
  for (let index = 0; index < activeSemesters.length; index++) {
    if (activeSemesters[index][2] === semesterNumber) {
      returnIndex = index
    }
    if (thisDate.getMonth() + 1 > MAX_2_MONTH && Number(activeSemesters[index][0]) === thisDate.getFullYear()) {
      yearMatch = index
    }
    if (thisDate.getMonth() + 1 < MAX_1_MONTH && Number(activeSemesters[index][0]) === thisDate.getFullYear() - 1) {
      yearMatch = index
    }
  }
  //* **** In case there should be no match at all, take the last senester in the list ******/
  if (returnIndex === -1 && yearMatch === -1) {
    return activeSemesters.length - 1
  }
  return returnIndex > -1 ? returnIndex : yearMatch
}

function reorder(option, key, arr) {
  const newArray = arr.slice()
  newArray.sort(o => (o[key] !== option ? 1 : -1)) // put in first
  return newArray
}

function reorderRoundListAfterSingleCourseStudents(activeSemester, initContext) {
  const singleCourseStrudentsRoundCategory = 'VU' // single course students
  return reorder(singleCourseStrudentsRoundCategory, 'round_category', initContext.courseData.roundList[activeSemester])
}

async function _chooseSemesterAndSyllabusFromActiveSemesters(externalSemester, useStartSemesterFromQuery, webContext) {
  const { activeSemesters } = webContext

  const defaultSemesterIndex = _getSemesterIndexToShow(
    useStartSemesterFromQuery ? externalSemester : '',
    activeSemesters
  )
  webContext.defaultIndex = defaultSemesterIndex

  if (useStartSemesterFromQuery) {
    webContext.activeSemester = externalSemester
    webContext.activeSemesterIndex = defaultSemesterIndex
    webContext.semesterSelectedIndex = defaultSemesterIndex
    webContext.activeSyllabusIndex = webContext.roundsSyllabusIndex[defaultSemesterIndex]
  }
}
/* ****************************************************************************** */
/*                    COURSE PAGE SETTINGS AND RENDERING                          */
/* ****************************************************************************** */
async function getIndex(req, res, next) {
  /** //TODO-INTEGRATION: REMOVE ------- CHECK OF CONNECTION TO KURS-PM-API ------- */
  let memoApiUp = true
  if (api.kursPmDataApi.connected && api.kursPmDataApi.connected === false) {
    memoApiUp = false
  }

  const courseCode = req.params.courseCode.toUpperCase()
  const lang = languageUtils.getLanguage(res) || 'sv'

  try {
    const { getCompressedData, renderStaticPage } = getServerSideFunctions()
    const webContext = { lang, proxyPrefixPath: serverConfig.proxyPrefixPath, ...createServerSideContext() }

    const { startterm, periods } = req.query
    webContext.setBrowserConfig(browserConfig, paths, serverConfig.hostUrl)

    webContext.courseCode = courseCode
    const startSemesterFromQuery = startterm ? startterm.substring(0, 5) : ''

    webContext.hasStartPeriodFromQuery = !!Number(periods)

    const courseApiResponse = await courseApi.getSellingText(courseCode)
    if (courseApiResponse.body) {
      const { sellingText, imageInfo } = courseApiResponse.body
      webContext.sellingText = sellingText
      webContext.imageFromAdmin = imageInfo || ''
      /* webContext.showCourseWebbLink = isCourseWebLink */
    }

    if (memoApiUp) {
      const memoApiResponse = await memoApi.getPrioritizedCourseMemos(courseCode)
      if (memoApiResponse && memoApiResponse.body) {
        webContext.memoList = memoApiResponse.body
      }
    }

    const koppsCourseDataResponse = await koppsCourseData.getKoppsCourseData(courseCode, lang)
    if (koppsCourseDataResponse.body) {
      const courseResult = koppsCourseDataResponse.body
      webContext.isCancelled = courseResult.course.cancelled
      webContext.isDeactivated = courseResult.course.deactivated

      //* **** Coruse information that is static on the course side *****//
      const courseInfo = _getCourseDefaultInformation(courseResult, lang)

      //* **** Course title data  *****//
      const courseTitleData = _getTitleData(courseResult)

      //* **** Get list of syllabuses and valid syllabus semesters *****//
      const syllabusList = []
      const syllabusSemesterList = []
      let tempSyllabus = {}
      const syllabuses = courseResult.publicSyllabusVersions
      if (syllabuses.length > 0) {
        for (let index = 0; index < syllabuses.length; index++) {
          syllabusSemesterList.push([syllabuses[index].validFromTerm.term, ''])
          tempSyllabus = _getSyllabusData(courseResult, index, lang)
          if (index > 0) {
            tempSyllabus.course_valid_to = _getSyllabusEndSemester(
              syllabusSemesterList[index - 1][0].toString().match(/.{1,4}/g)
            )
            syllabusSemesterList[index][1] = Number(tempSyllabus.course_valid_to.join(''))
          }
          syllabusList.push(tempSyllabus)
        }
      } else {
        syllabusList[0] = _getSyllabusData(courseResult, 0, lang)
      }

      //* **** Get a list of rounds and a list of redis keys for using to get teachers and responsibles from ugRedis *****//
      const {
        courseRoundList: roundList,
        activeSemesters,
        keyList,
      } = _getRounds(courseResult.roundInfos, courseCode, lang, webContext)

      webContext.activeSemesters = activeSemesters
      webContext.keyList = keyList
      //* **** Sets roundsSyllabusIndex, an array used for connecting rounds with correct syllabus *****//
      _getRoundsAndSyllabusConnection(syllabusSemesterList, webContext)

      webContext.useStartSemesterFromQuery = startSemesterFromQuery
        ? await _hasSemesterInArray(startSemesterFromQuery, activeSemesters)
        : false
      //* **** Get the index for start informatin based on time of year or semester if comes from query string *****/
      await _chooseSemesterAndSyllabusFromActiveSemesters(
        startSemesterFromQuery,
        webContext.useStartSemesterFromQuery,
        webContext
      )

      webContext.activeSemester =
        activeSemesters && activeSemesters.length > 0 ? activeSemesters[webContext.defaultIndex][2] : null

      webContext.courseData = {
        syllabusList,
        courseInfo,
        roundList,
        courseTitleData,
        syllabusSemesterList,
        language: lang,
      }

      if (webContext.useStartSemesterFromQuery) {
        // init roundList with reordered roundList after single course students
        const contextWithReorderedRoundList = reorderRoundListAfterSingleCourseStudents(
          webContext.activeSemester,
          webContext
        )
        webContext.courseData.roundList[webContext.activeSemester] = contextWithReorderedRoundList
      }
    }

    const apiMemoData = {
      courseCode,
      semester: '',
      ladokRoundIds: [],
    }
    const ugRedisApiResponse = await ugRedisApi.getCourseEmployees(apiMemoData)

    webContext.courseData.courseInfo.course_examiners =
      ugRedisApiResponse.examiners || INFORM_IF_IMPORTANT_INFO_IS_MISSING[lang]

    const compressedData = getCompressedData(webContext)

    const { uri: proxyPrefix } = serverConfig.proxyPrefixPath

    const view = renderStaticPage({
      applicationStore: {},
      location: req.url,
      basename: proxyPrefix,
      context: webContext,
    })

    res.render('course/index', {
      compressedData,
      debug: 'debug' in req.query,
      instrumentationKey: serverConfig.appInsights.instrumentationKey,
      html: view,
      title: courseCode.toUpperCase(),
      lang,
      description:
        lang === 'sv'
          ? 'KTH kursinformation för ' + courseCode.toUpperCase()
          : 'KTH course information ' + courseCode.toUpperCase(),
    })
  } catch (err) {
    const excludedStatusCodes = [403, 404]
    let statusCode
    if (err.response) {
      statusCode = err.response.status
    } else {
      statusCode = err.status || err.statusCode || 500
    }

    if (!excludedStatusCodes.includes(statusCode)) {
      if (err.code === 'ECONNABORTED' && err.config) {
        log.error(err.config.url, 'Timeout error')
      }
      log.error({ err }, 'Error in getIndex')
    }

    next(err)
  }
}

module.exports = {
  getIndex,
  getCourseEmployees,
  getKoppsCourseData,
}
