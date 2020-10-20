import React from 'react'
import { Provider } from 'mobx-react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import CoursePage from '../CoursePage'

import i18n from '../../../../../i18n'

const { getByText } = screen

const routerStore = {
  browserConfig: {},
  sellingText: { en: '', sv: '' },
  imageFromAdmin: '',
  activeSyllabusIndex: 0,
  courseData: {
    syllabusList: [{ course_valid_from: [], course_valid_to: [] }],
    syllabusSemesterList: [],
    courseInfo: { course_recruitment_text: '', course_application_info: '' },
    language: 'en'
  }
}
const translate = i18n.messages[0] // en

describe('Component <CoursePage>', () => {
  test('renders a course page', () => {
    render(
      <Provider routerStore={routerStore}>
        <CoursePage />
      </Provider>
    )
  })

  test('renders course syllabus link correctly', () => {
    const { rerender } = render(
      <Provider routerStore={routerStore}>
        <CoursePage />
      </Provider>
    )
    const noSyllabusText = getByText(translate.courseLabels.label_syllabus_missing)
    expect(noSyllabusText).toBeInTheDocument()
  })
})
