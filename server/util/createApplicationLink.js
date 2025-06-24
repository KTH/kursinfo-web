const serverConfig = require('../configuration').server

const createApplicationLink = ladokRound => {
  const tillfalleskod = ladokRound?.tillfalleskod
  const startperiodCode = ladokRound?.startperiod?.code

  if (!tillfalleskod || !startperiodCode || !startperiodCode.match(/^(HT|VT)\d{4}$/)) {
    return ''
  }
  // Target format should be 'https://www.antagning.se/se/addtobasket?period=VT_2025&id=KTH-20083' where 20083 is the tillfalleskod.
  const semester = startperiodCode.replace(/([A-Za-z]+)(\d+)/, '$1_$2')
  return `${serverConfig.antagningSubmitUrl}?period=${semester}&id=KTH-${tillfalleskod}`
}

module.exports = { createApplicationLink }
