const { INFORM_IF_IMPORTANT_INFO_IS_MISSING } = require('../util/constants')
const { calcPreviousSemester, parseSemesterIntoYearSemesterNumber } = require('../util/semesterUtils')
const { parseOrSetEmpty } = require('./courseCtrlHelpers')

const _parseExamObject = (exams, grades, language = 0, semester = '', creditUnitAbbr) => {
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

const _parseSyllabusData = (courseDetails, semesterIndex = 0, language) => {
  const { course, examinationSets, formattedGradeScales, publicSyllabusVersions } = courseDetails
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
    course_examination:
      examinationSets && Object.keys(examinationSets).length > 0
        ? _parseExamObject(
            examinationSets,
            formattedGradeScales,
            language,
            semesterSyllabus.validFromTerm.term,
            course.creditUnitAbbr
          )
        : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
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

const createSyllabusList = (courseDetails, lang) => {
  const { publicSyllabusVersions } = courseDetails

  if (publicSyllabusVersions.length === 0) {
    return {
      syllabusList: [_createEmptySyllabusData()],
    }
  }

  const syllabusList = []

  for (let index = 0; index < publicSyllabusVersions.length; index++) {
    const previousSyllabus = index > 0 ? syllabusList[index - 1] : undefined
    const syllabus = _parseSyllabusData(courseDetails, index, lang)

    if (previousSyllabus) {
      syllabus.course_valid_to = calcPreviousSemester(previousSyllabus.course_valid_from)
    }

    syllabusList.push(syllabus)
  }

  return {
    syllabusList,
  }
}

module.exports = {
  createSyllabusList,
}
