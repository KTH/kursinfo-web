import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { userEvent } from '@testing-library/user-event'

import { WebContextProvider } from '../../context/WebContext'

import CourseStatisticsPage from '../CourseStatisticsPage'

const language_sv = 'sv'

const context_sv = {
  language: language_sv,
  languageIndex: language_sv === 'en' ? 0 : 1,
}

function CourseStatisticsPageWithContext({ context }) {
  return (
    <WebContextProvider configIn={context}>
      <CourseStatisticsPage />
    </WebContextProvider>
  )
}
describe('Component <CourseStatisticsPage> form', () => {
  test('renders start state of page', () => {
    render(<CourseStatisticsPageWithContext context={context_sv} />)

    const h3 = screen.getByRole('heading', { level: 3 })
    expect(h3).toHaveTextContent('Område')

    const courseMemo = screen.getByLabelText(/kurs-pm/i)
    expect(courseMemo).toBeInTheDocument()

    const allRadios = screen.getAllByRole('radio')
    expect(allRadios.length).toBe(1)

    const checkbox = screen.queryByRole('checkbox')
    expect(checkbox).not.toBeInTheDocument()

    const select = screen.queryByRole('select')
    expect(select).not.toBeInTheDocument()

    const btn = screen.getByRole('button', { name: /visa statistik/i })
    expect(btn).toBeInTheDocument()
  })

  test('renders choose kurs-pm and show inputs for school, year and läsperiods', async () => {
    render(<CourseStatisticsPageWithContext context={context_sv} />)

    const courseMemo = screen.getByLabelText(/kurs-pm/i)
    await userEvent.click(courseMemo)
    expect(courseMemo).toBeChecked()

    const periods = screen.getByRole('heading', { name: /läsperiod/i })
    expect(periods).toBeInTheDocument()

    const termin = screen.queryByRole('heading', { name: /termin/i })
    expect(termin).not.toBeInTheDocument()

    const allRadios = screen.getAllByRole('radio')
    expect(allRadios.length).toBe(7)

    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes.length).toBe(5)

    const combobox = screen.getAllByRole('combobox')
    expect(combobox.length).toBe(1)
  })
})
