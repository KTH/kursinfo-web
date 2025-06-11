const { parseSemesterIntoYearSemesterNumber, findMatchedPeriod, SEMESTER_NUMBER } = require('./semesterUtils')

export const computeFirstRegistrationDate = ladokSemester => {
  const registrationDates = { [SEMESTER_NUMBER.SPRING]: '09-15', [SEMESTER_NUMBER.AUTUMN]: '03-15' }
  const summerRegistrationDate = '02-15'
  const registrationDateString = `${ladokSemester.year}-${ladokSemester.semesterNumber != 3 ? registrationDates[ladokSemester.semesterNumber] : summerRegistrationDate}`

  // Check if registration date occurs on a weekend and adjust to monday in that case
  const date = new Date(registrationDateString)
  const day = date.getDay()
  if (day === 6) date.setDate(date.getDate() + 2)
  else if (day === 0) date.setDate(date.getDate() + 1)
  return date.toISOString().split('T')[0]
}

export const checkIfOngoingRegistration = (startDate, periods) => {
  let ladokSemester = []

  const matchedPeriod = findMatchedPeriod(startDate, periods)

  ladokSemester = matchedPeriod
    ? (ladokSemester = parseSemesterIntoYearSemesterNumber(matchedPeriod.Kod))
    : (ladokSemester = { year: Number(startDate.substring(0, 4)), semesterNumber: 3 })
  const firstRegistrationDate = computeFirstRegistrationDate(ladokSemester)

  const currentDate = new Date()
  const [formattedCurrentDate] = currentDate.toISOString().split('T')

  return formattedCurrentDate >= firstRegistrationDate && formattedCurrentDate < startDate
}
