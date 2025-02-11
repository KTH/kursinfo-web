import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../../../../i18n'
import Alert from '../../components-shared/Alert'
import { ERROR_ASYNC } from '../../hooks/statisticsUseAsync'
import { useLanguage } from '../../hooks/useLanguage'

function StatisticsAlert({ alertType, children }) {
  const { languageIndex } = useLanguage()
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
}

export default StatisticsAlert
