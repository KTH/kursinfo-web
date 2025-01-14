import React from 'react'

import PropTypes from 'prop-types'
import { Col, Row } from 'reactstrap'

import { ERROR_ASYNC, STATUS } from '../../hooks/statisticsUseAsync'

import { documentTypes } from './domain/formConfigurations'
import { ResultNumbersSummary, Results, StatisticsDataTable } from './index'

function SortableCoursesAndDocuments({ statisticsStatus = null, error = {}, statisticsResult }) {
  return (
    <Results statisticsStatus={statisticsStatus} error={error}>
      <Row>
        <Col>
          {/* Small table, Sammanställning av antalet publicerade kurs-PM  */}
          <ResultNumbersSummary statisticsResult={statisticsResult} />
        </Col>
      </Row>
      <Row>
        <Col>
          {/* Big table, Tabell med kurser och kurs-PM  */}
          <StatisticsDataTable statisticsResult={statisticsResult}></StatisticsDataTable>
        </Col>
      </Row>
    </Results>
  )
}

SortableCoursesAndDocuments.propTypes = {
  languageIndex: PropTypes.oneOf([0, 1]),
  statisticsStatus: PropTypes.oneOf([...Object.values(STATUS), null]),
  statisticsResult: PropTypes.shape({
    documentType: PropTypes.oneOf(documentTypes()),
  }),
  error: PropTypes.shape({
    errorType: PropTypes.oneOf([...Object.values(ERROR_ASYNC), '']),
    errorExtraText: PropTypes.string,
  }),
}

function StatisticsResults({ result }) {
  const { data: statisticsResult, status: statisticsStatus, error = {} } = result || {}
  return (
    <Row style={{ marginTop: '22px' }}>
      <Col>
        <SortableCoursesAndDocuments
          statisticsStatus={statisticsStatus}
          error={error}
          statisticsResult={statisticsResult}
        />
      </Col>
    </Row>
  )
}

StatisticsResults.propTypes = {
  result: PropTypes.object,
}

export default StatisticsResults
