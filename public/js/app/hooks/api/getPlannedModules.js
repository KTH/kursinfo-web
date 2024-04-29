export const STATUS = {
  OK: 'OK',
  ERROR: 'ERROR',
}

export const getPlannedModules = async ({ basePath, courseCode, semester, applicationCode }) => {
  try {
    const uri = basePath
      .replace(':courseCode', courseCode)
      .replace(':semester', semester)
      .replace(':applicationCode', applicationCode)

    const result = await fetch(uri)

    if (!result.ok) {
      return {
        status: STATUS.ERROR,
        plannedModules: null,
      }
    }

    const { plannedModules } = await result.json()

    return {
      status: STATUS.OK,
      plannedModules,
    }
  } catch (error) {
    return {
      status: STATUS.ERROR,
      plannedModules: null,
    }
  }
}
