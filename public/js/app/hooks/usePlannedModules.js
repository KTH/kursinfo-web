import { useEffect, useMemo } from 'react'
import { useWebContext } from '../context/WebContext'
import { getPlannedModules } from './api/getPlannedModules'
import { useApi } from './useApi'
import { useMissingInfo } from './useMissingInfo'

const MISSING_INFO = ''

export const usePlannedModules = ({ courseCode, semester, applicationCode, showRoundData }) => {
  const [context] = useWebContext()
  const { missingInfoLabel } = useMissingInfo()

  const basePath = context.paths.api.plannedSchemaModules.uri

  const { data, isError, setApiParams } = useApi(
    getPlannedModules,
    { basePath, courseCode, semester, applicationCode },
    null,
    MISSING_INFO
  )

  useEffect(() => {
    setApiParams({ basePath, courseCode, semester, applicationCode })
  }, [applicationCode, basePath, courseCode, semester, setApiParams])

  const plannedModules = useMemo(() => {
    if (!showRoundData) return null
    const pla = data === MISSING_INFO ? missingInfoLabel : data
    return pla
  }, [data, missingInfoLabel, showRoundData])

  return {
    plannedModules,
    isError,
  }
}
