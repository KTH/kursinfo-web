import React from 'react'

import PropTypes from 'prop-types'

import { STATUS, ERROR_ASYNC } from '../../hooks/statisticsUseAsync'

import { useLanguage } from '../../hooks/useLanguage'

const errorItalicParagraph = (error = {}, labels) => {
  const { errorType, errorExtraText } = error
  const errorText = errorType ? labels[errorType].text : null
  if (!errorText)
    throw new Error(
      `Missing translations for errorType: ${errorType}. Allowed types: ${Object.values(ERROR_ASYNC).join(', ')}`
    )

  return (
    <>
      <p>
        <i>{errorText}</i>
      </p>
      {errorExtraText && (
        <p>
          <i>{errorExtraText}</i>
        </p>
      )}
    </>
  )
}

function Results({ statisticsStatus, error = {}, children }) {
  const {
    translation: { statisticsLabels },
  } = useLanguage()
  const { errorType } = error
  if (statisticsStatus === STATUS.missingParameters) return null

  if (statisticsStatus === STATUS.resolved) {
    return <>{children}</>
  }

  if (statisticsStatus === STATUS.idle) return null
  if (statisticsStatus === STATUS.pending) {
    return <p>{statisticsLabels.searchLoading}</p>
  }

  if (errorType) return errorItalicParagraph(error, statisticsLabels)

  return null
}

Results.propTypes = {
  statisticsStatus: PropTypes.oneOf([...Object.values(STATUS), null]),
  error: PropTypes.shape({
    errorType: PropTypes.oneOf([...Object.values(ERROR_ASYNC), '']),
    errorExtraText: PropTypes.string,
  }),
}

Results.defaultProps = {
  error: {},
  statisticsStatus: null,
}

export default Results
