import React from 'react'

import { Col, Row } from 'reactstrap'
import { useWebContext } from '../../context/WebContext'
import { useStatisticsAsync } from '../../hooks/statisticsUseAsync'
import { useLanguage } from '../../hooks/useLanguage'
import { TableSummary } from './TableSummaryRows'
import { Charts } from './Chart'
import { periods as periodsLib } from './domain/index'
import { Results, StatisticsAlert } from './index'

function getSchoolNumbers(school = {}) {
  return [
    school.numberOfCourses,
    school.numberOfUniqWebAndPdfMemos,
    school.numberOfUniqWebMemos,
    school.numberOfUniqPdfMemos,
    school.numberOfMemosPublishedBeforeStart,
    school.numberOfMemosPublishedBeforeDeadline,
  ]
}

function getFootTotalNumbers(totals) {
  return [
    totals.totalCourses,
    Math.abs(totals.totalNumberOfWebMemos) + Math.abs(totals.totalNumberOfPdfMemos),
    totals.totalNumberOfWebMemos,
    totals.totalNumberOfPdfMemos,
    totals.totalNumberOfMemosPublishedBeforeStart,
    totals.totalNumberOfMemosPublishedBeforeDeadline,
  ]
}

function getCellNames() {
  return [
    'totalCourses',
    'totalPublishedMemos',
    'totalPublWebMemos',
    'totalPublPdfMemos',
    'totalMemosPublishedBeforeCourseStart',
    'totalMemosPublishedBeforeDeadline',
  ]
}

function addAllSchoolsData({
  totalCourses,
  totalNumberOfMemosPublishedBeforeDeadline,
  totalNumberOfMemosPublishedBeforeStart,
  totalNumberOfPdfMemos,
  totalNumberOfWebMemos,
}) {
  const allSchools = {}
  allSchools.numberOfCourses = totalCourses
  allSchools.numberOfMemosPublishedBeforeDeadline = totalNumberOfMemosPublishedBeforeDeadline
  allSchools.numberOfMemosPublishedBeforeStart = totalNumberOfMemosPublishedBeforeStart
  allSchools.numberOfUniqWebAndPdfMemos = totalNumberOfPdfMemos + totalNumberOfWebMemos

  return allSchools
}

function Captions({ school, year, periods }) {
  const {
    translation: {
      statisticsLabels,
      statisticsLabels: {
        formLabels: { formSubHeaders },
      },
    },
    languageIndex,
  } = useLanguage()

  function getSchoolName(schoolName) {
    if (schoolName === 'allSchools') return statisticsLabels[schoolName]
    return schoolName
  }

  const periodsLabels = periods.map(period => periodsLib.labelPeriod(period, languageIndex, false))
  const uniqquePeriodsLabels = [...new Set(periodsLabels)]
  const periodsStr = uniqquePeriodsLabels.join(', ')
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
        <label>{formSubHeaders.periods}</label>
        {`: ${periodsStr}`}
      </Col>
    </Row>
  )
}

function MemosNumbersTable({ statisticsResult }) {
  const {
    translation: {
      statisticsLabels: { summaryLabels },
    },
  } = useLanguage()
  const { memosNumbersTable } = summaryLabels
  const { combinedMemosPerSchool, year, periods, school } = statisticsResult
  const cellNames = getCellNames()

  return (
    <>
      <Captions school={school} year={year} periods={periods} />

      <TableSummary
        docsPerSchool={combinedMemosPerSchool}
        cellNames={cellNames}
        getNumbersFn={getSchoolNumbers}
        labels={memosNumbersTable}
        totalNumbers={getFootTotalNumbers(combinedMemosPerSchool)}
      />
    </>
  )
}

function MemosNumbersCharts({ statisticsResult }) {
  const chartNames = [
    'numberOfUniqWebAndPdfMemos',
    'numberOfMemosPublishedBeforeStart',
    'numberOfMemosPublishedBeforeDeadline',
  ]
  const { combinedMemosPerSchool: docsPerSchool, periods, year, school } = statisticsResult
  const { schools = {} } = docsPerSchool
  const { languageIndex } = useWebContext()
  if (school === 'allSchools') {
    schools.allSchools = addAllSchoolsData(docsPerSchool)
  }

  return (
    <>
      <Captions school={school} year={year} periods={periods} languageIndex={languageIndex} />

      <Charts chartNames={chartNames} schools={schools} languageIndex={languageIndex} />
    </>
  )
}

function MemosNumbersChartsYearAgo({ statisticsResult }) {
  const { school, documentType, periods, year } = statisticsResult

  const oneYearAgo = Number(year) - 1

  const state = useStatisticsAsync({ periods, year: oneYearAgo, documentType, school }, 'once')

  const { data: statisticsResultYearAgo, status: statisticsStatus, error = {} } = state || {}

  return (
    <>
      {error?.errorType && <StatisticsAlert alertType={error.errorType}>{error.errorExtraText}</StatisticsAlert>}

      <Results statisticsStatus={statisticsStatus} error={error}>
        <MemosNumbersCharts statisticsResult={statisticsResultYearAgo} />
      </Results>
    </>
  )
}

function MemosSummary({ statisticsResult }) {
  const {
    translation: {
      statisticsLabels: { chartsLabels: labels },
    },
  } = useLanguage()
  const [isOpen, setOpen] = React.useState(false)

  return (
    <>
      <MemosNumbersTable statisticsResult={statisticsResult} />
      <h3>{labels.headerMemo}</h3>
      <MemosNumbersCharts statisticsResult={statisticsResult} />
      <details open={isOpen} onToggle={() => setOpen(!isOpen)}>
        <summary className="white"> {labels.headerYearAgo}</summary>
        {isOpen && <MemosNumbersChartsYearAgo statisticsResult={statisticsResult} />}
      </details>
    </>
  )
}

export default MemosSummary
