import React from 'react'
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
    <div>
      {`${labelCourseSyllabusSource} ${syllabusName} ${labelCourseSyllabusDenoted}`}
      {' ( '}
      <FaAsterisk className="syllabus-marker-icon-small" aria-label={labelCourseSyllabusAsterisk} />
      {' )'}
    </div>
  )
}

const SyllabusInformationOrNull = ({ syllabusName }) => {
  if (!syllabusName) return null

  return <ActualSyllabusInformation syllabusName={syllabusName} />
}

export { SyllabusInformationOrNull as SyllabusInformation }
