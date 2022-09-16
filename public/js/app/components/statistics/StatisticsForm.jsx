import React, { useReducer } from 'react'
import { Col, Row } from 'reactstrap'
import PropTypes from 'prop-types'
import i18n from '../../../../../i18n'
import { useWebContext } from '../../context/WebContext'
import { englishTexts, swedishTexts } from './StatisticsTexts'
import { PARAMS } from './domain/formConfigurations'

import { CheckboxOption, RadioboxOption } from './index'

const paramsReducer = (state, action) => ({ ...state, ...action })

const ORDERED_RADIO_PARAMS = [PARAMS.documentType, PARAMS.school]

function StatisticsForm({ onSubmit }) {
  const [context] = useWebContext()
  const { documentType = null } = context
  const [state, setState] = useReducer(paramsReducer, {})
  const { language, languageIndex } = context
  // labels are for headers and short texts
  const { statisticsLabels: labels } = i18n.messages[languageIndex]
  // texts are for big texts with several <p>, or dynamic
  const texts = language === 'en' ? englishTexts : swedishTexts
  // const currentYearDate = new Date().getFullYear()
  // const nextYearDate = Number(currentYearDate) + 1

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(state)
  }

  function handleParamChange(params) {
    setState(params)
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label={'??????'}
      name="statistics-options-choise"
      style={{
        display: 'block',
      }}
    >
      {/* documentType,school */}
      {ORDERED_RADIO_PARAMS.map(paramName => (
        <Row key={`row-for-${paramName}-choice`}>
          <Col>
            <RadioboxOption paramName={paramName} onChange={handleParamChange} />
          </Col>
        </Row>
      ))}
      <Row key={`row-for-year-choice`}>
        <Col>
          {/* replace to dropdown */}
          <RadioboxOption paramName="year" onChange={handleParamChange} />
        </Col>
      </Row>
      <Row key={`row-for-periods-or-semesters-choice`}>
        <Col>
          {/* depends on type of document to dropdown */}
          <CheckboxOption
            paramName={documentType === 'courseMemo' ? 'periods' : 'semesters'}
            onChange={handleParamChange}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <button className="btn btn-primary" type="submit" style={{ float: 'right' }}>
            {labels.btnShowResults}
          </button>
        </Col>
      </Row>
    </form>
  )
}

StatisticsForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}

export default StatisticsForm
