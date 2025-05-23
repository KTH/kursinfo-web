import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Col, Row } from 'reactstrap'
import { useWebContext } from '../../context/WebContext'
import { useLanguage } from '../../hooks/useLanguage'
import { frameIfEmpty } from './domain/validation'

import { getOptionsValues, splitToBulks } from './domain/formConfigurations'

function RadioboxOption({ paramName, onChange }) {
  const context = useWebContext()
  const [option, setOption] = React.useState(context[paramName])
  const {
    translation: {
      statisticsLabels: { formLabels },
    },
    languageIndex,
  } = useLanguage()

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
  }, [option])

  function handleChange(e) {
    const { value } = e.target
    setOption(value)
  }

  return (
    <div key={paramName} className="form-group" style={{ marginBottom: '7px' }}>
      <h3 style={{ marginTop: '7px' }}>{headerLabel}</h3>
      <fieldset>
        <legend className="form-control-label">{shortIntro}</legend>
        <Row className={`${frameIfEmpty(option)}`}>
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
  paramName: PropTypes.oneOf(['documentType', 'school', 'semester']).isRequired,
  onChange: PropTypes.func.isRequired,
}

export default RadioboxOption
