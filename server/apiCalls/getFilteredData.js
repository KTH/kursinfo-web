const { parseOrSetEmpty } = require('../controllers/courseCtrlHelpers')
const { createSyllabusList } = require('../controllers/createSyllabusList')
const { INFORM_IF_IMPORTANT_INFO_IS_MISSING, PROGRAMME_URL, INDEPENDENT_COURSE } = require('../util/constants')
const { getDateFormat, formatVersionDate } = require('../util/dates')
const { parseSemesterIntoYearSemesterNumberArray, getSemesterForDate } = require('../util/semesterUtils')
const i18n = require('../../i18n')
const { checkIfOngoingRegistration } = require('../util/ongoingRegistration')
const { createApplicationLink } = require('../util/createApplicationLink')
const ladokApi = require('./ladokApi')
const courseApi = require('./kursinfoApi')
const { getSocial } = require('./socialApi')
const { parseCourseDefaultInformation } = require('./parseCourseDefaultInformation')

function resolveText(text = {}, language) {
  return text[language] ?? ''
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
  const matchinSocialSchedulesRounds = socialSchedules?.rounds.filter(
    s => s.applicationCode === ladokRound.tillfalleskod
  )

  let socialSchedulesRound
  if (matchinSocialSchedulesRounds) {
    if (matchinSocialSchedulesRounds.length > 1) {
      const ladokYear = ladokRound.startperiod?.inDigits?.substring(0, 4)
      socialSchedulesRound = matchinSocialSchedulesRounds.find(s => ladokYear && s.term?.startsWith(ladokYear))
    } else {
      socialSchedulesRound = matchinSocialSchedulesRounds[0]
    }
  }

  const schemaUrl = socialSchedulesRound?.has_events ? socialSchedulesRound.calendar_url : null

  const firstTutitionDateString = ladokRound.forstaUndervisningsdatum.date
  const formattedStartDate = getDateFormat(parseOrSetEmpty(firstTutitionDateString, language), language)
  const endDate = getDateFormat(parseOrSetEmpty(ladokRound.sistaUndervisningsdatum.date, language), language)

  const round_registration_ongoing = checkIfOngoingRegistration(firstTutitionDateString, periods.data.Period)
  const round_funding_type = parseOrSetEmpty(ladokRound.finansieringsform?.code, language)
  const round_is_full = ladokRound.fullsatt
  const show_application_link =
    round_funding_type === INDEPENDENT_COURSE && round_registration_ongoing && !round_is_full
  const applicationLinkUrl = createApplicationLink(ladokRound, language)

  const courseRoundModel = {
    round_start_date: formattedStartDate,
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
  const [ladokRounds, ladokCourse, ladokSyllabuses, periods, socialSchedules] = await Promise.all([
    ladokApi.getRounds(courseCode, language),
    ladokApi.getCourse(courseCode, language),
    ladokApi.getLadokSyllabuses(courseCode, language),
    ladokApi.getPeriods(),
    getSocial(courseCode, language),
  ])

  //* **** Course information that is static on the course side *****//
  // We use both the course and the latest valid Ladok syllabus to get default course information, preferring syllabus values when available, except for avvecklad which comes only from the course
  const courseDefaultInformation = parseCourseDefaultInformation(ladokCourse, ladokSyllabuses?.latest, language)

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
  const courseTitleData = {
    course_code: courseDefaultInformation.course_code,
    course_title: courseDefaultInformation.course_title,
    course_credits_label: courseDefaultInformation.course_credits_label,
  }

  //* **** Get list of syllabuses and valid syllabus semesters *****//
  const { syllabusList, emptySyllabusData } = createSyllabusList(ladokSyllabuses?.fullList, language)

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
