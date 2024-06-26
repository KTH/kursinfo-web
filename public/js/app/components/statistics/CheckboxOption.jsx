import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Col, Row } from 'reactstrap'
import { useWebContext } from '../../context/WebContext'
import InfoModal from '../InfoModal'
import { useLanguage } from '../../hooks/useLanguage'
import { frameIfEmpty } from './domain/validation'

import { getOptionsValues, splitToBulks } from './domain/formConfigurations'

const optionsReducer = (state, action) => {
  const { value, type } = action
  const { options } = state

  switch (type) {
    case 'CLEAN_UP': {
      return { options: [] }
    }
    case 'ADD_ITEM': {
      const lastIndex = options.length

      options[lastIndex] = value // because while it is in state it, turns array into ordered object
      return { options }
    }
    case 'REMOVE_ITEM': {
      const removeIndex = options.indexOf(value)
      if (removeIndex >= 0) {
        options.splice(removeIndex, 1)
      }
      return { options }
    }
    default: {
      throw new Error(
        `Cannot change the state in reducer. Unknown type of action: ${type}. Allowed options: ADD_ITEM, REMOVE_ITEM`
      )
    }
  }
}

function CheckboxOption({ paramName, onChange, stateMode }) {
  /* depends on type of document to dropdown */
  const context = useWebContext()

  const [{ options }, setOptions] = React.useReducer(optionsReducer, { options: context[paramName] || [] }) // ???
  const {
    translation: { statisticsLabels, courseLabels: labels },
    languageIndex,
  } = useLanguage()
  const { formLabels } = statisticsLabels

  const headerLabel = formLabels.formSubHeaders[paramName]
  const shortIntro = formLabels.formShortIntro[paramName]

  const valuesBulks = React.useMemo(
    () => splitToBulks(getOptionsValues(paramName, languageIndex), 3),
    [paramName, languageIndex]
  ) // [{ label, id, value}, ...]

  useEffect(() => {
    let isMounted = true

    if (isMounted) {
      if (stateMode === 'cleanup-checkboxes') {
        setOptions({ type: 'CLEAN_UP' })
      }
      onChange({ [paramName]: options })
    }
    return () => (isMounted = false)
  }, [options.length, stateMode])

  function handleChange(e) {
    const { value, checked } = e.target
    setOptions({ value: Number(value), type: checked ? 'ADD_ITEM' : 'REMOVE_ITEM' })
  }

  return (
    <div key={paramName} className="form-group" style={{ marginBottom: '0px' }}>
      <h3 style={{ marginTop: '7px' }}>
        {headerLabel}
        {paramName === 'periods' && (
          <InfoModal
            closeLabel={labels.label_close}
            infoText={labels.study_period_info}
            title={headerLabel}
            type="html"
          />
        )}
      </h3>

      <fieldset>
        <legend className="form-control-label">{shortIntro}</legend>
        <Row className={`${frameIfEmpty(options)}`}>
          {valuesBulks.map(values => (
            <Col key={`col-starts-with-${Object.values(values)[0].id}`} xs="2">
              {values.map(({ label, id, value }) => (
                <div key={id} className="form-check form-group">
                  <input
                    id={id}
                    name={paramName}
                    value={value}
                    type="checkbox"
                    className="form-check-input"
                    onChange={handleChange}
                  />
                  <label htmlFor={id} className="form-control-label">
                    {label}
                  </label>
                </div>
              ))}
            </Col>
          ))}
        </Row>
      </fieldset>
    </div>
  )
}

CheckboxOption.propTypes = {
  paramName: PropTypes.oneOf(['periods', 'seasons']).isRequired,
  onChange: PropTypes.func.isRequired,
}

export default CheckboxOption
