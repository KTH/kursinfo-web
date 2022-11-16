import React from 'react'

import PropTypes from 'prop-types'
import { Col, Row } from 'reactstrap'

import { STATUS, ERROR_ASYNC, useStatisticsAsync } from '../../hooks/statisticsUseAsync'

import { periods, schools, seasons } from './domain/index'
import { documentTypes } from './domain/formConfigurations'
import { ResultNumbersSummary, Results, StatisticsDataTable } from './index'

function SortableCoursesAndDocuments({ statisticsStatus, error = {}, statisticsResult }) {
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
    documentsApiBasePath: PropTypes.string,
    documentType: PropTypes.oneOf(documentTypes()),
    koppsApiBasePath: PropTypes.string,
  }),
  error: PropTypes.shape({
    errorType: PropTypes.oneOf([...Object.values(ERROR_ASYNC), '']),
    errorExtraText: PropTypes.string,
  }),
}

SortableCoursesAndDocuments.defaultProps = {
  languageIndex: 0,
  error: {},
  statisticsResult: {},
  statisticsStatus: null,
}

function StatisticsResults({ chosenOptions }) {
  const state = useStatisticsAsync(chosenOptions, 'onChange')

  const { data: statisticsResult, status: statisticsStatus, error = {} } = state || {}

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
  chosenOptions: PropTypes.shape({
    documentType: PropTypes.oneOf(documentTypes()),
    year: PropTypes.number,
    periods: PropTypes.arrayOf(PropTypes.oneOf(periods.orderedPeriods())),
    school: PropTypes.oneOf(schools.orderedSchoolsFormOptions()),
    seasons: PropTypes.arrayOf(PropTypes.oneOf(seasons.orderedSeasons())),
  }),
}

StatisticsResults.defaultProps = {
  chosenOptions: {},
}

export default StatisticsResults
