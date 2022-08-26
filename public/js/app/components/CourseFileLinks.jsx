import React from 'react'
import { Row, Col } from 'reactstrap'
import i18n from '../../../../i18n'
import { INFORM_IF_IMPORTANT_INFO_IS_MISSING } from '../util/constants'

const CourseMemoLink = ({ href, translate }) => (
  <a id="memoLink" href={href}>
    {translate.courseLabels.label_link_course_memo}
  </a>
)

const CourseFileLinks = ({ courseCode, courseRound = {}, scheduleUrl, memoStorageURI, language }) => {
  const translate = i18n.messages[language === 'en' ? 0 : 1]
  const {
    round_memoFile: memoPdfFile,
    roundId: ladokRoundId,
    round_course_term: yearAndTermArr,
    has_round_published_memo: hasPublishedMemo,
  } = courseRound
  return (
    <Row id="courseLinks">
      {/* ---LINK TO ROUND PM/MEMO IF ROUND HAS ONE-- */}
      <Col sm="12" xs="12">
        <h3 className="t4">{translate.courseLabels.label_course_memo}</h3>
        {memoPdfFile ? (
          <a id="memoLink" href={`${memoStorageURI}${memoPdfFile.fileName}`} target="_blank" rel="noreferrer">
            {translate.courseLabels.label_link_course_memo}
          </a>
        ) : (
          courseRound &&
          yearAndTermArr &&
          (hasPublishedMemo ? (
            <CourseMemoLink
              href={`/kurs-pm/${courseCode}/${yearAndTermArr.join('')}/${ladokRoundId}`}
              translate={translate}
            />
          ) : (
            <span>
              <i>{translate.courseLabels.no_memo_published}</i>
            </span>
          ))
        )}
      </Col>
      {/* ---LINK TO ROUND SCHEDULE-- */}
      <Col sm="12" xs="12">
        <h3 className="t4">{translate.courseLabels.label_schedule}</h3>
        <i className="icon-schedule" />
        {scheduleUrl !== INFORM_IF_IMPORTANT_INFO_IS_MISSING[language === 'en' ? 0 : 1] ? (
          <a href={scheduleUrl}>{translate.courseLabels.label_link_schedule}</a>
        ) : (
          <span>
            <i>{translate.courseLabels.no_schedule_published}</i>
          </span>
        )}
      </Col>
    </Row>
  )
}

export default CourseFileLinks
