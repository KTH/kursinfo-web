import React from 'react'

import PropTypes from 'prop-types'
import { Col, Row } from 'reactstrap'

import i18n from '../../../../../i18n'
import { useWebContext } from '../../context/WebContext'
import { TableSummary } from './TableSummaryRows'
import { seasons as seasonLib } from './domain/index'

function getSchoolNumbers(school) {
  const { numberOfCourses, numberOfUniqAnalyses } = school
  return [numberOfCourses, numberOfUniqAnalyses]
}
function getFootTotalNumbers(totals) {
  return [totals.totalCourses, totals.totalUniqPublishedAnalyses]
}

function Captions({ statisticsResult, languageIndex }) {
  const { formLabels } = i18n.messages[languageIndex].statisticsLabels

  const { year, seasons } = statisticsResult
  const seasonsStr = seasons.map(season => seasonLib.labelSeason(season, languageIndex)).join(', ')
  return (
    <Row>
      <Col xs="4">
        <label>{formLabels.formSubHeaders.year}</label>
        <text>{`: ${year}`}</text>
      </Col>
      <Col xs="4">
        <label>{formLabels.formSubHeaders.semesters}</label>
        {`: ${seasonsStr}`}
      </Col>
    </Row>
  )
}

function AnalysesNumbersTable({ statisticsResult }) {
  const [{ languageIndex }] = useWebContext()
  const { summaryLabels } = i18n.messages[languageIndex].statisticsLabels
  const { analysesNumbersTable } = summaryLabels
  const { combinedAnalysesPerSchool } = statisticsResult
  const cellNames = ['totalCourses', 'totalUniqPublishedAnalyses']

  return (
    <>
      <Captions statisticsResult={statisticsResult} languageIndex={languageIndex} />

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
  return <></>
}
function AnalysesNumbersChartsYearAgo({ statisticsResult }) {
  return <></>
}

function AnalysesSummary({ statisticsResult }) {
  return (
    <>
      <AnalysesNumbersTable statisticsResult={statisticsResult} />
      <AnalysesNumbersCharts statisticsResult={statisticsResult} />
      <AnalysesNumbersChartsYearAgo statisticsResult={statisticsResult} />
    </>
  )
}

AnalysesSummary.propTypes = {
  // statisticsResult: PropTypes.shape({
  //   combinedAnalysesPerSchool: PropTypes.shape({}),
  //   documentType: PropTypes.oneOf(DOCUMENT_TYPES),
  //   koppsApiBasePath: PropTypes.string,
  //   documentsApiBasePath: PropTypes.string,
  //   school: PropTypes.oneOf(schools.ORDERED_SCHOOL_OPTIONS),
  //   semestersInAnalyses: PropTypes.arrayOf(PropTypes.string),
  //   totalOfferings: PropTypes.number,
  // }),
}

AnalysesSummary.defaultProps = {}
export default AnalysesSummary
