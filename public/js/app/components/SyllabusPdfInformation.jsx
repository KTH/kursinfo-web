import React from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { SYLLABUS_URL } from '../util/constants'
import { convertYearSemesterNumberIntoSemester } from '../../../../server/util/semesterUtils'

export const SyllabusPdfInformation = ({ courseCode, syllabusName, semesterRoundState }) => {
  const { translation, languageShortname } = useLanguage()
  const { activeSyllabus } = semesterRoundState
  return (
    <div className="info-box">
      <h3>{translation.courseLabels.label_syllabus_pdf_header}</h3>
      {/* TODO(karl): activeSyllabus.course_valid_from.year borde alltid finnas? fundera om det är okej att det blir tomt om year saknas, jag tror det är okej  */}
      {activeSyllabus.course_valid_from && activeSyllabus.course_valid_from.year && (
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
      )}
    </div>
  )
}
