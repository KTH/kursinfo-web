import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { WebContextProvider } from '../../context/WebContext'

import CourseSectionList from '../CourseSectionList'

const INFORM_IF_IMPORTANT_INFO_IS_MISSING = ['No information inserted', 'Ingen information tillagd']

describe('Component <CourseSectionList>', () => {
  test('renders a course section list', () => {
    const context = {}
    render(
      <WebContextProvider configIn={context}>
        <CourseSectionList syllabusList={[]} />
      </WebContextProvider>
    )
  })

  test('renders course literature correctly', () => {
    const language = 'en'
    const [courseLiteratureNoTitle] = INFORM_IF_IMPORTANT_INFO_IS_MISSING // en
    const courseInfoWithoutLiterature = { course_literature: `<i>${courseLiteratureNoTitle}</i>` }

    const courseLiteratureTitle = 'Course Literature (1970)'
    const courseInfoWithLiterature = { course_literature: courseLiteratureTitle }

    const [syllabusLiteratureNoTitle] = INFORM_IF_IMPORTANT_INFO_IS_MISSING // en
    const syllabusListWithoutLiterature = { course_literature: `<i>${syllabusLiteratureNoTitle}</i>` }

    const syllabusLiteratureTitle = 'Syllabus Literature (1970)'
    const syllabusLiteratureComment = 'Please read this book.'
    const [syllabusLiteratureNoComment] = INFORM_IF_IMPORTANT_INFO_IS_MISSING // en
    const syllabusListWithLiteratureAndComment = {
      course_literature: syllabusLiteratureTitle,
      course_literature_comment: syllabusLiteratureComment,
    }
    const syllabusListWithLiteratureNoComment = {
      course_literature: syllabusLiteratureTitle,
      course_literature_comment: `<i>${syllabusLiteratureNoComment}</i>`,
    }
    const syllabusListWithNoLiteratureAndComment = {
      course_literature_comment: syllabusLiteratureComment,
    }

    const context1 = {
      courseData: { language },
    }

    // Course has no literature, and syllabus has no literature – Show 'No information inserted'
    const { rerender } = render(
      <WebContextProvider configIn={context1}>
        <CourseSectionList courseInfo={courseInfoWithoutLiterature} syllabusList={syllabusListWithoutLiterature} />
      </WebContextProvider>
    )
    const noliteratureText = screen.getByText(courseLiteratureNoTitle)
    expect(noliteratureText).toBeInTheDocument()

    // Course has literature – Show only literature from course
    rerender(
      <WebContextProvider configIn={context1}>
        <CourseSectionList courseInfo={courseInfoWithLiterature} syllabusList={syllabusListWithLiteratureAndComment} />
      </WebContextProvider>
    )
    const literatureText = screen.getByText(courseLiteratureTitle)
    expect(literatureText).toBeInTheDocument()
    let syllabusText = screen.queryByText(syllabusLiteratureTitle)
    expect(syllabusText).toBeNull()

    // Course hasn't literature, syllabus does without comment – Show only literature (no comment) from syllabus
    rerender(
      <WebContextProvider configIn={context1}>
        <CourseSectionList
          courseInfo={courseInfoWithoutLiterature}
          syllabusList={syllabusListWithLiteratureNoComment}
        />
      </WebContextProvider>
    )
    syllabusText = screen.getByText(syllabusLiteratureTitle, { exact: false })
    expect(syllabusText).toBeInTheDocument()
    syllabusText = screen.queryByText(syllabusLiteratureNoComment)
    expect(syllabusText).toBeNull()

    // Course hasn't literature, syllabus does with comment – Show literature and literature comment from syllabus
    rerender(
      <WebContextProvider configIn={context1}>
        <CourseSectionList
          courseInfo={courseInfoWithoutLiterature}
          syllabusList={syllabusListWithLiteratureAndComment}
        />
      </WebContextProvider>
    )
    syllabusText = screen.getByText(syllabusLiteratureTitle, { exact: false })
    expect(syllabusText).toBeInTheDocument()
    syllabusText = screen.getByText(syllabusLiteratureComment, { exact: false })
    expect(syllabusText).toBeInTheDocument()

    // Course hasn't literature, syllabus only has comment – Show literature comment from syllabus
    rerender(
      <WebContextProvider configIn={context1}>
        <CourseSectionList
          courseInfo={courseInfoWithoutLiterature}
          syllabusList={syllabusListWithNoLiteratureAndComment}
        />
      </WebContextProvider>
    )
    syllabusText = screen.getByText(syllabusLiteratureComment, { exact: false })
    expect(syllabusText).toBeInTheDocument()
  })
})
