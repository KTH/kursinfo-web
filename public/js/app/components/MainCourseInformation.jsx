import React from 'react'

import Alert from '../components-shared/Alert'

import { FORSKARUTB_URL } from '../util/constants'
import { useLanguage } from '../hooks/useLanguage'

import CourseSectionList from './CourseSectionList'
import { SyllabusPdfInformation } from './SyllabusPdfInformation'

const MainCourseInformation = ({ courseCode, courseData, semesterRoundState }) => {
  const { translation } = useLanguage()

  const { courseInfo, emptySyllabusData } = courseData
  const { activeSyllabus, hasSyllabus } = semesterRoundState

  const createValidToString = () => {
    if (!activeSyllabus.course_valid_to) return ''
    return `${translation.courseInformation.course_short_semester[activeSyllabus.course_valid_to.semesterNumber]}${activeSyllabus.course_valid_to.year}`
  }

  const createValidFromString = () =>
    `${
      translation.courseInformation.course_short_semester[activeSyllabus.course_valid_from.semesterNumber]
    }${activeSyllabus.course_valid_from.year}`

  const createSyllabusName = () => {
    if (!hasSyllabus) return ''
    return `${courseCode}${` (${createValidFromString()}\u2013${createValidToString()})`}`
  }

  const syllabusName = createSyllabusName()
  return (
    <>
      {hasSyllabus ? (
        <SyllabusPdfInformation
          courseCode={courseCode}
          syllabusName={syllabusName}
          syllabus={semesterRoundState.activeSyllabus}
        />
      ) : (
        <Alert type="info" header={translation.courseLabels.header_no_syllabus}>
          {translation.courseLabels.label_no_syllabus}
        </Alert>
      )}

      {courseInfo.course_application_info.length > 0 && (
        <Alert type="info" header={translation.courseInformation.course_application_info}>
          <span dangerouslySetInnerHTML={{ __html: courseInfo.course_application_info }} />
        </Alert>
      )}

      <CourseSectionList
        courseInfo={courseInfo}
        // if there is no syllabus, we still want to display empty syllabus data
        syllabus={hasSyllabus ? activeSyllabus : emptySyllabusData}
        partToShow="courseContentBlock"
        syllabusName={syllabusName}
      />

      {/* ---IF RESEARCH LEVEL: SHOW "Postgraduate course" LINK--  */}
      {courseInfo.course_level_code === 'RESEARCH' && (
        <span>
          <h3>{translation.courseLabels.header_postgraduate_course}</h3>
          {translation.courseLabels.label_postgraduate_course}
          <a href={`${FORSKARUTB_URL}${courseInfo.course_department_code}`}>{courseInfo.course_department}</a>
        </span>
      )}
    </>
  )
}

export { MainCourseInformation }