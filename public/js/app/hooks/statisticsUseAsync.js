import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { useWebContext } from '../context/WebContext'
import { StatisticsAlert } from '../components/statistics/index'
import fetchStatistics from './api/statisticsApi'

const STATUS = {
  idle: 'idle',
  pending: 'pending',
  resolved: 'resolved',
  missingParameters: 'missingParameters',
  earlierYearThan2019: 'earlierYearThan2019',
  rejected: 'rejected',
}
const ERROR_ASYNC = {
  earlierYearThan2019: 'earlierYearThan2019',
  missingParameters: 'missingParameters',
  rejected: 'errorUnknown',
}

function asyncReducer(state, action) {
  switch (action.type) {
    case 'missingParameters': {
      return {
        status: STATUS.missingParameters,
        data: null,
        error: { errorType: ERROR_ASYNC.missingParameters, errorExtraText: action.data.missingValues },
      }
    }
    case 'earlierYearThan2019': {
      return {
        status: STATUS.earlierYearThan2019,
        data: null,
        error: { errorType: ERROR_ASYNC.earlierYearThan2019, errorExtraText: action.data.year },
      }
    }
    case 'pending': {
      return { status: STATUS.pending, data: null, error: {} }
    }
    case 'resolved': {
      return { status: STATUS.resolved, data: action.data, error: {} }
    }
    case 'rejected': {
      console.error(`Error: ${action.error}`)
      return { status: STATUS.rejected, data: null, error: { errorType: ERROR_ASYNC.rejected } } // for debug use: action.error
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}
const missingParametersDispatch = (dispatch, data) => dispatch({ type: STATUS.missingParameters, data })
const earlierYearThan2019Dispatch = (dispatch, data) => dispatch({ type: STATUS.earlierYearThan2019, data })

function useAsync(asyncCallback, initialState) {
  const [state, dispatch] = React.useReducer(asyncReducer, {
    status: STATUS.idle,
    data: null,
    error: {},
    ...initialState,
  })
  useEffect(() => {
    const promise = asyncCallback()
    if (!promise) return
    dispatch({ type: STATUS.pending })
    promise.then(
      data => {
        const { errorCode } = data
        if (errorCode) dispatch({ type: STATUS.rejected })
        else if (data.errorType === 'missing-parameters-in-query') missingParametersDispatch(dispatch, data)
        else if (data.errorType === 'earlier-year-than-2019') earlierYearThan2019Dispatch(dispatch, data)
        else if (data.errorType === 'error-unknown') dispatch({ type: STATUS.rejected })
        else dispatch({ type: STATUS.resolved, data })
      },
      error => dispatch({ type: STATUS.rejected, error }) // error will be replaced by ERROR_ASYNC.rejected, for debug use: action.error
    )
  }, [asyncCallback])

  return state
}

function renderAlertToTop(error = {}, languageIndex) {
  const { errorType = '', errorExtraText = '' } = error
  const alertContainer = document.getElementById('alert-placeholder')
  if (alertContainer) {
    ReactDOM.render(
      <StatisticsAlert alertType={errorType} languageIndex={languageIndex}>
        {errorExtraText}
      </StatisticsAlert>,
      alertContainer
    )
  }
}
function dismountTopAlert() {
  const alertContainer = document.getElementById('alert-placeholder')
  if (alertContainer) ReactDOM.unmountComponentAtNode(alertContainer)
}

function _getThisHost(thisHostBaseUrl) {
  return thisHostBaseUrl.slice(-1) === '/' ? thisHostBaseUrl.slice(0, -1) : thisHostBaseUrl
}

function useStatisticsAsync(chosenOptions, loadType = 'onChange') {
  const [{ proxyPrefixPath, language, languageIndex }] = useWebContext()
  const { documentType } = chosenOptions
  const dependenciesList = loadType === 'onChange' ? [chosenOptions] : []
  const asyncCallback = React.useCallback(() => {
    if (!documentType) return

    const proxyUrl = _getThisHost(proxyPrefixPath.uri)
    // eslint-disable-next-line consistent-return
    return fetchStatistics(language, proxyUrl, chosenOptions)
  }, [...dependenciesList])

  const initialStatus = { status: STATUS.idle }

  const state = useAsync(asyncCallback, initialStatus)

  const { status: statisticsStatus, error = {} } = state || {}
  const { errorType = '' } = error

  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      if (errorType && errorType !== null) {
        renderAlertToTop(error, languageIndex)
      } else dismountTopAlert()
    }
    return () => (isMounted = false)
  }, [statisticsStatus])

  return state
}

export { STATUS, ERROR_ASYNC, useAsync, useStatisticsAsync }
