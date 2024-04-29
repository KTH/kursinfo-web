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

  // const language = req.params.language || 'sv'
  // log.debug('Get Kopps course data for: ', courseCode, language)
  // try {
  //   const { body, statusCode = 500 } = await koppsCourseData.getKoppsCourseData(courseCode, language)
  //   log.debug('Got response from Kopps API for: ', courseCode, language)
  //   if (statusCode === 200) {
  //     log.debug('OK response from Kopps API for: ', courseCode, language)
  //     return httpResponse.json(res, body)
  //   }
  //   log.debug('NOK response from Kopps API for: ', courseCode, language)
  //   res.status(statusCode)
  //   res.statusCode = statusCode
  //   return res.send(courseCode)
  // } catch (err) {
  //   return err
  // }
}

module.exports = {
  getPlannedSchemaModules,
}
