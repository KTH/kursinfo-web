const { parseOrSetEmpty } = require('../controllers/courseCtrlHelpers')
const {
  INFORM_IF_IMPORTANT_INFO_IS_MISSING,
  INFORM_IF_IMPORTANT_INFO_IS_MISSING_ABOUT_MIN_FIELD_OF_STUDY,
} = require('../util/constants')
const { buildCourseDepartmentLink } = require('../util/courseDepartmentUtils')
const { parseSemesterIntoYearSemesterNumberArray } = require('../util/semesterUtils')

const pickSyllabusOrCourseValue = (syllabusValue, courseValue) =>
  syllabusValue !== undefined ? syllabusValue : courseValue

function parseCourseDefaultInformation(ladokCourse, ladokSyllabus, language) {
  const courseCode = pickSyllabusOrCourseValue(ladokSyllabus?.course?.kod, ladokCourse?.kod)

  const courseTitle = pickSyllabusOrCourseValue(ladokSyllabus?.course.benamning?.name, ladokCourse?.benamning?.name)
  const courseCreditsLabel = pickSyllabusOrCourseValue(
    ladokSyllabus?.course.omfattning?.formattedWithUnit,
    ladokCourse?.omfattning?.formattedWithUnit
  )

  const courseMainSubjects = pickSyllabusOrCourseValue(
    ladokSyllabus?.course?.huvudomraden?.map(subject => subject.name).join(', '),
    ladokCourse?.huvudomraden?.map(subject => subject.name).join(', ')
  )

  const courseLevelCode = pickSyllabusOrCourseValue(
    ladokSyllabus?.course?.utbildningstyp?.level?.code,
    ladokCourse?.utbildningstyp?.level?.code
  )

  const courseLevelLabel = pickSyllabusOrCourseValue(
    ladokSyllabus?.course?.utbildningstyp?.level?.name,
    ladokCourse?.utbildningstyp?.level?.name
  )

  const gradeScale = pickSyllabusOrCourseValue(
    ladokSyllabus?.course?.betygsskala?.formatted,
    ladokCourse?.betygsskala?.formatted
  )

  const courseDepartmentCode = pickSyllabusOrCourseValue(
    ladokSyllabus?.course?.organisation?.code,
    ladokCourse?.organisation?.code
  )

  const courseDepartmentName = pickSyllabusOrCourseValue(
    ladokSyllabus?.course?.organisation?.name,
    ladokCourse?.organisation?.name
  )

  const courseEducationType = pickSyllabusOrCourseValue(
    ladokSyllabus?.course?.utbildningstyp?.id,
    ladokCourse?.utbildningstyp?.id
  )

  /**
   * Fetched only from syllabus
   */
  const courseBeingDiscontinued = ladokSyllabus?.course?.underavveckling
  const discontinuationDecision = ladokSyllabus?.course?.avvecklingsbeslut
  const lastExaminationTerm = ladokSyllabus?.course?.sistaexaminationstermin

  /**
   * Fetched only from course version
   */
  const courseDiscontinued = !!ladokCourse?.avvecklad

  return {
    course_code: parseOrSetEmpty(courseCode),
    course_title: parseOrSetEmpty(courseTitle),
    course_credits_label: parseOrSetEmpty(courseCreditsLabel),
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
