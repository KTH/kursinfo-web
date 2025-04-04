/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react'

import { introductionTexts } from '../components/statistics/StatisticsTexts'
import { findMissingParametersKeys, hasValue } from '../components/statistics/domain/validation'
import { StatisticsForm, StatisticsResults } from '../components/statistics/index'
import { useStatisticsAsync } from '../hooks/statisticsUseAsync'
import { useLanguage } from '../hooks/useLanguage'
import Alert from '../components-shared/Alert'
import { NEW_COURSE_ANALYSIS_ADMIN_TOOL_URL } from '../util/constants'
import { useWebContext } from '../context/WebContext'

function _parseValues({ documentType, periods, school, semester, year }) {
  // clean params

  const optionsValues = {}

  if (hasValue(documentType)) optionsValues.documentType = documentType
  if (hasValue(periods)) optionsValues.periods = periods
  if (hasValue(semester)) optionsValues.semester = semester
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
  const { lang } = useWebContext()

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
     * @property {string} semester
     * @property {number} year
     */
    documentType: null,
    periods: null,
    school: null,
    semester: null,
    year: null,
  })
  const [hasSubmittedEmptyValue, setHasSubmittedEmptyValue] = React.useState(false)

  function handleSubmit(props) {
    const finalSearchParams = _parseResultValues(props)
    setParams(finalSearchParams)

    const missingParams = findMissingParametersKeys(finalSearchParams)
    setHasSubmittedEmptyValue(missingParams.length > 0)
  }

  const resultState = useStatisticsAsync(params, 'onChange')

  return (
    <div id="kursstatistik-main-page" className={hasSubmittedEmptyValue ? 'error-missing-parameters-in-query' : ''}>
      <h1>{labels.pageHeader}</h1>
      {texts.pageDescription()}
      <Alert type="info" header={labels.courseAnalysis_alert_header}>
        <p>{labels.courseAnalysis_alert_p1}</p>
        <p>
          {labels.courseAnalysis_alert_p2}
          <a href={NEW_COURSE_ANALYSIS_ADMIN_TOOL_URL[lang]}>{labels.courseAnalysis_alert_link_text}</a>
        </p>
      </Alert>
      <h2>{labels.formLabels.formHeader}</h2>
      <StatisticsForm onSubmit={handleSubmit} resultError={resultState.error} />
      <StatisticsResults result={resultState} />
    </div>
  )
}

export default CourseStatisticsPage
