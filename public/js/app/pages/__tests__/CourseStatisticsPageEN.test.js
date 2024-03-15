import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { userEvent } from '@testing-library/user-event'
import { WebContextProvider } from '../../context/WebContext'
import CourseStatisticsPage from '../CourseStatisticsPage'

const language_en = 'en'
const mockDate = new Date('2022-03-23 16:00')

const context_en = {
  language: language_en,
  languageIndex: language_en === 'en' ? 0 : 1,
}

function CourseStatisticsPageWithContext({ context }) {
  return (
    <WebContextProvider configIn={context}>
      <CourseStatisticsPage onSubmit={() => {}} />
    </WebContextProvider>
  )
}
describe('Component <CourseStatisticsPage> in English', () => {
  beforeAll(() => {
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate)
  })

  afterAll(() => {
    jest.spyOn(global, 'Date').mockRestore()
  })

  test('renders start state of page', () => {
    render(<CourseStatisticsPageWithContext context={context_en} />)
    const h3 = screen.getByRole('heading', { level: 3 })
    expect(h3).toHaveTextContent('Area')
    const courseMemo = screen.getByLabelText(/course memo/i)
    expect(courseMemo).toBeInTheDocument()
    expect(courseMemo).not.toBeChecked()

    const courseAnalysis = screen.getByLabelText(/course analysis/i)
    expect(courseAnalysis).toBeInTheDocument()
    expect(courseAnalysis).not.toBeChecked()

    const allRadios = screen.getAllByRole('radio')
    expect(allRadios.length).toBe(2)

    const checkbox = screen.queryByRole('checkbox')
    expect(checkbox).not.toBeInTheDocument()

    const combobox = screen.queryByRole('combobox')
    expect(combobox).not.toBeInTheDocument()

    const btn = screen.getByRole('button', { name: /show statistics/i })
    expect(btn).toBeInTheDocument()
  })

  test('renders choose course memo and show inputs for school, year and study periods', async () => {
    render(<CourseStatisticsPageWithContext context={context_en} />)

    const courseMemo = screen.getByLabelText(/course memo/i)
    await userEvent.click(courseMemo)
    expect(courseMemo).toBeChecked()

    const periods = screen.getByRole('heading', { name: /study period/i })
    expect(periods).toBeInTheDocument()

    const termin = screen.queryByRole('heading', { name: /termin/i })
    expect(termin).not.toBeInTheDocument()

    const allRadios = screen.getAllByRole('radio')
    expect(allRadios.length).toBe(8)

    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes.length).toBe(5)

    const comboboxes = screen.getAllByRole('combobox')
    expect(comboboxes.length).toBe(1)
  })
})
