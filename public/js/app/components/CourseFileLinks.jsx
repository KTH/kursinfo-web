import React from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { useMissingInfo } from '../hooks/useMissingInfo'

const CourseMemoLink = ({ href, translate }) => (
  <a id="memoLink" href={href}>
    {translate.courseLabels.label_link_course_memo}
  </a>
)

const CourseFileLinks = ({ courseCode, courseRound = {}, scheduleUrl, memoStorageURI }) => {
  const { translation } = useLanguage()
  const { isMissingInfoLabel } = useMissingInfo()
  const {
    round_memoFile: memoPdfFile,
    round_application_code: applicationCode,
    round_course_term: yearAndTermArr,
    has_round_published_memo: hasPublishedMemo,
  } = courseRound
  return (
    <div id="courseLinks">
      {/* ---LINK TO ROUND PM/MEMO IF ROUND HAS ONE-- */}
      <div>
        <h3>{translation.courseLabels.label_course_memo}</h3>
        {memoPdfFile ? (
          <a id="memoLink" href={`${memoStorageURI}${memoPdfFile.fileName}`} target="_blank" rel="noreferrer">
            {translation.courseLabels.label_link_course_memo}
          </a>
        ) : (
          courseRound &&
          yearAndTermArr &&
          (hasPublishedMemo ? (
            <CourseMemoLink
              href={`/kurs-pm/${courseCode}/${yearAndTermArr.join('')}/${applicationCode}`}
              translate={translation}
            />
          ) : (
            <span>
              <i>{translation.courseLabels.no_memo_published}</i>
            </span>
          ))
        )}
      </div>
      {/* ---LINK TO ROUND SCHEDULE-- */}
      <div>
        <h3>{translation.courseLabels.label_schedule}</h3>
        <i className="icon-schedule" />
        {!isMissingInfoLabel(scheduleUrl) ? (
          <a href={scheduleUrl}>{translation.courseLabels.label_link_schedule}</a>
        ) : (
          <span>
            <i>{translation.courseLabels.no_schedule_published}</i>
          </span>
        )}
      </div>
    </div>
  )
}

export default CourseFileLinks
