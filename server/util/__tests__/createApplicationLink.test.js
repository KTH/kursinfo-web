const { createApplicationLink } = require('../createApplicationLink')

jest.mock('../../configuration', () => ({
  server: {
    antagningSubmitUrl: 'https://www.antagning.se/se/addtobasket',
  },
}))

describe('Tests the logic for creating the link to antagning.se', () => {
  it('creates an antagning.se URL for a valid VT start period', () => {
    const ladokRound = { tillfalleskod: '20083', startperiod: { code: 'VT2025' } }
    expect(createApplicationLink(ladokRound)).toEqual(
      'https://www.antagning.se/se/addtobasket?period=VT_2025&id=KTH-20083'
    )
  })
  it('creates an antagning.se URL for a valid HT start period', () => {
    const ladokRound = { tillfalleskod: '99999', startperiod: { code: 'HT2026' } }
    expect(createApplicationLink(ladokRound)).toEqual(
      'https://www.antagning.se/se/addtobasket?period=HT_2026&id=KTH-99999'
    )
  })

  it.each([
    ['missing input', undefined],
    ['missing tillfalleskod', { startperiod: { code: 'VT2025' } }],
    ['missing startperiod', { tillfalleskod: '20083' }],
    ['missing startperiod.code', { tillfalleskod: '20083', startperiod: {} }],
    ['wrong startperiod.code format', { tillfalleskod: '20083', startperiod: { code: '2025' } }],
    ['wrong startperiod.code prefix', { tillfalleskod: '20083', startperiod: { code: 'ST2025' } }],
  ])('returns an empty string for %s', (_label, ladokRound) => {
    expect(createApplicationLink(ladokRound)).toEqual('')
  })
})
