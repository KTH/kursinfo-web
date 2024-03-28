const { INFORM_IF_IMPORTANT_INFO_IS_MISSING, PROGRAMME_URL, MAX_1_MONTH, MAX_2_MONTH } = require('../util/constants')
const { getDateFormat, formatVersionDate } = require('../util/dates')
const i18n = require('../../i18n')

function parseOrSetEmpty(value, language, setEmpty = false) {
  const emptyText = setEmpty ? '' : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language]
  return value ? value : emptyText
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

function parseRounds(roundInfos, courseCode, language, memoList) {
  const initActives = []
  const initkeyList = {
    teachers: [],
    responsibles: [],
  }
  const tempList = []
  let courseRound
  const courseRoundList = {}
  for (const roundInfo of roundInfos) {
    courseRound = _getRound(roundInfo, language)
    const { round_course_term: yearAndTermArr, round_application_code: applicationCode } = courseRound
    const semester = yearAndTermArr.join('')

    if (yearAndTermArr && tempList.indexOf(semester) < 0) {
      tempList.push(semester)
      initActives.push([...yearAndTermArr, semester, 0])
      courseRoundList[semester] = []
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
    courseRoundList[semester].push(courseRound)
    // TODO: This will be removed. Because UG Rest Api is still using ladokRoundId. So once it get replaced by application code then this will be removed.
    const { round = {} } = roundInfo
    const { ladokRoundId } = round
    initkeyList.teachers.push(`${courseCode}.${semester}.${ladokRoundId}.teachers`)
    initkeyList.responsibles.push(`${courseCode}.${semester}.${ladokRoundId}.courseresponsible`)
  }
  initkeyList.teachers.sort()
  initkeyList.responsibles.sort()
  return { roundList: courseRoundList, activeSemesters: initActives.sort(), keyList: initkeyList }
}

function isSyllabusValidForThisSemester(syllabusStartSemester, semester) {
  return syllabusStartSemester <= semester
}

function createSemestersAndSyllabusConnection(syllabusSemesterList, activeSemesters) {
  const numberOfSemesters = activeSemesters.length
  const activeSemestersIndexesWithValidSyllabusesIndexes = []

  for (let semesterIndex = 0; semesterIndex < numberOfSemesters; semesterIndex++) {
    const latestSyllabusIndex = 0
    const semester = Number(activeSemesters[semesterIndex][2])

    for (let syllabusIndex = latestSyllabusIndex; syllabusIndex < syllabusSemesterList.length; syllabusIndex++) {
      const prevSyllabusStartSemester = Number(syllabusSemesterList[syllabusIndex][0])
      const isPrevSyllabusValidForThisSemester = isSyllabusValidForThisSemester(prevSyllabusStartSemester, semester)

      if (isPrevSyllabusValidForThisSemester) {
        activeSemestersIndexesWithValidSyllabusesIndexes[semesterIndex] = syllabusIndex
        break
      }
    }
  }

  return activeSemestersIndexesWithValidSyllabusesIndexes
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

//* *** Default syllabus might change when the dates set in MAX_(semester)_DAY and MAX_(semester)_MONTH is passed ****/
function getSemesterIndexToShow(externalSemesterNumber, activeSemesters) {
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

// function chooseSemesterAndSyllabusFromActiveSemesters(externalSemester, useStartSemesterFromQuery, webContext) {
//   const { activeSemesters } = webContext

//   const defaultSemesterIndex = _getSemesterIndexToShow(
//     useStartSemesterFromQuery ? externalSemester : '',
//     activeSemesters
//   )

//   const result = {
//     defaultSemesterIndex,
//   }

//   if (useStartSemesterFromQuery) {
//     result.activeSemester = externalSemester
//     result.activeSemesterIndex = defaultSemesterIndex
//     result.semesterSelectedIndex = defaultSemesterIndex
//     result.activeSyllabusIndex = webContext.activeSemestersIndexesWithValidSyllabusesIndexes[defaultSemesterIndex]
//   }

//   return result
// }

module.exports = {
  parseRounds,
  createSemestersAndSyllabusConnection,
  chooseSemesterAndSyllabusFromActiveSemesters,
  getSemesterIndexToShow,
}
