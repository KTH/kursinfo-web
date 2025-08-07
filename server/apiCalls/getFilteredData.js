const { parseOrSetEmpty } = require('../controllers/courseCtrlHelpers')
const { createSyllabusList } = require('../controllers/createSyllabusList')
const {
  INFORM_IF_IMPORTANT_INFO_IS_MISSING,
  INFORM_IF_IMPORTANT_INFO_IS_MISSING_ABOUT_MIN_FIELD_OF_STUDY,
  PROGRAMME_URL,
  INDEPENDENT_COURSE,
} = require('../util/constants')
const { buildCourseDepartmentLink } = require('../util/courseDepartmentUtils')
const { getDateFormat, formatVersionDate } = require('../util/dates')
const { parseSemesterIntoYearSemesterNumberArray, getSemesterForDate } = require('../util/semesterUtils')
const i18n = require('../../i18n')
const { checkIfOngoingRegistration } = require('../util/ongoingRegistration')
const { createApplicationLink } = require('../util/createApplicationLink')
const ladokApi = require('./ladokApi')
const courseApi = require('./kursinfoApi')
const { getSocial } = require('./socialApi')

function _parseCourseDefaultInformation(ladokCourse, ladokSyllabus, language) {
  const getValue = (courseValue, syllabusValue) =>
    ladokCourse !== undefined && courseValue !== undefined ? courseValue : syllabusValue

  const courseCode = getValue(ladokCourse?.kod, ladokSyllabus?.course?.kod)

  const courseMainSubjects = getValue(
    ladokCourse?.huvudomraden?.map(subject => subject.name).join(', '),
    ladokSyllabus?.course?.huvudomraden?.map(subject => subject[language]).join(', ')
  )

  const courseLevelCode = getValue(
    ladokCourse?.utbildningstyp?.level?.code,
    ladokSyllabus?.course?.nivainomstudieordning?.level?.code
  )

  const courseLevelLabel = getValue(
    ladokCourse?.utbildningstyp?.level?.name,
    ladokSyllabus?.course?.nivainomstudieordning?.level?.[language]
  )

  const gradeScale = getValue(ladokCourse?.betygsskala?.formatted, ladokSyllabus?.course?.betygsskala)

  const discontinuationDecision = getValue(ladokCourse?.avvecklingsbeslut, ladokSyllabus?.kursplan?.avvecklingsbeslut)

  const courseDepartmentCode = getValue(ladokCourse?.organisation?.code, ladokSyllabus?.course?.organisation?.code)

  const courseDepartmentName = getValue(
    ladokCourse?.organisation?.name,
    ladokSyllabus?.course?.organisation?.[language]
  )

  const courseEducationType = getValue(
    ladokCourse?.utbildningstyp?.id,
    ladokSyllabus?.course?.nivainomstudieordning?.id
  )

  const courseDiscontinued = getValue(ladokCourse?.avvecklad, ladokSyllabus?.course?.avvecklad)

  const courseBeingDiscontinued = getValue(ladokCourse?.underavveckling, ladokSyllabus?.course?.underavveckling)

  const lastExaminationTerm = getValue(
    ladokCourse?.sistaexaminationstermin,
    ladokSyllabus?.course?.sistaexaminationstermin
  )

  return {
    course_code: parseOrSetEmpty(courseCode),
    course_department: parseOrSetEmpty(courseDepartmentName),
    course_department_code: parseOrSetEmpty(courseDepartmentCode),
    course_department_link: buildCourseDepartmentLink(courseDepartmentName, courseDepartmentCode, language),
    course_education_type_id: courseEducationType,
    course_level_code: courseLevelCode,
    course_level_code_label: parseOrSetEmpty(courseLevelLabel, language),
    course_main_subject:
      courseMainSubjects !== ''
        ? courseMainSubjects
        : INFORM_IF_IMPORTANT_INFO_IS_MISSING_ABOUT_MIN_FIELD_OF_STUDY[language],
    course_grade_scale: parseOrSetEmpty(gradeScale),
    course_is_discontinued: courseDiscontinued,
    course_is_being_discontinued: parseOrSetEmpty(courseBeingDiscontinued),
    course_decision_to_discontinue: parseOrSetEmpty(discontinuationDecision, language),
    course_last_exam: lastExaminationTerm ? parseSemesterIntoYearSemesterNumberArray(lastExaminationTerm) : '',

    // TODO(Ladok-POC): Will be replaced with field from Om kursen-admin
    course_prerequisites: INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],

    // TODO(Ladok-POC): Do we need to set course_examiners to empty here?
    course_examiners: INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
  }
}

