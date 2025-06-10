import { checkIfOngoingRegistration } from '../ongoingRegistration'

const mockedPeriods = [
  {
    Benamning: { sv: 'Hösttermin 2025', en: 'Autumn semester 2025' },
    Beskrivning: {},
    Dolt: false,
    Giltighetsperiod: { Slutdatum: '2026-01-12', Startdatum: '2025-08-25', link: [] },
    ID: '153192',
    Kod: 'HT2025',
    PeriodtypID: '2',
    Slutdatum: '2026-01-12',
    Startdatum: '2025-08-25',
    link: [],
  },
]

describe('Tests the logic of the checkIfOngoingRegistration function', () => {
  beforeAll(() => {
    // Set the mocked date
    jest.useFakeTimers()
  })

  afterAll(() => {
    // Restore real timers after the test
    jest.useRealTimers()
  })
  it('Should return true if the current date (today) is within the registration period', () => {
    jest.setSystemTime(new Date('2025-10-01'))
    expect(checkIfOngoingRegistration('2025-10-02', mockedPeriods)).toEqual(true)
  })
  it('Should return false if the current date (today) is NOT within the registration period', () => {
    jest.setSystemTime(new Date('2025-10-03'))
    expect(checkIfOngoingRegistration('2025-10-02', mockedPeriods)).toEqual(false)
  })
  it('Should be able to handle dates taking place during the summer', () => {
    jest.setSystemTime(new Date('2025-07-03'))
    expect(checkIfOngoingRegistration('2025-07-05', mockedPeriods)).toEqual(true)
  })
})
