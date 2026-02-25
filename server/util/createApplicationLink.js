const serverConfig = require('../configuration').server

const { SEMESTER_NUMBER } = require('./semesterUtils')

/**
 *
 * @returns ST if kthPeriod === 0 or 5. HT/VT if semesterNumber is 2/1
 */
const getSemesterShortCode = (semesterNumber, kthPeriod) => {
  // KTHPeriod 0 and 5 are considered as summer term
  if ([0, 5].includes(kthPeriod)) return 'ST'

  switch (semesterNumber) {
    case SEMESTER_NUMBER.SPRING:
      return 'VT'
    default:
      return 'HT'
  }
}

const createApplicationLink = ({ tillfalleskod, startingKTHPeriod }) => {
  if (!tillfalleskod || !startingKTHPeriod?.semester?.year || !startingKTHPeriod?.semester?.semesterNumber) {
    return ''
  }

  const semester = getSemesterShortCode(startingKTHPeriod.semester.semesterNumber, startingKTHPeriod.period)

  // Target format should be 'https://www.antagning.se/se/addtobasket?period=VT_2025&id=KTH-20083' where 20083 is the tillfalleskod.
  const antagningPeriod = `${semester}_${startingKTHPeriod.semester.year}`

  return `${serverConfig.antagningSubmitUrl}?period=${antagningPeriod}&id=KTH-${tillfalleskod}`
}

module.exports = { createApplicationLink }
