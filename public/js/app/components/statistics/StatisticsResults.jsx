import React, { useEffect } from 'react'

import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Col, Row } from 'reactstrap'

import i18n from '../../../../../i18n'
import { useWebContext } from '../../context/WebContext'
import { STATUS, ERROR_ASYNC, useAsync } from '../../hooks/statisticsUseAsync'

import fetchStatistics from './api/statisticsApi'
import { periods, schools, seasons } from './domain/index'
import { DOCUMENT_TYPES } from './domain/formConfigurations'
import { ResultNumbersSummary, StatisticsAlert } from './index'

function _getThisHost(thisHostBaseUrl) {
  return thisHostBaseUrl.slice(-1) === '/' ? thisHostBaseUrl.slice(0, -1) : thisHostBaseUrl
}

function renderAlertToTop(error = {}, languageIndex) {
  const { errorType = '', errorExtraText = '' } = error
  const alertContainer = document.getElementById('alert-placeholder')
  if (alertContainer) {
    ReactDOM.render(
      <StatisticsAlert alertType={errorType} languageIndex={languageIndex}>
        {errorExtraText}
      </StatisticsAlert>,
      alertContainer
    )
  }
}
function dismountTopAlert() {
  const alertContainer = document.getElementById('alert-placeholder')
  if (alertContainer) ReactDOM.unmountComponentAtNode(alertContainer)
}

const errorItalicParagraph = (error = {}, languageIndex) => {
  const { statisticsLabels: labels } = i18n.messages[languageIndex]
  const { errorType, errorExtraText } = error
  const errorText = errorType ? labels[errorType].text : null
  if (!errorText)
    throw new Error(
      `Missing translations for errorType: ${errorType}. Allowed types: ${Object.values(ERROR_ASYNC).join(', ')}`
    )

  return (
    <>
      <p>
        <i>{errorText}</i>
      </p>
      {errorExtraText && (
        <p>
          <i>{errorExtraText}</i>
        </p>
      )}
    </>
  )
}

function SortableCoursesAndDocuments({ languageIndex, statisticsStatus, error = {}, statisticsResult }) {
  const { errorType } = error

  if (statisticsStatus === STATUS.resolved) {
    return (
      <>
        <Row>
          <Col>
            <div className="word-break">
              Table with a big sorted table
              {JSON.stringify(statisticsResult)}
            </div>
            {/* Ex Sammanställning av antalet publicerade kurs-PM  */}
            {/* <StatisticsResultNumbers statisticsResult={statisticsResult} /> */}
            <ResultNumbersSummary statisticsResult={statisticsResult} />
          </Col>
        </Row>
        <Row>
          <Col>
            {/* Ex Tabell med kurser och kurs-PM  */}
            {/* <SortableCoursesAndDocuments
              unsortedStatisticsResult={statisticsResult}
            /> */}
          </Col>
        </Row>
      </>
    )
    // f.e., return <SortableTableView unsortedStatisticsResult={statisticsResult} />
  }

  if (statisticsStatus === STATUS.idle) return null
  if (statisticsStatus === STATUS.pending) {
    const { searchLoading } = i18n.messages[languageIndex].statisticsLabels
    return <p>{searchLoading}</p>
  }
  if (errorType) return errorItalicParagraph(error, languageIndex)

  return null
}

SortableCoursesAndDocuments.propTypes = {
  languageIndex: PropTypes.oneOf([0, 1]),
  statisticsStatus: PropTypes.oneOf([...Object.values(STATUS), null]),
  // statisticsResult: PropTypes.shape(searchHitsPropsShape),
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
  const [{ proxyPrefixPath, language, languageIndex }] = useWebContext()
  const { documentType } = chosenOptions
  // const [loadStatus, setLoadStatus] = useState('firstLoad')

  // TODO: FETCH TEXTS AND STATISTIC BY DOCUMENT TYPE
  const { statisticsLabels } = i18n.messages[languageIndex]
  const header = statisticsLabels[documentType]

  const asyncCallback = React.useCallback(() => {
    if (!documentType) return

    const proxyUrl = _getThisHost(proxyPrefixPath.uri)
    // eslint-disable-next-line consistent-return
    return fetchStatistics(language, proxyUrl, chosenOptions)
  }, [chosenOptions])

  const initialStatus = { status: STATUS.idle }

  const state = useAsync(asyncCallback, initialStatus)

  const { data: statisticsResult, status: statisticsStatus, error = {} } = state || {}
  const { errorType = '' } = error

  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      if (errorType && errorType !== null) {
        renderAlertToTop(error, languageIndex)
      } else dismountTopAlert()
    }
    return () => (isMounted = false)
  }, [statisticsStatus])

  return (
    <>
      {statisticsStatus !== STATUS.idle && (
        <Row>
          <Col>
            <h2 id="results-heading">{header}</h2>
          </Col>
        </Row>
      )}
      <SortableCoursesAndDocuments
        statisticsStatus={statisticsStatus}
        error={error}
        languageIndex={languageIndex}
        statisticsResult={statisticsResult}
      />
    </>
  )
}

StatisticsResults.propTypes = {
  chosenOptions: PropTypes.shape({
    documentType: PropTypes.oneOf(DOCUMENT_TYPES),
    year: PropTypes.number,
    periods: PropTypes.arrayOf(PropTypes.oneOf(periods.ORDERED_PERIODS)),
    school: PropTypes.oneOf(schools.ORDERED_SCHOOL_OPTIONS),
    semesters: PropTypes.arrayOf(PropTypes.oneOf(seasons.ORDERED_SEASONS)),
  }),
}

StatisticsResults.defaultProps = {
  chosenOptions: {},
}

export default StatisticsResults
