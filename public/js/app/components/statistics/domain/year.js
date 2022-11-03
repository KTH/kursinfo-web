const YEAR_MINIMUM = 2019 // The earliest year accepted by the system.

function getYears() {
  const today = new Date()
  const currentYear = today.getFullYear()
  const nextYear = currentYear + 1
  const years = []
  let y = YEAR_MINIMUM
  while (y <= nextYear) {
    years.push(y)
    y++
  }
  return years
}

export default { getYears }
