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
const courseApi = require('./kursinfoApi')

function _parseCourseDefaultInformation(courseDetails, language) {
  const { course, formattedGradeScales, mainSubjects } = courseDetails
  return {
    course_application_info: parseOrSetEmpty(course.applicationInfo, language, true), // applicationInfo is info for research students (Label in Kopps: "Information for research students about course offerings")
    course_code: parseOrSetEmpty(course.courseCode),
    course_department: parseOrSetEmpty(course.department.name, language),
    course_department_code: parseOrSetEmpty(course.department.code, language),
    course_department_link: buildCourseDepartmentLink(course.department, language),
    course_education_type_id: course.educationalTypeId || null,
    course_examiners: INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    course_grade_scale: parseOrSetEmpty(formattedGradeScales[course.gradeScaleCode], language),
    course_last_exam: course.lastExamTerm ? parseSemesterIntoYearSemesterNumberArray(course.lastExamTerm.term) : [],
    course_level_code: parseOrSetEmpty(course.educationalLevelCode),
    course_literature: parseOrSetEmpty(course.courseLiterature, language),
    course_main_subject:
      mainSubjects && mainSubjects.length > 0
        ? mainSubjects.join(', ')
        : INFORM_IF_IMPORTANT_INFO_IS_MISSING_ABOUT_MIN_FIELD_OF_STUDY[language],
    course_possibility_to_addition: parseOrSetEmpty(course.possibilityToAddition, language),
    course_possibility_to_completions: parseOrSetEmpty(course.possibilityToCompletion, language),
    course_recruitment_text: parseOrSetEmpty(course.recruitmentText, language, true),
    course_required_equipment: parseOrSetEmpty(course.requiredEquipment, language),
    course_suggested_addon_studies: parseOrSetEmpty(course.addOn, language),
    course_state: parseOrSetEmpty(course.state, language, true),
  }
}

function resolveText(text = {}, language) {
  return text[language] ?? ''
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
  const { body: courseDetails } = await koppsCourseData.getKoppsCourseData(courseCode, language)

  if (!courseDetails) {
    return {}
  }

  const isCancelledOrDeactivated = courseDetails.course.cancelled || courseDetails.course.deactivated

  //* **** Course information that is static on the course side *****//
  const courseDefaultInformation = _parseCourseDefaultInformation(courseDetails, language)

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
  const courseTitleData = _parseTitleData(courseDetails)

  //* **** Get list of syllabuses and valid syllabus semesters *****//
  const { syllabusList, emptySyllabusData } = createSyllabusList(courseDetails, language)

  //* **** Get a list of rounds and a list of redis keys for using to get teachers and responsibles from UG Rest API *****//
  const { roundsBySemester, activeSemesters, employees } = _parseRounds({
    roundInfos: courseDetails.roundInfos,
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
