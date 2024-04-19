const { INFORM_IF_IMPORTANT_INFO_IS_MISSING } = require('../util/constants')
const { parseYearTermIntoTerm } = require('../util/semesterUtils')

/**
 * Generates a semester-string based on the current year and month.
 * E.g. if its May 2024, the semester string would be `20242`
 *
 */
function generateSelectedSemesterBasedOnDate(thisDate) {
  const currentYear = thisDate.getFullYear()
  switch (thisDate.getMonth()) {
    case 0: // January
    case 1: // February
      return `${currentYear}1`
    case 2: // March
    case 3:
    case 4:
    case 5:
    case 6:
    case 7: // August
      return `${currentYear}2`
    case 8: // September
    case 9:
    case 10:
    case 11: // December
      return `${currentYear + 1}1`
    default:
      return ''
  }
}

const semesterExistsInArray = (needle, haystack) => haystack.some(({ semester }) => semester === needle)

const calculateInitiallySelectedSemester = (activeSemesters, startSemesterFromQuery) => {
  if (!activeSemesters || activeSemesters.length === 0) {
    return null
  }

  if (semesterExistsInArray(startSemesterFromQuery, activeSemesters)) {
    return Number(startSemesterFromQuery)
  }

  const semesterBasedOnDate = generateSelectedSemesterBasedOnDate(new Date())

  if (semesterExistsInArray(semesterBasedOnDate, activeSemesters)) {
    return Number(semesterBasedOnDate)
  }

  return parseYearTermIntoTerm(activeSemesters.at(-1))
}

// function isSyllabusValidForThisSemester(syllabusStartSemester, semester) {
//   return syllabusStartSemester <= semester
// }

// function getValidSyllabusIndexForSemester(publicSyllabusVersions, semester) {
//   const latestSyllabusIndex = 0
//   for (let syllabusIndex = latestSyllabusIndex; syllabusIndex < publicSyllabusVersions.length; syllabusIndex++) {
//     const prevSyllabusStartSemester = parseYearTermIntoTerm(publicSyllabusVersions[syllabusIndex].course_valid_from)

//     const isPrevSyllabusValidForThisSemester = isSyllabusValidForThisSemester(prevSyllabusStartSemester, semester)

//     if (isPrevSyllabusValidForThisSemester) {
//       return syllabusIndex
//     }
//   }

//   return latestSyllabusIndex
// }

// const createSemestersAndSyllabusConnection = (publicSyllabusVersions, activeSemesters) => {
//   const semesterToSyllabus = {}
//   activeSemesters.forEach(({ semester }) => {
//     const semesterInt = Number(semester)

//     semesterToSyllabus[semester] = getValidSyllabusIndexForSemester(publicSyllabusVersions, semesterInt)
//   })

//   return semesterToSyllabus // {20232: 0, 20242: 1}
// }

const parseOrSetEmpty = (value, language, setEmpty = false) => {
  const emptyText = setEmpty ? '' : INFORM_IF_IMPORTANT_INFO_IS_MISSING[language]
  return value ? value : emptyText
}

module.exports = {
  // createSemestersAndSyllabusConnection,
  calculateInitiallySelectedSemester,
  generateSelectedSemesterBasedOnDate,
  parseOrSetEmpty,
}
