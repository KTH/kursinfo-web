import React from 'react'

import { COURSE_MEMO_URL, SIDE_MENU_LINK_URL, COURSE_DEVELOPMENT_URL } from '../util/constants'
import { useLanguage } from '../hooks/useLanguage'
import { MainMenu } from '../components-shared/MainMenu'

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

const SideMenu = ({ courseCode, labels = {} }) => {
  const { languageShortname, isEnglish } = useLanguage()
  const { aboutCourseLink, courseMemoLink } = createLinksWithOptionalLanguageParameter(courseCode, isEnglish)
  const { courseArchiveLink, courseDevelopmentLink } = createLinksWithLanguageParameter(courseCode, languageShortname)

  const title = courseCode && `${labels.page_about_course} ${courseCode}`
  const ancestorItem = {
    label: labels.page_catalog,
    href: SIDE_MENU_LINK_URL[languageShortname],
  }

  return (
    <MainMenu title={title} ancestorItem={ancestorItem}>
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
    </MainMenu>
  )
}

export default SideMenu
