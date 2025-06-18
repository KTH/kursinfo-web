const ANTAGNING_BASE_URL = 'https://www.antagning.se'

const createApplicationLink = ladokRound => {
  const tillfalleskod = ladokRound?.tillfalleskod
  const startperiodCode = ladokRound?.startperiod?.code

  if (!tillfalleskod || !startperiodCode) {
    return ''
  }

  const semester = startperiodCode.replace(/([A-Za-z]+)(\d+)/, '$1_$2')
  return `${ANTAGNING_BASE_URL}/se/addtobasket?period=${semester}&id=KTH-${tillfalleskod}`
}

module.exports = { createApplicationLink }
