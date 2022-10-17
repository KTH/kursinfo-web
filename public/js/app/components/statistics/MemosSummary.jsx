import React from 'react'

import PropTypes from 'prop-types'
import { Col, Row } from 'reactstrap'

import i18n from '../../../../../i18n'
import { useWebContext } from '../../context/WebContext'
import { summaryTexts } from './StatisticsTexts'

// import { periods, schools, seasons } from './domain/index'
// import { DOCS, DOCUMENT_TYPES } from './domain/formConfigurations'

function MemosNumbersTable({ statisticsResult }) {
  const [{ languageIndex }] = useWebContext()
  const { statisticsLabels: labels } = i18n.messages[languageIndex]
  const { memosNumbersTable: tableLabels } = labels.summaryLabels
  const { combinedMemosPerSchool } = statisticsResult
  const headersLabelsIds = [
    'school',
    'totalCourses',
    'totalPublishedMemos',
    'totalPublWeMemos',
    'totalPublPdMemos',
    'totalMemosPublishedBeforeCourseStart',
    'totalMemosPublishedBeforeDeadline',
  ]
  const memosPerSchoolRows = () => {
    const rows = []
    const {
      schools = {},
      totalNumberOfCourses,
      totalNumberOfWebMemos,
      totalNumberOfPdfMemos,
      totalNumberOfMemosPublishedBeforeStart,
      totalNumberOfMemosPublishedBeforeDeadline,
    } = combinedMemosPerSchool
    Object.keys(schools).forEach(sC => {
      const {
        numberOfCourses,
        numberOfUniqWebMemos,
        numberOfUniqPdfMemos,
        numberOfMemosPublishedBeforeStart,
        numberOfMemosPublishedBeforeDeadline,
      } = schools[sC]
      rows.push(
        <tr key={sC}>
          <td>{sC}</td>
          <td>{numberOfCourses}</td>
          <td>{numberOfUniqWebMemos + numberOfUniqPdfMemos}</td>
          <td>{numberOfUniqWebMemos}</td>
          <td>{numberOfUniqPdfMemos}</td>
          <td>{numberOfMemosPublishedBeforeStart}</td>
          <td>{numberOfMemosPublishedBeforeDeadline}</td>
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
          <td>{Math.abs(totalNumberOfWebMemos) + Math.abs(totalNumberOfPdfMemos)}</td>
          <td>
            <b>{totalNumberOfWebMemos}</b>
          </td>
          <td>
            <b>{totalNumberOfPdfMemos}</b>
          </td>
          <td>
            <b>{totalNumberOfMemosPublishedBeforeStart}</b>
          </td>
          <td>
            <b>{totalNumberOfMemosPublishedBeforeDeadline}</b>
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
      <tbody>{memosPerSchoolRows()}</tbody>
    </table>
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
