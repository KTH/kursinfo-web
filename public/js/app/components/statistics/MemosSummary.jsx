import React from 'react'

import { Col, Row } from 'reactstrap'
import { useWebContext } from '../../context/WebContext'
import i18n from '../../../../../i18n'
import { useStatisticsAsync } from '../../hooks/statisticsUseAsync'
import { TableSummary } from './TableSummaryRows'
import { Charts } from './Chart'
import { periods as periodsLib } from './domain/index'
import { Results } from './index'

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

function Captions({ year, periods, languageIndex }) {
  const { formLabels } = i18n.messages[languageIndex].statisticsLabels

  const periodsLabels = periods.map(period => periodsLib.labelPeriod(period, languageIndex, false))
  const uniqquePeriodsLabels = [...new Set(periodsLabels)]
  const periodsStr = uniqquePeriodsLabels.join(', ')
  return (
    <Row>
      <Col xs="2" style={{ flex: 'none', width: 'auto', paddingBottom: '20px' }}>
        <label>{formLabels.formSubHeaders.year}</label>
        {`: ${year}`}
      </Col>
      <Col xs="4" style={{ flex: 'none', width: 'auto', paddingBottom: '20px' }}>
        <label>{formLabels.formSubHeaders.periods}</label>
        {`: ${periodsStr}`}
      </Col>
    </Row>
  )
}

function MemosNumbersTable({ statisticsResult }) {
  const [{ languageIndex }] = useWebContext()
  const { summaryLabels } = i18n.messages[languageIndex].statisticsLabels
  const { memosNumbersTable } = summaryLabels
  const { combinedMemosPerSchool, year, periods } = statisticsResult
  const cellNames = getCellNames()

  return (
    <>
      <Captions year={year} periods={periods} languageIndex={languageIndex} />

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
  console.log(statisticsResult)
  const chartNames = [
    'numberOfUniqWebAndPdfMemos',
    'numberOfMemosPublishedBeforeStart',
    'numberOfMemosPublishedBeforeDeadline',
  ]
  const { combinedMemosPerSchool: docsPerSchool, periods, year } = statisticsResult
  let { schools = {} } = docsPerSchool
  const [{ languageIndex }] = useWebContext()
  schools = { ...schools, ALLS: addAllSchoolsData(docsPerSchool) }

  return (
    <>
      <Captions year={year} periods={periods} languageIndex={languageIndex} />

      <Charts chartNames={chartNames} schools={schools} languageIndex={languageIndex} />
    </>
  )
}

function MemosNumbersChartsYearAgo({ statisticsResult }) {
  const { school, documentType, periods, year } = statisticsResult

  if (!documentType) return null
  const oneYearAgo = Number(year) - 1

  const state = useStatisticsAsync({ periods, year: oneYearAgo, documentType, school }, 'once')

  const { data: statisticsResultYearAgo, status: statisticsStatus, error = {} } = state || {}

  return (
    <>
      <Results statisticsStatus={statisticsStatus} error={error}>
        <MemosNumbersCharts statisticsResult={statisticsResultYearAgo} />
      </Results>
    </>
  )
}

function MemosSummary({ statisticsResult }) {
  const [{ languageIndex }] = useWebContext()
  const { chartsLabels: labels } = i18n.messages[languageIndex].statisticsLabels
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

MemosSummary.defaultProps = {}
export default MemosSummary
