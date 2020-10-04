import React from 'react'

import { COURSE_MEMO_URL, SIDE_MENU_LINK_URL, COURSE_HISTORY_URL, LISTS_OF_PILOT_COURSES } from '../util/constants'

const checkIfPilotCourse = (courseCode) => LISTS_OF_PILOT_COURSES.includes(courseCode)

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
  const courseHistoryLink = `${COURSE_HISTORY_URL}${courseCode}?l=${language}`

  return (
    <nav className="left-side-menu mt-20" lang={language} aria-label={labels.aria_label}>
      <p>
        &lsaquo;&nbsp;
        <a href={SIDE_MENU_LINK_URL[language]} title={labels.page_catalog}>
          {labels.page_catalog}
        </a>
      </p>
      {labelBeforeChoosingCourse(courseCode, labels.page_about_course)}
      <hr />
      <p>
        <a
          className="active sideMenuLink"
          href={aboutCourseLink(courseCode, language)}
          title={labels.page_before_course}
        >
          {labels.page_before_course}
        </a>
      </p>
      {checkIfPilotCourse(courseCode) && (
        <p>
          <a href={courseMemoLink(courseCode, language)} title={labels.page_memo} className="sideMenuLink">
            {labels.page_memo}
          </a>
        </p>
      )}
      <p>
        <a
          className="sideMenuLink"
          id="course-development-history-link"
          title={labels.page_history}
          href={courseHistoryLink}
        >
          {labels.page_history}
        </a>
      </p>
    </nav>
  )
}

export default SideMenu
