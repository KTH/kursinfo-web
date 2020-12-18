import React from 'react'
import { Provider } from 'mobx-react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import RoundInformationOneCol from '../RoundInformationOneCol'

import i18n from '../../../../../i18n'

const INFORM_IF_IMPORTANT_INFO_IS_MISSING = ['No information inserted', 'Ingen information tillagd']

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
    const emptyEmployees = getAllByText(INFORM_IF_IMPORTANT_INFO_IS_MISSING[0]) // en
    expect(emptyEmployees.length).toBe(3)

    rerender(<RoundInformationOneCol {...propsWithoutEmployees} />)
    const noEmployees = getAllByText(INFORM_IF_IMPORTANT_INFO_IS_MISSING[0]) // en
    expect(noEmployees.length).toBe(3)
  })
  
  test('renders course offering number of places correctly if all data is available', async (done) => {
    const language = 'en'
    const translate = i18n.messages[language === 'en' ? 0 : 1]
    const propsWithSeatsNum = {
      language: 'en',
      showRoundData: true,
      courseHasRound: true,
      courseData: {},
      courseRound: {
        round_course_term: [ '2018', '1'],
        round_selection_criteria: 'English. Spicy jalapeno bacon ipsum',
        round_seats: 'Max: 10',
      },
      routerStore: {
        roundData: {
          examiners: '',
          responsibles: '',
          teachers: ''
        }
      }
    }

    const { rerender } = render(<RoundInformationOneCol {...propsWithSeatsNum} />)
    const label = getByText('Number of places')
    expect(label).toBeInTheDocument()
    expect(label.querySelector('button')).toBeInTheDocument()
    
    const seatsNum = getByText('Max: 10')
    expect(seatsNum).toBeInTheDocument()


    label.querySelector('button').click()
    await waitFor(() =>
      {
        expect(getByText('Course offering may be cancelled if number of admitted are less than minimum of places. If there are more applicants than number of places selection will be made. The selection results are based on:')).toBeInTheDocument()
        expect(getByText('English. Spicy jalapeno bacon ipsum')).toBeInTheDocument()
      }
    )

    done()

  })

  test('renders default text and hide info icon if a course offering number of places is not provided', (done) => {
    const language = 'en'
    const translate = i18n.messages[language === 'en' ? 0 : 1]
    const propsWithoutSeatsNum = {
      language: 'en',
      showRoundData: true,
      courseHasRound: true,
      courseData: {},
      courseRound: {
        round_course_term: [ '2018', '1'],
        round_selection_criteria: 'English. Spicy jalapeno bacon ipsum',
        round_seats: '',
      },
      routerStore: {
        roundData: {}
      }
    }

    const { rerender } = render(<RoundInformationOneCol {...propsWithoutSeatsNum} />)

    const label = getByText('Number of places')
    expect(label).toBeInTheDocument()
    expect(label.querySelector('button')).toBeFalsy()
    
    const seatsNum = getByText('Places are not limited')
    expect(seatsNum).toBeInTheDocument()

    done()
  })

  test('renders course offering number of places correctly and default text in modal if selection criteria is empty', async (done) => {
    const language = 'en'
    const translate = i18n.messages[language === 'en' ? 0 : 1]

    const propsWithEmptyCriteria = {
      language: 'en',
      showRoundData: true,
      courseHasRound: true,
      courseData: {},
      courseRound: {
        round_course_term: [ '2018', '1'],
        round_selection_criteria: '',
        round_seats: '5-10',
      },
      routerStore: {
        roundData: {}
      }
    }

    const { rerender } = render(<RoundInformationOneCol {...propsWithEmptyCriteria} />)

    const label = getByText('Number of places')
    expect(label).toBeInTheDocument()
    expect(label.querySelector('button')).toBeInTheDocument()
    
    const seatsNum = getByText('5-10')
    expect(seatsNum).toBeInTheDocument()

    label.querySelector('button').click()
    await waitFor(() =>{
      expect(getByText('Course offering may be cancelled if number of admitted are less than minimum of places. If there are more applicants than number of places selection will be made.')).toBeInTheDocument()
      let criteriaText = screen.queryByText('The selection results are based on:')
      expect(criteriaText).toBeNull()
      }
    )

    done()
  })
})
