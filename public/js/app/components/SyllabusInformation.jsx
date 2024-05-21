import React from 'react'
import { Col } from 'reactstrap'
import { FaAsterisk } from 'react-icons/fa'

const SyllabusInformation = ({ context = {}, syllabus = {}, hasSyllabus, translation = {} }) => {
  const { courseCode } = context

  const { courseLabels, courseInformation } = translation
  const {
    label_course_syllabus_source: labelCourseSyllabusSource,
    label_course_syllabus_denoted: labelCourseSyllabusDenoted,
    syllabus_marker_aria_label: labelCourseSyllabusAsterisk,
  } = courseLabels
  const { course_short_semester: courseShortSemester } = courseInformation

  const { course_valid_from: courseValidFrom = ['', ''], course_valid_to: courseValidTo = ['', ''] } = syllabus
  const courseValidFromLabel = `${courseShortSemester[courseValidFrom[1]]}${courseValidFrom[0]}`
  const courseValidToLabel = courseValidTo.length ? courseShortSemester[courseValidTo[1]] + '' + courseValidTo[0] : ''
  const courseValidRangeLabel = `(${courseValidFromLabel}\u2013${courseValidToLabel})`

  const syllabusText = `${labelCourseSyllabusSource} ${courseCode} ${courseValidRangeLabel} ${labelCourseSyllabusDenoted}`

  return (
    <Col sm="12">
      <div>
        {hasSyllabus && (
          <span>
            {syllabusText}
            {' ( '}
            <FaAsterisk className="syllabus-marker-icon-small" aria-label={labelCourseSyllabusAsterisk} />
            {' )'}
          </span>
        )}
      </div>
    </Col>
  )
}

export default SyllabusInformation
