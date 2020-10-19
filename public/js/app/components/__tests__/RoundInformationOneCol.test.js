import React from 'react'
import { Provider } from 'mobx-react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import RoundInformationOneCol from '../RoundInformationOneCol'

import i18n from '../../../../../i18n'
import { EMPTY } from '../../util/constants'

const { getByText, getAllByText } = screen

describe('Component <RoundInformationOneCol>', () => {
  test('renders a course information column', () => {
    const routerStore = { browserConfig: {}, sellingText: { en: '', sv: '' }, imageFromAdmin: '' }
    render(
      <Provider routerStore={routerStore}>
        <RoundInformationOneCol />
      </Provider>
    )
  })

  test('renders course offering employees correctly', () => {
    const language = 'en'
    const translate = i18n.messages[language === 'en' ? 0 : 1]
    const examinersData = 'Examiners’ data'
    const responsiblesData = 'Responsibles’ data'
    const teachersData = 'Teachers’ data'
    const propsWithEmployees = {
      language: 'en',
      showRoundData: true,
      courseHasRound: true,
      courseData: {},
      routerStore: {
        roundData: {
          examiners: `<span>${examinersData}</span>'`,
          responsibles: `<span>${responsiblesData}</span>`,
          teachers: `<span>${teachersData}</span>`
        }
      }
    }
    const propsWithEmptyEmployees = {
      language: 'en',
      showRoundData: true,
      courseHasRound: true,
      courseData: {},
      routerStore: {
        roundData: {
          examiners: '',
          responsibles: '',
          teachers: ''
        }
      }
    }
    const propsWithoutEmployees = {
      language: 'en',
      showRoundData: true,
      courseHasRound: true,
      courseData: {},
      routerStore: { roundData: {} }
    }

    const { rerender } = render(<RoundInformationOneCol {...propsWithEmployees} />)
    const examiners = getByText(examinersData)
    expect(examiners).toBeInTheDocument()
    const responsibles = getByText(responsiblesData)
    expect(responsibles).toBeInTheDocument()
    const teachers = getByText(teachersData)
    expect(teachers).toBeInTheDocument()

    rerender(<RoundInformationOneCol {...propsWithEmptyEmployees} />)
    const emptyEmployees = getAllByText(EMPTY[0]) // en
    expect(emptyEmployees.length).toBe(3)

    rerender(<RoundInformationOneCol {...propsWithoutEmployees} />)
    const noEmployees = getAllByText(EMPTY[0]) // en
    expect(noEmployees.length).toBe(3)
  })
})
