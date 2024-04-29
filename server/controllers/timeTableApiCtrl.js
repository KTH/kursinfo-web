const { getPlannedModularSchedule } = require('../apiCalls/timeTable/utils/getPlannedModularSchedule')

const getPlannedSchemaModules = async (req, res, next) => {
  const { courseCode, semester, applicationCode } = req.params

  try {
    const plannedModules = await getPlannedModularSchedule({
      courseCode,
      applicationCode,
      semester,
    })

    res.status(200)
    return res.json({
      plannedModules,
    })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  getPlannedSchemaModules,
}
