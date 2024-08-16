import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { CourseScheduleLink } from '../RoundInformation/CourseScheduleLink'

import i18n from '../../../../../i18n'
import { INFORM_IF_IMPORTANT_INFO_IS_MISSING } from '../../util/constants'

jest.mock('../../context/WebContext')
import { useWebContext } from '../../context/WebContext'

useWebContext.mockReturnValue({ lang: 'en' })
const [translate] = i18n.messages // en

describe('Component <CourseScheduleLink>', () => {
  test('renders link to schedule if round_schedule is set', () => {
    const courseRound = {
      round_schedule: 'https://test.com',
    }

    render(<CourseScheduleLink courseRound={courseRound} />)
    const scheduleLink = screen.getByText(translate.courseLabels.label_link_schedule)
    expect(scheduleLink).toBeInTheDocument()
  })

  test('renders no_schedule_published text if round_schedule is not defined', () => {
    const courseRound = {
      round_schedule: undefined,
    }

    render(<CourseScheduleLink courseRound={courseRound} />)
    const scheduleText = screen.getByText(translate.courseLabels.no_schedule_published)
    expect(scheduleText).toBeInTheDocument()
  })

  test('renders no_schedule_published text if round_schedule is "missing text"', () => {
    const courseRound = {
      round_schedule: INFORM_IF_IMPORTANT_INFO_IS_MISSING[0],
    }

    render(<CourseScheduleLink courseRound={courseRound} />)
    const scheduleText = screen.getByText(translate.courseLabels.no_schedule_published)
    expect(scheduleText).toBeInTheDocument()
  })
})
