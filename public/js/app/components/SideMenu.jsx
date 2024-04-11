import React from 'react'

import { COURSE_MEMO_URL, SIDE_MENU_LINK_URL, COURSE_DEVELOPMENT_URL } from '../util/constants'
import { useLanguage } from '../hooks/useLanguage'

const createLinksWithOptionalLanguageParameter = (courseCode, isEnglish) => {
  const languageParameter = isEnglish ? '?l=en' : ''

  const aboutCourseLink = `/student/kurser/kurs/${courseCode}${languageParameter}`
  const courseMemoLink = `${COURSE_MEMO_URL}${courseCode}${languageParameter}`

  return {
    aboutCourseLink,
    courseMemoLink,
  }
}

const createLinksWithLanguageParameter = (courseCode, languageShortname) => {
  const courseDevelopmentLink = `${COURSE_DEVELOPMENT_URL}${courseCode}?l=${languageShortname}`
  const courseArchiveLink = `${COURSE_DEVELOPMENT_URL}${courseCode}/arkiv?l=${languageShortname}`

  return {
    courseDevelopmentLink,
    courseArchiveLink,
  }
}

function SideMenuMobile() {
  // TODO: kth-style-10: Mobile menu
  const title = 'Mobile menu'

  return (
    <nav className="kth-local-navigation--mobile" aria-labelledby="kth-local-navigation-title--mobile">
      <button className="kth-button menu" id="kth-local-navigation-title--mobile">
        <span>{title}</span>
      </button>
      <dialog className="kth-mobile-menu left">
        <div className="kth-mobile-menu__navigation">
          <button className="kth-icon-button close">
            <span className="kth-visually-hidden">Close</span>
          </button>
        </div>
        <div className="mobile-menu__content"></div>
      </dialog>
    </nav>
  )
}

const SideMenu = ({ courseCode, labels = {} }) => {
  const { languageShortname, isEnglish } = useLanguage()

  const { aboutCourseLink, courseMemoLink } = createLinksWithOptionalLanguageParameter(courseCode, isEnglish)

  const { courseArchiveLink, courseDevelopmentLink } = createLinksWithLanguageParameter(courseCode, languageShortname)

  return (
    <>
      <SideMenuMobile />

      <nav id="mainMenu" className="kth-local-navigation col" aria-labelledby="local-navigation-title">
        <a href={SIDE_MENU_LINK_URL[languageShortname]} className="kth-button back">
          {labels.page_catalog}
        </a>

        <h2 id="local-navigation-title">{courseCode && `${labels.page_about_course} ${courseCode}`}</h2>

        <ul>
          <li>
            <a href={aboutCourseLink} aria-current="page">
              {labels.page_before_course}
            </a>
          </li>
          <li>
            <a href={courseMemoLink} className="expandable">
              {labels.page_memo}
            </a>
          </li>
          <li>
            <a href={courseDevelopmentLink}>{labels.page_development}</a>
          </li>
          <li>
            <a href={courseArchiveLink}>{labels.page_archive}</a>
          </li>
        </ul>
      </nav>
    </>
  )
}

export default SideMenu
