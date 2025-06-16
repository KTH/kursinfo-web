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
jest.setTimeout(30000)
const language_sv = 'sv'

const context_sv = {
  language: language_sv,
  languageIndex: language_sv === 'en' ? 0 : 1,
}
const memos2021 = {
  combinedMemosPerSchool: {
    schools: {
      ABE: {
        numberOfCourses: 303,
        numberOfUniqWebAndPdfMemos: 34,
        numberOfUniqWebMemos: 30,
        numberOfUniqPdfMemos: 4,
        numberOfMemosPublishedBeforeStart: 28,
        numberOfMemosPublishedBeforeDeadline: 9,
      },
      EECS: {
        numberOfCourses: 550,
        numberOfUniqWebAndPdfMemos: 67,
        numberOfUniqWebMemos: 57,
        numberOfUniqPdfMemos: 10,
        numberOfMemosPublishedBeforeStart: 21,
        numberOfMemosPublishedBeforeDeadline: 3,
      },
      ITM: {
        numberOfCourses: 87,
        numberOfUniqWebAndPdfMemos: 54,
        numberOfUniqWebMemos: 46,
        numberOfUniqPdfMemos: 8,
        numberOfMemosPublishedBeforeStart: 19,
        numberOfMemosPublishedBeforeDeadline: 18,
      },
      CBH: {
        numberOfCourses: 34,
        numberOfUniqWebAndPdfMemos: 23,
        numberOfUniqWebMemos: 21,
        numberOfUniqPdfMemos: 2,
        numberOfMemosPublishedBeforeStart: 3,
        numberOfMemosPublishedBeforeDeadline: 3,
      },
      SCI: {
        numberOfCourses: 34,
        numberOfUniqWebAndPdfMemos: 56,
        numberOfUniqWebMemos: 54,
        numberOfUniqPdfMemos: 26,
        numberOfMemosPublishedBeforeStart: 4,
        numberOfMemosPublishedBeforeDeadline: 3,
      },
    },
    totalCourses: 1008,
    totalNumberOfWebMemos: 208,
    totalNumberOfPdfMemos: 15,
    totalNumberOfMemosPublishedBeforeStart: 75,
    totalNumberOfMemosPublishedBeforeDeadline: 36,
  },
  documentType: 'courseMemo',
  koppsApiBasePath: 'https://api-r.referens.sys.kth.se/api/kopps/v2/',
  documentsApiBasePath: 'http://localhost/api/kurs-pm-data',
  school: 'allSchools',
  periods: ['0', '1', '2', '3', '4', '5'],
  seasons: ['1', '2'],
  semesters: ['20211', '20212'],
  year: '2021',
}

const memos2020 = {
  combinedMemosPerSchool: {
    schools: {
      ABE: {
        numberOfCourses: 602,
        numberOfUniqWebAndPdfMemos: 31,
        numberOfUniqWebMemos: 27,
        numberOfUniqPdfMemos: 4,
        numberOfMemosPublishedBeforeStart: 18,
        numberOfMemosPublishedBeforeDeadline: 16,
      },
      EECS: {
        numberOfCourses: 702,
        numberOfUniqWebAndPdfMemos: 20,
        numberOfUniqWebMemos: 16,
        numberOfUniqPdfMemos: 4,
        numberOfMemosPublishedBeforeStart: 11,
        numberOfMemosPublishedBeforeDeadline: 11,
      },
      ITM: {
        numberOfCourses: 718,
        numberOfUniqWebAndPdfMemos: 19,
        numberOfUniqWebMemos: 18,
        numberOfUniqPdfMemos: 1,
        numberOfMemosPublishedBeforeStart: 9,
        numberOfMemosPublishedBeforeDeadline: 8,
      },
      CBH: {
        numberOfCourses: 634,
        numberOfUniqWebAndPdfMemos: 15,
        numberOfUniqWebMemos: 13,
        numberOfUniqPdfMemos: 2,
        numberOfMemosPublishedBeforeStart: 4,
        numberOfMemosPublishedBeforeDeadline: 4,
      },
      SCI: {
        numberOfCourses: 595,
        numberOfUniqWebAndPdfMemos: 21,
        numberOfUniqWebMemos: 17,
        numberOfUniqPdfMemos: 4,
        numberOfMemosPublishedBeforeStart: 7,
        numberOfMemosPublishedBeforeDeadline: 6,
      },
    },
    totalCourses: 3251,
    totalNumberOfWebMemos: 91,
    totalNumberOfPdfMemos: 15,
    totalNumberOfMemosPublishedBeforeStart: 49,
    totalNumberOfMemosPublishedBeforeDeadline: 45,
  },
  documentType: 'courseMemo',
  koppsApiBasePath: 'https://api-r.referens.sys.kth.se/api/kopps/v2/',
  documentsApiBasePath: 'http://localhost/api/kurs-pm-data',
  school: 'allSchools',
  periods: ['0', '1', '2', '3', '4', '5'],
  seasons: ['1', '2'],
  semesters: ['20201', '20202'],
  year: '2020',
}

