import React, { useEffect } from 'react'

const STATUS = {
  pending: 'pending',
  resolved: 'resolved',
  overflow: 'overflow',
  noQueryProvided: 'noQueryProvided',
  noHits: 'noHits',
  rejected: 'rejected',
}
const ERROR_ASYNC = {
  rejected: 'errorUnknown',
}

function asyncReducer(state, action) {
  switch (action.type) {
    case 'pending': {
      return { status: STATUS.pending, data: null, error: null }
    }
    case 'resolved': {
      return { status: STATUS.resolved, data: action.data, error: null }
    }
    case 'rejected': {
      return { status: STATUS.rejected, data: null, error: ERROR_ASYNC.rejected } // for debug use: action.error
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function useAsync(asyncCallback, initialState) {
  const [state, dispatch] = React.useReducer(asyncReducer, {
    status: STATUS.idle,
    data: null,
    error: null,
    ...initialState,
  })
  useEffect(() => {
    const promise = asyncCallback()
    if (!promise) return
    dispatch({ type: STATUS.pending })
    promise.then(
      data => {
        const { errorCode } = data
        if (errorCode) dispatch({ type: STATUS.rejected, error: errorCode })
        else dispatch({ type: STATUS.resolved, data })
      },
      error => dispatch({ type: STATUS.rejected, error }) // 'error-unknown'
    )
  }, [asyncCallback])

  return state
}

export { STATUS, ERROR_ASYNC, useAsync }