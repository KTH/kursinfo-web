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
const ladokCourseDataApi = require('./ladokCourseDataApi')
const courseApi = require('./kursinfoApi')

function _parseCourseDefaultInformation(koppsCourseDetails, ladokCourse, language) {
  const {
    course: koppsCourse,
    formattedGradeScales: koppsFormattedGradeScales,
    mainSubjects: koppsMainSubjects,
  } = koppsCourseDetails
  return {
    course_code: parseOrSetEmpty(koppsCourse.courseCode),

    course_department: parseOrSetEmpty(koppsCourse.department.name, language),
    course_department_code: parseOrSetEmpty(koppsCourse.department.code, language),
    course_department_link: buildCourseDepartmentLink(koppsCourse.department, language),
    course_education_type_id: koppsCourse.educationalTypeId || null,
    course_examiners: INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    course_grade_scale: parseOrSetEmpty(koppsFormattedGradeScales[koppsCourse.gradeScaleCode], language),
    course_last_exam: koppsCourse.lastExamTerm
      ? parseSemesterIntoYearSemesterNumberArray(koppsCourse.lastExamTerm.term)
      : [],
    course_level_code: parseOrSetEmpty(koppsCourse.educationalLevelCode),
    course_literature: parseOrSetEmpty(koppsCourse.courseLiterature, language),
    course_main_subject:
      koppsMainSubjects && koppsMainSubjects.length > 0
        ? koppsMainSubjects.join(', ')
        : INFORM_IF_IMPORTANT_INFO_IS_MISSING_ABOUT_MIN_FIELD_OF_STUDY[language],
    course_recruitment_text: parseOrSetEmpty(koppsCourse.recruitmentText, language, true),
    course_supplemental_information_url: parseOrSetEmpty(koppsCourse.supplementaryInfoUrl, language),
    course_supplemental_information_url_text: parseOrSetEmpty(koppsCourse.supplementaryInfoUrlName, language),
    course_state: parseOrSetEmpty(koppsCourse.state, language, true),

    // Following should be removed (KUI-1387) set to emport for now
    course_contact_name: INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    course_suggested_addon_studies: INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    course_application_info: INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    course_possibility_to_addition: INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    course_possibility_to_completions: INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    course_required_equipment: INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],

    // Will be replaced with field from Om kursen-admin
    course_prerequisites: INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
  }
}

function resolveText(text = {}, language) {
  return text[language] ?? ''
}

function _parseTitleData({ course: koppsCourse }) {
  return {
    course_code: parseOrSetEmpty(koppsCourse.courseCode),
    course_title: parseOrSetEmpty(koppsCourse.title),
    course_other_title: parseOrSetEmpty(koppsCourse.titleOther),
    course_credits: parseOrSetEmpty(koppsCourse.credits),
    course_credits_text: parseOrSetEmpty(koppsCourse.creditUnitAbbr),
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

function _getRound(roundObject = {}, language = 'sv') {
  const { admissionLinkUrl, commentsToStudents, round = {}, schemaUrl, timeslots, usage } = roundObject
  const { applicationCodes } = round
  const hasApplicationCodes = applicationCodes.length > 0
  const [latestApplicationCode] = applicationCodes
  const courseRoundModel = {
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
        ? parseSemesterIntoYearSemesterNumberArray(round.startTerm.term)
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

function _parseRounds({ roundInfos, courseCode, language, memoList }) {
  const activeSemesterArray = []
  const tempList = []
  const employees = {
    teachers: [],
    responsibles: [],
  }

  const roundsBySemester = {}
  for (const roundInfo of roundInfos) {
    const courseRound = _getRound(roundInfo, language)
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
    const { round = {} } = roundInfo
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
  const ladokCourse = await ladokCourseDataApi.getLadokCourseData(courseCode, language)

  if (!koppsCourseDetails || !ladokCourse) {
    // TODO(Ladok-POC): What to do if we find course in only in Ladok or only in Kopps?
    return {}
  }

  const isCancelledOrDeactivated = koppsCourseDetails.course.cancelled || koppsCourseDetails.course.deactivated

  //* **** Course information that is static on the course side *****//
  const courseDefaultInformation = _parseCourseDefaultInformation(koppsCourseDetails, ladokCourse, language)

  const { sellingText, courseDisposition, supplementaryInfo, imageInfo } = await courseApi.getCourseInfo(courseCode)

  const courseInfo = {
    ...courseDefaultInformation,
    sellingText: resolveText(sellingText, language),
    imageFromAdmin: imageInfo,
    course_disposition: resolveText(courseDisposition, language),
    course_supplemental_information: resolveText(supplementaryInfo, language),
  }

  //* **** Course title data  *****//
  const courseTitleData = _parseTitleData(koppsCourseDetails)

  //* **** Get list of syllabuses and valid syllabus semesters *****//
  const { syllabusList, emptySyllabusData } = createSyllabusList(koppsCourseDetails, language)

  //* **** Get a list of rounds and a list of redis keys for using to get teachers and responsibles from UG Rest API *****//
  const { roundsBySemester, activeSemesters, employees } = _parseRounds({
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
