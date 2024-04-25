/**
 *
 * @param {number} term
 * @returns
 */
const parseTermIntoYearTermArray = term => {
  const yearTermArrayStrings = term.toString().match(/.{1,4}/g)

  return yearTermArrayStrings.map(str => Number(str))
}

const parseTermIntoYearTerm = term => {
  const [year, termNumber] = parseTermIntoYearTermArray(term)

  return {
    year,
    termNumber,
  }
}

/**
 *
 * @param {Number} semester
 */
const convertSemesterIntoFromToDates = semester => {
  console.log(Number.isNaN(''))
  if (Number.isNaN(semester)) {
    const year = 2023
    return {
      start: `${year}-01-01T00:00:00`,
      end: `${year}-06-30T23:59:59`,
    }
  }

  const { year } = parseTermIntoYearTerm(semester)

  return {
    start: `${year}-01-01T00:00:00`,
    end: `${year}-06-30T23:59:59`,
  }
}

module.exports = {
  convertSemesterIntoFromToDates,
}
