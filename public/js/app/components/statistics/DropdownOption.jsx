import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Col, Row } from 'reactstrap'
import { useWebContext } from '../../context/WebContext'

import i18n from '../../../../../i18n'
import { getOptionsValues } from './domain/formConfigurations'
import { frameIfEmpty } from './domain/validation'

function DropdownOption({ paramName, onChange }) {
  const [context] = useWebContext()
  const { languageIndex } = context
  const [option, setOption] = React.useState(context[paramName])
  const { formLabels } = i18n.messages[languageIndex].statisticsLabels
  const headerLabel = formLabels.formSubHeaders[paramName]
  const shortIntro = formLabels.formShortIntro[paramName]
  const values = React.useMemo(() => getOptionsValues(paramName, languageIndex), [paramName, languageIndex])
  // [{ label, id, value}, ...]

  useEffect(() => {
    let isMounted = true

    if (isMounted) onChange({ [paramName]: option })
    return () => (isMounted = false)
  }, [option])

  function handleChange(e) {
    const { value } = e.target
    setOption(value === 'placeholder' ? undefined : Math.abs(value))
  }

  return (
    <div key={paramName} className="form-group">
      <h3>{headerLabel}</h3>
      <fieldset>
        <legend className="form-control-label">{shortIntro}</legend>
        <div className="form-select form-group">
          <Row className={`${frameIfEmpty(option)}`}>
            <Col xs="2">
              <div className="select-wrapper">
                <select
                  className="form-control"
                  id={`${paramName}-select-year`}
                  aria-label={shortIntro}
                  onChange={handleChange}
                  defaultValue={'placeholder'} // selects value
                >
                  <option id={`${paramName}`} value={'placeholder'}>
                    {shortIntro}
                  </option>
                  {values.map(({ label, id, value }) => (
                    <option key={id} id={id} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </Col>
          </Row>
        </div>
      </fieldset>
    </div>
  )
}

DropdownOption.propTypes = {
  paramName: PropTypes.oneOf(['year']).isRequired,
  onChange: PropTypes.func.isRequired,
}

export default DropdownOption
