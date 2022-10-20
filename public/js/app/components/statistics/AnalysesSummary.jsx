import React from 'react'

import PropTypes from 'prop-types'

import i18n from '../../../../../i18n'
import { useWebContext } from '../../context/WebContext'
import { summaryTexts } from './StatisticsTexts'

function AnalysesNumbersTable({ statisticsResult }) {
  const [{ languageIndex }] = useWebContext()
  const { statisticsLabels: labels } = i18n.messages[languageIndex]
  const { analysesNumbersTable: tableLabels } = labels.summaryLabels
  const { combinedAnalysesPerSchool } = statisticsResult
  const headersLabelsIds = ['school', 'totalCourses', 'totalPublishedAnalyses']
  const analysesPerSchoolRows = () => {
    const rows = []
    const { schools = {}, totalNumberOfCourses, totalNumberOfUniqAnalyses } = combinedAnalysesPerSchool
    Object.keys(schools).forEach(sC => {
      const { numberOfCourses, numberOfUniqAnalyses } = schools[sC]
      rows.push(
        <tr key={sC}>
          <td>{sC}</td>
          <td>{numberOfCourses}</td>
          <td>{numberOfUniqAnalyses}</td>
        </tr>
      )
    })
    if (Object.keys(schools) > 1)
      rows.push(
        <tr key="totals">
          <td>
            <b>
              <i>Total</i>
            </b>
          </td>
          <td>
            <b>{totalNumberOfCourses}</b>
          </td>
          <td>
            <b>{totalNumberOfUniqAnalyses}</b>
          </td>
        </tr>
      )
    return rows
  }
  return (
    <table className="table">
      <thead>
        <tr>
          {headersLabelsIds.map(thId => (
            <th key={thId}>{tableLabels[thId]}</th>
          ))}
        </tr>
      </thead>
      <tbody>{analysesPerSchoolRows()}</tbody>
    </table>
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
