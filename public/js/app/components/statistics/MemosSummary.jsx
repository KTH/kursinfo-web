import React from 'react'

import PropTypes from 'prop-types'
import { useWebContext } from '../../context/WebContext'
import i18n from '../../../../../i18n'
import { summaryTexts } from './StatisticsTexts'
import { TableSummary } from './TableSummaryRows'

function getSchoolNumbers(school = {}) {
  return [
    school.numberOfCourses,
    school.numberOfUniqWebMemos + school.numberOfUniqPdfMemos,
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

function MemosNumbersTable({ statisticsResult }) {
  const [{ languageIndex }] = useWebContext()
  const { summaryLabels } = i18n.messages[languageIndex].statisticsLabels
  const { memosNumbersTable } = summaryLabels
  const { combinedMemosPerSchool } = statisticsResult
  const cellNames = getCellNames()

  return (
    <TableSummary
      docsPerSchool={combinedMemosPerSchool}
      cellNames={cellNames}
      getNumbersFn={getSchoolNumbers}
      labels={memosNumbersTable}
      totalNumbers={getFootTotalNumbers(combinedMemosPerSchool)}
    />
  )
}

function MemosNumbersCharts({ statisticsResult }) {
  return <></>
}
function MemosNumbersChartsYearAgo({ statisticsResult }) {
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
