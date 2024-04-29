import { useEffect, useState } from 'react'
import { useWebContext } from '../context/WebContext'
import { getPlannedModules, STATUS } from './api/getPlannedModules'
import { useMissingInfo } from './useMissingInfo'

export const usePlannedModules = ({ courseCode, semester, applicationCode }) => {
  const [context] = useWebContext()
  const { missingInfoLabel } = useMissingInfo()

  const [plannedModules, setPlannedModules] = useState(null)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setPlannedModules(null)
      setIsError(false)

      const basePath = context.paths.api.plannedSchemaModules.uri
      const result = await getPlannedModules({ basePath, courseCode, semester, applicationCode })
      setPlannedModules(result.plannedModules || '')
      setIsError(result.status === STATUS.ERROR)
    }
    fetchData()
  }, [applicationCode, context, courseCode, semester])

  return {
    plannedModules: plannedModules === '' ? missingInfoLabel : plannedModules,
    isError,
  }
}
