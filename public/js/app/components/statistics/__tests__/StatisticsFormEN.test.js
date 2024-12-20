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
    render(<StatisticsFormWithContext context={context_en} />)

    const courseMemo = screen.getByLabelText(/course memo/i)
    await userEvent.click(courseMemo)
    expect(courseMemo).toBeChecked()

    const periods = screen.getByRole('heading', { name: /study period/i })
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

  test('renders switch between course memo and analyses and check for clean up state', async () => {
    render(<StatisticsFormWithContext context={context_en} />)

    const courseMemo = screen.getByLabelText(/course memo/i)
    const courseAnalysis = screen.getByLabelText(/course analysis/i)
    const btn = screen.getByRole('button', { name: /show statistics/i })

    await userEvent.click(courseMemo)
    expect(courseMemo).toBeChecked()

    expect(screen.getByRole('heading', { name: /study period/i })).toBeInTheDocument()

    expect(screen.queryByRole('heading', { name: /semester/i })).not.toBeInTheDocument()

    await userEvent.click(screen.getByLabelText(/period 1, Autumn/i))
    await userEvent.click(screen.getByLabelText(/period 2, Autumn/i))

    expect(screen.getByLabelText(/period 1, Autumn/i)).toBeChecked()
    expect(screen.getByLabelText(/period 2, Autumn/i)).toBeChecked()

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

    expect(screen.queryByRole('heading', { name: /study period/i })).not.toBeInTheDocument()

    expect(screen.getByRole('heading', { name: /semester/i })).toBeInTheDocument()

    await userEvent.click(screen.getByLabelText(/autumn/i))
    expect(screen.getByLabelText(/autumn/i)).toBeChecked()

    await userEvent.click(screen.getByLabelText(/spring/i))
    expect(screen.getByLabelText(/spring/i)).toBeChecked()
    expect(screen.getByLabelText(/autumn/i)).not.toBeChecked()

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

    expect(screen.getByLabelText(/period 1, autumn/i)).not.toBeChecked()
    expect(screen.getByLabelText(/period 2, autumn/i)).not.toBeChecked()

    await userEvent.click(courseAnalysis)
    expect(courseAnalysis).toBeChecked()

    expect(screen.getByLabelText(/autumn/i)).not.toBeChecked()
    expect(screen.getByLabelText(/spring/i)).not.toBeChecked()

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
    render(<StatisticsFormWithContext context={context_en} />)

    const courseMemo = screen.getByLabelText(/course memo/i)
    const courseAnalysis = screen.getByLabelText(/course analysis/i)
    const btn = screen.getByRole('button', { name: /show statistics/i })

    await userEvent.click(courseMemo)
    expect(courseMemo).toBeChecked()

    await userEvent.click(screen.getByLabelText(/SCI/i))
    expect(screen.getByLabelText(/SCI/i)).toBeChecked()

    await userEvent.selectOptions(screen.getByRole('combobox', { name: /Select year/i }), '2020')

    await userEvent.click(screen.getByLabelText(/period 1, autumn/i))

    expect(screen.getByLabelText(/period 1, autumn/i)).toBeChecked()

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

    expect(screen.queryByRole('heading', { name: /study period/i })).not.toBeInTheDocument()

    expect(screen.getByRole('heading', { name: /semester/i })).toBeInTheDocument()

    await userEvent.click(screen.getByLabelText(/autumn/i))
    expect(screen.getByLabelText(/autumn/i)).toBeChecked()

    await userEvent.click(screen.getByLabelText(/spring/i))
    expect(screen.getByLabelText(/spring/i)).toBeChecked()
    expect(screen.getByLabelText(/autumn/i)).not.toBeChecked()

    await userEvent.selectOptions(screen.getByRole('combobox', { name: /Select year/i }), '2019')

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

  test('submit for empty submitted state', async () => {
    render(<StatisticsFormWithContext context={context_en} />)

    const courseMemo = screen.getByLabelText(/course memo/i)
    const courseAnalysis = screen.getByLabelText(/course analysis/i)

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

  test('check or select all inputs for course analysis', async () => {
    render(<StatisticsFormWithContext context={context_en} />)

    const courseanalysis = screen.getByLabelText(/course analysis/i)

    await userEvent.click(courseanalysis)
    expect(courseanalysis).toBeChecked()

    await userEvent.click(screen.getByLabelText(/EECS/i))
    expect(screen.getByLabelText(/EECS/i)).toBeChecked()

    await userEvent.selectOptions(screen.getByRole('combobox', { name: /Select year/i }), '2019')

    await userEvent.click(screen.getByLabelText(/spring/i))
    expect(screen.getByLabelText(/spring/i)).toBeChecked()
    expect(screen.getByLabelText(/autumn/i)).not.toBeChecked()

    const btn = screen.getByRole('button', { name: /show statistics/i })
    await userEvent.click(btn)

    expect(submittedResults).toMatchInlineSnapshot(`
      {
        "documentType": "courseAnalysis",
        "school": "EECS",
        "semester": "1",
        "year": 2019,
      }
    `)

    // change school and year
    await userEvent.click(screen.getByLabelText(/itm/i))
    expect(screen.getByLabelText(/itm/i)).toBeChecked()

    await userEvent.selectOptions(screen.getByRole('combobox', { name: /Select year/i }), '2020')

    await userEvent.click(screen.getByLabelText(/autumn/i))
    expect(screen.getByLabelText(/autumn/i)).toBeChecked()
    expect(screen.getByLabelText(/spring/i)).not.toBeChecked()

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
