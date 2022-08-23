'use strict'

const log = require('@kth/log')
const languageUtils = require('@kth/kth-node-web-common/lib/language')
const httpResponse = require('@kth/kth-node-response')
const courseApi = require('../apiCalls/kursinfoAdmin')
const memoApi = require('../apiCalls/memoApi')
const koppsCourseData = require('../apiCalls/koppsCourseData')
const ugRestApi = require('../apiCalls/ugRestApi')

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

function parseOrSetEmpty(dataObject, language, setEmpty = false) {
  const emptyText = setEmpty ? '' : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language]
  return dataObject ? dataObject : emptyText
}

function parceContactName(infoContactName, language) {
  const courseContactName = parseOrSetEmpty(infoContactName, language)
  if (courseContactName === INFORM_IF_IMPORTANT_INFO_IS_MISSING[language]) return courseContactName
  const emailBracketsRexEx = /<|>/gi
  const contact = courseContactName.replace(emailBracketsRexEx, '')
  return contact
}

async function getCourseEmployees(req, res, next) {
  const apiMemoData = req.body
  const courseEmployees = await ugRestApi.getCourseEmployees(apiMemoData)
  res.send(courseEmployees)
}

async function getKoppsCourseData(req, res, next) {
  const { courseCode } = req.params
  const language = req.params.language || 'sv'
  log.debug('Get Kopps course data for: ', courseCode, language)
  try {
    const { body, statusCode = 500 } = await koppsCourseData.getKoppsCourseData(courseCode, language)
    log.debug('Got response from Kopps API for: ', courseCode, language)
    if (statusCode === 200) {
      log.debug('OK response from Kopps API for: ', courseCode, language)
      return httpResponse.json(res, body)
    }
    log.debug('NOK response from Kopps API for: ', courseCode, language)
    res.status(statusCode)
    res.statusCode = statusCode
    res.send(courseCode)
  } catch (err) {
    return err
  }
}

function _parseCourseDefaultInformation(courseDetails, language) {
  const { course, formattedGradeScales, mainSubjects, socialCoursePageUrl } = courseDetails
  return {
    course_code: parseOrSetEmpty(course.courseCode),
    course_application_info: parseOrSetEmpty(course.applicationInfo, language, true),
    course_grade_scale: parseOrSetEmpty(formattedGradeScales[course.gradeScaleCode], language),
    course_level_code: parseOrSetEmpty(course.educationalLevelCode),
    course_main_subject:
      mainSubjects && mainSubjects.length > 0
        ? mainSubjects.join(', ')
        : INFORM_IF_IMPORTANT_INFO_IS_MISSING_ABOUT_MIN_FIELD_OF_STUDY[language],
    course_recruitment_text: parseOrSetEmpty(course.recruitmentText, language, true),
    course_department: parseOrSetEmpty(course.department.name, language),
    course_department_link:
      parseOrSetEmpty(course.department.name, language) !== INFORM_IF_IMPORTANT_INFO_IS_MISSING[language]
        ? '<a href="/' +
          course.department.name.split('/')[0].toLowerCase() +
          '/" target="blank">' +
          course.department.name +
          '</a>'
        : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    course_department_code: parseOrSetEmpty(course.department.code, language),
    course_contact_name: parceContactName(course.infoContactName, language),
    course_prerequisites: parseOrSetEmpty(course.prerequisites, language),
    course_suggested_addon_studies: parseOrSetEmpty(course.addOn, language),
    course_supplemental_information_url: parseOrSetEmpty(course.supplementaryInfoUrl, language),
    course_supplemental_information_url_text: parseOrSetEmpty(course.supplementaryInfoUrlName, language),
    course_supplemental_information: parseOrSetEmpty(course.supplementaryInfo, language),
    course_examiners: INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    course_last_exam: course.lastExamTerm ? course.lastExamTerm.term.toString().match(/.{1,4}/g) : [],
    course_web_link: parseOrSetEmpty(socialCoursePageUrl, language),
    course_spossibility_to_completions: parseOrSetEmpty(course.possibilityToCompletion, language),
    course_disposition: parseOrSetEmpty(course.courseDeposition, language),
    course_possibility_to_addition: parseOrSetEmpty(course.possibilityToAddition, language),
    course_literature: parseOrSetEmpty(course.courseLiterature, language),
    course_required_equipment: parseOrSetEmpty(course.requiredEquipment, language),
    course_state: parseOrSetEmpty(course.state, language, true),
  }
}

