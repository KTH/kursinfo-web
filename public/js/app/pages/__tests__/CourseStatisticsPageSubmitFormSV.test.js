import React from 'react'
import { render, screen, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import { userEvent } from '@testing-library/user-event'

import axios from 'axios'
import { WebContextProvider } from '../../context/WebContext'

import CourseStatisticsPage from '../CourseStatisticsPage'

jest.mock('axios', () => ({
  get: jest.fn(),
}))

const context_sv = {
  lang: 'sv',
}

function CourseStatisticsPageWithContext({ context }) {
  return (
    <WebContextProvider configIn={context}>
      <CourseStatisticsPage />
    </WebContextProvider>
  )
}

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
    const emptyMemoFieldsNamesMessage = /Du måste välja skola, år och läsperiod för att kunna visa statistik/i
    expect(within(alertMemoMessage).getByText(emptyMemoFieldsNamesMessage)).toBeInTheDocument()

    expect(screen.getAllByText(emptyMemoFieldsNamesMessage, { exact: true }).length).toBe(1)
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
    const errorMessage = /Du måste välja skola och år för att kunna visa statistik/i

    expect(alertMemoMessage1).toBeInTheDocument()
    expect(within(alertMemoMessage1).getByText(errorMessage)).toBeInTheDocument()

    // uncheck period 1
    await userEvent.click(periodOneCheckbox)
    expect(periodOneCheckbox).not.toBeChecked()
    await userEvent.click(btn)

    const alertMemoMessage2 = screen.getByRole('alert')
    expect(within(alertMemoMessage2).getByText(/skola, år och läsperiod/i)).toBeInTheDocument()

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
    expect(within(alertMemoMessage3).getByText(/skola och år/i)).toBeInTheDocument()

    // uncheck period summer
    await userEvent.click(periodSummerCheckbox)
    expect(periodSummerCheckbox).not.toBeChecked()
    await userEvent.click(btn)

    const alertMemoMessage4 = screen.getByRole('alert')
    expect(within(alertMemoMessage4).getByText(/skola, år och läsperiod/i)).toBeInTheDocument()
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
    const paramsPeriod1 = { params: { l: 'sv', periods: [0, 1, 2, 3, 4, 5], school: 'SCI', seasons: [1, 2] } }
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get).toHaveBeenCalledWith(url, paramsPeriod1)
    const rejectMsg = /Ett okänt fel inträffade - misslyckad hämtning av kursdata./i
    const alertMemoMessage1 = await screen.findByRole('alert')

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

    const errorMessage = /Du måste välja läsperiod för att kunna visa statistik/i
    const alertMemoMessage2 = screen.getByRole('alert')
    expect(within(alertMemoMessage2).getByText(errorMessage)).toBeInTheDocument()
  })
})
