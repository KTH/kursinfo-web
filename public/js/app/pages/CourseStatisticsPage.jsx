/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react'
// import { CSVLink } from 'react-csv'
import { Col, Row } from 'reactstrap'

import { useWebContext } from '../context/WebContext'
import { introductionTexts } from '../components/statistics/StatisticsTexts'
import i18n from '../../../../i18n'
import { StatisticsForm, StatisticsResults } from '../components/statistics/index'

function hasValue(param) {
  if (!param || param === null || param === '') return false
  if (typeof param === 'object' && param.length === 0) return false
  if (typeof param === 'string' && param.trim().length === 0) return false
  return true
}
// { documentType, school, periods, ... }

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
  const [context] = useWebContext()
  const { language, languageIndex } = context
  // labels are for headers and short texts
  const { statisticsLabels: labels } = i18n.messages[languageIndex]
  // texts are for big texts with several <p>, or dynamic
  const texts = introductionTexts(language)
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

  function handleSubmit(props) {
    const finalSearchParams = _parseResultValues(props)
    setParams(finalSearchParams)
  }

  return (
    <div className="container" id="kursstatistik-main-page" style={{ paddingTop: '30px' }}>
      <Row>
        <Col>
          <header>
            <h1 id="page-heading">{labels.pageHeader}</h1>
          </header>
          <div>{texts.pageDescription()}</div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div id="alert-placeholder" />
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
