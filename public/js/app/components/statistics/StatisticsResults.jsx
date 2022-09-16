import React, { useEffect } from 'react'

import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Col, Row } from 'reactstrap'

import i18n from '../../../../../i18n'
import { useWebContext } from '../../context/WebContext'
import { STATUS, ERROR_ASYNC, useAsync } from '../../hooks/searchUseAsync'
import { englishTexts, swedishTexts } from './StatisticsTexts'

import fetchStatistics from './api/statisticsApi'
import { periods, schools, semester } from './domain/index'
import { DOCUMENT_TYPES } from './domain/formConfigurations'
import { StatisticsAlert } from './index'

function _getThisHost(thisHostBaseUrl) {
  return thisHostBaseUrl.slice(-1) === '/' ? thisHostBaseUrl.slice(0, -1) : thisHostBaseUrl
}

function renderAlertToTop(errorType, languageIndex) {
  const alertContainer = document.getElementById('alert-placeholder')
  if (alertContainer) {
    ReactDOM.render(<StatisticsAlert alertType={errorType} languageIndex={languageIndex} />, alertContainer)
  }
}
function dismountTopAlert() {
  const alertContainer = document.getElementById('alert-placeholder')
  if (alertContainer) ReactDOM.unmountComponentAtNode(alertContainer)
}

const errorItalicParagraph = (errorType, languageIndex) => {
  const errorText = i18n.messages[languageIndex].generalSearch[errorType]
  if (!errorText)
    throw new Error(
      `Missing translations for errorType: ${errorType}. Allowed types: ${Object.values(ERROR_ASYNC).join(', ')}`
    )

  return (
    <p>
      <i>{errorText}</i>
    </p>
  )
}

function SortableCoursesAndDocuments({ languageIndex, statisticsStatus, errorType, statisticsResult }) {
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
            {/* <StatisticsResultNumbers unsortedStatisticsResult={statisticsResult} /> */}
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
  if (errorType) return errorItalicParagraph(errorType, languageIndex)

  return null
}

SortableCoursesAndDocuments.propTypes = {
  languageIndex: PropTypes.oneOf([0, 1]),
  statisticsStatus: PropTypes.oneOf([...Object.values(STATUS), null]),
  errorType: PropTypes.oneOf([...Object.values(ERROR_ASYNC), '']),
  // statisticsResult: PropTypes.shape(searchHitsPropsShape),
}

SortableCoursesAndDocuments.defaultProps = {
  languageIndex: 0,
  errorType: '',
  statisticsResult: {},
  statisticsStatus: null,
}

function StatisticsResults({ chosenOptions }) {
  const [{ proxyPrefixPath, language, languageIndex }] = useWebContext()
  const { documentType } = chosenOptions
  // const [loadStatus, setLoadStatus] = useState('firstLoad')

  // TODO: FETCH TEXTS AND STATISTIC BY DOCUMENT TYPE
  // const { sortableTable } = i18n.messages[languageIndex].statisticsLabels
  // const { documentType } = chosenOptions

  const asyncCallback = React.useCallback(() => {
    // TODO: CHECK ALL PARAMS?
    if (!documentType) return

    const proxyUrl = _getThisHost(proxyPrefixPath.uri)
    // eslint-disable-next-line consistent-return
    return fetchStatistics(language, proxyUrl, chosenOptions)
  }, [chosenOptions])

  const initialStatus = { status: STATUS.idle }

  const state = useAsync(asyncCallback, initialStatus)

  const { data: statisticsResult, status: statisticsStatus, error: errorType } = state

  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      if (errorType && errorType !== null) {
        renderAlertToTop(errorType, languageIndex)
      } else dismountTopAlert()
    }
    return () => (isMounted = false)
  }, [statisticsStatus])

  return (
    <>
      {statisticsStatus !== STATUS.idle && <h2 id="results-heading">{'????? RESULTS HEADER'}</h2>}

      <SortableCoursesAndDocuments
        statisticsStatus={statisticsStatus}
        errorType={errorType}
        languageIndex={languageIndex}
        statisticsResult={statisticsResult}
      />
    </>
  )
}

StatisticsResults.propTypes = {
  onlyPattern: PropTypes.bool,
  chosenOptions: PropTypes.shape({
    documentType: PropTypes.oneOf(DOCUMENT_TYPES),
    year: PropTypes.number,
    periods: PropTypes.arrayOf(PropTypes.oneOf(periods.ORDERED_PERIODS)),
    school: PropTypes.oneOf(schools.ORDERED_SCHOOL_OPTIONS),
    semesters: PropTypes.arrayOf(PropTypes.oneOf(semester.ORDERED_SEASONS)),
  }),
}

StatisticsResults.defaultProps = {
  chosenOptions: {},
}

export default StatisticsResults
