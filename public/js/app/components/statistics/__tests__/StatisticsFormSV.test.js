import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { userEvent } from '@testing-library/user-event'

import { WebContextProvider } from '../../../context/WebContext'

import StatisticsForm from '../StatisticsForm'

const language_sv = 'sv'

let submittedResults

const context_sv = {
  language: language_sv,
  languageIndex: language_sv === 'en' ? 0 : 1,
}

function StatisticsFormWithContext({ context }) {
  return (
    <WebContextProvider configIn={context}>
      <StatisticsForm onSubmit={props => (submittedResults = props)} />
    </WebContextProvider>
  )
}
describe('Component <StatisticsForm>', () => {
  beforeAll(() => {
    jest.useFakeTimers({ advanceTimers: true })
    jest.setSystemTime(new Date(2023, 3, 1))
    submittedResults = undefined
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  test('renders start state of page', () => {
    render(<StatisticsFormWithContext context={context_sv} />)

    const h3 = screen.getByRole('heading', { level: 3 })
    expect(h3).toHaveTextContent('Område')

    const courseMemo = screen.getByLabelText(/kurs-pm/i)
    expect(courseMemo).toBeInTheDocument()

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
    render(<StatisticsFormWithContext context={context_sv} />)

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
          class="form-select"
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
            id="2024"
            value="2024"
          >
            2024
          </option>
          <option
            id="2023"
            value="2023"
          >
            2023
          </option>
          <option
            id="2022"
            value="2022"
          >
            2022
          </option>
          <option
            id="2021"
            value="2021"
          >
            2021
          </option>
          <option
            id="2020"
            value="2020"
          >
            2020
          </option>
          <option
            id="2019"
            value="2019"
          >
            2019
          </option>
        </select>,
      ]
    `)
  })

  test('renders switch between kurs-pm and analyses and check for clean up state', async () => {
    render(<StatisticsFormWithContext context={context_sv} />)

    const courseMemo = screen.getByLabelText(/kurs-pm/i)
    const courseAnalysis = screen.getByLabelText(/kursanalys/i)
    const btn = screen.getByRole('button', { name: /visa statistik/i })

    await userEvent.click(courseMemo)
    expect(courseMemo).toBeChecked()

    expect(screen.getByRole('heading', { name: /läsperiod/i })).toBeInTheDocument()

    expect(screen.queryByRole('heading', { name: /termin/i })).not.toBeInTheDocument()

    await userEvent.click(screen.getByLabelText(/period 1, HT/i))
    await userEvent.click(screen.getByLabelText(/period 2, HT/i))

    expect(screen.getByLabelText(/period 1, HT/i)).toBeChecked()
    expect(screen.getByLabelText(/period 2, HT/i)).toBeChecked()

    await userEvent.click(btn)
    expect(submittedResults).toMatchInlineSnapshot(`
      {
        "documentType": "courseMemo",
        "periods": [
          1,
          2,
        ],
        "school": undefined,
        "year": undefined,
      }
    `)

    await userEvent.click(courseAnalysis)
    expect(courseAnalysis).toBeChecked()

    expect(screen.queryByRole('heading', { name: /läsperiod/i })).not.toBeInTheDocument()

    expect(screen.getByRole('heading', { name: /termin/i })).toBeInTheDocument()

    await userEvent.click(screen.getByLabelText(/HT/i))
    expect(screen.getByLabelText(/HT/i)).toBeChecked()

    await userEvent.click(screen.getByLabelText(/VT/i))
    expect(screen.getByLabelText(/VT/i)).toBeChecked()
    expect(screen.getByLabelText(/HT/i)).not.toBeChecked()

    await userEvent.click(btn)
    expect(submittedResults).toMatchInlineSnapshot(`
      {
        "documentType": "courseAnalysis",
        "periods": [],
        "school": undefined,
        "semester": "1",
        "year": undefined,
      }
    `)

    await userEvent.click(courseMemo)
    expect(courseMemo).toBeChecked()

    expect(screen.getByLabelText(/period 1, HT/i)).not.toBeChecked()
    expect(screen.getByLabelText(/period 2, HT/i)).not.toBeChecked()

    await userEvent.click(courseAnalysis)
    expect(courseAnalysis).toBeChecked()

    expect(screen.getByLabelText(/HT/i)).not.toBeChecked()
    expect(screen.getByLabelText(/VT/i)).not.toBeChecked()

    await userEvent.click(btn)
    expect(submittedResults).toMatchInlineSnapshot(`
      {
        "documentType": "courseAnalysis",
        "periods": [],
        "school": undefined,
        "semester": undefined,
        "year": undefined,
      }
    `)
  })

  test('submit for empty submitted state', async () => {
    render(<StatisticsFormWithContext context={context_sv} />)

    const courseMemo = screen.getByLabelText(/kurs-pm/i)
    const courseAnalysis = screen.getByLabelText(/kursanalys/i)

    await userEvent.click(courseMemo)
    expect(courseMemo).toBeChecked()

    const btn = screen.getByRole('button', { name: /visa statistik/i })
    await userEvent.click(btn)

    expect(submittedResults).toMatchInlineSnapshot(`
      {
        "documentType": "courseMemo",
        "periods": [],
        "school": undefined,
        "year": undefined,
      }
    `)

    await userEvent.click(courseAnalysis)
    expect(courseAnalysis).toBeChecked()

    await userEvent.click(btn)

    expect(submittedResults).toMatchInlineSnapshot(`
      {
        "documentType": "courseAnalysis",
        "periods": [],
        "school": undefined,
        "semester": undefined,
        "year": undefined,
      }
    `)
  })

  test('renders switch between course memo and analyses and check state continue working', async () => {
    render(<StatisticsFormWithContext context={context_sv} />)

    const courseMemo = screen.getByLabelText(/kurs-pm/i)
    const courseAnalysis = screen.getByLabelText(/kursanalys/i)
    const btn = screen.getByRole('button', { name: /visa statistik/i })

    await userEvent.click(courseMemo)
    expect(courseMemo).toBeChecked()

    await userEvent.click(screen.getByLabelText(/SCI/i))
    expect(screen.getByLabelText(/SCI/i)).toBeChecked()

    await userEvent.selectOptions(screen.getByRole('combobox', { name: /välj år/i }), '2020')

    await userEvent.click(screen.getByLabelText(/period 1, HT/i))

    expect(screen.getByLabelText(/period 1, HT/i)).toBeChecked()

    await userEvent.click(btn)
    expect(submittedResults).toMatchInlineSnapshot(`
      {
        "documentType": "courseMemo",
        "periods": [
          1,
        ],
        "school": "SCI",
        "year": 2020,
      }
    `)

    await userEvent.click(courseAnalysis)
    expect(courseAnalysis).toBeChecked()

    expect(screen.queryByRole('heading', { name: /läsperiod/i })).not.toBeInTheDocument()

    expect(screen.getByRole('heading', { name: /termin/i })).toBeInTheDocument()

    await userEvent.click(screen.getByLabelText(/HT/i))
    expect(screen.getByLabelText(/HT/i)).toBeChecked()

    await userEvent.click(screen.getByLabelText(/VT/i))
    expect(screen.getByLabelText(/VT/i)).toBeChecked()
    expect(screen.getByLabelText(/HT/i)).not.toBeChecked()

    await userEvent.selectOptions(screen.getByRole('combobox', { name: /välj år/i }), '2019')

    await userEvent.click(btn)
    expect(submittedResults).toMatchInlineSnapshot(`
      {
        "documentType": "courseAnalysis",
        "periods": [],
        "school": "SCI",
        "semester": "1",
        "year": 2019,
      }
    `)
  })

  test('check or select all inputs', async () => {
    render(<StatisticsFormWithContext context={context_sv} />)

    const courseMemo = screen.getByLabelText(/kurs-pm/i)

    await userEvent.click(courseMemo)
    expect(courseMemo).toBeChecked()

    await userEvent.click(screen.getByLabelText(/EECS/i))
    expect(screen.getByLabelText(/EECS/i)).toBeChecked()

    await userEvent.selectOptions(screen.getByRole('combobox', { name: /välj år/i }), '2019')

    await userEvent.click(screen.getByLabelText(/period 1, HT/i))
    await userEvent.click(screen.getByLabelText(/period 2, HT/i))

    const btn = screen.getByRole('button', { name: /visa statistik/i })
    await userEvent.click(btn)

    expect(submittedResults).toMatchInlineSnapshot(`
      {
        "documentType": "courseMemo",
        "periods": [
          1,
          2,
        ],
        "school": "EECS",
        "year": 2019,
      }
    `)

    expect(screen.getByLabelText(/period 1, HT/i)).toBeChecked()
    expect(screen.getByLabelText(/period 2, HT/i)).toBeChecked()

    // change school and year
    await userEvent.click(screen.getByLabelText(/alla skolor/i))
    expect(screen.getByLabelText(/alla skolor/i)).toBeChecked()

    await userEvent.selectOptions(screen.getByRole('combobox', { name: /välj år/i }), '2021')

    await userEvent.click(screen.getByLabelText(/period 2, HT/i))
    expect(screen.getByLabelText(/period 2, HT/i)).not.toBeChecked()
    await userEvent.click(screen.getByLabelText(/sommar/i))

    await userEvent.click(btn)

    expect(submittedResults).toMatchInlineSnapshot(`
          {
            "documentType": "courseMemo",
            "periods": [
              1,
              0,
            ],
            "school": "allSchools",
            "year": 2021,
          }
        `)
  })

  test('check or select all inputs for course analysis', async () => {
    render(<StatisticsFormWithContext context={context_sv} />)

    const courseanalysis = screen.getByLabelText(/kursanalys/i)

    await userEvent.click(courseanalysis)
    expect(courseanalysis).toBeChecked()

    await userEvent.click(screen.getByLabelText(/alla skolor/i))
    expect(screen.getByLabelText(/alla skolor/i)).toBeChecked()

    await userEvent.selectOptions(screen.getByRole('combobox', { name: /välj år/i }), '2020')

    await userEvent.click(screen.getByLabelText(/VT/i))
    expect(screen.getByLabelText(/VT/i)).toBeChecked()
    expect(screen.getByLabelText(/HT/i)).not.toBeChecked()

    const btn = screen.getByRole('button', { name: /visa statistik/i })
    await userEvent.click(btn)

    expect(submittedResults).toMatchInlineSnapshot(`
      {
        "documentType": "courseAnalysis",
        "school": "allSchools",
        "semester": "1",
        "year": 2020,
      }
    `)
    // change school and year and termin
    await userEvent.click(screen.getByLabelText(/itm/i))
    expect(screen.getByLabelText(/itm/i)).toBeChecked()

    await userEvent.selectOptions(screen.getByRole('combobox', { name: /välj år/i }), '2020')

    await userEvent.click(screen.getByLabelText(/HT/i))
    expect(screen.getByLabelText(/HT/i)).toBeChecked()
    expect(screen.getByLabelText(/VT/i)).not.toBeChecked()

    await userEvent.click(btn)

    expect(submittedResults).toMatchInlineSnapshot(`
          {
            "documentType": "courseAnalysis",
            "school": "ITM",
            "semester": "2",
            "year": 2020,
          }
        `)
  })
})
