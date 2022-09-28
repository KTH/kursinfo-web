import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Col, Row } from 'reactstrap'
import { useWebContext } from '../../context/WebContext'

import i18n from '../../../../../i18n'
import { getOptionsValues, splitToBulks } from './domain/formConfigurations'

function RadioboxOption({ paramName, onChange }) {
  const [context] = useWebContext()
  const { languageIndex } = context
  const [option, setOption] = React.useState(context[paramName])
  const optinsLength = option ? option.length : 0
  const { formLabels } = i18n.messages[languageIndex].statisticsLabels
  const headerLabel = formLabels.formSubHeaders[paramName]
  const shortIntro = formLabels.formShortIntro[paramName]
  const valuesBulks = React.useMemo(
    () => splitToBulks(getOptionsValues(paramName, languageIndex), 2),
    [paramName, languageIndex]
  )
  // [{ label, id, value}, ...]

  useEffect(() => {
    let isMounted = true

    if (isMounted) onChange({ [paramName]: option })
    return () => (isMounted = false)
  }, [optinsLength])

  function handleChange(e) {
    const { value } = e.target
    setOption(value)
  }

  return (
    <div key={paramName} className="form-group">
      <h3>{headerLabel}</h3>
      <fieldset>
        <legend className="form-control-label">{shortIntro}</legend>
        <Row>
          {valuesBulks.map(values => (
            <Col key={`col-starts-with-${Object.values(values)[0].id}`} xs="2">
              {values.map(({ label, id, value }) => (
                <div key={`row-${id}`}>
                  <div key={id} className="form-check form-group">
                    <input
                      id={id}
                      name={paramName}
                      value={value}
                      type="radio"
                      className="form-check-input"
                      onChange={handleChange}
                    />
                    <label htmlFor={id} className="form-control-label">
                      {label}
                    </label>
                  </div>
                </div>
              ))}
            </Col>
          ))}
        </Row>
      </fieldset>
    </div>
  )
}

RadioboxOption.propTypes = {
  paramName: PropTypes.oneOf(['documentType', 'school']).isRequired,
  onChange: PropTypes.func.isRequired,
}

export default RadioboxOption
