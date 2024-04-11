import React from 'react'
import PropTypes from 'prop-types'
import Alert from '../../components-shared/Alert'
import i18n from '../../../../../i18n'
import { ERROR_ASYNC } from '../../hooks/statisticsUseAsync'

function StatisticsAlert({ alertType, languageIndex, children }) {
  // We cannot use useLanguage or useWebContext here, as this component will be rendered outside of our component tree
  const { statisticsLabels } = i18n.messages[languageIndex]
  const { header = '', help = '', text = '' } = statisticsLabels[alertType] || {}

  return (
    <Alert type={alertType === ERROR_ASYNC.missingParameters ? 'warning' : 'info'} aria-live="polite" header={header}>
      {text && <p>{text}</p>}
      {help && <p>{help}</p>}
      {children && <p>{children}</p>}
    </Alert>
  )
}

StatisticsAlert.propTypes = {
  alertType: PropTypes.oneOf([...Object.values(ERROR_ASYNC), null]).isRequired,
  languageIndex: PropTypes.oneOf([0, 1]).isRequired,
}

export default StatisticsAlert
