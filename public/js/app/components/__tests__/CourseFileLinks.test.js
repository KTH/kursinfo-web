import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import CourseFileLinks from '../CourseFileLinks'

import i18n from '../../../../../i18n'
import { INFORM_IF_IMPORTANT_INFO_IS_MISSING } from '../../util/constants'

const { getByText } = screen

describe('Component <CourseFileLinks>', () => {
  test('renders course file links', () => {
    render(<CourseFileLinks />)
  })

  test('renders course offering schedule correctly', () => {
    const language = 'en'
    const [translate] = i18n.messages // en
    const propsWithScheduleUrl = {
      language,
      scheduleUrl: 'https://test.com',
    }
    const propsWithoutScheduleUrl = {
      language,
      scheduleUrl: INFORM_IF_IMPORTANT_INFO_IS_MISSING[0], // 'en'
    }

    const { rerender } = render(<CourseFileLinks {...propsWithScheduleUrl} />)
    const scheduleLink = getByText(translate.courseLabels.label_schedule)
    expect(scheduleLink).toBeInTheDocument()

    rerender(<CourseFileLinks {...propsWithoutScheduleUrl} />)
    const scheduleText = getByText(translate.courseLabels.no_schedule_published)
    expect(scheduleText).toBeInTheDocument()
  })

  test('renders course offering memo link correctly if there is an available course memo as pdf', () => {
    const language = 'en'
    const [translate] = i18n.messages // en
    const propsWithMemoFile = {
      language,
      memoStorageURI: 'https://test.com/',
      courseRound: { round_memoFile: { fileName: 'testedMemo', fileDate: '1970-01-01' } },
    }

    render(<CourseFileLinks {...propsWithMemoFile} />)
    const memoLink = getByText(`${translate.courseLabels.label_link_course_memo}`)
    expect(memoLink).toBeInTheDocument()
    expect(memoLink.href).toBe('https://test.com/testedMemo')
  })

  test('renders course offering memo link correctly to web-based course memos', () => {
    const language = 'en'
    const [translate] = i18n.messages // en
    const propsWithMemoFile = {
      language,
      memoStorageURI: 'https://test.com/',
      courseRound: { round_memoFile: { fileName: 'test', fileDate: '1970-01-01' } },
    }
    const propsWithMemoWebPage = {
      courseCode: 'KIP1111',
      language,
      courseRound: {
        roundId: '7',
        round_application_code: '7',
        round_course_term: ['1970', '1'],
        has_round_published_memo: true,
      },
    }

    const { rerender } = render(<CourseFileLinks {...propsWithMemoFile} />)
    const memoLink = getByText(`${translate.courseLabels.label_link_course_memo}`)
    expect(memoLink).toBeInTheDocument()

    rerender(<CourseFileLinks {...propsWithMemoWebPage} />)
    const linkToMemoWebPage = getByText(translate.courseLabels.label_link_course_memo)
    expect(linkToMemoWebPage).toBeInTheDocument()
    expect(linkToMemoWebPage.href).toBe('http://localhost/kurs-pm/KIP1111/19701/7')
  })

  test('renders course offering memo link to pdf if it exists among other data and correctly prioriterized  ', () => {
    const language = 'en'
    const [translate] = i18n.messages // en
    const propsWithMemoFileAndOtherInfo = {
      courseCode: 'KIP1111',
      language,
      memoStorageURI: 'https://test.com/',
      courseRound: {
        roundId: '7',
        round_application_code: '7',
        round_course_term: ['1970', '1'],
        round_memoFile: { fileName: 'test', fileDate: '1970-01-01' },
      },
    }

    const { rerender } = render(<CourseFileLinks {...propsWithMemoFileAndOtherInfo} />)
    const memoLink = getByText(`${translate.courseLabels.label_link_course_memo}`)
    expect(memoLink).toBeInTheDocument()
  })
})
