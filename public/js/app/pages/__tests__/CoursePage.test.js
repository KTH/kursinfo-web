import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { WebContextProvider } from '../../context/WebContext'

import CoursePage from '../CoursePage'

import i18n from '../../../../../i18n'

const context = {
  browserConfig: {},
  sellingText: { en: '', sv: '' },
  imageFromAdmin: '',
  activeSyllabusIndex: 0,
  courseData: {
    syllabusList: [{ course_valid_from: [], course_valid_to: [] }],
    syllabusSemesterList: [],
    courseInfo: { course_recruitment_text: '', course_application_info: '' },
    language: 'en',
  },
  activeSemesters: [],
}
const [translate] = i18n.messages // en

describe('Component <CoursePage>', () => {
  test('renders a course page', () => {
    render(
      <WebContextProvider configIn={context}>
        <CoursePage />
      </WebContextProvider>
    )
  })

  test('renders course syllabus link correctly', () => {
    const { rerender } = render(
      <WebContextProvider configIn={context}>
        <CoursePage />
      </WebContextProvider>
    )
    const noSyllabusText = screen.getByText(translate.courseLabels.label_syllabus_missing)
    expect(noSyllabusText).toBeInTheDocument()
  })
})
