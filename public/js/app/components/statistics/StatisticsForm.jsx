import React, { useReducer } from 'react'
import { Col, Row } from 'reactstrap'
import PropTypes from 'prop-types'
import i18n from '../../../../../i18n'
import { useWebContext } from '../../context/WebContext'
import { englishTexts, swedishTexts } from './StatisticsTexts'
import { studyLengthParamName } from './domain/formConfigurations'

import { CheckboxOption, DropdownOption, RadioboxOption } from './index'

const paramsReducer = (state, action) => {
  const { value, type } = action

  switch (type) {
    case 'UPDATE_STATE': {
      return { ...state, ...value }
    }
    case 'SWITCH_STATE': {
      return value
    }
    default: {
      throw new Error(
        `Cannot change the state in reducer. Unknown type of action: ${type}. Allowed options: UPDATE_STATE, SWITCH_STATE`
      )
    }
  }
}

// const ORDERED_RADIO_PARAMS = [PARAMS.documentType, PARAMS.school]
function StatisticsForm({ onSubmit }) {
  const [context] = useWebContext()
  const [state, setState] = useReducer(paramsReducer, {})
  const [stateMode, setStateMode] = React.useState('init')
  const { documentType = null } = state
  const { language, languageIndex } = context
  // labels are for headers and short texts
  const { statisticsLabels: labels } = i18n.messages[languageIndex]
  // texts are for big texts with several <p>, or dynamic
  const texts = language === 'en' ? englishTexts : swedishTexts

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(state)
  }

  function handleParamChange(params) {
    const { documentType: newDocumentType } = params
    const prevDocumentType = documentType
    if (prevDocumentType && newDocumentType) {
      if (newDocumentType !== prevDocumentType) {
        setStateMode('cleanup-checkboxes')

        const oldParamName = studyLengthParamName(prevDocumentType)
        params[oldParamName] = []
        const newParamName = studyLengthParamName(newDocumentType)
        params[newParamName] = []
      }
    } else setStateMode('continue')
    setState({ value: params, type: 'UPDATE_STATE' })
  }

  return (
    <form
      onSubmit={handleSubmit}
      name="statistics-options-choice"
      style={{
        display: 'block',
      }}
    >
      <Row key={`row-for-documentType-choice`}>
        <Col>
          <RadioboxOption paramName={'documentType'} onChange={handleParamChange} />
        </Col>
      </Row>
      {documentType && (
        <>
          <Row key={`row-for-school-choice`}>
            <Col>
              <RadioboxOption paramName={'school'} onChange={handleParamChange} />
            </Col>
          </Row>
          <Row key={`row-for-year-choice`}>
            <Col>
              <DropdownOption paramName="year" onChange={handleParamChange} />
            </Col>
          </Row>
          <Row key={`row-for-periods-or-semesters-choice`}>
            <Col>
              {/* depends on type of document to dropdown */}
              <CheckboxOption
                paramName={studyLengthParamName(documentType)}
                onChange={handleParamChange}
                stateMode={stateMode}
              />
            </Col>
          </Row>
        </>
      )}
      <Row>
        <Col>
          <button className="btn btn-primary" type="submit" style={{ float: 'left' }}>
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
