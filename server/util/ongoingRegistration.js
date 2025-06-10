export const checkIfOngoingRegistration = (startDate, periods) => {
  const registrationDates = { HT: '03-15', VT: '09-15', ST: '02-15' }
  let code = ''
  let semester = ''
  let year = ''
  let registrationDateString = ''
  const matchedPeriod = periods.find(
    period =>
      startDate >= period.Giltighetsperiod.Startdatum &&
      startDate <= period.Giltighetsperiod.Slutdatum &&
      ['HT', 'VT'].includes(period.Kod.slice(0, 2))
  )
  if (!matchedPeriod) {
    // Summer
    semester = 'ST'
    year = startDate.substring(0, 4)
    registrationDateString = `${year}-${registrationDates.ST}`
  } else {
    code = matchedPeriod?.Kod
    semester = code?.slice(0, 2)
    year = code?.slice(2, 6)
    registrationDateString = `${year}-${registrationDates[semester]}`
  }

  const date = new Date(registrationDateString)
  const day = date.getDay()

  if (day === 6) {
    date.setDate(date.getDate() + 2)
  } else if (day === 0) {
    date.setDate(date.getDate() + 1)
  }
  const [firstRegistrationDate] = date.toISOString().split('T')

  const currentDate = new Date()
  const [formattedCurrentDate] = currentDate.toISOString().split('T')

  return formattedCurrentDate >= firstRegistrationDate && formattedCurrentDate < startDate
}
