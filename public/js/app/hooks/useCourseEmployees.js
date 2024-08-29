import { useWebContext } from '../context/WebContext'
import { useApi } from './useApi'
import { getCourseEmployees } from './api/getCourseEmployees'

export const useCourseEmployees = ({ courseCode, selectedSemester, applicationCode }) => {
  const context = useWebContext()

  const { uri } = context.paths.api.employees

  const { data, isError, isLoading } = useApi(getCourseEmployees, {
    uri,
    courseCode,
    selectedSemester,
    applicationCode,
  })

  return {
    courseRoundEmployees: data,
    isError,
    isLoading,
  }
}
