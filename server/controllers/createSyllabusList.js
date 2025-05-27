const { INFORM_IF_IMPORTANT_INFO_IS_MISSING } = require('../util/constants')
const { parseSemesterIntoYearSemesterNumber } = require('../util/semesterUtils')
const { parseOrSetEmpty } = require('./courseCtrlHelpers')

const _createEmptySyllabusData = language => ({
  course_goals: INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
  course_content: INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
  course_eligibility: INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
  course_requirments_for_final_grade: '',
  course_literature: INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
  course_valid_from: undefined,
  course_valid_to: undefined,
  course_examination: INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
  course_examination_comments: '',
  course_ethical: '',
  course_additional_regulations: '',
  course_transitional_reg: '',
  course_decision_to_discontinue: '',
})

const _mapSyllabus = (syllabus, language) => {
  if (!syllabus) {
    return _createEmptySyllabusData(language)
  }
  return {
    course_goals: parseOrSetEmpty(syllabus.kursplan.larandemal, language),
    course_content: parseOrSetEmpty(syllabus.kursplan.kursinnehall, language),
    course_eligibility: parseOrSetEmpty(syllabus.kursplan.sarskildbehorighet, language),
    course_requirments_for_final_grade: parseOrSetEmpty(syllabus.kursplan.ovrigakravforslutbetyg, language, true),
    course_literature: parseOrSetEmpty(syllabus.kursplan.kurslitteratur, language),
    course_valid_from: parseSemesterIntoYearSemesterNumber(parseOrSetEmpty(syllabus.kursplan.giltigfrom)),
    course_valid_to: undefined,
    course_examination: syllabus.kursplan.examinationModules.completeExaminationStrings,
    course_examination_comments: parseOrSetEmpty(syllabus.kursplan.kommentartillexamination, language, true),
    course_ethical: parseOrSetEmpty(syllabus.kursplan.etisktforhallandesatt, language, true),
    course_additional_regulations: parseOrSetEmpty(syllabus.kursplan.faststallande, language, true),
    course_transitional_reg: parseOrSetEmpty(syllabus.course.overgangsbestammelser, language, true),
    course_decision_to_discontinue: parseOrSetEmpty(syllabus.kursplan.avvecklingsbeslut, language),
  }
}

const createSyllabusList = (syllabus, lang) => {
  const emptySyllabusData = _createEmptySyllabusData(lang)

  if (!syllabus) {
    return {
      syllabusList: [],
      emptySyllabusData,
    }
  }

  const syllabusList = []

  const mappedSyllabus = _mapSyllabus(syllabus, lang)

  syllabusList.push(mappedSyllabus)

  return {
    syllabusList,
    emptySyllabusData,
  }
}

module.exports = {
  createSyllabusList,
}
