import { useEffect, useState } from 'react'
import { STATUS } from './api/status'

export const useApi = (apiToCall, apiParams, defaultValue, defaulValueIfNullResponse) => {
  const [data, setData] = useState(defaultValue)
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setData(defaultValue)
      setIsError(false)
      try {
        const result = await apiToCall(apiParams)
        setData(result.data || defaulValueIfNullResponse)
        setIsError(result.status === STATUS.ERROR)
      } catch (error) {
        setIsError(true)
        setData(defaulValueIfNullResponse)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()

    // we do not want to react on defaultValue and defaulValueIfNullResponse, because otherwise
    // we cannot use empty objects
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiToCall, apiParams])

  return {
    data,
    isError,
    isLoading,
  }
}
