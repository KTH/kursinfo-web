import { useEffect, useState } from 'react'
import { STATUS } from './api/status'

export const useApi = (apiToCall, initialApiParams, defaultValue, defaulValueIfNullResponse) => {
  const [apiParams, setApiParams] = useState(initialApiParams)
  const [data, setData] = useState(defaultValue)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setData(defaultValue)
      setIsError(false)

      const result = await apiToCall(apiParams)

      setData(result.data || defaulValueIfNullResponse)
      setIsError(result.status === STATUS.ERROR)
    }

    fetchData()

    // we do not want to react on defaultValue and defaulValueIfNullResponse, because otherwise
    // we cannot use empty objects
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiToCall, apiParams])

  return {
    data,
    isError,
    setApiParams,
  }
}
