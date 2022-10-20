import React from 'react'

import PropTypes from 'prop-types'

import i18n from '../../../../../i18n'
import { useWebContext } from '../../context/WebContext'
import { TableSummary } from './TableSummaryRows'

function getSchoolNumbers(school) {
  const { numberOfCourses, numberOfUniqAnalyses } = school
  return [numberOfCourses, numberOfUniqAnalyses]
}
function getFootTotalNumbers(totals) {
  return [totals.totalCourses, totals.totalUniqPublishedAnalyses]
}

function AnalysesNumbersTable({ statisticsResult }) {
  const [{ languageIndex }] = useWebContext()
  const { summaryLabels } = i18n.messages[languageIndex].statisticsLabels
  const { analysesNumbersTable } = summaryLabels
  const { combinedAnalysesPerSchool } = statisticsResult
  const cellNames = ['totalCourses', 'totalUniqPublishedAnalyses']

  return (
    <TableSummary
      docsPerSchool={combinedAnalysesPerSchool}
      cellNames={cellNames}
      getNumbersFn={getSchoolNumbers}
      labels={analysesNumbersTable}
      totalNumbers={getFootTotalNumbers(combinedAnalysesPerSchool)}
    />
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
