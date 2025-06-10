import { ongoingRegistrationPeriod } from '../RoundSelector/RoundApplicationButton'

const periods = [
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

describe('Tests the logic for when the application button should be visible', () => {
  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2025-10-01'))
  })

  afterAll(() => {
    // Restore real timers after the test
    jest.useRealTimers()
  })
  it('should return true if the current date is within the registration period', () => {
    jest.setSystemTime(new Date('2025-10-01'))
    expect(ongoingRegistrationPeriod('2025-10-02', periods)).toEqual(true)
  })
  it('should return false if the current date is not within the registration period', () => {
    jest.setSystemTime(new Date('2025-10-02'))
    expect(ongoingRegistrationPeriod('2025-10-02', periods)).toEqual(false)
  })
})
