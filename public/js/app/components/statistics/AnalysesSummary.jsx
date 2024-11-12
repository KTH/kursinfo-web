import React from 'react'

import { Col, Row } from 'reactstrap'

import { useStatisticsAsync } from '../../hooks/statisticsUseAsync'
import { useLanguage } from '../../hooks/useLanguage'
import { TableSummary } from './TableSummaryRows'
import { seasons as seasonLib } from './domain/index'
import { Charts } from './Chart'
import { Results, StatisticsAlert } from './index'

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

function Captions({ school, year, semester }) {
  const {
    languageIndex,
    translation: {
      statisticsLabels,
      statisticsLabels: {
        formLabels: { formSubHeaders },
      },
    },
  } = useLanguage()

  function getSchoolName(schoolName) {
    if (schoolName === 'allSchools') return statisticsLabels[schoolName]
    return schoolName
  }

  const semesterStr = seasonLib.labelSeason(semester, languageIndex)
  return (
    <Row>
      <Col xs="4" style={{ flex: 'none', width: 'auto', paddingBottom: '20px' }}>
        <label>{formSubHeaders.school}</label>
        {`: ${getSchoolName(school)}`}
      </Col>
      <Col xs="4" style={{ flex: 'none', width: 'auto', paddingBottom: '20px' }}>
        <label>{formSubHeaders.year}</label>
        {`: ${year}`}
      </Col>
      <Col xs="4" style={{ flex: 'none', width: 'auto', paddingBottom: '20px' }}>
        <label>{formSubHeaders.semester}</label>
        {`: ${semesterStr}`}
      </Col>
    </Row>
  )
}

function AnalysesNumbersTable({ statisticsResult }) {
  const { translation } = useLanguage()
  const { analysesNumbersTable } = translation.statisticsLabels.summaryLabels
  const { combinedAnalysesPerSchool, year, semester, school } = statisticsResult
  const cellNames = ['totalCourses', 'totalUniqPublishedAnalyses']

  return (
    <>
      <Captions school={school} year={year} semester={semester} />

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
  const { combinedAnalysesPerSchool: docsPerSchool, semester, year, school } = statisticsResult
  const { schools = {} } = docsPerSchool
  if (school === 'allSchools') {
    schools.allSchools = addAllSchoolsData(docsPerSchool)
  }

  return (
    <>
      <Captions school={school} year={year} semester={semester} />

      <Charts chartNames={chartNames} schools={schools} />
    </>
  )
}
function AnalysesNumbersChartsYearAgo({ statisticsResult }) {
  const { school, documentType, semester, year } = statisticsResult

  const oneYearAgo = Number(year) - 1

  const state = useStatisticsAsync({ semester, year: oneYearAgo, documentType, school }, 'once')

  const { data: statisticsResultYearAgo, status: statisticsStatus, error = {} } = state || {}

  return (
    <>
      {error?.errorType && <StatisticsAlert alertType={error.errorType}>{error.errorExtraText}</StatisticsAlert>}
      <Results statisticsStatus={statisticsStatus} error={error}>
        <AnalysesNumbersCharts statisticsResult={statisticsResultYearAgo} />
      </Results>
    </>
  )
}

function AnalysesSummary({ statisticsResult }) {
  const { translation } = useLanguage()
  const { chartsLabels: labels } = translation.statisticsLabels
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
