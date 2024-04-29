import { useEffect, useState } from 'react'
import { useWebContext } from '../context/WebContext'
import { getPlannedModules, STATUS } from './api/getPlannedModules'
import { useMissingInfo } from './useMissingInfo'

const MISSING_INFO = ''

export const usePlannedModules = ({ courseCode, semester, applicationCode, showRoundData }) => {
  const [context] = useWebContext()
  const { missingInfoLabel } = useMissingInfo()

  const [plannedModules, setPlannedModules] = useState(null)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setPlannedModules(null)
      setIsError(false)

      if (!showRoundData) {
        return
      }

      if (!courseCode || !semester || !applicationCode) {
        setPlannedModules(MISSING_INFO)
      } else {
        const basePath = context.paths.api.plannedSchemaModules.uri
        const result = await getPlannedModules({ basePath, courseCode, semester, applicationCode })
        setPlannedModules(result.plannedModules || MISSING_INFO)
        setIsError(result.status === STATUS.ERROR)
      }
    }
    fetchData()
  }, [applicationCode, context, courseCode, semester, showRoundData])

  return {
    plannedModules: plannedModules === MISSING_INFO ? missingInfoLabel : plannedModules,
    isError,
  }
}
