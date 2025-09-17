import {
  checkIfOngoingRegistration,
  computeFirstRegistrationDate,
  EXTENDED_SEMESTER_NUMBER,
} from '../ongoingRegistration'
import { findMatchedPeriod, SEMESTER_NUMBER } from '../semesterUtils'

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
  {
    Benamning: { sv: 'Kalenderår 2025', en: 'Calendar year 2025' },
    Beskrivning: {},
    Dolt: false,
    Giltighetsperiod: { Slutdatum: '2025-12-31', Startdatum: '2025-01-01', link: [] },
    ID: '29156',
    Kod: '2025',
    PeriodtypID: '1',
    Slutdatum: '2025-12-31',
    Startdatum: '2025-01-01',
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
  it('Should return false if the current date is past the registration period', () => {
    jest.setSystemTime(new Date('2025-10-03'))
    expect(checkIfOngoingRegistration('2025-10-02', mockedPeriods)).toEqual(false)
  })
  it('Should return false if the current date is before the registration period', () => {
    jest.setSystemTime(new Date('2025-03-14'))
    expect(checkIfOngoingRegistration('2025-10-02', mockedPeriods)).toEqual(false)
  })
  it('Should return undefined for a date during the summer', () => {
    jest.setSystemTime(new Date('2025-07-03'))
    expect(findMatchedPeriod('2025-07-05', mockedPeriods)).toEqual(undefined)
  })
  it('Should adjust to monday for a first registration date that occurs during a weekend', () => {
    expect(computeFirstRegistrationDate({ year: 2025, semesterNumber: 2 })).toEqual('2025-03-17')
  })
})

describe('computeFirstRegistrationDate', () => {
  test('should work for autumn semester if date is on a weekday', () => {
    expect(
      computeFirstRegistrationDate({
        year: 2024,
        semesterNumber: SEMESTER_NUMBER.AUTUMN,
      })
    ).toStrictEqual('2024-03-15')
  })

  test('should work for autumn semester if date is on a weekend', () => {
    expect(
      computeFirstRegistrationDate({
        year: 2025,
        semesterNumber: SEMESTER_NUMBER.AUTUMN,
      })
    ).toStrictEqual('2025-03-17')
  })

  test('should work for summer semester if date is on a weekday', () => {
    expect(
      computeFirstRegistrationDate({
        year: 2024,
        semesterNumber: EXTENDED_SEMESTER_NUMBER.SUMMER,
      })
    ).toStrictEqual('2024-02-15')
  })

  test('should work for summer semester if date is on a weekend', () => {
    expect(
      computeFirstRegistrationDate({
        year: 2025,
        semesterNumber: EXTENDED_SEMESTER_NUMBER.SUMMER,
      })
    ).toStrictEqual('2025-02-17')
  })

  test('should work for spring semester if date is on a weekday', () => {
    expect(
      computeFirstRegistrationDate({
        year: 2026,
        semesterNumber: SEMESTER_NUMBER.SPRING,
      })
    ).toStrictEqual('2025-09-15')
  })

  test('should work for spring semester if date is on a weekend', () => {
    expect(
      computeFirstRegistrationDate({
        year: 2025,
        semesterNumber: SEMESTER_NUMBER.SPRING,
      })
    ).toStrictEqual('2024-09-16')
  })
})
