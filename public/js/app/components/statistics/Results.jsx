import React from 'react'

import PropTypes from 'prop-types'

import i18n from '../../../../../i18n'
import { STATUS, ERROR_ASYNC } from '../../hooks/statisticsUseAsync'

import { useWebContext } from '../../context/WebContext'

const errorItalicParagraph = (error = {}, languageIndex) => {
  const { statisticsLabels: labels } = i18n.messages[languageIndex]
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
  const [{ languageIndex }] = useWebContext()
  const { errorType } = error

  if (statisticsStatus === STATUS.resolved) {
    return <>{children}</>
  }

  if (statisticsStatus === STATUS.idle) return null
  if (statisticsStatus === STATUS.pending) {
    const { searchLoading } = i18n.messages[languageIndex].statisticsLabels
    return <p>{searchLoading}</p>
  }
  if (errorType) return errorItalicParagraph(error, languageIndex)

  return null
}

Results.propTypes = {
  languageIndex: PropTypes.oneOf([0, 1]),
  statisticsStatus: PropTypes.oneOf([...Object.values(STATUS), null]),
  // statisticsResult: PropTypes.shape(searchHitsPropsShape),
  error: PropTypes.shape({
    errorType: PropTypes.oneOf([...Object.values(ERROR_ASYNC), '']),
    errorExtraText: PropTypes.string,
  }),
}

Results.defaultProps = {
  languageIndex: 0,
  error: {},
  statisticsResult: {},
  statisticsStatus: null,
}

export default Results
