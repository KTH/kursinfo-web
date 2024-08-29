import { useWebContext } from '../context/WebContext'
import { getPlannedModules } from './api/getPlannedModules'
import { useApi } from './useApi'
import { useMissingInfo } from './useMissingInfo'

const MISSING_INFO = ''

export const usePlannedModules = ({ courseCode, semester, applicationCode }) => {
  const context = useWebContext()
  const { missingInfoLabel } = useMissingInfo()

  const basePath = context.paths.api.plannedSchemaModules.uri

  const { data, isError, isLoading } = useApi(
    getPlannedModules,
    { basePath, courseCode, semester, applicationCode },
    null,
    MISSING_INFO
  )

  const plannedModules = data === MISSING_INFO ? missingInfoLabel : data

  return {
    plannedModules,
    isError,
    isLoading,
  }
}
