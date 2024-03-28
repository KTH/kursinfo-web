const {
  INFORM_IF_IMPORTANT_INFO_IS_MISSING,
  INFORM_IF_IMPORTANT_INFO_IS_MISSING_ABOUT_MIN_FIELD_OF_STUDY,
} = require('../util/constants')
const { buildCourseDepartmentLink } = require('../util/courseDepartmentUtils')

function parseOrSetEmpty(value, language, setEmpty = false) {
  const emptyText = setEmpty ? '' : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language]
  return value ? value : emptyText
}

function parceContactName(infoContactName, language) {
  const courseContactName = parseOrSetEmpty(infoContactName, language)
  if (courseContactName === INFORM_IF_IMPORTANT_INFO_IS_MISSING[language]) return courseContactName
  const emailBracketsRexEx = /<|>/gi
  const contact = courseContactName.replace(emailBracketsRexEx, '')
  return contact
}

function parseCourseDefaultInformation(courseDetails, language) {
  const { course, formattedGradeScales, mainSubjects } = courseDetails
  return {
    course_application_info: parseOrSetEmpty(course.applicationInfo, language, true),
    course_code: parseOrSetEmpty(course.courseCode),
    course_contact_name: parceContactName(course.infoContactName, language),
    course_department: parseOrSetEmpty(course.department.name, language),
    course_department_code: parseOrSetEmpty(course.department.code, language),
    course_department_link: buildCourseDepartmentLink(course.department, language),
    course_education_type_id: course.educationalTypeId || null,
    course_examiners: INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    course_grade_scale: parseOrSetEmpty(formattedGradeScales[course.gradeScaleCode], language),
    course_last_exam: course.lastExamTerm ? course.lastExamTerm.term.toString().match(/.{1,4}/g) : [],
    course_level_code: parseOrSetEmpty(course.educationalLevelCode),
    course_literature: parseOrSetEmpty(course.courseLiterature, language),
    course_main_subject:
      mainSubjects && mainSubjects.length > 0
        ? mainSubjects.join(', ')
        : INFORM_IF_IMPORTANT_INFO_IS_MISSING_ABOUT_MIN_FIELD_OF_STUDY[language],
    course_possibility_to_addition: parseOrSetEmpty(course.possibilityToAddition, language),
    course_possibility_to_completions: parseOrSetEmpty(course.possibilityToCompletion, language),
    course_prerequisites: parseOrSetEmpty(course.prerequisites, language),
    course_recruitment_text: parseOrSetEmpty(course.recruitmentText, language, true),
    course_required_equipment: parseOrSetEmpty(course.requiredEquipment, language),
    course_suggested_addon_studies: parseOrSetEmpty(course.addOn, language),
    course_supplemental_information_url: parseOrSetEmpty(course.supplementaryInfoUrl, language),
    course_supplemental_information_url_text: parseOrSetEmpty(course.supplementaryInfoUrlName, language),
    course_state: parseOrSetEmpty(course.state, language, true),
  }
}

function parseTitleData({ course }) {
  return {
    course_code: parseOrSetEmpty(course.courseCode),
    course_title: parseOrSetEmpty(course.title),
    course_other_title: parseOrSetEmpty(course.titleOther),
    course_credits: parseOrSetEmpty(course.credits),
    course_credits_text: parseOrSetEmpty(course.creditUnitAbbr),
  }
}

