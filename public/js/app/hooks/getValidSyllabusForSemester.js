const { convertYearSemesterNumberIntoSemester } = require('../../../../server/util/semesterUtils')

const isSyllabusValidForThisSemester = (syllabusStartSemester, semester) => syllabusStartSemester <= semester

const getValidSyllabusForSemester = (publicSyllabusVersions, semester) =>
  publicSyllabusVersions.find(syllabus => {
    const prevSyllabusStartSemester = convertYearSemesterNumberIntoSemester(syllabus.course_valid_from)

    return isSyllabusValidForThisSemester(prevSyllabusStartSemester, semester)
  })

module.exports = {
  getValidSyllabusForSemester,
}
