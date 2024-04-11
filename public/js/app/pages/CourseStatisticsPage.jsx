/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react'
// import { CSVLink } from 'react-csv'
import { Col, Row } from 'reactstrap'

import { introductionTexts } from '../components/statistics/StatisticsTexts'
import { StatisticsForm, StatisticsResults } from '../components/statistics/index'
import { findMissingParametersKeys, hasValue } from '../components/statistics/domain/validation'
import { useLanguage } from '../hooks/useLanguage'

function _parseValues({ documentType, periods, school, seasons, year }) {
  // clean params

  const optionsValues = {}

  if (hasValue(documentType)) optionsValues.documentType = documentType
  if (hasValue(periods)) optionsValues.periods = periods
  if (hasValue(seasons)) optionsValues.seasons = seasons
  if (hasValue(school)) optionsValues.school = school
  if (hasValue(year)) optionsValues.year = year

  return optionsValues
}
// { documentType, school, periods, ... }
function _parseResultValues(props) {
  // clean params
  const chosenOptions = _parseValues(props)

  const resultValues = chosenOptions

  return resultValues
}

function CourseStatisticsPage() {
  // labels are for headers and short texts
  const {
    translation: { statisticsLabels: labels },
    isEnglish,
  } = useLanguage()
  // texts are for big texts with several <p>, or dynamic
  const texts = introductionTexts(isEnglish)
  // fetch props from url query in case it's presented
  const [params, setParams] = React.useState({
    /**
     * @property {string} documentType
     * @property {array} periods
     * @property {string} school
     * @property {array} seasons
     * @property {number} year
     */
    documentType: null,
    periods: null,
    school: null,
    seasons: null,
    year: null,
  })
  const [hasSubmittedEmptyValue, setHasSubmittedEmptyValue] = React.useState(false)

  function handleSubmit(props) {
    const finalSearchParams = _parseResultValues(props)
    setParams(finalSearchParams)

    const missingParams = findMissingParametersKeys(finalSearchParams)
    setHasSubmittedEmptyValue(missingParams.length > 0)
  }
  return (
    <div id="kursstatistik-main-page" className={hasSubmittedEmptyValue ? 'error-missing-parameters-in-query' : ''}>
      <Row>
        <Col>
          <h1>{labels.pageHeader}</h1>
          {texts.pageDescription()}
        </Col>
      </Row>
      <Row>
        <Col>
          <h2>{labels.formLabels.formHeader}</h2>
          <StatisticsForm onSubmit={handleSubmit} />
        </Col>
      </Row>
      <Row>
        <Col>
          {/* Ex Sammanställning av antalet publicerade kurs-PM  */}
          {/* Ex Tabell med kurser och kurs-PM  */}
          <StatisticsResults chosenOptions={params} />
        </Col>
      </Row>
    </div>
  )
}

export default CourseStatisticsPage
