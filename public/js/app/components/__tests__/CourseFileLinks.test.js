import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import CourseFileLinks from '../CourseFileLinks'

import i18n from '../../../../../i18n'
import { EMPTY } from '../../util/constants'

const { getByText } = screen

describe('Component <CourseFileLinks>', () => {
  test('renders course file links', () => {
    render(<CourseFileLinks />)
  })

  test('renders course offering schedule correctly', () => {
    const language = 'en'
    const translate = i18n.messages[language === 'en' ? 0 : 1]
    const propsWithScheduleUrl = {
      language,
      scheduleUrl: 'https://test.com'
    }
    const propsWithoutScheduleUrl = {
      language,
      scheduleUrl: EMPTY[0] // 'en'
    }

    const { rerender } = render(<CourseFileLinks {...propsWithScheduleUrl} />)
    const scheduleLink = getByText(translate.courseLabels.label_schedule)
    expect(scheduleLink).toBeInTheDocument()

    rerender(<CourseFileLinks {...propsWithoutScheduleUrl} />)
    const scheduleText = getByText(translate.courseLabels.no_schedule)
    expect(scheduleText).toBeInTheDocument()
  })
})
