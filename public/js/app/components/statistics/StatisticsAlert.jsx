import React from 'react'
import { Alert } from 'reactstrap'
import PropTypes from 'prop-types'
import i18n from '../../../../../i18n'
import { ERROR_ASYNC } from '../../hooks/searchUseAsync'

function StatisticsAlert({ alertType, languageIndex }) {
  const { statisticsLabels } = i18n.messages[languageIndex]
  const { header = '', help = '', text = '' } = statisticsLabels[alertType]

  return (
    <Alert color="info" aria-live="polite">
      {header && <h5>{header}</h5>}
      {text && <p>{text}</p>}
      {help && <p>{help}</p>}
    </Alert>
  )
}

StatisticsAlert.propTypes = {
  alertType: PropTypes.oneOf([...Object.values(ERROR_ASYNC), null]).isRequired,
  languageIndex: PropTypes.oneOf([0, 1]).isRequired,
}

export default StatisticsAlert
