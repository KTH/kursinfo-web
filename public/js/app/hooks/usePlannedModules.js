import { useMemo } from 'react'
import { useWebContext } from '../context/WebContext'
import { getPlannedModules } from './api/getPlannedModules'
import { useApi } from './useApi'
import { useMissingInfo } from './useMissingInfo'

const MISSING_INFO = ''

export const usePlannedModules = ({ courseCode, selectedSemester, applicationCode }) => {
  const context = useWebContext()
  const { missingInfoLabel } = useMissingInfo()

  const basePath = context.paths.api.plannedSchemaModules.uri

  const requestData = useMemo(
    () => ({
      basePath,
      courseCode,
      semester: selectedSemester,
      applicationCode,
    }),
    [basePath, courseCode, selectedSemester, applicationCode]
  )

  const { data, isError, isLoading } = useApi(getPlannedModules, requestData, null, MISSING_INFO)

  const plannedModules = data === MISSING_INFO ? missingInfoLabel : data

  return {
    plannedModules,
    isError,
    isLoading,
  }
}
