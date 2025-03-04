const { parseOrSetEmpty } = require('../controllers/courseCtrlHelpers')
const { createSyllabusList } = require('../controllers/createSyllabusList')
const {
  INFORM_IF_IMPORTANT_INFO_IS_MISSING,
  INFORM_IF_IMPORTANT_INFO_IS_MISSING_ABOUT_MIN_FIELD_OF_STUDY,
  PROGRAMME_URL,
} = require('../util/constants')
const { buildCourseDepartmentLink } = require('../util/courseDepartmentUtils')
const { getDateFormat, formatVersionDate } = require('../util/dates')
const i18n = require('../../i18n')
const {
  parseSemesterIntoYearSemesterNumber,
  parseSemesterIntoYearSemesterNumberArray,
} = require('../util/semesterUtils')
const koppsCourseData = require('./koppsCourseData')
const ladokApi = require('./ladokApi')
const courseApi = require('./kursinfoApi')
const { getSocial } = require('./socialApi')

function _parseCourseDefaultInformation(koppsCourseDetails, ladokCourse, language) {
  const { course: koppsCourse } = koppsCourseDetails

  const mainSubjects = ladokCourse.huvudomraden?.map(x => x.name)

  return {
    course_code: parseOrSetEmpty(ladokCourse.kod),
    course_department: parseOrSetEmpty(ladokCourse.organisation.name, language),
    course_department_code: parseOrSetEmpty(ladokCourse.organisation.code, language),
    course_department_link: buildCourseDepartmentLink(ladokCourse.organisation, language),
    course_education_type_id: ladokCourse.utbildningstyp?.id,
    course_level_code: parseOrSetEmpty(ladokCourse.utbildningstyp.level.code),
    course_main_subject:
      mainSubjects && mainSubjects.length > 0
        ? mainSubjects.join(', ')
        : INFORM_IF_IMPORTANT_INFO_IS_MISSING_ABOUT_MIN_FIELD_OF_STUDY[language],
    course_grade_scale: parseOrSetEmpty(ladokCourse.betygsskala.formatted),
    // From Kopps for now
    course_last_exam: koppsCourse.lastExamTerm
      ? parseSemesterIntoYearSemesterNumberArray(koppsCourse.lastExamTerm.term)
      : [],
    course_literature: parseOrSetEmpty(koppsCourse.courseLiterature, language),
    course_state: parseOrSetEmpty(koppsCourse.state, language, true),

    // TODO(Ladok-POC): Will be replaced with field from Om kursen-admin
    course_prerequisites: INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],

    // TODO(Ladok-POC): Do we need to set course_examiners to empty here?
    course_examiners: INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
  }
}

function resolveText(text = {}, language) {
  return text[language] ?? ''
}

function _parseTitleData(ladokCourse) {
  return {
    course_code: parseOrSetEmpty(ladokCourse.kod),
    course_title: parseOrSetEmpty(ladokCourse.benamning),
    course_credits_label: parseOrSetEmpty(ladokCourse.omfattning.formattedWithUnit),
  }
}

