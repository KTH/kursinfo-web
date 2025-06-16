import React from 'react'
import { render, screen } from '@testing-library/react'
import { RoundApplicationButton } from '../RoundSelector/RoundApplicationButton'
import '@testing-library/jest-dom'

jest.mock('../../hooks/useLanguage', () => ({
  useLanguage: () => ({ translation: { courseRoundInformation: { round_application_link: 'Till anmälan' } } }),
}))

describe('RoundApplicationButton', () => {
  it('renders "Till anmälan" when showApplicationLink is true', () => {
    const courseRound = { show_application_link: true, round_application_link: 'https://example.com/apply' }

    render(<RoundApplicationButton courseRound={courseRound} showRoundData={true} />)

    const tillAnmalan = screen.queryByText('Till anmälan')

    expect(tillAnmalan).toBeInTheDocument()
  })
  it('Does not render "Till anmälan" when showApplicationLink is false', () => {
    const courseRound = { show_application_link: false, round_application_link: 'https://example.com/apply' }

    render(<RoundApplicationButton courseRound={courseRound} showRoundData={true} />)

    const tillAnmalan = screen.queryByText('Till anmälan')

    expect(tillAnmalan).not.toBeInTheDocument()
  })
})
