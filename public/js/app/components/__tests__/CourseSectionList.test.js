import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { WebContextProvider } from '../../context/WebContext'
import i18n from '../../../../../i18n'

import CourseSectionList from '../CourseSectionList'

const INFORM_IF_IMPORTANT_INFO_IS_MISSING = ['No information inserted', 'Ingen information tillagd']

describe('Component <CourseSectionList>', () => {
  test('renders course literature correctly', () => {
    const lang = 'en'

    const translation = i18n.getLanguageByShortname(lang)
    const syllabusLiteratureDefaultEmptyValue = translation.courseInformation.course_literature

    const [syllabusLiteratureNoTitle] = INFORM_IF_IMPORTANT_INFO_IS_MISSING // en
    const syllabusWithoutLiterature = {
      course_valid_from: { year: 2020, semesterNumber: 2 },
      course_literature: `<i>${syllabusLiteratureNoTitle}</i>`,
    }

    const syllabusLiteratureTitle = 'Syllabus Literature (1970)'
    const syllabusLiteratureComment = 'Please read this book.'
    const [syllabusLiteratureNoComment] = INFORM_IF_IMPORTANT_INFO_IS_MISSING // en
    const syllabusWithLiteratureAndComment = {
      course_valid_from: { year: 2020, semesterNumber: 2 },
      course_literature: syllabusLiteratureTitle,
      course_literature_comment: syllabusLiteratureComment,
    }
    const syllabusWithLiteratureNoComment = {
      course_valid_from: { year: 2020, semesterNumber: 2 },
      course_literature: syllabusLiteratureTitle,
      course_literature_comment: `<i>${syllabusLiteratureNoComment}</i>`,
    }
    const syllabusWithNoLiteratureAndComment = {
      course_valid_from: { year: 2020, semesterNumber: 2 },
      course_literature_comment: syllabusLiteratureComment,
    }

    const context1 = {
      lang,
    }

    // Syllabus has no literature – Show the default text
    const { rerender } = render(
      <WebContextProvider configIn={context1}>
        <CourseSectionList syllabus={syllabusWithoutLiterature} />
      </WebContextProvider>
    )
    const noliteratureText = screen.getByText(syllabusLiteratureDefaultEmptyValue)
    expect(noliteratureText).toBeInTheDocument()

    // Syllabus has literature without comment – Show only literature (no comment) from syllabus
    rerender(
      <WebContextProvider configIn={context1}>
        <CourseSectionList syllabus={syllabusWithLiteratureNoComment} />
      </WebContextProvider>
    )
    let syllabusText = screen.getByText(syllabusLiteratureTitle, { exact: false })
    expect(syllabusText).toBeInTheDocument()
    syllabusText = screen.queryByText(syllabusLiteratureNoComment)
    expect(syllabusText).not.toBeInTheDocument()

    // Course hasn't literature, syllabus does with comment – Show literature and literature comment from syllabus
    rerender(
      <WebContextProvider configIn={context1}>
        <CourseSectionList syllabus={syllabusWithLiteratureAndComment} />
      </WebContextProvider>
    )
    syllabusText = screen.getByText(syllabusLiteratureTitle, { exact: false })
    expect(syllabusText).toBeInTheDocument()
    syllabusText = screen.getByText(syllabusLiteratureComment, { exact: false })
    expect(syllabusText).toBeInTheDocument()

    // Course hasn't literature, syllabus only has comment – Show literature comment from syllabus
    rerender(
      <WebContextProvider configIn={context1}>
        <CourseSectionList syllabus={syllabusWithNoLiteratureAndComment} />
      </WebContextProvider>
    )
    syllabusText = screen.getByText(syllabusLiteratureComment, { exact: false })
    expect(syllabusText).toBeInTheDocument()
  })

  test('renders course department correctly', () => {
    const courseDepartmentLinkText = 'Link text'
    const courseDepartmentFallbackValue = 'Fallback text'

    const courseInfoWithLink = {
      course_department_link: `<a href="/itm/" target="blank">${courseDepartmentLinkText}</a>`,
      course_department: courseDepartmentFallbackValue,
    }
    const { rerender } = render(
      <WebContextProvider configIn={{ courseInfo: courseInfoWithLink }}>
        <CourseSectionList
          courseInfo={courseInfoWithLink}
          syllabus={{ course_valid_from: { year: 2020, semesterNumber: 2 } }}
        />
      </WebContextProvider>
    )
    const linkText1 = screen.queryByText(courseDepartmentLinkText)
    expect(linkText1).toBeInTheDocument()
    const fallbackText1 = screen.queryByText(courseDepartmentFallbackValue)
    expect(fallbackText1).not.toBeInTheDocument()

    const courseInfoWithoutLink = {
      course_department_link: undefined,
      course_department: courseDepartmentFallbackValue,
    }
    rerender(
      <WebContextProvider configIn={{ courseInfo: courseInfoWithoutLink }}>
        <CourseSectionList
          courseInfo={courseInfoWithoutLink}
          syllabus={{ course_valid_from: { year: 2020, semesterNumber: 2 } }}
        />
      </WebContextProvider>
    )
    const linkText2 = screen.queryByText(courseDepartmentLinkText)
    expect(linkText2).not.toBeInTheDocument()
    const fallbackText2 = screen.queryByText(courseDepartmentFallbackValue)
    expect(fallbackText2).toBeInTheDocument()
  })
})
