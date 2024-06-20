import React from 'react'

import Alert from '../components-shared/Alert'

import { FORSKARUTB_URL } from '../util/constants'
import { useLanguage } from '../hooks/useLanguage'

import CourseSectionList from './CourseSectionList'
import { SyllabusContainer } from './SyllabusContainer'

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
      {/* TODO(karl): Vad är SyllabusContainer i förhållande till activeSyllabusContainer nedanför? */}

      <SyllabusContainer courseCode={courseCode} syllabusName={syllabusName} semesterRoundState={semesterRoundState} />

      <div id="activeSyllabusContainer" key="activeSyllabusContainer">
        {!hasSyllabus && (
          <Alert color="info" aria-live="polite">
            <h4>{translation.courseLabels.header_no_syllabus}</h4>
            {translation.courseLabels.label_no_syllabus}
          </Alert>
        )}
      </div>

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
