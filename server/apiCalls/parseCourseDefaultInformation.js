const { parseOrSetEmpty } = require('../controllers/courseCtrlHelpers')
const {
  INFORM_IF_IMPORTANT_INFO_IS_MISSING,
  INFORM_IF_IMPORTANT_INFO_IS_MISSING_ABOUT_MIN_FIELD_OF_STUDY,
} = require('../util/constants')
const { buildCourseDepartmentLink } = require('../util/courseDepartmentUtils')
const { parseSemesterIntoYearSemesterNumberArray } = require('../util/semesterUtils')

function parseCourseDefaultInformation(ladokCourse, ladokSyllabus, language) {
  const courseCode = ladokSyllabus?.course?.kod
  const courseMainSubjects = ladokSyllabus?.course?.huvudomraden?.map(subject => subject.name).join(', ')
  const courseLevelCode = ladokSyllabus?.course?.utbildningstyp?.level?.code
  const courseLevelLabel = ladokSyllabus?.course?.utbildningstyp?.level?.name
  const gradeScale = ladokSyllabus?.course?.betygsskala?.formatted
  const discontinuationDecision = ladokSyllabus?.course?.avvecklingsbeslut
  const courseDepartmentCode = ladokSyllabus?.course?.organisation?.code
  const courseDepartmentName = ladokSyllabus?.course?.organisation?.name
  const courseEducationType = ladokSyllabus?.course?.utbildningstyp?.id
  const lastExaminationTerm = ladokSyllabus?.course?.sistaexaminationstermin
  const courseBeingDiscontinued = ladokSyllabus?.course?.underavveckling
  const courseDiscontinued = !!ladokCourse?.avvecklad

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

module.exports = { parseCourseDefaultInformation }
