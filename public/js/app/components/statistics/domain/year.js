function getYears() {
  const earliestYear = '2019'
  const today = new Date()
  const currentYear = today.getFullYear()
  const years = []
  let y = earliestYear
  while (y <= currentYear) {
    years.push(y)
    y++
  }
  return years
}

export default { getYears }
