import React, { useEffect } from 'react'

const STATUS = {
  pending: 'pending',
  resolved: 'resolved',
  missingParameters: 'missingParameters',
  rejected: 'rejected',
}
const ERROR_ASYNC = {
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
        else if (data.errorType === 'error-unknown') dispatch({ type: STATUS.rejected })
        else dispatch({ type: STATUS.resolved, data })
      },
      error => dispatch({ type: STATUS.rejected, error }) // error will be replaced by ERROR_ASYNC.rejected, for debug use: action.error
    )
  }, [asyncCallback])

  return state
}

export { STATUS, ERROR_ASYNC, useAsync }
