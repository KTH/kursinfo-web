import React from 'react'
import { Row } from 'reactstrap'

import { useLanguage } from '../hooks/useLanguage'

const adminLink = (courseCode, languageShortname) => `/kursinfoadmin/kurser/kurs/${courseCode}?l=${languageShortname}`

const CourseTitle = ({ courseTitleData = '', pageTitle }) => {
  const title = courseTitleData
  const { translation, languageShortname } = useLanguage()
  const adminLinkLabel = translation.courseLabels.label_edit
  return (
    <Row>
      <header className="col">
        <h1 id="page-heading" aria-labelledby="page-heading page-sub-heading">
          {`${title.course_code} ${title.course_title} ${title.course_credits_label}`}
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
