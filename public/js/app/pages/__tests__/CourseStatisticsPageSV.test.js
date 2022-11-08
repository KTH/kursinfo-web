import React from 'react'
import { render, screen, within } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'

import axios from 'axios'
import { WebContextProvider } from '../../context/WebContext'

import CourseStatisticsPage from '../CourseStatisticsPage'

jest.mock('axios', () => ({
  get: jest.fn(),
}))
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
    const courseAnalysis = screen.getByLabelText(/kursanalys/i)
    expect(courseAnalysis).toBeInTheDocument()

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

    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes.length).toBe(5)

    const combobox = screen.getAllByRole('combobox')
    expect(combobox.length).toBe(1)
  })
})

describe('Component <CourseStatisticsPage> submit data', () => {
  test('submit empty form without choosing anything', async () => {
    render(<CourseStatisticsPageWithContext context={context_sv} />)
    const btn = screen.getByRole('button', { name: /visa statistik/i })
    await userEvent.click(btn)
    expect(axios.get).toHaveBeenCalledTimes(0)
  })

  test('choose between document types and submit the rest of the form empty', async () => {
    render(<CourseStatisticsPageWithContext context={context_sv} />)

    const courseMemo = screen.getByLabelText(/kurs-pm/i)
    await userEvent.click(courseMemo)

    const btn = screen.getByRole('button', { name: /visa statistik/i })
    await userEvent.click(btn)

    // show alert message without calling axios
    expect(axios.get).toHaveBeenCalledTimes(0)
    const alertMemoMessage = screen.getByRole('alert')
    const errorMessage = /det finns frågebegränsning som inte angavs/i
    const emptyMemoFieldsNames = /skola, år, läsperiod/i

    expect(alertMemoMessage).toBeInTheDocument()
    expect(within(alertMemoMessage).getByText(errorMessage)).toBeInTheDocument()
    expect(within(alertMemoMessage).getByText(emptyMemoFieldsNames)).toBeInTheDocument()

    expect(screen.getAllByText(errorMessage, { exact: true }).length).toBe(2)
    expect(screen.getAllByText(emptyMemoFieldsNames, { exact: true }).length).toBe(2)

    // choose course analysis
    const courseAnalysis = screen.getByLabelText(/kursanalys/i)
    await userEvent.click(courseAnalysis)
    // submit
    await userEvent.click(btn)

    const emptyAnalysisFieldsNames = /skola, år, termin/i
    const alertnalysisMemoMessage = screen.getByRole('alert')
    expect(alertnalysisMemoMessage).toBeInTheDocument()
    expect(within(alertnalysisMemoMessage).getByText(errorMessage)).toBeInTheDocument()
    expect(within(alertnalysisMemoMessage).getByText(emptyAnalysisFieldsNames)).toBeInTheDocument()

    expect(screen.getAllByText(errorMessage, { exact: true }).length).toBe(2)
    expect(screen.getAllByText(emptyAnalysisFieldsNames, { exact: true }).length).toBe(2)
  })

  test('choose a course memo, chose/unchoose different periods (läsperiod) and submit the rest of the form empty', async () => {
    render(<CourseStatisticsPageWithContext context={context_sv} />)

    const courseMemo = screen.getByLabelText(/kurs-pm/i)
    await userEvent.click(courseMemo)
    // check period 1
    const periodOneCheckbox = screen.getByLabelText(/period 1, HT/i)

    await userEvent.click(periodOneCheckbox)
    expect(periodOneCheckbox).toBeChecked()

    const btn = screen.getByRole('button', { name: /visa statistik/i })
    await userEvent.click(btn)

    // show alert message without calling axios
    expect(axios.get).toHaveBeenCalledTimes(0)
    const alertMemoMessage1 = screen.getByRole('alert')
    const errorMessage = /det finns frågebegränsning som inte angavs/i

    expect(alertMemoMessage1).toBeInTheDocument()
    expect(within(alertMemoMessage1).getByText(errorMessage)).toBeInTheDocument()
    expect(within(alertMemoMessage1).getByText(/skola, år/i)).toBeInTheDocument()

    // uncheck period 1
    await userEvent.click(periodOneCheckbox)
    expect(periodOneCheckbox).not.toBeChecked()
    await userEvent.click(btn)

    const alertMemoMessage2 = screen.getByRole('alert')
    expect(within(alertMemoMessage2).getByText(/skola, år, läsperiod/i)).toBeInTheDocument()

    // Summer period
    const periodSummerCheckbox = screen.getByLabelText(/sommar/i)

    await userEvent.click(periodSummerCheckbox)
    expect(periodSummerCheckbox).toBeChecked()

    await userEvent.click(btn)

    // show alert message without calling axios
    expect(axios.get).toHaveBeenCalledTimes(0)
    const alertMemoMessage3 = screen.getByRole('alert')

    expect(alertMemoMessage3).toBeInTheDocument()
    expect(within(alertMemoMessage3).getByText(errorMessage)).toBeInTheDocument()
    expect(within(alertMemoMessage3).getByText(/skola, år/i)).toBeInTheDocument()

    // uncheck period summer
    await userEvent.click(periodSummerCheckbox)
    expect(periodSummerCheckbox).not.toBeChecked()
    await userEvent.click(btn)

    const alertMemoMessage4 = screen.getByRole('alert')
    expect(within(alertMemoMessage4).getByText(/skola, år, läsperiod/i)).toBeInTheDocument()
  })

  test('choose all parameters, chose/unchoose different periods (läsperiod) and check clean up of periods query', async () => {
    // axios.get.mockReturnValue({ data: {} })
    axios.get.mockRejectedValue({ data: {} })

    render(<CourseStatisticsPageWithContext context={context_sv} />)
    const courseMemo = screen.getByLabelText(/kurs-pm/i)
    await userEvent.click(courseMemo)
    await userEvent.click(screen.getByLabelText(/SCI/i))
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /välj år/i }), '2020')

    // check all checkboxes
    const periodOneCheckbox = screen.getByLabelText(/period 1, HT/i)
    const periodTwoCheckbox = screen.getByLabelText(/period 2, HT/i)
    const periodThreeCheckbox = screen.getByLabelText(/period 3, VT/i)
    const periodFourCheckbox = screen.getByLabelText(/period 4, VT/i)

    const periodSummerCheckbox = screen.getByLabelText(/sommar/i)
    await userEvent.click(periodOneCheckbox)
    await userEvent.click(periodTwoCheckbox)
    await userEvent.click(periodThreeCheckbox)
    await userEvent.click(periodFourCheckbox)
    await userEvent.click(periodSummerCheckbox)

    expect(periodOneCheckbox).toBeChecked()
    expect(periodSummerCheckbox).toBeChecked()

    const btn = screen.getByRole('button', { name: /visa statistik/i })
    await userEvent.click(btn)
    const url = 'node/api/kursinfo/statistics/courseMemo/year/2020'
    const paramsPeriod1 = { params: { l: 'sv', periods: [1, 2, 3, 4, 0, 5], school: 'SCI', seasons: [1, 2] } }
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get).toHaveBeenCalledWith(url, paramsPeriod1)
    const rejectMsg = /Ett okänt fel inträffade - misslyckad hämtning av kursdata./i
    const alertMemoMessage1 = screen.getByRole('alert')

    expect(alertMemoMessage1).toBeInTheDocument()
    expect(within(alertMemoMessage1).getByText(rejectMsg)).toBeInTheDocument()

    // uncheck ALL periods, show alert about no chosen period
    await userEvent.click(periodOneCheckbox)
    await userEvent.click(periodTwoCheckbox)
    await userEvent.click(periodThreeCheckbox)
    await userEvent.click(periodFourCheckbox)
    await userEvent.click(periodSummerCheckbox)

    expect(periodOneCheckbox).not.toBeChecked()
    expect(periodSummerCheckbox).not.toBeChecked()
    await userEvent.click(btn)

    const errorMessage = /det finns frågebegränsning som inte angavs/i
    const alertMemoMessage2 = screen.getByRole('alert')
    expect(within(alertMemoMessage2).getByText(errorMessage)).toBeInTheDocument()
    expect(within(alertMemoMessage2).getByText(/läsperiod/i)).toBeInTheDocument()
  })
})
