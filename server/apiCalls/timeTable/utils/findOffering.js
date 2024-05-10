const { convertSemesterToSeasonString } = require('./timeTableDateUtils')

const createId = (courseCode, applicationCode, semester) =>
  `${courseCode}-${applicationCode} (${convertSemesterToSeasonString(semester)})`

const findOffering = ({ offerings, courseCode, applicationCode, semester }) => {
  const wantedId = createId(courseCode, applicationCode, semester)
  return offerings.find(({ id }) => id === wantedId)
}

module.exports = {
  findOffering,
}