function _parseTitleData({ course }) {
  return {
    course_code: parseOrSetEmpty(course.courseCode),
    course_title: parseOrSetEmpty(course.title),
    course_other_title: parseOrSetEmpty(course.titleOther),
    course_credits: parseOrSetEmpty(course.credits),
    course_credits_text: parseOrSetEmpty(course.creditUnitAbbr),
  }
}

function _parseExamObject(exams, grades, language = 0, semester = '', creditUnitAbbr) {
  let matchingExamSemester = ''
  Object.keys(exams).forEach(key => {
    if (Number(semester) >= Number(key)) {
      matchingExamSemester = key
    }
  })
  let examString = "<ul class='ul-no-padding' >"
  if (exams[matchingExamSemester] && exams[matchingExamSemester].examinationRounds.length > 0) {
    for (const exam of exams[matchingExamSemester].examinationRounds) {
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
        language === 'en' ? ' credits' : creditUnitAbbr
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

function _parseSyllabusData(courseDetails, semester = 0, language) {
  const { course, examinationSets, formattedGradeScales, publicSyllabusVersions } = courseDetails
  const hasSyllabusData = publicSyllabusVersions && publicSyllabusVersions.length > 0
  const semesterSyllabus = hasSyllabusData && publicSyllabusVersions[semester] ? publicSyllabusVersions[semester] : null

  return {
    course_goals: semesterSyllabus
      ? parseOrSetEmpty(semesterSyllabus.courseSyllabus.goals, language)
      : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    course_content: semesterSyllabus
      ? parseOrSetEmpty(semesterSyllabus.courseSyllabus.content, language)
      : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    course_disposition: semesterSyllabus
      ? parseOrSetEmpty(semesterSyllabus.courseSyllabus.disposition, language)
      : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    course_eligibility: semesterSyllabus
      ? parseOrSetEmpty(semesterSyllabus.courseSyllabus.eligibility, language)
      : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    course_requirments_for_final_grade: semesterSyllabus
      ? parseOrSetEmpty(semesterSyllabus.courseSyllabus.reqsForFinalGrade, language, true)
      : '',
    course_literature: semesterSyllabus
      ? parseOrSetEmpty(semesterSyllabus.courseSyllabus.literature, language)
      : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    course_literature_comment: semesterSyllabus
      ? parseOrSetEmpty(semesterSyllabus.courseSyllabus.literatureComment, language)
      : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    course_valid_from: semesterSyllabus
      ? parseOrSetEmpty(semesterSyllabus.validFromTerm.term)
          .toString()
          .match(/.{1,4}/g)
      : [],
    course_valid_to: [],
    course_required_equipment: semesterSyllabus
      ? parseOrSetEmpty(semesterSyllabus.courseSyllabus.requiredEquipment, language)
      : '',
    course_examination:
      hasSyllabusData && examinationSets && Object.keys(examinationSets).length > 0
        ? _parseExamObject(
            examinationSets,
            formattedGradeScales,
            language,
            semesterSyllabus.validFromTerm.term,
            course.creditUnitAbbr
          )
        : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    course_examination_comments: semesterSyllabus
      ? parseOrSetEmpty(semesterSyllabus.courseSyllabus.examComments, language, true)
      : '',
    course_ethical: semesterSyllabus
      ? parseOrSetEmpty(semesterSyllabus.courseSyllabus.ethicalApproach, language, true)
      : '',
    course_establishment: semesterSyllabus
      ? parseOrSetEmpty(semesterSyllabus.courseSyllabus.establishment, language, true)
      : '',
    course_additional_regulations: semesterSyllabus
      ? parseOrSetEmpty(semesterSyllabus.courseSyllabus.additionalRegulations, language, true)
      : '',
    course_transitional_reg: semesterSyllabus
      ? parseOrSetEmpty(semesterSyllabus.courseSyllabus.transitionalRegulations, language, true)
      : '',
    course_decision_to_discontinue: semesterSyllabus
      ? parseOrSetEmpty(semesterSyllabus.courseSyllabus.decisionToDiscontinue, language)
      : '',
  }
}

//* *** Sets the end semester for older syllabuses *****/
function _getSyllabusEndSemester(newerSyllabusValidFromTerm) {
  const [year, season] = newerSyllabusValidFromTerm
  if (season === '1') {
    return [Number(year) - 1, '2']
  }
  return [Number(year), '1']
}

function _getRoundProgramme(programmes, language = 0) {
  let programmeString = ''
  programmes.forEach(programme => {
    const { electiveCondition, progAdmissionTerm, programmeCode, specCode, studyYear, title } = programme
    programmeString += `<p>
        <a href="${PROGRAMME_URL}/${programmeCode}/${progAdmissionTerm.term}/arskurs${studyYear}${
      specCode ? '#inr' + specCode : ''
    }">
          ${title}, ${language === 0 ? 'year' : 'åk'} ${studyYear}, ${specCode ? specCode + ', ' : ''}${
      electiveCondition.abbrLabel
    }
      </a>
    </p>`
  })
  return programmeString
}

function _getRoundPeriodes(courseRoundTerms, language = 'sv') {
  let periodeString = ''
  if (courseRoundTerms) {
    if (courseRoundTerms.length > 1) {
      courseRoundTerms.map(
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
      return courseRoundTerms[0].formattedPeriodsAndCredits
    }
  }
  return INFORM_IF_IMPORTANT_INFO_IS_MISSING[language]
}

function _parseRoundSeatsMsg(max, min) {
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

function _getRound(roundObject = {}, language = 'sv') {
  const { admissionLinkUrl, commentsToStudents, round = {}, schemaUrl, timeslots, usage } = roundObject
  const { applicationCodes } = round
  const hasApplicationCodes = applicationCodes.length > 0
  const [latestApplicationCode] = applicationCodes
  const courseRoundModel = {
    roundId: parseOrSetEmpty(round.ladokRoundId, language),
    round_time_slots: parseOrSetEmpty(timeslots, language),
    round_start_date: getDateFormat(parseOrSetEmpty(round.firstTuitionDate, language), language),
    round_end_date: getDateFormat(parseOrSetEmpty(round.lastTuitionDate, language), language),
    round_target_group: parseOrSetEmpty(round.targetGroup, language),
    round_tutoring_form: parseOrSetEmpty(round.tutoringForm.name, language),
    round_tutoring_time: parseOrSetEmpty(round.tutoringTimeOfDay.name, language),
    round_tutoring_language: parseOrSetEmpty(round.language, language),
    round_course_place: parseOrSetEmpty(round.campus.label, language),
    round_campus: parseOrSetEmpty(round.campus.name, language),
    round_short_name: parseOrSetEmpty(round.shortName, language),
    round_application_code: parseOrSetEmpty(round.applicationCodes[0].applicationCode, language),
    round_schedule: parseOrSetEmpty(schemaUrl, language),
    round_study_pace: parseOrSetEmpty(round.studyPace, language),
    round_course_term:
      parseOrSetEmpty(round.startTerm.term, language).toString().length > 0
        ? round.startTerm.term.toString().match(/.{1,4}/g)
        : [],
    round_periods: _getRoundPeriodes(round.courseRoundTerms, language),
    round_seats:
      _parseRoundSeatsMsg(
        parseOrSetEmpty(round.maxSeats, language, true),
        parseOrSetEmpty(round.minSeats, language, true)
      ) || '',
    round_selection_criteria: parseOrSetEmpty(
      round[language === 'en' ? 'selectionCriteriaEn' : 'selectionCriteriaSv'],
      language,
      true
    ),
    round_type: hasApplicationCodes
      ? parseOrSetEmpty(latestApplicationCode.courseRoundType.name, language)
      : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    round_funding_type: hasApplicationCodes
      ? parseOrSetEmpty(latestApplicationCode.courseRoundType.code, language)
      : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    round_application_link: parseOrSetEmpty(admissionLinkUrl, language),
    round_part_of_programme:
      usage.length > 0 ? _getRoundProgramme(usage, language) : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    round_state: parseOrSetEmpty(round.state, language),
    round_comment: parseOrSetEmpty(commentsToStudents, language, true),
    round_category: hasApplicationCodes
      ? parseOrSetEmpty(latestApplicationCode.courseRoundType.category, language)
      : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
  }
  if (courseRoundModel.round_short_name === INFORM_IF_IMPORTANT_INFO_IS_MISSING[language]) {
    courseRoundModel.round_short_name = `${language === 0 ? 'Start' : 'Start'}  ${courseRoundModel.round_start_date}`
  }

  return courseRoundModel
}

function _parseRounds(roundInfos, courseCode, language, webContext) {
  const { activeSemesters: initActives, memoList, keyList: initkeyList } = { ...webContext }
  const tempList = []
  let courseRound
  const courseRoundList = {}
  for (const roundInfo of roundInfos) {
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
        courseRound.round_memoFile = {
          fileName: courseMemoFileName,
          fileDate: lastChangeDate ? formatVersionDate(language, lastChangeDate) : '',
        }
      }
      courseRound.has_round_published_memo = true
    }
    courseRoundList[semester].push(courseRound)
    initkeyList.teachers.push(`${courseCode}.${semester}.${ladokRoundId}.teachers`)
    initkeyList.responsibles.push(`${courseCode}.${semester}.${ladokRoundId}.courseresponsible`)
  }
  initkeyList.teachers.sort()
  initkeyList.responsibles.sort()
  return { courseRoundList, activeSemesters: initActives.sort(), keyList: initkeyList }
}

function isSyllabusValidForThisSemester(syllabusStartSemester, semester) {
  return syllabusStartSemester <= semester
}

function _createSemestersAndSyllabusConnection(syllabusSemesterList, webContext) {
  const { activeSemesters } = webContext
  const numberOfSemesters = activeSemesters.length

  for (let semesterIndex = 0; semesterIndex < numberOfSemesters; semesterIndex++) {
    const latestSyllabusIndex = 0
    const semester = Number(activeSemesters[semesterIndex][2])

    for (let syllabusIndex = latestSyllabusIndex; syllabusIndex < syllabusSemesterList.length; syllabusIndex++) {
      const prevSyllabusStartSemester = Number(syllabusSemesterList[syllabusIndex][0])
      const isPrevSyllabusValidForThisSemester = isSyllabusValidForThisSemester(prevSyllabusStartSemester, semester)

      if (isPrevSyllabusValidForThisSemester) {
        webContext.activeSemestersIndexesWithValidSyllabusesIndexes[semesterIndex] = syllabusIndex
        break
      }
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
    webContext.activeSyllabusIndex = webContext.activeSemestersIndexesWithValidSyllabusesIndexes[defaultSemesterIndex]
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
    const startSemesterFromQuery = startterm ? startterm.substring(0, 5) : ''

    webContext.setBrowserConfig(browserConfig, paths, serverConfig.hostUrl)

    webContext.courseCode = courseCode

    webContext.hasStartPeriodFromQuery = !!Number(periods)

    const { body: introductionTextsAndImage } = await courseApi.getSellingText(courseCode)
    if (introductionTextsAndImage) {
      const { sellingText, imageInfo } = introductionTextsAndImage
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

    const { body: courseDetails } = await koppsCourseData.getKoppsCourseData(courseCode, lang)
    if (courseDetails) {
      webContext.isCancelled = courseDetails.course.cancelled
      webContext.isDeactivated = courseDetails.course.deactivated

      //* **** Coruse information that is static on the course side *****//
      const courseInfo = _parseCourseDefaultInformation(courseDetails, lang)

      //* **** Course title data  *****//
      const courseTitleData = _parseTitleData(courseDetails)

      //* **** Get list of syllabuses and valid syllabus semesters *****//
      const syllabusList = []
      const syllabusSemesterList = []
      let parsedSyllabus = {}
      const { publicSyllabusVersions: syllabuses } = courseDetails
      if (syllabuses.length > 0) {
        for (let index = 0; index < syllabuses.length; index++) {
          syllabusSemesterList.push([syllabuses[index].validFromTerm.term, ''])
          parsedSyllabus = _parseSyllabusData(courseDetails, index, lang)
          if (index > 0) {
            const yearRegEx = /.{1,4}/g
            const [newerSyllabusValidFromTerm] = syllabusSemesterList[index - 1]
            parsedSyllabus.course_valid_to = _getSyllabusEndSemester(
              newerSyllabusValidFromTerm.toString().match(yearRegEx)
            )
            syllabusSemesterList[index][1] = Number(parsedSyllabus.course_valid_to.join(''))
          }
          syllabusList.push(parsedSyllabus)
        }
      } else {
        syllabusList[0] = _parseSyllabusData(courseDetails, 0, lang)
      }

      //* **** Get a list of rounds and a list of redis keys for using to get teachers and responsibles from ugRedis *****//
      const {
        courseRoundList: roundList,
        activeSemesters,
        keyList,
      } = _parseRounds(courseDetails.roundInfos, courseCode, lang, webContext)

      webContext.activeSemesters = activeSemesters
      webContext.keyList = keyList
      //* **** Sets activeSemestersIndexesWithValidSyllabusesIndexes, an array used for connecting rounds with correct syllabus *****//
      _createSemestersAndSyllabusConnection(syllabusSemesterList, webContext)

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
    const ugRestApiResponse = await ugRestApi.getCourseEmployees(apiMemoData)

    webContext.courseData.courseInfo.course_examiners =
      ugRestApiResponse.examiners || INFORM_IF_IMPORTANT_INFO_IS_MISSING[lang]

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
