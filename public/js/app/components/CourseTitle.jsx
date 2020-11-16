import React from 'react'
import { Row } from 'reactstrap'

import i18n from '../../../../i18n'

import { INFORM_IF_IMPORTANT_INFO_IS_MISSING } from '../util/constants'

const formatCredits = (credits, creditUnitAbbr, languageIndex) => {
  if (!credits) return <>&nbsp;</>
  const cred = credits !== INFORM_IF_IMPORTANT_INFO_IS_MISSING[languageIndex] && credits.toString().indexOf('.') < 0 ? credits + '.0' : credits
  const localeCredits = languageIndex === 0 ? cred : cred.toString().replace('.', ',')
  const creditUnit = languageIndex === 0 ? 'credits' : creditUnitAbbr
  return `${localeCredits} ${creditUnit}`
}

const adminLink = (courseCode, languageIndex) => {
  return `/kursinfoadmin/kurser/kurs/${courseCode}?l=${languageIndex === 0 ? 'en' : 'sv'}`
}

const CourseTitle = ({ courseTitleData = '', language, pageTitle }) => {
  const title = courseTitleData
  const languageIndex = language === 'en' ? 0 : 1
  const adminLinkLabel = i18n.messages[languageIndex].courseLabels.label_edit
  return (
    <Row>
      <header className="pageTitle col">
        <span id="page-course-title" role="heading" aria-level="1">
          <span className="t1">{pageTitle}</span>
          <span className="t4">
            {`${title.course_code} ${title.course_title} `}
            {formatCredits(title.course_credits, title.course_credits_text, languageIndex)}
          </span>
        </span>
        <a className="right-link" href={adminLink(title.course_code, languageIndex)} style={{ fontSize: '1rem' }}>
          {adminLinkLabel}
        </a>
      </header>
    </Row>
  )
}

export default CourseTitle
