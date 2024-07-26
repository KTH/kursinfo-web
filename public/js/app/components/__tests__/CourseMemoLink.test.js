import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { CourseMemoLink } from '../RoundInformation/CourseMemoLink'

import i18n from '../../../../../i18n'

jest.mock('../../context/WebContext')
import { useWebContext } from '../../context/WebContext'

describe('Component <CourseMemoLink>', () => {
  test('renders course offering memo link correctly if there is an available course memo as pdf', () => {
    useWebContext.mockReturnValue({ lang: 'en', browserConfig: { memoStorageURI: 'https://test.com/' } })
    const [translate] = i18n.messages // en

    const propsWithMemoFile = {
      courseCode: 'ABC123',
      courseRound: { round_memoFile: { fileName: 'testedMemo', fileDate: '1970-01-01' } },
    }

    render(<CourseMemoLink {...propsWithMemoFile} />)
    const memoLink = screen.getByText(`${translate.courseLabels.label_link_course_memo}`)
    expect(memoLink).toBeInTheDocument()
    expect(memoLink.href).toBe('https://test.com/testedMemo')
  })

  test('renders course offering memo link correctly to web-based course memos', () => {
    useWebContext.mockReturnValue({ lang: 'en', browserConfig: { memoStorageURI: 'https://test.com/' } })
    const [translate] = i18n.messages // en
    const propsWithMemoFile = {
      courseCode: 'ABC123',
      memoStorageURI: 'https://test.com/',
      courseRound: { round_memoFile: { fileName: 'test', fileDate: '1970-01-01' } },
    }
    const propsWithMemoWebPage = {
      courseCode: 'KIP1111',
      courseRound: {
        round_application_code: '7',
        round_course_term: ['1970', '1'],
        has_round_published_memo: true,
      },
    }

    const { rerender } = render(<CourseMemoLink {...propsWithMemoFile} />)
    const memoLink = screen.getByText(`${translate.courseLabels.label_link_course_memo}`)
    expect(memoLink).toBeInTheDocument()

    rerender(<CourseMemoLink {...propsWithMemoWebPage} />)
    const linkToMemoWebPage = screen.getByText(translate.courseLabels.label_link_course_memo)
    expect(linkToMemoWebPage).toBeInTheDocument()
    expect(linkToMemoWebPage.href).toBe('http://localhost/kurs-pm/KIP1111/19701/7')
  })

  test('renders course offering memo link to pdf if it exists among other data and correctly prioriterized', () => {
    useWebContext.mockReturnValue({ lang: 'en', browserConfig: { memoStorageURI: 'https://test.com/' } })
    const [translate] = i18n.messages // en
    const propsWithMemoFileAndOtherInfo = {
      courseCode: 'KIP1111',
      courseRound: {
        round_application_code: '7',
        round_course_term: ['1970', '1'],
        round_memoFile: { fileName: 'test', fileDate: '1970-01-01' },
      },
    }

    render(<CourseMemoLink {...propsWithMemoFileAndOtherInfo} />)
    const memoLink = screen.getByText(`${translate.courseLabels.label_link_course_memo}`)
    expect(memoLink).toBeInTheDocument()
  })
})
