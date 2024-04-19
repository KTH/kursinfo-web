const YEAR_PART_INDEX = 0
const TERM_PART_INDEX = 1
const YEAR_SEMESTER_PART_INDEX = 2

const getYear = semesterArray => semesterArray[YEAR_PART_INDEX]

const getTerm = semesterArray => semesterArray[TERM_PART_INDEX]

const getYearSemester = semesterArray => semesterArray[YEAR_SEMESTER_PART_INDEX]

module.exports = {
  getYear,
  getTerm,
  getYearSemester,
}
