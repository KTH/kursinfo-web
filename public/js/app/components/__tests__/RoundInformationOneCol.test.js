/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { WebContextProvider } from '../../context/WebContext'

import RoundInformationOneCol from '../RoundInformationOneCol'

const INFORM_IF_IMPORTANT_INFO_IS_MISSING = ['No information inserted', 'Ingen information tillagd']
const context = { browserConfig: {}, sellingText: { en: '', sv: '' }, imageFromAdmin: '' }

describe('Component <RoundInformationOneCol>', () => {
  test('renders a course information column', () => {
    render(
      <WebContextProvider configIn={context}>
        <RoundInformationOneCol />
      </WebContextProvider>
    )
  })
  test('renders study pace correctly', () => {
    const propsWithStudyPace = {
      language: 'en',
      showRoundData: true,
      courseHasRound: true,
      courseData: {},
      courseRound: {
        round_course_term: ['2018', '1'],
        round_study_pace: '25',
      },
      testEmployees: {
        examiners: '',
        responsibles: '',
        teachers: '',
      },
    }
    render(
      <WebContextProvider configIn={context}>
        <RoundInformationOneCol {...propsWithStudyPace} />{' '}
      </WebContextProvider>
    )
    const label = screen.getByText('Pace of study')
    expect(label).toBeInTheDocument()
    const studyPace = screen.getByText('25%')
    expect(studyPace).toBeInTheDocument()
  })
  test('renders course offering employees correctly', () => {
    const examinersData = 'Examiners’ data'
    const responsiblesData = 'Responsibles’ data'
    const teachersData = 'Teachers’ data'
    const propsWithEmployees = {
      language: 'en',
      showRoundData: true,
      courseHasRound: true,
      courseData: {},
      testEmployees: {
        examiners: `<span>${examinersData}</span>'`,
        responsibles: `<span>${responsiblesData}</span>`,
        teachers: `<span>${teachersData}</span>`,
      },
    }
    const propsWithEmptyEmployees = {
      language: 'en',
      showRoundData: true,
      courseHasRound: true,
      courseData: {},
      testEmployees: {
        examiners: '',
        responsibles: '',
        teachers: '',
      },
    }
    const propsWithoutEmployees = {
      language: 'en',
      showRoundData: true,
      courseHasRound: true,
      courseData: {},
      testEmployees: {},
    }

    const { rerender } = render(
      <WebContextProvider configIn={context}>
        <RoundInformationOneCol {...propsWithEmployees} />{' '}
      </WebContextProvider>
    )
    const examiners = screen.getByText(examinersData)
    expect(examiners).toBeInTheDocument()
    const responsibles = screen.getByText(responsiblesData)
    expect(responsibles).toBeInTheDocument()
    const teachers = screen.getByText(teachersData)
    expect(teachers).toBeInTheDocument()

    rerender(
      <WebContextProvider configIn={context}>
        <RoundInformationOneCol {...propsWithEmptyEmployees} />{' '}
      </WebContextProvider>
    )
    const emptyEmployees = screen.getAllByText(INFORM_IF_IMPORTANT_INFO_IS_MISSING[0]) // en
    expect(emptyEmployees.length).toBe(3)

    rerender(
      <WebContextProvider configIn={context}>
        <RoundInformationOneCol {...propsWithoutEmployees} />{' '}
      </WebContextProvider>
    )
    const noEmployees = screen.getAllByText(INFORM_IF_IMPORTANT_INFO_IS_MISSING[0]) // en
    expect(noEmployees.length).toBe(3)
  })

  test('renders course offering number of places correctly if all data is available', async () => {
    const propsWithSeatsNum = {
      language: 'en',
      showRoundData: true,
      courseHasRound: true,
      courseData: {},
      courseRound: {
        round_course_term: ['2018', '1'],
        round_selection_criteria: '<p>English. Spicy jalapeno bacon ipsum</p>',
        round_seats: 'Max: 10',
      },
      testEmployees: {
        examiners: '',
        responsibles: '',
        teachers: '',
      },
    }

    render(<RoundInformationOneCol {...propsWithSeatsNum} />)
    const label = screen.getByText('Number of places')
    expect(label).toBeInTheDocument()
    expect(label.querySelector('button')).toBeInTheDocument()

    const seatsNum = screen.getByText('Max: 10')
    expect(seatsNum).toBeInTheDocument()

    label.querySelector('button').click()
    await waitFor(() => {
      expect(
        screen.getByText(
          'Course offering may be cancelled if number of admitted are less than minimum of places. If there are more applicants than number of places selection will be made. The selection results are based on:'
        )
      ).toBeInTheDocument()
      expect(screen.getByText('English. Spicy jalapeno bacon ipsum')).toBeInTheDocument()
    })
  })

  test('renders default text and hide info icon if a course offering number of places is not provided', done => {
    const propsWithoutSeatsNum = {
      language: 'en',
      showRoundData: true,
      courseHasRound: true,
      courseData: {},
      courseRound: {
        round_course_term: ['2018', '1'],
        round_selection_criteria: '<p>English. Spicy jalapeno bacon ipsum</p>',
        round_seats: '',
      },
      testEmployees: {},
    }

    render(
      <WebContextProvider configIn={context}>
        <RoundInformationOneCol {...propsWithoutSeatsNum} />{' '}
      </WebContextProvider>
    )

    const label = screen.getByText('Number of places')
    expect(label).toBeInTheDocument()
    expect(label.querySelector('button')).toBeFalsy()

    const seatsNum = screen.getByText('Places are not limited')
    expect(seatsNum).toBeInTheDocument()

    done()
  })

  test('renders course offering number of places correctly and default text in modal if selection criteria is empty', async () => {
    const propsWithEmptyCriteria = {
      language: 'en',
      showRoundData: true,
      courseHasRound: true,
      courseData: {},
      courseRound: {
        round_course_term: ['2018', '1'],
        round_selection_criteria: '<p></p>',
        round_seats: '5-10',
      },
      testEmployees: {},
    }

    render(
      <WebContextProvider configIn={context}>
        {' '}
        <RoundInformationOneCol {...propsWithEmptyCriteria} />
      </WebContextProvider>
    )

    const label = screen.getByText('Number of places')
    expect(label).toBeInTheDocument()
    expect(label.querySelector('button')).toBeInTheDocument()

    const seatsNum = screen.getByText('5-10')
    expect(seatsNum).toBeInTheDocument()

    label.querySelector('button').click()
    await waitFor(() => {
      expect(
        screen.getByText(
          'Course offering may be cancelled if number of admitted are less than minimum of places. If there are more applicants than number of places selection will be made.'
        )
      ).toBeInTheDocument()
      const criteriaText = screen.queryByText('The selection results are based on:')
      expect(criteriaText).not.toBeInTheDocument()
    })
  })
})
