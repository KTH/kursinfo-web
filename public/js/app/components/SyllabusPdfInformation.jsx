import React from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { SYLLABUS_URL } from '../util/constants'
import { convertYearSemesterNumberIntoSemester } from '../../../../server/util/semesterUtils'

export const SyllabusPdfInformation = ({ courseCode, syllabusName, syllabus }) => {
  const { translation, languageShortname } = useLanguage()
  return (
    <div className="info-box">
      <h3>{translation.courseLabels.label_syllabus_pdf_header}</h3>
      <p>{translation.courseLabels.label_syllabus_pdf_info}</p>
      <a
        href={`${SYLLABUS_URL}${courseCode}-${convertYearSemesterNumberIntoSemester(syllabus.course_valid_from)}.pdf?lang=${languageShortname}`}
        id={convertYearSemesterNumberIntoSemester(syllabus.course_valid_from) + '_active'}
        target="_blank"
        rel="noreferrer"
        className="pdf-link pdf-link-fix pdf-link-last-line"
      >
        {`${translation.courseLabels.label_syllabus_link} ${syllabusName}`}
      </a>
    </div>
  )
}
