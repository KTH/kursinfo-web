import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { userEvent } from '@testing-library/user-event'
import { WebContextProvider } from '../../../context/WebContext'
import StatisticsForm from '../StatisticsForm'

let submittedResults

const context_en = {
  lang: 'en',
}

function StatisticsFormWithContext({ context }) {
  return (
    <WebContextProvider configIn={context}>
      <StatisticsForm onSubmit={props => (submittedResults = props)} />
    </WebContextProvider>
  )
}
describe('Component <StatisticsForm> in english', () => {
  beforeAll(() => {
    jest.useFakeTimers({ advanceTimers: true })
    jest.setSystemTime(new Date(2023, 3, 1))
    submittedResults = undefined
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  test('renders start state of page', () => {
    render(<StatisticsFormWithContext context={context_en} />)
    const h3 = screen.getByRole('heading', { level: 3 })
    expect(h3).toHaveTextContent('Area')
    const courseMemo = screen.getByLabelText(/course memo/i)
    expect(courseMemo).toBeInTheDocument()
    expect(courseMemo).not.toBeChecked()

    const allRadios = screen.getAllByRole('radio')
    expect(allRadios.length).toBe(1)

    const checkbox = screen.queryByRole('checkbox')
    expect(checkbox).not.toBeInTheDocument()

    const combobox = screen.queryByRole('combobox')
    expect(combobox).not.toBeInTheDocument()

    const btn = screen.getByRole('button', { name: /show statistics/i })
    expect(btn).toBeInTheDocument()
  })

  test('renders choose course memo and show inputs for school, year and study periods', async () => {
    render(<StatisticsFormWithContext context={context_en} />)

    const courseMemo = screen.getByLabelText(/course memo/i)
    await userEvent.click(courseMemo)
    expect(courseMemo).toBeChecked()

    const periods = screen.getByRole('heading', { name: /study period/i })
    expect(periods).toBeInTheDocument()

    const termin = screen.queryByRole('heading', { name: /termin/i })
    expect(termin).not.toBeInTheDocument()

    const allRadios = screen.getAllByRole('radio')
    expect(allRadios.length).toBe(7)
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
          aria-label="Select year"
          class="form-select"
          id="year-select-year"
        >
          <option
            id="year"
            selected=""
            value="placeholder"
          >
            Select year
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

  test('submit for empty submitted state', async () => {
    render(<StatisticsFormWithContext context={context_en} />)

    const courseMemo = screen.getByLabelText(/course memo/i)

    await userEvent.click(courseMemo)
    expect(courseMemo).toBeChecked()

    const btn = screen.getByRole('button', { name: /show statistics/i })
    await userEvent.click(btn)

    expect(submittedResults).toMatchInlineSnapshot(`
      {
        "documentType": "courseMemo",
        "periods": [],
        "school": undefined,
        "year": undefined,
      }
    `)
  })

  test('check or select all inputs for course memo', async () => {
    render(<StatisticsFormWithContext context={context_en} />)

    const courseMemo = screen.getByLabelText(/course memo/i)

    await userEvent.click(courseMemo)
    expect(courseMemo).toBeChecked()

    await userEvent.click(screen.getByLabelText(/EECS/i))
    expect(screen.getByLabelText(/EECS/i)).toBeChecked()

    await userEvent.selectOptions(screen.getByRole('combobox', { name: /Select year/i }), '2019')

    await userEvent.click(screen.getByLabelText(/period 1, Autumn/i))
    await userEvent.click(screen.getByLabelText(/period 2, Autumn/i))

    expect(screen.getByLabelText(/period 1, Autumn/i)).toBeChecked()
    expect(screen.getByLabelText(/period 2, Autumn/i)).toBeChecked()

    const btn = screen.getByRole('button', { name: /show statistics/i })
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

    // change school and year
    await userEvent.click(screen.getByLabelText(/all schools/i))
    expect(screen.getByLabelText(/all schools/i)).toBeChecked()

    await userEvent.selectOptions(screen.getByRole('combobox', { name: /Select year/i }), '2021')

    await userEvent.click(screen.getByLabelText(/period 2, Autumn/i))
    expect(screen.getByLabelText(/period 2, Autumn/i)).not.toBeChecked()
    await userEvent.click(screen.getByLabelText(/summer/i))

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

  test('check, uncheck and check same inputs for course memo', async () => {
    render(<StatisticsFormWithContext context={context_en} />)

    const courseMemo = screen.getByLabelText(/course memo/i)

    await userEvent.click(courseMemo)
    expect(courseMemo).toBeChecked()

    await userEvent.click(screen.getByLabelText(/EECS/i))
    expect(screen.getByLabelText(/EECS/i)).toBeChecked()

    await userEvent.selectOptions(screen.getByRole('combobox', { name: /Select year/i }), '2019')

    await userEvent.click(screen.getByLabelText(/summer/i))

    expect(screen.getByLabelText(/summer/i)).toBeChecked()

    const btn = screen.getByRole('button', { name: /show statistics/i })
    await userEvent.click(btn)

    expect(submittedResults).toMatchInlineSnapshot(`
      {
        "documentType": "courseMemo",
        "periods": [
          0,
        ],
        "school": "EECS",
        "year": 2019,
      }
    `)

    // uncheck the same checkbox
    await userEvent.click(screen.getByLabelText(/summer/i))

    expect(screen.getByLabelText(/summer/i)).not.toBeChecked()

    await userEvent.click(btn)

    expect(submittedResults).toMatchInlineSnapshot(`
          {
            "documentType": "courseMemo",
            "periods": [],
            "school": "EECS",
            "year": 2019,
          }
        `)
    // check the same checkbox
    await userEvent.click(screen.getByLabelText(/summer/i))

    expect(screen.getByLabelText(/summer/i)).toBeChecked()

    await userEvent.click(btn)

    expect(submittedResults).toMatchInlineSnapshot(`
          {
            "documentType": "courseMemo",
            "periods": [
              0,
            ],
            "school": "EECS",
            "year": 2019,
          }
        `)
  })
})
