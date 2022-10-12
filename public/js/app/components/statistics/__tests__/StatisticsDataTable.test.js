import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import { WebContextProvider } from '../../../context/WebContext'
import StatisticsDataTable from '../StatisticsDataTable'

const data = [
  {
    year: '2022',
    school: 'IT',
    institution: 'Energiteknik',
    courseCode: 'SF1624',
    linkedProgram: 'CDEPR-2, CINEK-EHUI-2, CITEH-2',
    courseRoundNumber: '1',
    semester: '4',
    courseStart: '2022-03-21',
    publishDate: '2022-01-10',
    linkToCourse: null,
  },
]
const language_en = 'en'

const context_en = {
  language: language_en,
  languageIndex: language_en === 'en' ? 0 : 1,
}

function StatisticsDataTableWithContext({ context }) {
  return (
    <WebContextProvider configIn={context}>
      <StatisticsDataTable data={data} />
    </WebContextProvider>
  )
}

function StatisticsDataTableWithContextWithOutData({ context }) {
  return (
    <WebContextProvider configIn={context}>
      <StatisticsDataTable data={[]} />
    </WebContextProvider>
  )
}

describe('Component <StatisticsDataTable> in english', () => {
  test('Renders empty table for statistics page', () => {
    render(<StatisticsDataTableWithContextWithOutData context={context_en} />)
    expect(screen.getByText('No statistics data found!')).toBeInTheDocument()
  })

  test('renders a table for a statistics page', () => {
    render(<StatisticsDataTableWithContext context={context_en} />)
    expect(screen.getByText('Energiteknik')).toBeInTheDocument()
    expect(screen.getByText('SF1624')).toBeInTheDocument()
    expect(screen.getByText('CDEPR-2, CINEK-EHUI-2, CITEH-2')).toBeInTheDocument()
    expect(screen.getByText('2022-03-21')).toBeInTheDocument()
    expect(screen.getByText('2022-01-10')).toBeInTheDocument()
  })
})
