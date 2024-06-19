import React from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { SYLLABUS_URL } from '../util/constants'
import { convertYearSemesterNumberIntoSemester } from '../../../../server/util/semesterUtils'

// TODO(karl): name this and/or SyllabusInformation better

export const SyllabusContainer = ({ courseCode, syllabusName, semesterRoundState }) => {
  const { translation, languageShortname } = useLanguage()
  const { activeSyllabus, hasSyllabus } = semesterRoundState
  return (
    <div className="info-box">
      <h3>{translation.courseLabels.label_syllabus_pdf_header}</h3>
      {hasSyllabus && activeSyllabus.course_valid_from && activeSyllabus.course_valid_from.year ? (
        <>
          <p>{translation.courseLabels.label_syllabus_pdf_info}</p>
          <a
            href={`${SYLLABUS_URL}${courseCode}-${convertYearSemesterNumberIntoSemester(activeSyllabus.course_valid_from)}.pdf?lang=${languageShortname}`}
            id={convertYearSemesterNumberIntoSemester(activeSyllabus.course_valid_from) + '_active'}
            target="_blank"
            rel="noreferrer"
            className="pdf-link pdf-link-fix pdf-link-last-line"
          >
            {`${translation.courseLabels.label_syllabus_link} ${syllabusName}`}
          </a>
        </>
      ) : (
        <>{translation.courseLabels.label_syllabus_missing}</>
      )}
    </div>
  )
}
