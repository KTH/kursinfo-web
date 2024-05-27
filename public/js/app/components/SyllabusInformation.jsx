import React from 'react'
import { Col } from 'reactstrap'
import { FaAsterisk } from 'react-icons/fa'
import { useLanguage } from '../hooks/useLanguage'

const ActualSyllabusInformation = ({ syllabusName }) => {
  const { translation } = useLanguage()

  const {
    label_course_syllabus_source: labelCourseSyllabusSource,
    label_course_syllabus_denoted: labelCourseSyllabusDenoted,
    syllabus_marker_aria_label: labelCourseSyllabusAsterisk,
  } = translation.courseLabels

  return (
    <Col sm="12">
      <div>
        <span>
          {`${labelCourseSyllabusSource} ${syllabusName} ${labelCourseSyllabusDenoted}`}
          {' ( '}
          <FaAsterisk className="syllabus-marker-icon-small" aria-label={labelCourseSyllabusAsterisk} />
          {' )'}
        </span>
      </div>
    </Col>
  )
}

const SyllabusInformationOrNull = ({ syllabusName }) => {
  if (!syllabusName) return null

  return <ActualSyllabusInformation syllabusName={syllabusName} />
}

export { SyllabusInformationOrNull as SyllabusInformation }
