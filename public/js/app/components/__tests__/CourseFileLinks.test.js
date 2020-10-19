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
    const translate = i18n.messages[0] // en
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

  test('renders course offering schedule correctly', () => {
    const language = 'en'
    const translate = i18n.messages[0] // en
    const courseRoundWithMemoFile = { round_memoFile: { fileName: 'test', fileDate: '1970-01-01' } }
    const courseRoundWithoutMemoFile = {}
    const propsWithMemoFile = {
      language,
      memoStorageURI: 'https://test.com/',
      courseRound: courseRoundWithMemoFile,
      canGetMemoFiles: true
    }
    const propsWithoutMemoFile = {
      language,
      memoStorageURI: 'https://test.com/',
      courseRound: courseRoundWithoutMemoFile,
      canGetMemoFiles: true
    }
    const propsWithoutMemoFileNorConnection = {
      language,
      memoStorageURI: 'https://test.com/',
      courseRound: courseRoundWithoutMemoFile,
      canGetMemoFiles: false
    }

    const { rerender } = render(<CourseFileLinks {...propsWithMemoFile} />)
    const memoLink = getByText(
      `${translate.courseLabels.label_course_memo} (${courseRoundWithMemoFile.round_memoFile.fileDate})`
    )
    expect(memoLink).toBeInTheDocument()

    rerender(<CourseFileLinks {...propsWithoutMemoFile} />)
    const memoNoText = getByText(translate.courseLabels.no_memo)
    expect(memoNoText).toBeInTheDocument()

    rerender(<CourseFileLinks {...propsWithoutMemoFileNorConnection} />)
    const memoNoConnectionText = getByText(translate.courseLabels.no_memo_connection)
    expect(memoNoConnectionText).toBeInTheDocument()
  })
})
