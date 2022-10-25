import React from 'react'

import PropTypes from 'prop-types'
import { Col, Row } from 'reactstrap'
import { useWebContext } from '../../context/WebContext'
import i18n from '../../../../../i18n'
import { TableSummary } from './TableSummaryRows'
import { summaryTexts } from './StatisticsTexts'
import { Charts } from './Chart'
import { periods as periodsLib } from './domain/index'

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

function Captions({ year, periods, languageIndex }) {
  const { formLabels } = i18n.messages[languageIndex].statisticsLabels

  const periodsStr = periods.map(period => periodsLib.labelPeriod(period, languageIndex, false)).join(', ')
  return (
    <Row>
      <Col xs="2">
        <label>{formLabels.formSubHeaders.year}</label>
        {`: ${year}`}
      </Col>
      <Col xs="4">
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
  const chartNames = [
    'numberOfUniqWebAndPdfMemos',
    'numberOfMemosPublishedBeforeStart',
    'numberOfMemosPublishedBeforeDeadline',
  ]
  const { combinedMemosPerSchool: docsPerSchool, periods, year } = statisticsResult
  const { schools = {} } = docsPerSchool
  const [{ languageIndex }] = useWebContext()

  return (
    <>
      <Captions year={year} periods={periods} languageIndex={languageIndex} />

      <Charts chartNames={chartNames} schools={schools} />
    </>
  )
}

function MemosNumbersChartsYearAgo({ statisticsResult }) {
  const { combinedMemosPerSchool: docsPerSchool, periods, year } = statisticsResult

  return <></>
}

function MemosSummary({ statisticsResult }) {
  return (
    <>
      <MemosNumbersTable statisticsResult={statisticsResult} />
      <MemosNumbersCharts statisticsResult={statisticsResult} />
      <MemosNumbersChartsYearAgo statisticsResult={statisticsResult} />
    </>
  )
}

MemosSummary.propTypes = {
  // statisticsResult: PropTypes.shape({
  //   combinedMemosPerSchool: PropTypes.shape({}),
  //   documentType: PropTypes.oneOf(DOCUMENT_TYPES),
  //   koppsApiBasePath: PropTypes.string,
  //   documentsApiBasePath: PropTypes.string,
  //   school: PropTypes.oneOf(schools.ORDERED_SCHOOL_OPTIONS),
  //   semestersInMemos: PropTypes.arrayOf(PropTypes.string),
  //   totalOfferings: PropTypes.number,
  // }),
}

MemosSummary.defaultProps = {}
export default MemosSummary
