import React from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { useWebContext } from '../../context/WebContext'

export const CourseMemoLink = ({ courseCode, courseRound }) => {
  const { translation } = useLanguage()
  const { browserConfig } = useWebContext()

  const { round_memoFile, round_application_code, round_course_term, has_round_published_memo } = courseRound
  return (
    <div>
      {round_memoFile ? (
        <a href={`${browserConfig.memoStorageURI}${round_memoFile.fileName}`} target="_blank" rel="noreferrer">
          {translation.courseLabels.label_link_course_memo}
        </a>
      ) : (
        courseRound &&
        round_course_term &&
        (has_round_published_memo ? (
          <a href={`/kurs-pm/${courseCode}/${round_course_term.join('')}/${round_application_code}`}>
            {translation.courseLabels.label_link_course_memo}
          </a>
        ) : (
          <span>
            <i>{translation.courseLabels.no_memo_published}</i>
          </span>
        ))
      )}
    </div>
  )
}
