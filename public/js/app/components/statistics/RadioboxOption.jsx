import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useWebContext } from '../../context/WebContext'

import i18n from '../../../../../i18n'
import { getOptionsValues } from './domain/formConfigurations'

function RadioboxOption({ paramName, onChange }) {
  const [context] = useWebContext()
  const { languageIndex } = context
  const [option, setOption] = React.useState(context[paramName])
  const { formLabels } = i18n.messages[languageIndex].statisticsLabels
  const headerLabel = formLabels.formSubHeaders[paramName]

  const values = React.useMemo(() => getOptionsValues(paramName, languageIndex), [paramName, languageIndex])
  // [{ label, id, value}, ...]

  useEffect(() => {
    let isMounted = true

    if (isMounted) onChange({ [paramName]: option })
    return () => (isMounted = false)
  }, [option.length])

  function handleChange(e) {
    const { value } = e.target
    setOption(value)
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
              type="radio"
              className="form-check-input"
              onChange={handleChange}
              checked={option === value}
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

RadioboxOption.propTypes = {
  paramName: PropTypes.oneOf(['documentType', 'school', 'year']).isRequired,
  onChange: PropTypes.func.isRequired,
}

export default RadioboxOption
