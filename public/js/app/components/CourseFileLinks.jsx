import React from 'react'
import { Row, Col } from 'reactstrap'
import i18n from '../../../../i18n'
import { INFORM_IF_IMPORTANT_INFO_IS_MISSING, LISTS_OF_PILOT_COURSES } from '../util/constants'

const CourseMemoLink = ({ href, translate }) => (
  <a id="memoLink" href={href}>
    {translate.courseLabels.label_course_memo}
  </a>
)

const CourseFileLinks = ({ courseCode, courseRound = {}, scheduleUrl, memoStorageURI, language }) => {
  const translate = i18n.messages[language === 'en' ? 0 : 1]
  return (
    <Row id="courseLinks">
      {/* ---LINK TO ROUND PM/MEMO IF ROUND HAS ONE-- */}
      <Col sm="12" xs="12">
        {courseRound.round_memoFile ? (
          <a
            id="memoLink"
            className="pdf-link pdf-link-fix"
            href={`${memoStorageURI}${courseRound.round_memoFile.fileName}`}
            target="_blank"
            rel="noreferrer"
          >
            {`${translate.courseLabels.label_course_memo} (${courseRound.round_memoFile.fileDate})`}
          </a>
        ) : (
          courseRound &&
          courseRound.round_course_term && (
            <CourseMemoLink
              href={`/kurs-pm/${courseCode}/${courseRound.round_course_term.join('')}/${courseRound.roundId}`}
              translate={translate}
            />
          )
        )}
      </Col>
      {/* ---LINK TO ROUND SCHEDULE-- */}
      <Col sm="12" xs="12">
        <i className="icon-schedule" />
        {scheduleUrl !== INFORM_IF_IMPORTANT_INFO_IS_MISSING[language === 'en' ? 0 : 1] ? (
          <a href={scheduleUrl}>{translate.courseLabels.label_schedule}</a>
        ) : (
          <span>{translate.courseLabels.no_schedule}</span>
        )}
      </Col>
    </Row>
  )
}

export default CourseFileLinks