function CourseStatisticsPageWithContext({ context }) {
  return (
    <WebContextProvider configIn={context}>
      <CourseStatisticsPage />
    </WebContextProvider>
  )
}

describe('Component <CourseStatisticsPage> show compilation data in for memos', () => {
  test('choose all parameters and check compilation table for chosen and check extracting of data for previous years', async () => {
    axios.get.mockResolvedValue({ data: memos2021 })

    render(<CourseStatisticsPageWithContext context={context_sv} />)
    const courseMemo = screen.getByLabelText(/kurs-pm/i)
    await userEvent.click(courseMemo)
    await userEvent.click(screen.getByLabelText(/Alla skolor/i))
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /välj år/i }), '2021')

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
    const url = 'node/api/kursinfo/statistics/courseMemo/year/2021'
    const paramsPeriod1 = { params: { l: 'sv', periods: [0, 1, 2, 3, 4, 5], school: 'allSchools', seasons: [1, 2] } }
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get).toHaveBeenCalledWith(url, paramsPeriod1)
    expect(
      screen.getByRole('heading', {
        name: /sammanställning av antalet publicerade kurs-pm/i,
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        name: /andel kurser som har publicerade kurs-pm/i,
      })
    ).toBeInTheDocument()
    const periodsLabel = /Sommar, 1 HT, 2 HT, 3 VT, 4 VT/i
    expect(screen.getAllByText(periodsLabel).length).toBe(2)
    expect(screen.getAllByText(/2021/i).length).toBe(3)
    expect(screen.getAllByText(/2020/i).length).toBe(1)

    const compilationTables = screen.getAllByRole('table')
    const [compilationTable] = compilationTables
    expect(compilationTable).toBeInTheDocument()
    const columnheaderNames = within(compilationTable)
      .getAllByRole('columnheader')
      .map(th => th.textContent)

    expect(columnheaderNames).toMatchInlineSnapshot(`
      [
        "Skola",
        "Antal kurser",
        "Totalt antal publicerade kurs-PM",
        "Kurs-PM som webbsida",
        "Kurs-PM som PDF",
        "Kurs-PM publicerade  senast vid kursstart",
        "Kurs-PM publicerade en vecka före kursstart",
      ]
    `)

    const table = within(compilationTable)

    expect(table.getByRole('row', { name: /ABE 303 34 30 4 28 9/ })).toBeInTheDocument()
    expect(table.getByRole('row', { name: /ITM 87 54 46 8 19 18/ })).toBeInTheDocument()
    expect(table.getByRole('row', { name: /CBH 34 23 21 2 3 3/ })).toBeInTheDocument()
    expect(table.getByRole('row', { name: /EECS 550 67 57 10 21 3/ })).toBeInTheDocument()
    expect(table.getByRole('row', { name: /SCI 34 56 54 26 4 3/ })).toBeInTheDocument()
    expect(table.getByRole('row', { name: /Total 1008 223 208 15 75 36/ })).toBeInTheDocument()

    const numberOfRows = table.getAllByRole('row').length
    expect(numberOfRows).toBe(7)
    const numberOfColumns = columnheaderNames.length
    const firstColumnContent = table
      .getAllByRole('cell')
      .filter((_, index) => index % numberOfColumns === 0)
      .map(row => row.textContent)
    expect(firstColumnContent).toMatchInlineSnapshot(`
      [
        "ABE",
        "CBH",
        "EECS",
        "ITM",
        "SCI",
        "Total",
      ]
    `)

    // Compare to previous year and get error
    axios.get.mockRejectedValue({ data: [] })

    const btnCompare = screen.getByText(/jämför med resultatet för vald läsperiod från föregående år/i)
    await userEvent.click(btnCompare)

    const rejectMsg = /Ett okänt fel inträffade - misslyckad hämtning av kursdata./i
    const [alertMemoMessage1] = await screen.findAllByText(rejectMsg)

    expect(alertMemoMessage1).toBeVisible()

    // Compare to previous year again and get positive resut
    axios.get.mockResolvedValue({ data: memos2020 })

    await userEvent.click(btnCompare)

    const params2020 = { ...paramsPeriod1 }
    const url2020 = 'node/api/kursinfo/statistics/courseMemo/year/2020'
    expect(axios.get).toHaveBeenCalledTimes(2)
    expect(axios.get).toHaveBeenCalledWith(url2020, params2020)
    jest.resetAllMocks()
  })
})
