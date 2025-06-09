/**
 * semester: 20242 (Number) -> Autumn 2024
 * yearSemesterNubmer: {
 *    year: number
 *    semesterNumber: number
 * }
 *
 */

const SEMESTER_NUMBER = {
  SPRING: 1,
  AUTUMN: 2,
}

/**
 * Takes a yearSemesterNumber and returns a yearSemesterNumber representing the semester previous to the given semester
 *
 * @param {Object} yearSemesterNumber
 * @returns
 */
const calcPreviousSemester = ({ year, semesterNumber }) => {
  if (semesterNumber === 2) {
    return {
      year,
      semesterNumber: 1,
    }
  }

  return {
    year: year - 1,
    semesterNumber: 2,
  }
}

/**
 *
 * @param {number} semester
 * @returns
 */
const parseSemesterIntoYearSemesterNumberArray = semester => {
  const yearSemesterNumberArrayStrings = semester.toString().match(/.{1,4}/g)

  return yearSemesterNumberArrayStrings.map(str => Number(str))
}

const getPeriodCodeForDate = date => {
  const JULY = 6
  const year = date.getFullYear()
  const month = date.getMonth()
  const semester = month < JULY ? '1' : '2'
  return `${year}${semester}`
}

const parseLadokSemester = semester => {
  let match = undefined
  if (semester) {
    match = semester.match(/(HT|VT)(\d{4})/)
  }

  if (!match) throw new Error("Invalid semester format. Expected 'HTYYYY' or 'VTYYYY'.")

  const [, term, year] = match
  const semesterNumber = term === 'VT' ? 1 : 2

  return [Number(year), semesterNumber]
}
function parseSemester(semester) {
  let match = undefined
  if (semester) {
    match = semester.match(/^(\d{4})([1|2])$/)
  }

  if (!match) throw new Error("Invalid semester format. Expected 'YYYYS' where S is 1 for VT or 2 for HT.")

  const [, year, term] = match
  const semesterNumber = term === '1' ? 1 : 2

  return [Number(year), semesterNumber]
}

const parseSemesterIntoYearSemesterNumber = semester => {
  const semesterRegex = /^([A-Za-z]{2}\d{4})$/
  const ladokFormat = semesterRegex.test(semester)
  if (ladokFormat) {
    const [year, semesterNumber] = parseLadokSemester(semester)
    return {
      year,
      semesterNumber,
    }
  } else {
    const [year, semesterNumber] = parseSemester(String(semester))
    return {
      year,
      semesterNumber,
    }
  }
}

const convertYearSemesterNumberIntoSemester = ({ year, semesterNumber }) => Number(`${year}${semesterNumber}`)

const SPRING_MONTHS = [0, 1, 2, 3, 4, 5]

const getSemesterNumberByMonth = month => {
  if (SPRING_MONTHS.includes(month)) {
    return 1
  }
  return 2
}

const getCurrentYearAndSemesterNumber = () => {
  const now = new Date()
  const semesterNumber = getSemesterNumberByMonth(now.getMonth())

  return {
    year: now.getFullYear(),
    semesterNumber,
  }
}

const getSemester = (dateStr, language) => {
  const [yearStr, monthStr] = dateStr.split('-')
  const year = parseInt(yearStr, 10)
  const month = parseInt(monthStr, 10)

  if (month >= 1 && month <= 7) {
    return `${language === 'sv' ? 'VT' : 'Spring'} ${year}`
  } else if (month >= 8 && month <= 12) {
    return `${language === 'sv' ? 'HT' : 'Autumn'} ${year}`
  }

  throw new Error('Invalid date format or value')
}

const getSemesterForDate = (date, periods, language) => {
  const [year] = date.split('-')
  if (periods) {
    const springPeriod = periods.data.Period.find(item => item.Kod === `VT${year}`)
    if (date >= springPeriod.Giltighetsperiod.Startdatum && date <= springPeriod.Giltighetsperiod.Slutdatum) {
      return `${language === 'sv' ? 'VT' : 'Spring'} ${year}`
    }
    const autumnPeriod = periods.data.Period.find(item => item.Kod === `HT${year}`)
    if (date >= autumnPeriod.Giltighetsperiod.Startdatum && date <= autumnPeriod.Giltighetsperiod.Slutdatum) {
      return `${language === 'sv' ? 'HT' : 'Autumn'} ${year}`
    }
  }
  return ''
}

// I want global isNaN
// eslint-disable-next-line no-restricted-globals
const isFiveDigitNumber = semester => semester.toString().length === 5 && !isNaN(semester)

const convertToYearSemesterNumberOrGetCurrent = semester => {
  if (!isFiveDigitNumber(semester)) {
    return getCurrentYearAndSemesterNumber()
  }

  return parseSemesterIntoYearSemesterNumber(semester)
}

module.exports = {
  getPeriodCodeForDate,
  calcPreviousSemester,
  parseSemesterIntoYearSemesterNumberArray,
  parseSemesterIntoYearSemesterNumber,
  convertYearSemesterNumberIntoSemester,
  convertToYearSemesterNumberOrGetCurrent,
  getCurrentYearAndSemesterNumber,
  getSemester,
  getSemesterForDate,
  SEMESTER_NUMBER,
}