function _getRoundPeriodes(courseRoundTerms, language = 'sv') {
  let periodeString = ''
  if (courseRoundTerms) {
    if (courseRoundTerms.length > 1) {
      courseRoundTerms.forEach(periode => {
        const yearTerm = parseSemesterIntoYearSemesterNumber(periode.term.term)

        periodeString += `<p class="periode-list">
                                ${
                                  i18n.messages[language === 'en' ? 0 : 1].courseInformation.course_short_semester[
                                    yearTerm.semesterNumber
                                  ]
                                } 
                                ${yearTerm.year}: 
                                ${periode.formattedPeriodsAndCredits}
                                </p>`
      })
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

function _getRound(koppsRoundObject = {}, ladokRound, socialSchedules, language = 'sv') {
  const { admissionLinkUrl: koppsAdmissionLinkUrl, round: koppsRound = {}, usage: koppsUsage } = koppsRoundObject
  const { applicationCodes = [] } = koppsRound
  const hasApplicationCodes = applicationCodes.length > 0
  const [koppsLatestApplicationCode] = applicationCodes
  const round = socialSchedules.rounds.find(schedule => schedule.applicationCode === ladokRound.tillfalleskod)

  const schemaUrl = round && round.has_events ? round.calendar_url : null

  const courseRoundModel = {
    round_start_date: getDateFormat(parseOrSetEmpty(ladokRound.forstaUndervisningsdatum.date, language), language),
    round_end_date: getDateFormat(parseOrSetEmpty(ladokRound.sistaUndervisningsdatum.date, language), language),
    round_target_group: parseOrSetEmpty(ladokRound.malgrupp, language),
    round_tutoring_form: parseOrSetEmpty(ladokRound.undervisningsform?.code, language),
    round_tutoring_time: parseOrSetEmpty(ladokRound.undervisningstid?.code, language),
    round_tutoring_language: parseOrSetEmpty(ladokRound.undervisningssprak?.name, language),
    round_course_place: parseOrSetEmpty(ladokRound.studieort?.name, language),
    round_short_name: parseOrSetEmpty(ladokRound.kortnamn, language),
    round_application_code: parseOrSetEmpty(ladokRound.tillfalleskod, language),
    round_study_pace: parseOrSetEmpty(ladokRound.studietakt?.takt, language),
    round_course_term: parseSemesterIntoYearSemesterNumberArray(ladokRound.startperiod?.inDigits),
    round_funding_type: parseOrSetEmpty(ladokRound.finansieringsform?.code, language),
    round_seats:
      _parseRoundSeatsMsg(
        parseOrSetEmpty(ladokRound.utbildningsplatser, language, true),
        parseOrSetEmpty(ladokRound.minantalplatser, language, true)
      ) || '',

    round_schedule: parseOrSetEmpty(schemaUrl, language),
    round_periods: koppsRound.courseRoundTerms ? _getRoundPeriodes(koppsRound.courseRoundTerms, language) : [],
    round_selection_criteria: parseOrSetEmpty(
      koppsRound[language === 'en' ? 'selectionCriteriaEn' : 'selectionCriteriaSv'],
      language,
      true
    ),
    round_type: hasApplicationCodes
      ? parseOrSetEmpty(koppsLatestApplicationCode.courseRoundType.name, language)
      : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    round_application_link: parseOrSetEmpty(koppsAdmissionLinkUrl, language),
    round_part_of_programme:
      koppsUsage && koppsUsage.length > 0
        ? _getRoundProgramme(koppsUsage, language)
        : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    round_state: parseOrSetEmpty(koppsRound.state, language),
    round_category: hasApplicationCodes
      ? parseOrSetEmpty(koppsLatestApplicationCode.courseRoundType.category, language)
      : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
  }
  if (courseRoundModel.round_short_name === INFORM_IF_IMPORTANT_INFO_IS_MISSING[language]) {
    courseRoundModel.round_short_name = `${language === 0 ? 'Start' : 'Start'}  ${courseRoundModel.round_start_date}`
  }

  return courseRoundModel
}

function _parseRounds({ ladokRounds, socialSchedules, roundInfos: koppsRoundInfos, courseCode, language, memoList }) {
  const activeSemesterArray = []
  const tempList = []
  const employees = {
    teachers: [],
    responsibles: [],
  }

  const roundsBySemester = {}
  for (const ladokRound of ladokRounds) {
    const koppsRoundInfo = koppsRoundInfos.find(x => x.round.ladokUID === ladokRound.uid) ?? {}
    const courseRound = _getRound(koppsRoundInfo, ladokRound, socialSchedules, language)
    const { round_course_term: yearAndTermArr, round_application_code: applicationCode } = courseRound
    const semester = yearAndTermArr.join('')

    if (yearAndTermArr && tempList.indexOf(semester) < 0) {
      tempList.push(semester)
      activeSemesterArray.push([...yearAndTermArr, semester])
      roundsBySemester[semester] = []
    }

    const hasMemoForThisRound = !!(memoList[semester] && memoList[semester][applicationCode])
    if (hasMemoForThisRound) {
      const { isPdf, courseMemoFileName, lastChangeDate } = memoList[semester][applicationCode]
      if (isPdf) {
        courseRound.round_memoFile = {
          fileName: courseMemoFileName,
          fileDate: lastChangeDate ? formatVersionDate(language, lastChangeDate) : '',
        }
      }
      courseRound.has_round_published_memo = true
    }
    roundsBySemester[semester].push(courseRound)
    // TODO: This will be removed. Because UG Rest Api is still using ladokRoundId. So once it get replaced by application code then this will be removed.
    const { round = {} } = koppsRoundInfo
    const { ladokRoundId } = round
    employees.teachers.push(`${courseCode}.${semester}.${ladokRoundId}.teachers`)
    employees.responsibles.push(`${courseCode}.${semester}.${ladokRoundId}.courseresponsible`)
  }
  employees.teachers.sort()
  employees.responsibles.sort()

  activeSemesterArray.sort()

  const activeSemesters = activeSemesterArray.map(([year, semesterNumber, semester]) => ({
    year,
    semesterNumber,
    semester,
  }))

  return { roundsBySemester, activeSemesters, employees }
}

const getFilteredData = async ({ courseCode, language, memoList }) => {
  const { body: koppsCourseDetails } = await koppsCourseData.getKoppsCourseData(courseCode, language)
  const { course: ladokCourse, rounds: ladokRounds } = await ladokApi.getCourseAndActiveRounds(courseCode, language)

  // console.log(`YOUR DATA: ${JSON.stringify(koppsCourseDetails, null, 4)}`)

  const socialSchedules = await getSocial(courseCode, language)

  console.log('ladokRounds: ', ladokRounds)
  // console.log('socialSchedules: ', socialSchedules)

  const examinationModules = await ladokApi.getExaminationModules(ladokCourse.uid, language)
  if (!koppsCourseDetails || !ladokCourse) {
    // TODO(Ladok-POC): What to do if we find course in only in Ladok or only in Kopps?
    return {}
  }

  const isCancelledOrDeactivated = koppsCourseDetails.course.cancelled || koppsCourseDetails.course.deactivated

  //* **** Course information that is static on the course side *****//
  const courseDefaultInformation = _parseCourseDefaultInformation(koppsCourseDetails, ladokCourse, language)

  const { sellingText, courseDisposition, recommendedPrerequisites, supplementaryInfo, imageInfo } =
    await courseApi.getCourseInfo(courseCode)

  const courseInfo = {
    ...courseDefaultInformation,
    sellingText: resolveText(sellingText, language),
    imageFromAdmin: imageInfo,
    course_disposition: resolveText(courseDisposition, language),
    course_recommended_prerequisites: resolveText(recommendedPrerequisites, language),
    course_supplemental_information: resolveText(supplementaryInfo, language),
  }

  //* **** Course title data  *****//
  const courseTitleData = _parseTitleData(ladokCourse, language)

  //* **** Get list of syllabuses and valid syllabus semesters *****//
  const { syllabusList, emptySyllabusData } = createSyllabusList(koppsCourseDetails, examinationModules, language)

  //* **** Get a list of rounds and a list of redis keys for using to get teachers and responsibles from UG Rest API *****//
  const { roundsBySemester, activeSemesters, employees } = _parseRounds({
    ladokRounds,
    socialSchedules,
    roundInfos: koppsCourseDetails.roundInfos,
    courseCode,
    language,
    memoList,
  })

  const courseData = {
    syllabusList,
    courseInfo,
    roundsBySemester,
    courseTitleData,
    language,
    emptySyllabusData,
  }

  return {
    isCancelledOrDeactivated,
    activeSemesters,
    employees,
    courseData,
  }
}

module.exports = {
  getFilteredData,
}
