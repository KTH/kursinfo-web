const YEAR_MINIMUM = 2019 // The earliest year accepted by the system.

function getYears() {
  const today = new Date()
  const currentYear = today.getFullYear()
  const years = []
  let y = YEAR_MINIMUM
  while (y <= currentYear) {
    years.push(y)
    y++
  }
  return years
}

export default { getYears }
