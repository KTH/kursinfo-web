const { createApplicationLink } = require('../../util/createApplicationLink')

describe('Tests the logic for creating the link to antagning.se', () => {
  it('should take the ladok round data and return a url on the correct format', () => {
    const ladokRound = { tillfalleskod: '20083', startperiod: { code: 'VT2025' } }
    expect(createApplicationLink(ladokRound)).toEqual(
      'https://www.antagning.se/se/addtobasket?period=VT_2025&id=KTH-20083'
    )
  })
  it('should return antagning.se as the url if tillfalleskod or startperiod.code do not exist', () => {
    const ladokRound = {}
    expect(createApplicationLink(ladokRound)).toEqual('https://www.antagning.se')
  })
})
