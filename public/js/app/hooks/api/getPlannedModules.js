import { STATUS } from './status'

export const getPlannedModules = async ({ basePath, courseCode, semester, applicationCode }) => {
  if (!basePath || !courseCode || !semester || !applicationCode) {
    return {
      status: STATUS.OK,
      data: null,
    }
  }

  try {
    const uri = basePath
      .replace(':courseCode', courseCode)
      .replace(':semester', semester)
      .replace(':applicationCode', applicationCode)

    const result = await fetch(uri)

    if (!result.ok) {
      return {
        status: STATUS.ERROR,
        data: null,
      }
    }

    const { plannedModules } = await result.json()

    return {
      status: STATUS.OK,
      data: plannedModules,
    }
  } catch (error) {
    return {
      status: STATUS.ERROR,
      data: null,
    }
  }
}
