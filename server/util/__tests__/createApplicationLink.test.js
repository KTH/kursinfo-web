const { AcademicSemester } = require('@kth/om-kursen-ladok-client')
const { createApplicationLink } = require('../createApplicationLink')

jest.mock('../../configuration', () => ({
  server: {
    antagningSubmitUrl: 'https://www.antagning.se/se/addtobasket',
  },
}))

describe('Tests the logic for creating the link to antagning.se', () => {
  it('creates an antagning.se URL for a valid VT startingKTHPeriod', () => {
    expect(
      createApplicationLink({
        tillfalleskod: '20083',
        startingKTHPeriod: {
          period: 4,
          semester: AcademicSemester.fromLadokPeriodString('VT2025'),
        },
      })
    ).toEqual('https://www.antagning.se/se/addtobasket?period=VT_2025&id=KTH-20083')
  })

  it('creates an antagning.se URL for a valid HT startingKTHPeriod', () => {
    expect(
      createApplicationLink({
        tillfalleskod: '99999',
        startingKTHPeriod: {
          period: 1,
          semester: AcademicSemester.fromLadokPeriodString('HT2026'),
        },
      })
    ).toEqual('https://www.antagning.se/se/addtobasket?period=HT_2026&id=KTH-99999')
  })

  it('creates an antagning.se URL for a valid ST startingKTHPeriod period 5', () => {
    expect(
      createApplicationLink({
        tillfalleskod: '20083',
        startingKTHPeriod: {
          period: 5,
          semester: AcademicSemester.fromLadokPeriodString('VT2025'),
        },
      })
    ).toEqual('https://www.antagning.se/se/addtobasket?period=ST_2025&id=KTH-20083')
  })

  it('creates an antagning.se URL for a valid ST startingKTHPeriod period 0', () => {
    expect(
      createApplicationLink({
        tillfalleskod: '99999',
        startingKTHPeriod: {
          period: 0,
          semester: AcademicSemester.fromLadokPeriodString('HT2026'),
        },
      })
    ).toEqual('https://www.antagning.se/se/addtobasket?period=ST_2026&id=KTH-99999')
  })

  it('falls back to using semesterNumber if kthPeriod is not given VT', () => {
    expect(
      createApplicationLink({
        tillfalleskod: '20083',
        startingKTHPeriod: {
          semester: AcademicSemester.fromLadokPeriodString('VT2025'),
        },
      })
    ).toEqual('https://www.antagning.se/se/addtobasket?period=VT_2025&id=KTH-20083')
  })

  it('falls back to using semesterNumber if kthPeriod is not given HT', () => {
    expect(
      createApplicationLink({
        tillfalleskod: '20083',
        startingKTHPeriod: {
          semester: AcademicSemester.fromLadokPeriodString('HT2026'),
        },
      })
    ).toEqual('https://www.antagning.se/se/addtobasket?period=HT_2026&id=KTH-20083')
  })

  it.each([
    [
      'missing tillfalleskod',
      {
        startingKTHPeriod: {
          period: 4,
          semester: AcademicSemester.fromLadokPeriodString('VT2025'),
        },
      },
    ],
    ['missing startingKTHPeriod', { tillfalleskod: '20083' }],
    ['empty startingKTHPeriod', { tillfalleskod: '20083', startingKTHPeriod: {} }],
    [
      'missing startingKTHPeriod.semester.year',
      { tillfalleskod: '20083', startingKTHPeriod: { period: 5, semester: { semesterNumber: 1 } } },
    ],
    [
      'missing startingKTHPeriod.semester.semesterNumber',
      { tillfalleskod: '20083', startingKTHPeriod: { period: 5, semester: { year: 2025 } } },
    ],
  ])('returns an empty string for %s', (_label, ladokRound) => {
    expect(createApplicationLink(ladokRound)).toEqual('')
  })
})
