/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { render, screen, waitFor, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import { WebContextProvider } from '../../context/WebContext'

import RoundInformationOneCol from '../RoundInformationOneCol'
import { usePlannedModules } from '../../hooks/usePlannedModules'

jest.mock('../../hooks/usePlannedModules')

const INFORM_IF_IMPORTANT_INFO_IS_MISSING = ['No information inserted', 'Ingen information tillagd']
const context = {
  browserConfig: {},
  sellingText: { en: '', sv: '' },
  imageFromAdmin: '',
  lang: 'en',
  paths: {
    api: {
      plannedSchemaModules: {
        uri: '/:courseCode/:semester/:applicationCode',
      },
    },
  },
}

describe('Component <RoundInformationOneCol>', () => {
  beforeAll(() => {
    usePlannedModules.mockReturnValue({
      plannedModules: 'somePlannedModules',
    })
  })

  test('renders study pace correctly', () => {
    const propsWithStudyPace = {
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
      showRoundData: true,
      courseHasRound: true,
      courseData: {},
      testEmployees: {
        examiners: `<span>${examinersData}</span>'`,
        responsibles: `<span>${responsiblesData}</span>`,
        teachers: `<span>${teachersData}</span>`,
      },
    }

    render(
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
  })

  test('renders information about missing course employees in course offering because it contains empty string', () => {
    const propsWithEmptyEmployees = {
      showRoundData: true,
      courseHasRound: true,
      courseData: {},
      testEmployees: {
        examiners: '',
        responsibles: '',
        teachers: '',
      },
    }

    render(
      <WebContextProvider configIn={context}>
        <RoundInformationOneCol {...propsWithEmptyEmployees} />{' '}
      </WebContextProvider>
    )
    const emptyEmployees = screen.getAllByText(INFORM_IF_IMPORTANT_INFO_IS_MISSING[0]) // en
    expect(emptyEmployees.length).toBe(3)
  })

  test('renders information about missing course employees in course offering because no data about employees is provided', () => {
    const propsWithoutEmployees = {
      showRoundData: true,
      courseHasRound: true,
      courseData: {},
      testEmployees: {},
    }

    render(
      <WebContextProvider configIn={context}>
        <RoundInformationOneCol {...propsWithoutEmployees} />
      </WebContextProvider>
    )
    const noEmployees = screen.getAllByText(INFORM_IF_IMPORTANT_INFO_IS_MISSING[0]) // en
    expect(noEmployees.length).toBe(3)
  })

  test('renders course offering number of places correctly if all data is available', async () => {
    const propsWithSeatsNum = {
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

    render(
      <WebContextProvider configIn={context}>
        <RoundInformationOneCol {...propsWithSeatsNum} />{' '}
      </WebContextProvider>
    )

    const label = screen.getByText('Number of places')
    expect(label).toBeInTheDocument()

    const button = within(label).getByRole('button')

    const seatsNum = screen.getByText('Max: 10')
    expect(seatsNum).toBeInTheDocument()

    button.click()
    await waitFor(() => {
      expect(
        screen.getByText(
          'Course offering may be cancelled if number of admitted are less than minimum of places. If there are more applicants than number of places selection will be made. The selection results are based on:'
        )
      ).toBeInTheDocument()
    })
    expect(screen.getByText('English. Spicy jalapeno bacon ipsum')).toBeInTheDocument()
  })

  test('renders default text and hide info icon if a course offering number of places is not provided', () => {
    const propsWithoutSeatsNum = {
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
    const button = within(label).queryByRole('button')

    expect(button).not.toBeInTheDocument()

    const seatsNum = screen.getByText('Places are not limited')
    expect(seatsNum).toBeInTheDocument()
  })

  test('renders course offering number of places correctly and default text in modal if selection criteria is empty', async () => {
    const propsWithEmptyCriteria = {
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
        <RoundInformationOneCol {...propsWithEmptyCriteria} />
      </WebContextProvider>
    )

    const label = screen.getByText('Number of places')
    expect(label).toBeInTheDocument()
    const button = within(label).getByRole('button')

    expect(button).toBeInTheDocument()

    const seatsNum = screen.getByText('5-10')
    expect(seatsNum).toBeInTheDocument()

    button.click()
    await waitFor(() => {
      expect(
        screen.getByText(
          'Course offering may be cancelled if number of admitted are less than minimum of places. If there are more applicants than number of places selection will be made.'
        )
      ).toBeInTheDocument()
    })
    const criteriaText = screen.queryByText('The selection results are based on:')
    expect(criteriaText).not.toBeInTheDocument()
  })
})
