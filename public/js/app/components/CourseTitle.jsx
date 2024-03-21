import React from 'react'
import { Row } from 'reactstrap'

import { useLanguage } from '../hooks/useLanguage'
import { useFormatCredits } from '../hooks/useFormatCredits'

const adminLink = (courseCode, languageShortname) => `/kursinfoadmin/kurser/kurs/${courseCode}?l=${languageShortname}`

const CourseTitle = ({ courseTitleData = '', pageTitle }) => {
  const title = courseTitleData
  const { translation, currentLanguageShortname } = useLanguage()
  const { formatCredits } = useFormatCredits()
  const adminLinkLabel = translation.courseLabels.label_edit
  return (
    <Row>
      <header className="col course-header">
        <h1 id="page-heading" aria-labelledby="page-heading page-sub-heading">
          {`${title.course_code} ${title.course_title} `}
          {formatCredits(title.course_credits, title.course_credits_text)}
        </h1>
        <div id="page-sub-heading-wrapper">
          <p id="page-sub-heading" aria-hidden="true">
            {pageTitle}
          </p>
          <p id="page-sub-heading-admin-link" className="d-none d-sm-block">
            <a title={adminLinkLabel} href={adminLink(title.course_code, currentLanguageShortname)}>
              {adminLinkLabel}
            </a>
          </p>
        </div>
      </header>
    </Row>
  )
}

export default CourseTitle
