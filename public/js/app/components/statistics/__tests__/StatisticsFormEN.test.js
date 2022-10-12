import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import { WebContextProvider } from '../../../context/WebContext'
import StatisticsForm from '../StatisticsForm'

// import i18n from '../../../../../../i18n'

const language_en = 'en'
// const [translate] = i18n.messages // en

let submittedResults

const context_en = {
  language: language_en,
  languageIndex: language_en === 'en' ? 0 : 1,
}

function StatisticsFormWithContext({ context }) {
  return (
    <WebContextProvider configIn={context}>
      <StatisticsForm onSubmit={props => (submittedResults = props)} />
    </WebContextProvider>
  )
}
describe('Component <StatisticsForm> in english', () => {
  test('renders a form to choose parameters for a statistics page', () => {
    render(<StatisticsFormWithContext context={context_en} />)
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
          aria-label="Choose a year"
          class="form-control"
          id="year-select-year"
        >
          <option
            id="year"
            selected=""
            value="placeholder"
          >
            Choose a year
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

  test('renders switch between course memo and analyses and check for clean up state', async () => {
    render(<StatisticsFormWithContext context={context_en} />)

    const courseMemo = screen.getByLabelText(/course memo/i)
    const courseAnalysis = screen.getByLabelText(/course analysis/i)
    const btn = screen.getByRole('button', { name: /show statistics/i })

    await userEvent.click(courseMemo)
    expect(courseMemo).toBeChecked()

    expect(screen.getByRole('heading', { name: /study period/i })).toBeInTheDocument()

    expect(screen.queryByRole('heading', { name: /semester/i })).not.toBeInTheDocument()

    await userEvent.click(screen.getByLabelText(/period 1, autumn/i))
    await userEvent.click(screen.getByLabelText(/period 2, autumn/i))

    expect(screen.getByLabelText(/period 1, autumn/i)).toBeChecked()
    expect(screen.getByLabelText(/period 2, autumn/i)).toBeChecked()

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
    await userEvent.click(screen.getByLabelText(/summer/i))

    expect(screen.getByLabelText(/autumn/i)).toBeChecked()
    expect(screen.getByLabelText(/summer/i)).toBeChecked()

    await userEvent.click(btn)
    expect(submittedResults).toMatchInlineSnapshot(`
      {
        "documentType": "courseAnalysis",
        "periods": [],
        "school": undefined,
        "semesters": [
          2,
          0,
        ],
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
    expect(screen.getByLabelText(/summer/i)).not.toBeChecked()

    await userEvent.click(btn)
    expect(submittedResults).toMatchInlineSnapshot(`
      {
        "documentType": "courseAnalysis",
        "periods": [],
        "school": undefined,
        "semesters": [],
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

    await userEvent.selectOptions(screen.getByRole('combobox', { name: /choose a year/i }), '2020')

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
    await userEvent.click(screen.getByLabelText(/summer/i))

    expect(screen.getByLabelText(/autumn/i)).toBeChecked()
    expect(screen.getByLabelText(/summer/i)).toBeChecked()

    await userEvent.selectOptions(screen.getByRole('combobox', { name: /choose a year/i }), '2019')

    await userEvent.click(btn)
    expect(submittedResults).toMatchInlineSnapshot(`
      {
        "documentType": "courseAnalysis",
        "periods": [],
        "school": "SCI",
        "semesters": [
          2,
          0,
        ],
        "year": 2019,
      }
    `)

    // await userEvent.click(courseMemo)
    // expect(courseMemo).toBeChecked()

    // expect(screen.getByLabelText(/period 1, autumn/i)).not.toBeChecked()
    // expect(screen.getByLabelText(/period 2, autumn/i)).not.toBeChecked()

    // await userEvent.click(courseAnalysis)
    // expect(courseAnalysis).toBeChecked()

    // expect(screen.getByLabelText(/autumn/i)).not.toBeChecked()
    // expect(screen.getByLabelText(/summer/i)).not.toBeChecked()

    // await userEvent.click(btn)
    // expect(submittedResults).toMatchInlineSnapshot(`
    //   {
    //     "documentType": "courseAnalysis",
    //     "periods": [],
    //     "school": undefined,
    //     "semesters": [],
    //     "year": undefined,
    //   }
    // `)
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
        "semesters": [],
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

    await userEvent.selectOptions(screen.getByRole('combobox', { name: /choose a year/i }), '2019')

    await userEvent.click(screen.getByLabelText(/period 1, autumn/i))
    await userEvent.click(screen.getByLabelText(/period 2, autumn/i))

    expect(screen.getByLabelText(/period 1, autumn/i)).toBeChecked()
    expect(screen.getByLabelText(/period 2, autumn/i)).toBeChecked()

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

    await userEvent.selectOptions(screen.getByRole('combobox', { name: /choose a year/i }), '2021')

    await userEvent.click(screen.getByLabelText(/period 2, autumn/i))
    expect(screen.getByLabelText(/period 2, autumn/i)).not.toBeChecked()
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

  test('check or select all inputs for course analysis', async () => {
    render(<StatisticsFormWithContext context={context_en} />)

    const courseanalysis = screen.getByLabelText(/course analysis/i)

    await userEvent.click(courseanalysis)
    expect(courseanalysis).toBeChecked()

    await userEvent.click(screen.getByLabelText(/EECS/i))
    expect(screen.getByLabelText(/EECS/i)).toBeChecked()

    await userEvent.selectOptions(screen.getByRole('combobox', { name: /choose a year/i }), '2019')

    await userEvent.click(screen.getByLabelText(/spring/i))
    await userEvent.click(screen.getByLabelText(/summer/i))

    expect(screen.getByLabelText(/spring/i)).toBeChecked()
    expect(screen.getByLabelText(/summer/i)).toBeChecked()

    const btn = screen.getByRole('button', { name: /show statistics/i })
    await userEvent.click(btn)

    expect(submittedResults).toMatchInlineSnapshot(`
      {
        "documentType": "courseAnalysis",
        "school": "EECS",
        "semesters": [
          1,
          0,
        ],
        "year": 2019,
      }
    `)

    // change school and year
    await userEvent.click(screen.getByLabelText(/itm/i))
    expect(screen.getByLabelText(/itm/i)).toBeChecked()

    await userEvent.selectOptions(screen.getByRole('combobox', { name: /choose a year/i }), '2020')

    await userEvent.click(screen.getByLabelText(/autumn/i))
    expect(screen.getByLabelText(/autumn/i)).toBeChecked()

    await userEvent.click(btn)

    expect(submittedResults).toMatchInlineSnapshot(`
      {
        "documentType": "courseAnalysis",
        "school": "ITM",
        "semesters": [
          1,
          0,
          2,
        ],
        "year": 2020,
      }
    `)
  })
})