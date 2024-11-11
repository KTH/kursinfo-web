import PropTypes from 'prop-types'
import React, { useReducer } from 'react'
import { Col, Row } from 'reactstrap'
import { useLanguage } from '../../hooks/useLanguage'
import { DOCS, studyLengthParamName } from './domain/formConfigurations'

import { CheckboxOption, DropdownOption, RadioboxOption, StatisticsAlert } from './index'

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

function StatisticsForm({ onSubmit, resultError }) {
  const [state, setState] = useReducer(paramsReducer, {})
  const [stateMode, setStateMode] = React.useState('init')
  const { documentType = null } = state
  // labels are for headers and short texts
  const {
    translation: { statisticsLabels: labels },
  } = useLanguage()

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
          <Row key={`row-for-school-choice`} className={`row-for-school-choice`}>
            <Col>
              <RadioboxOption paramName={'school'} onChange={handleParamChange} />
            </Col>
          </Row>
          <Row key={`row-for-year-choice`} className={`row-for-year-choice`}>
            <Col>
              <DropdownOption
                paramName="year"
                showInfoBox={state.documentType === DOCS.courseMemo ? false : true}
                onChange={handleParamChange}
              />
            </Col>
          </Row>
          <Row key={`row-for-periods-or-seasons-choice`} className={`row-for-periods-or-seasons-choice`}>
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
          {resultError?.errorType && (
            <StatisticsAlert alertType={resultError.errorType}>{resultError.errorExtraText}</StatisticsAlert>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <button className="kth-button primary" type="submit">
            {labels.btnShowResults}
          </button>
        </Col>
      </Row>
    </form>
  )
}

StatisticsForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  resultError: PropTypes.object,
}

export default StatisticsForm