function resolveText(text = {}, language) {
  return text[language] ?? ''
}

function _parseTitleData(ladokCourse, ladokSyllabus, language) {
  const getValue = (courseValue, syllabusValue) =>
    ladokCourse !== undefined && courseValue !== undefined ? courseValue : syllabusValue
  const courseCode = getValue(ladokCourse?.kod, ladokSyllabus?.course?.kod)
  const courseTitle = getValue(ladokCourse?.benamning, ladokSyllabus?.course.benamning[language])
  const courseCreditsLabel = getValue(
    ladokCourse?.omfattning.formattedWithUnit,
    ladokSyllabus?.course.omfattning.formattedWithUnit
  )
  return {
    course_code: parseOrSetEmpty(courseCode),
    course_title: parseOrSetEmpty(courseTitle),
    course_credits_label: parseOrSetEmpty(courseCreditsLabel),
  }
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

function _getRoundProgramme(programmes, language = 'en') {
  let programmeString = ''
  programmes.forEach(programme => {
    const { kod, benamning, arskurs, startperiod, inriktning, valinformation } = programme
    programmeString += `<p>
          <a href="${PROGRAMME_URL}/${kod}/${startperiod.inDigits}/arskurs${arskurs}${inriktning ? '#inr' + inriktning : ''}">
            ${benamning[language]}, ${i18n.messages[language === 'en' ? 0 : 1].courseRoundInformation.round_study_year} ${arskurs}${inriktning ? ', ' + inriktning : ''}${valinformation[language] ? ', ' + valinformation[language] : ''}
        </a>
      </p>`
  })
  return programmeString
}

const createPeriodString = (ladokRound, periods, language) => {
  const { tillfallesPerioder } = ladokRound

  return tillfallesPerioder
    .map(period => {
      const semesterAndYear = getSemesterForDate(period.ForstaUndervisningsdatum, periods, language)
      const periodString = `<p class="periode-list">${semesterAndYear}: `

      const periodCodes = period.Lasperiodsfordelning
        ? period.Lasperiodsfordelning.map(
            fordelning => `${fordelning.Lasperiodskod} (${fordelning.Omfattningsvarde} hp)`
          )
        : []

      return periodCodes.length > 0 ? `${periodString}${periodCodes.join(', ')}</p>` : ''
    })
    .join('')
}

function _getRound(ladokRound, socialSchedules, periods, language = 'sv') {
  const round = socialSchedules.rounds.find(schedule => schedule.applicationCode === ladokRound.tillfalleskod)
  const schemaUrl = round && round.has_events ? round.calendar_url : null

  const startDate = getDateFormat(parseOrSetEmpty(ladokRound.forstaUndervisningsdatum.date, language), language)
  const endDate = getDateFormat(parseOrSetEmpty(ladokRound.sistaUndervisningsdatum.date, language), language)

  const round_registration_ongoing = checkIfOngoingRegistration(startDate, periods.data.Period)
  const round_funding_type = parseOrSetEmpty(ladokRound.finansieringsform?.code, language)
  const round_is_full = ladokRound.fullsatt
  const show_application_link =
    round_funding_type === INDEPENDENT_COURSE && round_registration_ongoing && !round_is_full
  const applicationLinkUrl = createApplicationLink(ladokRound, language)

  const courseRoundModel = {
    round_start_date: startDate,
    round_end_date: endDate,
    round_target_group: parseOrSetEmpty(ladokRound.malgrupp, language),
    round_tutoring_form: parseOrSetEmpty(ladokRound.undervisningsform?.code, language),
    round_tutoring_time: parseOrSetEmpty(ladokRound.undervisningstid?.code, language),
    round_tutoring_language: parseOrSetEmpty(ladokRound.undervisningssprak?.name, language),
    round_course_place: parseOrSetEmpty(ladokRound.studieort?.name, language),
    round_short_name: parseOrSetEmpty(ladokRound.kortnamn, language),
    round_application_code: parseOrSetEmpty(ladokRound.tillfalleskod, language),
    round_study_pace: parseOrSetEmpty(ladokRound.studietakt?.takt, language),
    round_course_term: parseSemesterIntoYearSemesterNumberArray(ladokRound.startperiod?.inDigits),
    round_funding_type,
    round_seats:
      _parseRoundSeatsMsg(
        parseOrSetEmpty(ladokRound.utbildningsplatser, language, true),
        parseOrSetEmpty(ladokRound.minantalplatser, language, true)
      ) || '',

    round_periods: createPeriodString(ladokRound, periods, language),
    round_schedule: parseOrSetEmpty(schemaUrl, language),
    round_selection_criteria: parseOrSetEmpty(ladokRound.urvalskriterier, language, true),
    round_application_link: parseOrSetEmpty(applicationLinkUrl),
    round_part_of_programme:
      ladokRound.delAvProgram?.length > 0
        ? _getRoundProgramme(ladokRound.delAvProgram, language)
        : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    round_status: parseOrSetEmpty(ladokRound.status?.code, language),
    round_is_cancelled: ladokRound.installt,
    round_is_full,
    show_application_link,
  }
  if (courseRoundModel.round_short_name === INFORM_IF_IMPORTANT_INFO_IS_MISSING[language]) {
    courseRoundModel.round_short_name = `${language === 0 ? 'Start' : 'Start'}  ${courseRoundModel.round_start_date}`
  }

  return courseRoundModel
}

function _parseRounds({ ladokRounds, socialSchedules, language, memoList, periods }) {
  const activeSemesterArray = []
  const tempList = []

  const roundsBySemester = {}
  for (const ladokRound of ladokRounds) {
    const courseRound = _getRound(ladokRound, socialSchedules, periods, language)
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
  }

  activeSemesterArray.sort()

  const activeSemesters = activeSemesterArray.map(([year, semesterNumber, semester]) => ({
    year,
    semesterNumber,
    semester,
  }))

  return { roundsBySemester, activeSemesters }
}

const getFilteredData = async ({ courseCode, language, memoList }) => {
  let ladokCourse = undefined
  const [ladokRounds, ladokSyllabuses, periods, socialSchedules] = await Promise.all([
    ladokApi.getRounds(courseCode, language),
    ladokApi.getLadokSyllabuses(courseCode, language),
    ladokApi.getPeriods(),
    getSocial(courseCode, language),
  ])
  if (!ladokSyllabuses) {
    ladokCourse = await ladokApi.getCourse(courseCode, language)
  }

  //* **** Course information that is static on the course side *****//
  // We use the latest valid ladok syllabus here since the information that we are using inside _parseCourseDefaultInformation are general data inside syllabuses
  const courseDefaultInformation = _parseCourseDefaultInformation(ladokCourse, ladokSyllabuses[0], language)

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
  const courseTitleData = _parseTitleData(ladokCourse, ladokSyllabuses[0], language)

  //* **** Get list of syllabuses and valid syllabus semesters *****//
  const { syllabusList, emptySyllabusData } = createSyllabusList(ladokSyllabuses, language)

  //* **** Get a list of rounds and a list of redis keys for using to get teachers and courseCoordinators from UG Rest API *****//
  const { roundsBySemester, activeSemesters } = _parseRounds({
    ladokRounds,
    socialSchedules,
    language,
    memoList,
    periods,
  })

  const courseData = { syllabusList, courseInfo, roundsBySemester, courseTitleData, language, emptySyllabusData }

  return { activeSemesters, courseData }
}

module.exports = { getFilteredData, createApplicationLink }
