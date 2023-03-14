import React from 'react'

import { Col, Row } from 'reactstrap'

import i18n from '../../../../../i18n'
import { useStatisticsAsync } from '../../hooks/statisticsUseAsync'
import { useWebContext } from '../../context/WebContext'
import { TableSummary } from './TableSummaryRows'
import { seasons as seasonLib } from './domain/index'
import { Charts } from './Chart'
import { Results } from './index'

function getSchoolNumbers(school) {
  const { numberOfCourses, numberOfUniqAnalyses } = school
  return [numberOfCourses, numberOfUniqAnalyses]
}
function getFootTotalNumbers(totals) {
  return [totals.totalCourses, totals.totalUniqPublishedAnalyses]
}

function addAllSchoolsData({ totalCourses, totalUniqPublishedAnalyses }) {
  const allSchools = {}
  allSchools.numberOfCourses = totalCourses
  allSchools.numberOfUniqAnalyses = totalUniqPublishedAnalyses

  return allSchools
}

function Captions({ year, seasons, languageIndex }) {
  const { formLabels } = i18n.messages[languageIndex].statisticsLabels

  const seasonsStr = seasons.map(season => seasonLib.labelSeason(season, languageIndex)).join(', ')
  return (
    <Row>
      <Col xs="4" style={{ flex: 'none', width: 'auto', paddingBottom: '20px' }}>
        <label>{formLabels.formSubHeaders.year}</label>
        {`: ${year}`}
      </Col>
      <Col xs="4" style={{ flex: 'none', width: 'auto', paddingBottom: '20px' }}>
        <label>{formLabels.formSubHeaders.seasons}</label>
        {`: ${seasonsStr}`}
      </Col>
    </Row>
  )
}

function AnalysesNumbersTable({ statisticsResult }) {
  const [{ languageIndex }] = useWebContext()
  const { summaryLabels } = i18n.messages[languageIndex].statisticsLabels
  const { analysesNumbersTable } = summaryLabels
  const { combinedAnalysesPerSchool, year, seasons } = statisticsResult
  const cellNames = ['totalCourses', 'totalUniqPublishedAnalyses']

  return (
    <>
      <Captions year={year} seasons={seasons} languageIndex={languageIndex} />

      <TableSummary
        docsPerSchool={combinedAnalysesPerSchool}
        cellNames={cellNames}
        getNumbersFn={getSchoolNumbers}
        labels={analysesNumbersTable}
        totalNumbers={getFootTotalNumbers(combinedAnalysesPerSchool)}
      />
    </>
  )
}

function AnalysesNumbersCharts({ statisticsResult }) {
  const chartNames = ['numberOfUniqAnalyses']
  const { combinedAnalysesPerSchool: docsPerSchool, seasons, year, school } = statisticsResult
  const { schools = {} } = docsPerSchool
  const [{ languageIndex }] = useWebContext()
  if (school === 'allSchools') {
    schools.allSchools = addAllSchoolsData(docsPerSchool)
  }

  return (
    <>
      <Captions year={year} seasons={seasons} languageIndex={languageIndex} />

      <Charts chartNames={chartNames} schools={schools} languageIndex={languageIndex} />
    </>
  )
}
function AnalysesNumbersChartsYearAgo({ statisticsResult }) {
  const { school, documentType, seasons, year } = statisticsResult

  if (!documentType) return null
  const oneYearAgo = Number(year) - 1

  const state = useStatisticsAsync({ seasons, year: oneYearAgo, documentType, school }, 'once')

  const { data: statisticsResultYearAgo, status: statisticsStatus, error = {} } = state || {}

  return (
    <>
      <Results statisticsStatus={statisticsStatus} error={error}>
        <AnalysesNumbersCharts statisticsResult={statisticsResultYearAgo} />
      </Results>
    </>
  )
}

function AnalysesSummary({ statisticsResult }) {
  const [{ languageIndex }] = useWebContext()
  const { chartsLabels: labels } = i18n.messages[languageIndex].statisticsLabels
  const [isOpen, setOpen] = React.useState(false)

  return (
    <>
      <AnalysesNumbersTable statisticsResult={statisticsResult} />
      <h3>{labels.headerAnalysis}</h3>
      <AnalysesNumbersCharts statisticsResult={statisticsResult} />
      <details open={isOpen} onToggle={() => setOpen(!isOpen)}>
        <summary className="white"> {labels.headerYearAgo}</summary>
        {isOpen && <AnalysesNumbersChartsYearAgo statisticsResult={statisticsResult} />}
      </details>
    </>
  )
}

export default AnalysesSummary
