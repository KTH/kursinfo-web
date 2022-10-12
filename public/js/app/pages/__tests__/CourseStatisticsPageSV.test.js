import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'

import { WebContextProvider } from '../../context/WebContext'

import CourseStatisticsPage from '../CourseStatisticsPage'

// import i18n from '../../../../../../i18n'

const language_sv = 'sv'
// const [translate] = i18n.messages // en

let submittedResults

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
describe('Component <CourseStatisticsPage>', () => {
  test('renders a form to choose parameters for a statistics page', () => {
    render(<CourseStatisticsPageWithContext context={context_sv} />)
  })

  test('renders start state of page', () => {
    render(<CourseStatisticsPageWithContext context={context_sv} />)

    const h3 = screen.getByRole('heading', { level: 3 })
    expect(h3).toHaveTextContent('Område')

    const courseMemo = screen.getByLabelText(/kurs-pm/i)
    expect(courseMemo).toBeInTheDocument()
    const courseAnalysis = screen.getByLabelText(/kursanalys/i)

    const allRadios = screen.getAllByRole('radio')
    expect(allRadios.length).toBe(2)

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
    expect(allRadios.length).toBe(8)
    expect(allRadios).toMatchInlineSnapshot(`
      [
        <input
          class="form-check-input"
          id="courseMemo"
          name="documentType"
          type="radio"
          value="courseMemo"
        />,
        <input
          class="form-check-input"
          id="courseAnalysis"
          name="documentType"
          type="radio"
          value="courseAnalysis"
        />,
        <input
          class="form-check-input"
          id="ABE"
          name="school"
          type="radio"
          value="ABE"
        />,
        <input
          class="form-check-input"
          id="ITM"
          name="school"
          type="radio"
          value="ITM"
        />,
        <input
          class="form-check-input"
          id="CBH"
          name="school"
          type="radio"
          value="CBH"
        />,
        <input
          class="form-check-input"
          id="SCI"
          name="school"
          type="radio"
          value="SCI"
        />,
        <input
          class="form-check-input"
          id="EECS"
          name="school"
          type="radio"
          value="EECS"
        />,
        <input
          class="form-check-input"
          id="allSchools"
          name="school"
          type="radio"
          value="allSchools"
        />,
      ]
    `)

    const checkbox = screen.getAllByRole('checkbox')
    expect(checkbox).toMatchInlineSnapshot(`
      [
        <input
          class="form-check-input"
          id="1"
          name="periods"
          type="checkbox"
          value="1"
        />,
        <input
          class="form-check-input"
          id="3"
          name="periods"
          type="checkbox"
          value="3"
        />,
        <input
          class="form-check-input"
          id="0"
          name="periods"
          type="checkbox"
          value="0"
        />,
        <input
          class="form-check-input"
          id="2"
          name="periods"
          type="checkbox"
          value="2"
        />,
        <input
          class="form-check-input"
          id="4"
          name="periods"
          type="checkbox"
          value="4"
        />,
      ]
    `)

    const combobox = screen.getAllByRole('combobox')
    expect(combobox).toMatchInlineSnapshot(`
      [
        <select
          aria-label="Välj år"
          class="form-control"
          id="year-select-year"
        >
          <option
            id="year"
            selected=""
            value="placeholder"
          >
            Välj år
          </option>
          <option
            id="2019"
            value="2019"
          >
            2019
          </option>
          <option
            id="2020"
            value="2020"
          >
            2020
          </option>
          <option
            id="2021"
            value="2021"
          >
            2021
          </option>
          <option
            id="2022"
            value="2022"
          >
            2022
          </option>
        </select>,
      ]
    `)
  })

  test('renders switch between kurs-pm and analyses and check for clean up state', async () => {
    render(<CourseStatisticsPageWithContext context={context_sv} />)

    const courseMemo = screen.getByLabelText(/kurs-pm/i)
    const courseAnalysis = screen.getByLabelText(/kursanalys/i)

    await userEvent.click(courseMemo)
    expect(courseMemo).toBeChecked()

    expect(screen.getByRole('heading', { name: /läsperiod/i })).toBeInTheDocument()

    expect(screen.queryByRole('heading', { name: /termin/i })).not.toBeInTheDocument()

    await userEvent.click(screen.getByLabelText(/period 1, HT/i))
    await userEvent.click(screen.getByLabelText(/period 2, HT/i))

    expect(screen.getByLabelText(/period 1, HT/i)).toBeChecked()
    expect(screen.getByLabelText(/period 2, HT/i)).toBeChecked()

    await userEvent.click(courseAnalysis)
    expect(courseAnalysis).toBeChecked()

    expect(screen.queryByRole('heading', { name: /läsperiod/i })).not.toBeInTheDocument()

    expect(screen.getByRole('heading', { name: /termin/i })).toBeInTheDocument()

    await userEvent.click(screen.getByLabelText(/HT/i))
    await userEvent.click(screen.getByLabelText(/sommar/i))

    expect(screen.getByLabelText(/HT/i)).toBeChecked()
    expect(screen.getByLabelText(/sommar/i)).toBeChecked()

    await userEvent.click(courseMemo)
    expect(courseMemo).toBeChecked()

    expect(screen.getByLabelText(/period 1, HT/i)).not.toBeChecked()
    expect(screen.getByLabelText(/period 2, HT/i)).not.toBeChecked()

    await userEvent.click(courseAnalysis)
    expect(courseAnalysis).toBeChecked()

    expect(screen.getByLabelText(/HT/i)).not.toBeChecked()
    expect(screen.getByLabelText(/sommar/i)).not.toBeChecked()
  })

  test('submit for epmty submitted state', async () => {
    render(<CourseStatisticsPageWithContext context={context_sv} />)

    const courseMemo = screen.getByLabelText(/kurs-pm/i)
    const courseAnalysis = screen.getByLabelText(/kursanalys/i)

    await userEvent.click(courseMemo)
    expect(courseMemo).toBeChecked()

    expect(submittedResults).toMatchInlineSnapshot(`undefined`)

    await userEvent.click(courseAnalysis)
    expect(courseAnalysis).toBeChecked()

    expect(submittedResults).toMatchInlineSnapshot(`undefined`)
  })

  test('check or select all inputs', async () => {
    render(<CourseStatisticsPageWithContext context={context_sv} />)

    const courseMemo = screen.getByLabelText(/kurs-pm/i)

    await userEvent.click(courseMemo)
    expect(courseMemo).toBeChecked()

    await userEvent.click(screen.getByLabelText(/EECS/i))
    expect(screen.getByLabelText(/EECS/i)).toBeChecked()

    await userEvent.selectOptions(screen.getByRole('combobox', { name: /välj år/i }), '2019')

    await userEvent.click(screen.getByLabelText(/period 1, HT/i))
    await userEvent.click(screen.getByLabelText(/period 2, HT/i))

    expect(screen.getByLabelText(/period 1, HT/i)).toBeChecked()
    expect(screen.getByLabelText(/period 2, HT/i)).toBeChecked()
  })
})