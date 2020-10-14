import React from 'react'
import { Row, Col } from 'reactstrap'
import i18n from '../../../../i18n'
import { EMPTY, LISTS_OF_PILOT_COURSES } from '../util/constants'

const checkIfPilotCourse = (courseCode) => LISTS_OF_PILOT_COURSES.includes(courseCode)

const PilotNewMemoLink = ({ href, translate }) => (
  <a id="memoLink" href={href}>
    {translate.courseLabels.label_course_memo}
  </a>
)

const PdfNoMemoLink = ({ canGetMemoFiles, translate }) => (
  // eslint-disable-next-line jsx-a11y/anchor-is-valid
  <a id="memoLink" className="pdf-link pdf-link-fix">
    {canGetMemoFiles ? translate.courseLabels.no_memo : translate.courseLabels.no_memo_connection}
  </a>
)

const CourseFileLinks = ({ courseCode, courseRound = {}, scheduleUrl, canGetMemoFiles, memoStorageURI, language }) => {
  const translate = i18n.messages[language === 'en' ? 0 : 1]
  const isPilot = checkIfPilotCourse(courseCode)

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
          (isPilot && (
            <PilotNewMemoLink
              href={`/kurs-pm/${courseCode}/${courseRound.round_course_term[0]}${courseRound.round_course_term[1]}/${courseRound.roundId}`}
              translate={translate}
            />
          )) || <PdfNoMemoLink canGetMemoFiles={canGetMemoFiles} translate={translate} />
        )}
      </Col>
      {/* ---LINK TO ROUND SCHEDULE-- */}
      <Col sm="12" xs="12">
        <i className="icon-schedule" />
        {scheduleUrl !== EMPTY[language] ? (
          <a href={scheduleUrl}>{translate.courseLabels.label_schedule}</a>
        ) : (
          <span>{translate.courseLabels.no_schedule}</span>
        )}
      </Col>
    </Row>
  )
}

export default CourseFileLinks
