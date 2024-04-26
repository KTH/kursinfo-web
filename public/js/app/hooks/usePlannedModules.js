import { useEffect, useState } from 'react'
import { useWebContext } from '../context/WebContext'
import { getPlannedModules } from './api/getPlannedModules'

export const usePlannedModules = ({ courseCode, semester, applicationCode }) => {
  // anropa API:et
  // returnera värdet
  // loading
  // default-value
  // error-state
  // nollställa gamla datat
  // const [context] = useWebContext()
  // const basePath = context.paths.api.plannedSchemaModules.uri
  // const [plannedModules, setPlannedModules] = useState(null)
  // useEffect(() => {
  //   async function fetchData() {
  //     setPlannedModules(null)
  //     const result = await getPlannedModules({
  //       basePath,
  //       courseCode,
  //       semester,
  //       applicationCode,
  //     })
  //     setPlannedModules(result.plannedModules)
  //   }
  //   fetchData()
  // }, [applicationCode, basePath, courseCode, semester])
  // return {
  //   plannedModules,
  // }
}
