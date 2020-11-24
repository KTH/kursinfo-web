import React from 'react'

import { COURSE_MEMO_URL, SIDE_MENU_LINK_URL, COURSE_DEVELOPMENT_URL } from '../util/constants'

const aboutCourseLink = (courseCode, language) => {
  const languageParameter = language === 'en' ? '?l=en' : ''
  return `https://www.kth.se/student/kurser/kurs/${courseCode}${languageParameter}`
}

const courseMemoLink = (courseCode, language) => {
  const languageParameter = language === 'en' ? '?l=en' : ''
  return `${COURSE_MEMO_URL}${courseCode}${languageParameter}`
}

const labelBeforeChoosingCourse = (courseCode, label) =>
  courseCode ? (
    <p>
      <b>{`${label} ${courseCode}`}</b>
    </p>
  ) : null

const SideMenu = ({ courseCode, labels = {}, language }) => {
  const courseDevelopmentLink = `${COURSE_DEVELOPMENT_URL}${courseCode}?l=${language}`
  const courseArchiveLink = `${COURSE_DEVELOPMENT_URL}${courseCode}/arkiv?l=${language}`

  return (
    <nav
      id="mainMenu"
      className="col navbar navbar-expand-lg navbar-light"
      lang={language}
      aria-label={labels.aria_label}
      style={{ paddingLeft: '15px' }}
    >
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="nav">
          <li className="parentLink">
            <a href={SIDE_MENU_LINK_URL[language]} title={labels.page_catalog}>
              {labels.page_catalog}
            </a>
          </li>
        </ul>
        <ul className="nav nav-ancestor">
          <li>
            <span className="nav-item ancestor">{labelBeforeChoosingCourse(courseCode, labels.page_about_course)}</span>
          </li>
        </ul>
        <ul className="nav nav-list">
          <li className="nav-item leaf selected">
            <a className="nav-link" href={aboutCourseLink(courseCode, language)} title={labels.page_before_course}>
              {labels.page_before_course}
            </a>
          </li>
          <li className="nav-item node">
            <a href={courseMemoLink(courseCode, language)} title={labels.page_memo} className="nav-link">
              {labels.page_memo}
            </a>
          </li>
          <li className="nav-item leaf">
            <a
              className="nav-link"
              id="course-development-link"
              title={labels.page_development}
              href={courseDevelopmentLink}
            >
              {labels.page_development}
            </a>
          </li>
          <li className="nav-item leaf">
            <a className="nav-link" id="course-archive-link" title={labels.page_archive} href={courseArchiveLink}>
              {labels.page_archive}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default SideMenu
