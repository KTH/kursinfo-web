const { convertSemesterToSeasonString } = require('./semesterUtils')

const createId = (courseCode, applicationCode, semester) =>
  `${courseCode}-${applicationCode} (${convertSemesterToSeasonString(semester)})`

const filterOfferings = ({ offerings, courseCode, applicationCode, semester }) => {
  const wantedId = createId(courseCode, applicationCode, semester)
  return offerings.filter(({ id }) => id === wantedId)
}
// offerings.find

module.exports = {
  filterOfferings,
}
