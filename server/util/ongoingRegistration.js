export const computeFirstRegistrationDate = (semester, year) => {
  const registrationDates = { HT: '03-15', VT: '09-15', ST: '02-15' }
  const registrationDateString = `${year}-${registrationDates[semester]}`

  // Check if registration date occurs on a weekend and adjust to monday in that case
  const date = new Date(registrationDateString)
  const day = date.getDay()
  if (day === 6) date.setDate(date.getDate() + 2)
  else if (day === 0) date.setDate(date.getDate() + 1)
  return date.toISOString().split('T')[0]
}

export const findMatchedPeriod = (startDate, periods) => {
  const matchedPeriod = periods.find(
    period =>
      startDate >= period.Giltighetsperiod.Startdatum &&
      startDate <= period.Giltighetsperiod.Slutdatum &&
      ['HT', 'VT'].includes(period.Kod.slice(0, 2))
  )
  return matchedPeriod
}

export const checkIfOngoingRegistration = (startDate, periods) => {
  let semester = ''
  let year = ''

  const matchedPeriod = findMatchedPeriod(startDate, periods)

  if (!matchedPeriod) {
    // Summer
    semester = 'ST'
    year = startDate.substring(0, 4)
  } else {
    semester = matchedPeriod?.Kod.slice(0, 2)
    year = matchedPeriod?.Kod.slice(2, 6)
  }
  const firstRegistrationDate = computeFirstRegistrationDate(semester, year)

  const currentDate = new Date()
  const [formattedCurrentDate] = currentDate.toISOString().split('T')

  return formattedCurrentDate >= firstRegistrationDate && formattedCurrentDate < startDate
}
