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

  /**
   * Detectify reports missing CSRF token on this form
   *
   * ✅ Why this is not a security issue:
   *
   * 1. It only triggers authenticated GET requests that do not modify server state.
   *    - “GET requests are to be used for idempotent requests, or requests that do not change state. These requests do not need to have anti‑CSRF tokens.”
   *      source: https://security.stackexchange.com/questions/115794/should-i-use-csrf-protection-for-get-requests
   *
   * 2. The request is made using a secret tokens stored in environment variables (never exposed to the browser).
   *    - “CSRF attacks rely on the fact that the victim is authenticated via cookies or other authentication headers that the browser automatically includes in requests.”
   *      source: https://security.stackexchange.com/questions/232936/how-to-prevent-csrf-attacks-on-a-rest-api-when-using-windows-authentication
   *
   * 3. CSRF via GET is only risky if the endpoint changes application state, the ladok mellanlager endpoint that we use today to get the data does is a read-only API.
   *    - “CSRF attacks are only possible if the request changes the state of the application. If the request is read-only, it cannot change the state of the application.”
   *     source: https://security.stackexchange.com/questions/115794/should-i-use-csrf-protection-for-get-requests
   *
   * 5. CSRF attacks are blind: even if a request were triggered, the attacker cannot read its response.
   *    - “CRSF attacks are blind. They typically send a request without being able to read the result … Same Origin Policy.”
   *      source: https://owasp.org/www-community/attacks/csrf
   *
   * Detectify CSRF False Positive: We can mark the Detectify finding as a False Positive, since:
   *   - All requests are server-side and read-only.
   *   - Browser sends no credentials automatically.
   *   - No state is changed, no sensitive data is exposed.
   *   - Pattern is fundamentally safe from CSRF exploitation.
   */

  return (
    <form
      onSubmit={handleSubmit}
      name="statistics-options-choice"
      method="GET"
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
              {
                <CheckboxOption
                  paramName={studyLengthParamName(documentType)}
                  onChange={handleParamChange}
                  stateMode={stateMode}
                />
              }
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
