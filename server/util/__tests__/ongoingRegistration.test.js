import {
  checkIfOngoingRegistration,
  computeFirstRegistrationDate,
  EXTENDED_SEMESTER_NUMBER,
} from '../ongoingRegistration'
import { findMatchedPeriod, SEMESTER_NUMBER } from '../semesterUtils'

const mockedPeriods = [
  {
    Giltighetsperiod: {
      Slutdatum: '2024-06-03',
      Startdatum: '2024-01-16',
    },
    Kod: 'VT2024',
  },
  {
    Giltighetsperiod: {
      Slutdatum: '2025-01-13',
      Startdatum: '2024-08-26',
    },
    Kod: 'HT2024',
  },
  {
    Giltighetsperiod: {
      Slutdatum: '2025-06-02',
      Startdatum: '2025-01-14',
    },
    Kod: 'VT2025',
  },
  {
    Giltighetsperiod: { Slutdatum: '2026-01-12', Startdatum: '2025-08-25' },
    Kod: 'HT2025',
  },
  {
    Giltighetsperiod: { Slutdatum: '2025-12-31', Startdatum: '2025-01-01' },
    Kod: '2025',
  },
  {
    Giltighetsperiod: {
      Slutdatum: '2026-06-01',
      Startdatum: '2026-01-13',
    },
    Kod: 'VT2026',
  },
]

describe('Tests the logic of the checkIfOngoingRegistration function', () => {
  describe('returns false if parameters are invalid', () => {
    test.each([undefined, '', null])('returns false if date is invalid: "%s"', startDate => {
      expect(checkIfOngoingRegistration(startDate, mockedPeriods)).toBeFalse()
    })

    test.each([undefined, []])('returns false if periods are: %s', periods => {
      expect(checkIfOngoingRegistration('2025-10-01', periods)).toBeFalse()
    })
  })

  beforeAll(() => {
    // Set the mocked date
    jest.useFakeTimers()
  })

  afterAll(() => {
    // Restore real timers after the test
    jest.useRealTimers()
  })

  describe('startDate is in the Autumn', () => {
    describe('if startDate is on a weekend', () => {
      it.each(['2025-03-17', '2025-03-18', '2025-10-01'])(
        'Should return true if the current date (%s) is within the registration period',
        currentDate => {
          jest.setSystemTime(new Date(currentDate))
          expect(checkIfOngoingRegistration('2025-10-02', mockedPeriods)).toBeTrue()
        }
      )
      it('Should return false if the current date is past the registration period', () => {
        jest.setSystemTime(new Date('2025-10-03'))
        expect(checkIfOngoingRegistration('2025-10-02', mockedPeriods)).toBeFalse()
      })
      it('Should return false if the current date is before the registration period', () => {
        jest.setSystemTime(new Date('2025-03-16'))
        expect(checkIfOngoingRegistration('2025-10-02', mockedPeriods)).toBeFalse()
      })
    })
    describe('if startDate is on a weekday', () => {
      it.each(['2024-03-15', '2024-03-16', '2024-10-01'])(
        'Should return true if the current date (%s) is within the registration period',
        currentDate => {
          jest.setSystemTime(new Date(currentDate))
          expect(checkIfOngoingRegistration('2024-10-02', mockedPeriods)).toBeTrue()
        }
      )
      it('Should return false if the current date is past the registration period', () => {
        jest.setSystemTime(new Date('2024-10-03'))
        expect(checkIfOngoingRegistration('2024-10-02', mockedPeriods)).toBeFalse()
      })
      it('Should return false if the current date is before the registration period', () => {
        jest.setSystemTime(new Date('2024-03-14'))
        expect(checkIfOngoingRegistration('2024-10-02', mockedPeriods)).toBeFalse()
      })
    })
  })

  describe('startDate is in the Spring', () => {
    describe('if startDate is on a weekend', () => {
      it.each(['2024-09-16', '2024-09-17', '2025-01-22'])(
        'Should return true if the current date (%s) is within the registration period',
        currentDate => {
          jest.setSystemTime(new Date(currentDate))
          expect(checkIfOngoingRegistration('2025-01-23', mockedPeriods)).toBeTrue()
        }
      )
      it('Should return false if the current date is past the registration period', () => {
        jest.setSystemTime(new Date('2025-01-23'))
        expect(checkIfOngoingRegistration('2025-01-23', mockedPeriods)).toBeFalse()
      })
      it('Should return false if the current date is before the registration period', () => {
        jest.setSystemTime(new Date('2024-09-15'))
        expect(checkIfOngoingRegistration('2025-01-23', mockedPeriods)).toBeFalse()
      })
    })
    describe('if startDate is on a weekday', () => {
      it.each(['2025-09-15', '2025-09-16', '2026-01-23'])(
        'Should return true if the current date (%s) is within the registration period',
        currentDate => {
          jest.setSystemTime(new Date(currentDate))
          expect(checkIfOngoingRegistration('2026-01-24', mockedPeriods)).toBeTrue()
        }
      )
      it('Should return false if the current date is past the registration period', () => {
        jest.setSystemTime(new Date('2026-01-25'))
        expect(checkIfOngoingRegistration('2026-01-24', mockedPeriods)).toBeFalse()
      })
      it('Should return false if the current date is before the registration period', () => {
        jest.setSystemTime(new Date('2025-09-14'))
        expect(checkIfOngoingRegistration('2026-01-24', mockedPeriods)).toBeFalse()
      })
    })
  })

  describe('startDate is in the Summer', () => {
    describe('if startDate is on a weekend', () => {
      it.each(['2025-02-17', '2025-02-18', '2025-06-24'])(
        'Should return true if the current date (%s) is within the registration period',
        currentDate => {
          jest.setSystemTime(new Date(currentDate))
          expect(checkIfOngoingRegistration('2025-06-25', mockedPeriods)).toBeTrue()
        }
      )
      it('Should return false if the current date is past the registration period', () => {
        jest.setSystemTime(new Date('2025-06-25'))
        expect(checkIfOngoingRegistration('2025-06-25', mockedPeriods)).toBeFalse()
      })
      it('Should return false if the current date is before the registration period', () => {
        jest.setSystemTime(new Date('2025-02-16'))
        expect(checkIfOngoingRegistration('2025-06-25', mockedPeriods)).toBeFalse()
      })
    })
    describe('if startDate is on a weekday', () => {
      it.each(['2024-02-15', '2024-02-16', '2024-06-24'])(
        'Should return true if the current date (%s) is within the registration period',
        currentDate => {
          jest.setSystemTime(new Date(currentDate))
          expect(checkIfOngoingRegistration('2024-06-25', mockedPeriods)).toBeTrue()
        }
      )
      it('Should return false if the current date is past the registration period', () => {
        jest.setSystemTime(new Date('2024-06-25'))
        expect(checkIfOngoingRegistration('2024-06-25', mockedPeriods)).toBeFalse()
      })
      it('Should return false if the current date is before the registration period', () => {
        jest.setSystemTime(new Date('2024-02-14'))
        expect(checkIfOngoingRegistration('2024-06-25', mockedPeriods)).toBeFalse()
      })
    })
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
