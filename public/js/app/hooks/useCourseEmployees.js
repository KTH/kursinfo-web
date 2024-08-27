import { useEffect } from 'react'
import { useWebContext } from '../context/WebContext'
import { useApi } from './useApi'
import { getCourseEmployees } from './api/getCourseEmployees'

export const useCourseEmployees = ({ courseCode, selectedSemester, applicationCode }) => {
  const context = useWebContext()

  const { uri } = context.paths.api.employees

  const { data, isError, setApiParams } = useApi(getCourseEmployees, {
    uri,
    courseCode,
    selectedSemester,
    applicationCode,
  })

  useEffect(() => {
    setApiParams({ uri, courseCode, selectedSemester, applicationCode })
  }, [applicationCode, courseCode, selectedSemester, setApiParams, uri])

  return {
    courseRoundEmployees: data,
    isError,
  }
}
