import React from 'react'
import { Row } from 'reactstrap'

import { useLanguage } from '../hooks/useLanguage'
import { useFormatCredits } from '../hooks/useFormatCredits'

const adminLink = (courseCode, languageShortname) => `/kursinfoadmin/kurser/kurs/${courseCode}?l=${languageShortname}`

const CourseTitle = ({ courseTitleData = '', pageTitle, courseLevelCode }) => {
  const title = courseTitleData
  const isPreparatory = courseLevelCode === 'PREPARATORY'
  const { translation, languageShortname } = useLanguage()
  const { formatCredits } = useFormatCredits()
  const adminLinkLabel = translation.courseLabels.label_edit
  return (
    <Row>
      <header className="col">
        <h1 id="page-heading" aria-labelledby="page-heading page-sub-heading">
          {`${title.course_code} ${title.course_title} `}
          {formatCredits(title.course_credits, title.course_credits_text, isPreparatory)}
        </h1>
        <div id="page-sub-heading-wrapper">
          <p id="page-sub-heading" aria-hidden="true">
            {pageTitle}
          </p>
          <p id="page-sub-heading-admin-link" className="d-none d-sm-block">
            <a title={adminLinkLabel} href={adminLink(title.course_code, languageShortname)}>
              {adminLinkLabel}
            </a>
          </p>
        </div>
      </header>
    </Row>
  )
}

export default CourseTitle
