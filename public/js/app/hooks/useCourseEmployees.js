import { useMemo } from 'react'
import { useWebContext } from '../context/WebContext'
import { useApi } from './useApi'
import { getCourseEmployees } from './api/getCourseEmployees'

export const useCourseEmployees = ({ courseCode, selectedSemester, applicationCode }) => {
  const context = useWebContext()

  const { uri } = context.paths.api.employees

  const requestData = useMemo(
    () => ({
      uri,
      courseCode,
      selectedSemester,
      applicationCode,
    }),
    [uri, courseCode, selectedSemester, applicationCode]
  )

  const { data, isError, isLoading } = useApi(getCourseEmployees, requestData)

  return {
    courseRoundEmployees: data,
    isError,
    isLoading,
  }
}