function _parseExamObject(exams, grades, language = 0, semester = '', creditUnitAbbr) {
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

function _parseSyllabusData(courseDetails, semester = 0, language) {
  const { course, examinationSets, formattedGradeScales, publicSyllabusVersions } = courseDetails
  const hasSyllabusData = publicSyllabusVersions && publicSyllabusVersions.length > 0
  const semesterSyllabus = hasSyllabusData && publicSyllabusVersions[semester] ? publicSyllabusVersions[semester] : null

  return {
    course_goals: semesterSyllabus
      ? parseOrSetEmpty(semesterSyllabus.courseSyllabus.goals, language)
      : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    course_content: semesterSyllabus
      ? parseOrSetEmpty(semesterSyllabus.courseSyllabus.content, language)
      : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    course_disposition: semesterSyllabus
      ? parseOrSetEmpty(semesterSyllabus.courseSyllabus.disposition, language)
      : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    course_eligibility: semesterSyllabus
      ? parseOrSetEmpty(semesterSyllabus.courseSyllabus.eligibility, language)
      : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    course_requirments_for_final_grade: semesterSyllabus
      ? parseOrSetEmpty(semesterSyllabus.courseSyllabus.reqsForFinalGrade, language, true)
      : '',
    course_literature: semesterSyllabus
      ? parseOrSetEmpty(semesterSyllabus.courseSyllabus.literature, language)
      : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    course_literature_comment: semesterSyllabus
      ? parseOrSetEmpty(semesterSyllabus.courseSyllabus.literatureComment, language)
      : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    course_valid_from: semesterSyllabus
      ? parseOrSetEmpty(semesterSyllabus.validFromTerm.term)
          .toString()
          .match(/.{1,4}/g)
      : [],
    course_valid_to: [],
    course_required_equipment: semesterSyllabus
      ? parseOrSetEmpty(semesterSyllabus.courseSyllabus.requiredEquipment, language)
      : '',
    course_examination:
      hasSyllabusData && examinationSets && Object.keys(examinationSets).length > 0
        ? _parseExamObject(
            examinationSets,
            formattedGradeScales,
            language,
            semesterSyllabus.validFromTerm.term,
            course.creditUnitAbbr
          )
        : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language],
    course_examination_comments: semesterSyllabus
      ? parseOrSetEmpty(semesterSyllabus.courseSyllabus.examComments, language, true)
      : '',
    course_ethical: semesterSyllabus
      ? parseOrSetEmpty(semesterSyllabus.courseSyllabus.ethicalApproach, language, true)
      : '',
    course_establishment: semesterSyllabus
      ? parseOrSetEmpty(semesterSyllabus.courseSyllabus.establishment, language, true)
      : '',
    course_additional_regulations: semesterSyllabus
      ? parseOrSetEmpty(semesterSyllabus.courseSyllabus.additionalRegulations, language, true)
      : '',
    course_transitional_reg: semesterSyllabus
      ? parseOrSetEmpty(semesterSyllabus.courseSyllabus.transitionalRegulations, language, true)
      : '',
    course_decision_to_discontinue: semesterSyllabus
      ? parseOrSetEmpty(semesterSyllabus.courseSyllabus.decisionToDiscontinue, language)
      : '',
  }
}

//* *** Sets the end semester for older syllabuses *****/
function _getSyllabusEndSemester(newerSyllabusValidFromTerm) {
  const [year, season] = newerSyllabusValidFromTerm
  if (season === '1') {
    return [Number(year) - 1, '2']
  }
  return [Number(year), '1']
}

function getListOfSyllabusesAndValidSyllabusSemesters(courseDetails, lang) {
  const syllabusList = []
  const syllabusSemesterList = []
  let parsedSyllabus = {}
  const { publicSyllabusVersions: syllabuses } = courseDetails
  if (syllabuses.length > 0) {
    for (let index = 0; index < syllabuses.length; index++) {
      syllabusSemesterList.push([syllabuses[index].validFromTerm.term, ''])
      parsedSyllabus = _parseSyllabusData(courseDetails, index, lang)
      if (index > 0) {
        const yearRegEx = /.{1,4}/g
        const [newerSyllabusValidFromTerm] = syllabusSemesterList[index - 1]
        parsedSyllabus.course_valid_to = _getSyllabusEndSemester(newerSyllabusValidFromTerm.toString().match(yearRegEx))
        syllabusSemesterList[index][1] = Number(parsedSyllabus.course_valid_to.join(''))
      }
      syllabusList.push(parsedSyllabus)
    }
  } else {
    syllabusList[0] = _parseSyllabusData(courseDetails, 0, lang)
  }

  return {
    syllabusList,
    syllabusSemesterList,
  }
}

module.exports = {
  parseCourseDefaultInformation,
  parseTitleData,
  getListOfSyllabusesAndValidSyllabusSemesters,
}
