import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useWebContext } from '../../context/WebContext'

import i18n from '../../../../../i18n'
import { getOptionsValues } from './domain/formConfigurations'

const optionsReducer = (state, action) => {
  const { value, type } = action
  const { options } = state

  switch (type) {
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

function CheckboxOption({ paramName, onChange }) {
  /* depends on type of document to dropdown */
  const [context] = useWebContext()
  const { languageIndex } = context

  const [{ options }, setOptions] = React.useReducer(optionsReducer, { options: context[paramName] || [] }) // ???
  const { formLabels } = i18n.messages[languageIndex].statisticsLabels
  const headerLabel = formLabels.formSubHeaders[paramName]

  const values = React.useMemo(() => getOptionsValues(paramName, languageIndex), [paramName, languageIndex])
  // [{ label, id, value}, ...]

  useEffect(() => {
    let isMounted = true

    if (isMounted) onChange({ [paramName]: options })
    return () => (isMounted = false)
  }, [options.length])

  function handleChange(e) {
    const { value, checked } = e.target
    setOptions({ value, type: checked ? 'ADD_ITEM' : 'REMOVE_ITEM' })
  }

  return (
    <div key={paramName} className="form-group">
      <fieldset>
        <legend className="form-control-label">{headerLabel}</legend>
        {values.map(({ label, id, value }) => (
          <div key={id} className="form-check form-group">
            <input
              id={id}
              name={paramName}
              value={value}
              type="checkbox"
              className="form-check-input"
              onChange={handleChange}
              checked={!!(options && options.includes(value))}
            />
            <label htmlFor={id} className="form-control-label">
              {label}
            </label>
          </div>
        ))}
      </fieldset>
    </div>
  )
}

CheckboxOption.propTypes = {
  paramName: PropTypes.oneOf(['documentType', 'periods', 'school', 'semesters', 'year']).isRequired,
  onChange: PropTypes.func.isRequired,
}

export default CheckboxOption
