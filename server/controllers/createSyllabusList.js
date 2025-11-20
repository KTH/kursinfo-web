const { INFORM_IF_IMPORTANT_INFO_IS_MISSING } = require('../util/constants')
const { parseSemesterIntoYearSemesterNumber, calcPreviousSemester } = require('../util/semesterUtils')
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
    course_ethical: parseOrSetEmpty(syllabus.kursplan.etisktforhallningssatt, language, true),
    course_additional_regulations: parseOrSetEmpty(syllabus.kursplan.ovrigaForeskrifter, language, true),
    course_transitional_reg: parseOrSetEmpty(syllabus.course.overgangsbestammelser, language, true),
  }
}

const createSyllabusList = (syllabuses, lang) => {
  const emptySyllabusData = _createEmptySyllabusData(lang)

  if (!syllabuses?.length) {
    return {
      syllabusList: [],
      emptySyllabusData,
    }
  }

  const syllabusList = []
  for (let index = 0; index < syllabuses.length; index++) {
    const syllabus = _mapSyllabus(syllabuses[index], lang)

    /* The syllabuses list we get from the om-kursen-ladok-client package is sorted from newest to oldest.
     * This means we can determine how long each syllabus is valid by looking at the previous item in the list
     * — which is the newer syllabus — to know until which semester it's valid.
     */
    const newerSyllabus = syllabusList[index - 1]
    if (newerSyllabus) {
      syllabus.course_valid_to = calcPreviousSemester(newerSyllabus.course_valid_from)
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
