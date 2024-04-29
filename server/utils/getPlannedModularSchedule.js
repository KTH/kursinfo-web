const { getOfferingsWithModules: getOfferingsWithModules } = require('../apiCalls/timeTableApi')
const { createPlannedModularString } = require('./createPlannedModularString')
const { findOffering } = require('./findOffering')

const getPlannedModularOrEmptyString = matchingOffering => {
  if (!matchingOffering) {
    return ''
  }

  return createPlannedModularString(matchingOffering.modules)
}

const getOfferingsOrEmpty = async (courseCode, semester) => {
  try {
    const offerings = await getOfferingsWithModules(courseCode, semester)

    return offerings
  } catch (error) {
    return []
  }
}

const extractPlannedModularSchedule = ({ offerings, courseCode, semester, applicationCode }) => {
  const firstMatchingOffering = findOffering({ offerings, courseCode, semester, applicationCode })

  return getPlannedModularOrEmptyString(firstMatchingOffering)
}

const getPlannedModularSchedule = async ({ courseCode, semester, applicationCode }) => {
  const offerings = await getOfferingsOrEmpty(courseCode, semester)
  return extractPlannedModularSchedule({ offerings, courseCode, semester, applicationCode })
}

module.exports = {
  getPlannedModularSchedule,
}
