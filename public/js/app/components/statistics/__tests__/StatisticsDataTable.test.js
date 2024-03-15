import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { userEvent } from '@testing-library/user-event'
import { WebContextProvider } from '../../../context/WebContext'
import StatisticsDataTable from '../StatisticsDataTable'

const statisticsResultForMemo = {
  year: 2019,
  periods: ['1'],
  offeringsWithMemos: [
    {
      endDate: '2020-01-14',
      firstSemester: '20192',
      startDate: '2019-08-26',
      schoolMainCode: 'ABE',
      departmentName: 'ABE/CDE, Gru 1-2-3',
      connectedPrograms: 'ARKIT-3',
      courseCode: 'A31REA',
      period: 'P1',
      courseMemoInfo: {
        courseCode: 'A31REA',
        courseMemoFileName: 'memo-123-3456.pdf',
        applicationCodes: ['1'],
        semester: '20192',
        isPdf: true,
        lastChangeDate: 'Wed Dec 04 2019 22:36:39 GMT+0000 (Coordinated Universal Time)',
        publishedData: {
          offeringStartTime: '2019-08-26',
          publishedTime: '2019-12-04',
          publishedBeforeStart: false,
          publishedBeforeDeadline: false,
        },
      },
    },
  ],
}

const statisticsResultForAnalysis = {
  year: 2019,
  seasons: ['1'],
  offeringsWithAnalyses: [
    {
      endDate: '2020-01-14',
      firstSemester: '20192',
      startDate: '2019-08-26',
      schoolMainCode: 'ABE',
      departmentName: 'ABE/CDE, Gru 1-2-3',
      connectedPrograms: 'ARKIT-3',
      courseCode: 'A31REA',
      period: 'P1',
      courseAnalysisInfo: {
        courseCode: 'A31REA',
        analysisFileName: 'analysis-123-3456.pdf',
        applicationCodes: ['1'],
        semester: '20192',
        isPublished: true,
        lastChangeDate: 'Wed Dec 04 2019 22:36:39 GMT+0000 (Coordinated Universal Time)',
        publishedDate: '2019-12-04',
      },
    },
  ],
}
const language_en = 'en'

const context_en = {
  language: language_en,
  languageIndex: language_en === 'en' ? 0 : 1,
  browserConfig: {
    hostUrl: 'http://localhost:3000',
  },
}

function StatisticsDataTableWithContext({ context, statisticsResult }) {
  return (
    <WebContextProvider configIn={context}>
      <StatisticsDataTable statisticsResult={statisticsResult} />
    </WebContextProvider>
  )
}

function StatisticsDataTableWithContextWithOutData({ context }) {
  return (
    <WebContextProvider configIn={context}>
      <StatisticsDataTable statisticsResult={{}} />
    </WebContextProvider>
  )
}

describe('Component <StatisticsDataTable> in english', () => {
  test('Renders empty table for statistics page', () => {
    render(<StatisticsDataTableWithContextWithOutData context={context_en} />)
    expect(screen.getByText('No statistics data found!')).toBeInTheDocument()
  })

  test('Renders a table for a statistics page for course memo', async () => {
    render(<StatisticsDataTableWithContext context={context_en} statisticsResult={statisticsResultForMemo} />)
    expect(screen.getByText('A31REA')).toBeInTheDocument()
    expect(screen.getByText('CDE, Gru 1-2-3')).toBeInTheDocument()
    expect(screen.getByText('memo-123-3456.pdf')).toBeInTheDocument()
    expect(screen.getByText('ABE')).toBeInTheDocument()
    expect(screen.getByText('26 Aug 2019')).toBeInTheDocument()
    const csvDownloadButton = screen.getByRole('button', { name: /Download table as csv file/i })
    expect(csvDownloadButton).toBeInTheDocument()
    await userEvent.click(csvDownloadButton)
    const excelDownloadButton = screen.getByRole('button', { name: /Download table as excel file/i })
    expect(excelDownloadButton).toBeInTheDocument()
    await userEvent.click(excelDownloadButton)
  })

  test('Renders a table for a statistics page for course analysis', async () => {
    render(<StatisticsDataTableWithContext context={context_en} statisticsResult={statisticsResultForAnalysis} />)
    expect(screen.getByText('A31REA')).toBeInTheDocument()
    expect(screen.getByText('CDE, Gru 1-2-3')).toBeInTheDocument()
    expect(screen.getByText('analysis-123-3456.pdf')).toBeInTheDocument()
    expect(screen.getByText('ABE')).toBeInTheDocument()
    expect(screen.getByText('14 Jan 2020')).toBeInTheDocument()
    const csvDownloadButton = screen.getByRole('button', { name: /Download table as csv file/i })
    expect(csvDownloadButton).toBeInTheDocument()
    await userEvent.click(csvDownloadButton)
    const excelDownloadButton = screen.getByRole('button', { name: /Download table as excel file/i })
    expect(excelDownloadButton).toBeInTheDocument()
    await userEvent.click(excelDownloadButton)
  })
})
