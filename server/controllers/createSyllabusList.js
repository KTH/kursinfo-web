const { INFORM_IF_IMPORTANT_INFO_IS_MISSING } = require('../util/constants')
const { calcPreviousSemester, parseSemesterIntoYearSemesterNumber } = require('../util/semesterUtils')
const { parseOrSetEmpty } = require('./courseCtrlHelpers')

const _parseExamObject = (language = 0, semester = '', examinationModules) => {
  let activeExaminationModule = {}

  examinationModules.forEach(examinationModule => {
    const giltigFrom = examinationModule.giltigFrom.code.includes('VT')
      ? examinationModule.giltigFrom.code.slice(2) + 1
      : examinationModule.giltigFrom.code.slice(2) + 2
    // Pick the latest examination module by comparing to current semester
    if (Number(semester) >= Number(giltigFrom)) {
      activeExaminationModule = examinationModule
    }
  })
  let examString = "<ul class='ul-no-padding' >"
  if (activeExaminationModule) {
    examString += `<li>${activeExaminationModule.kod} - 
                          ${activeExaminationModule.benamning},
                          ${activeExaminationModule.omfattning.formattedWithUnit},  
                          ${language === 'en' ? 'grading scale' : 'betygsskala'}: ${
                            activeExaminationModule.betygsskala.code
                          }              
                          </li>`
  }
  examString += '</ul>'
  return examString
}

const _createEmptySyllabusData = language => ({
  course_goals: INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
  course_content: INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
  course_eligibility: INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
  course_requirments_for_final_grade: '',
  course_literature: INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
  course_literature_comment: INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
  course_valid_from: undefined,
  course_valid_to: undefined,
  course_required_equipment: '',
  course_examination: INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
  course_examination_comments: '',
  course_ethical: '',
  course_additional_regulations: '',
  course_transitional_reg: '',
  course_decision_to_discontinue: '',
})

const _parseSyllabusData = (courseDetails, examinationModules, semesterIndex = 0, language) => {
  const { publicSyllabusVersions } = courseDetails
  const hasSyllabusData = publicSyllabusVersions && publicSyllabusVersions.length > 0
  const semesterSyllabus =
    hasSyllabusData && publicSyllabusVersions[semesterIndex] ? publicSyllabusVersions[semesterIndex] : null

  if (!semesterSyllabus) {
    return _createEmptySyllabusData(language)
  }

  return {
    course_goals: parseOrSetEmpty(semesterSyllabus.courseSyllabus.goals, language),
    course_content: parseOrSetEmpty(semesterSyllabus.courseSyllabus.content, language),
    course_eligibility: parseOrSetEmpty(semesterSyllabus.courseSyllabus.eligibility, language),
    course_requirments_for_final_grade: parseOrSetEmpty(
      semesterSyllabus.courseSyllabus.reqsForFinalGrade,
      language,
      true
    ),
    course_literature: parseOrSetEmpty(semesterSyllabus.courseSyllabus.literature, language),
    course_literature_comment: parseOrSetEmpty(semesterSyllabus.courseSyllabus.literatureComment, language),
    course_valid_from: parseSemesterIntoYearSemesterNumber(parseOrSetEmpty(semesterSyllabus.validFromTerm.term)),
    course_valid_to: undefined,
    course_required_equipment: parseOrSetEmpty(semesterSyllabus.courseSyllabus.requiredEquipment, language),
    course_examination: _parseExamObject(language, semesterSyllabus.validFromTerm.term, examinationModules),
    course_examination_comments: parseOrSetEmpty(semesterSyllabus.courseSyllabus.examComments, language, true),
    course_ethical: parseOrSetEmpty(semesterSyllabus.courseSyllabus.ethicalApproach, language, true),
    course_additional_regulations: parseOrSetEmpty(
      semesterSyllabus.courseSyllabus.additionalRegulations,
      language,
      true
    ),
    course_transitional_reg: parseOrSetEmpty(semesterSyllabus.courseSyllabus.transitionalRegulations, language, true),
    course_decision_to_discontinue: parseOrSetEmpty(semesterSyllabus.courseSyllabus.decisionToDiscontinue, language),
  }
}

const createSyllabusList = (koppsCourseDetails, examinationModules, lang) => {
  const { publicSyllabusVersions } = koppsCourseDetails
  const emptySyllabusData = _createEmptySyllabusData(lang)

  if (publicSyllabusVersions.length === 0) {
    return {
      syllabusList: [],
      emptySyllabusData,
    }
  }

  const syllabusList = []

  for (let index = 0; index < publicSyllabusVersions.length; index++) {
    const previousSyllabus = index > 0 ? syllabusList[index - 1] : undefined
    const syllabus = _parseSyllabusData(koppsCourseDetails, examinationModules, index, lang)

    if (previousSyllabus) {
      syllabus.course_valid_to = calcPreviousSemester(previousSyllabus.course_valid_from)
    }

    syllabusList.push(syllabus)
  }

  return {
    syllabusList,
    emptySyllabusData,
  }
}

module.exports = {
  createSyllabusList,
}
