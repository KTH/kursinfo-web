import React from 'react'
import { Provider } from 'mobx-react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import CourseSectionList from '../CourseSectionList'
import { EMPTY } from '../../util/constants'

const { getByText, queryByText } = screen

describe('Component <CourseSectionList>', () => {
  test('renders a course section list', () => {
    const routerStore = {}
    render(
      <Provider routerStore={routerStore}>
        <CourseSectionList syllabusList={[]} />
      </Provider>
    )
  })

  test('renders course literature correctly', () => {
    const language = 'en'
    const courseLiteratureNoTitle = EMPTY[0] // en
    const courseInfoWithoutLiterature = { course_literature: courseLiteratureNoTitle }

    const courseLiteratureTitle = 'Course Literature (1970)'
    const courseInfoWithLiterature = { course_literature: courseLiteratureTitle }

    const syllabusLiteratureNoTitle = EMPTY[0] // en
    const syllabusListWithoutLiterature = { course_literature: syllabusLiteratureNoTitle }

    const syllabusLiteratureTitle = 'Syllabus Literature (1970)'
    const syllabusLiteratureComment = 'Please read this book.'
    const syllabusLiteratureNoComment = EMPTY[0] // en
    const syllabusListWithLiteratureAndComment = {
      course_literature: syllabusLiteratureTitle,
      course_literature_comment: syllabusLiteratureComment
    }
    const syllabusListWithLiteratureNoComment = {
      course_literature: syllabusLiteratureTitle,
      course_literature_comment: syllabusLiteratureNoComment
    }

    const routerStore = {
      courseData: { language }
    }

    // Course has no literature, and syllabus has no literature – Show 'No information inserted'
    const { rerender } = render(
      <Provider routerStore={routerStore}>
        <CourseSectionList courseInfo={courseInfoWithoutLiterature} syllabusList={syllabusListWithoutLiterature} />
      </Provider>
    )
    const noliteratureText = getByText(courseLiteratureNoTitle)
    expect(noliteratureText).toBeInTheDocument()

    // Course has literature – Show only literature from course
    rerender(
      <Provider routerStore={routerStore}>
        <CourseSectionList courseInfo={courseInfoWithLiterature} syllabusList={syllabusListWithLiteratureAndComment} />
      </Provider>
    )
    let literatureText = getByText(courseLiteratureTitle)
    expect(literatureText).toBeInTheDocument()
    let syllabusText = queryByText(syllabusLiteratureTitle)
    expect(syllabusText).toBeNull()

    // Course hasn't literature, syllabus does without comment – Show only literature (no comment) from syllabus
    rerender(
      <Provider routerStore={routerStore}>
        <CourseSectionList
          courseInfo={courseInfoWithoutLiterature}
          syllabusList={syllabusListWithLiteratureNoComment}
        />
      </Provider>
    )
    syllabusText = getByText(syllabusLiteratureTitle, { exact: false })
    expect(syllabusText).toBeInTheDocument()
    syllabusText = queryByText(syllabusLiteratureNoComment)
    expect(syllabusText).toBeNull()

    // Course hasn't literature, syllabus does with comment – Show literature and literature comment from syllabus
    rerender(
      <Provider routerStore={routerStore}>
        <CourseSectionList
          courseInfo={courseInfoWithoutLiterature}
          syllabusList={syllabusListWithLiteratureAndComment}
        />
      </Provider>
    )
    syllabusText = getByText(syllabusLiteratureTitle, { exact: false })
    expect(syllabusText).toBeInTheDocument()
    syllabusText = getByText(syllabusLiteratureComment, { exact: false })
    expect(syllabusText).toBeInTheDocument()
  })
})
