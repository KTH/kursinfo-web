import { calculateActiveSemester, generateSelectedSemesterBasedOnDate } from '../courseCtrlHelpers'

const activeSemesters = [
  {
    year: '2023',
    term: '2',
    semester: '20232',
  },
  {
    year: '2024',
    term: '2',
    semester: '20242',
  },
  {
    year: '2025',
    term: '1',
    semester: '20251',
  },
]

const activeSemestersEverySemester = [
  {
    year: '2023',
    term: '1',
    semester: '20231',
  },
  {
    year: '2023',
    term: '2',
    semester: '20232',
  },
  {
    year: '2024',
    term: '1',
    semester: '20241',
  },
  {
    year: '2024',
    term: '2',
    semester: '20242',
  },
  {
    year: '2025',
    term: '1',
    semester: '20251',
  },
  {
    year: '2025',
    term: '2',
    semester: '20252',
  },
]

describe('courseCtrlHelpers', () => {
  describe('calculateActiveSemester', () => {
    test('should return null if activeSemesters is undefined', () => {
      expect(calculateActiveSemester(undefined, '')).toBe(null)
    })

    test('should return null if activeSemesters is empty', () => {
      expect(calculateActiveSemester([], '')).toBe(null)
    })

    test.each(['20232', '20242', '20251'])(
      'should return startSemesterFromQuery if it exists in array',
      startSemesterFromQuery => {
        expect(calculateActiveSemester(activeSemesters, startSemesterFromQuery)).toBe(startSemesterFromQuery)
      }
    )

    test.each(['20202', '20212', '20221'])(
      'should NOT return startSemesterFromQuery if it does not exist in array',
      startSemesterFromQuery => {
        expect(calculateActiveSemester(activeSemesters, startSemesterFromQuery)).not.toBe(startSemesterFromQuery)
      }
    )

    describe('if no startSemester has been given,', () => {
      describe('try to find a semester based on the current date', () => {
        beforeAll(() => {
          jest.useFakeTimers()
        })

        test.each([
          ['2022-09-04', '20231'],
          ['2023-03-04', '20232'],
          ['2023-12-30', '20241'],
          ['2024-07-04', '20242'],
        ])('should match the date %s to the active semester %s', (currentDate, expectedTerm) => {
          jest.setSystemTime(new Date(currentDate))

          expect(calculateActiveSemester(activeSemestersEverySemester, '')).toBe(expectedTerm)
        })

        afterAll(() => {
          jest.useRealTimers()
        })
      })

      describe('if no matching semester could be found', () => {
        beforeAll(() => {
          jest.useFakeTimers()
        })

        test.each(['2022-09-04', '2023-12-30', '2020-03-04'])(
          'it should return the last/newest semester in the list',
          currentDate => {
            jest.setSystemTime(new Date(currentDate))

            expect(calculateActiveSemester(activeSemesters, '')).toBe(activeSemesters.at(-1))
          }
        )

        afterAll(() => {
          jest.useRealTimers()
        })
      })
    })
  })

  describe('generateSemesterBasedOnDate', () => {
    test('January through February result in period 1 of the same year', () => {
      const expectedSemester = '20241'
      expect(generateSelectedSemesterBasedOnDate(new Date('2024-01-01'))).toBe(expectedSemester)
      expect(generateSelectedSemesterBasedOnDate(new Date('2024-02-29'))).toBe(expectedSemester)
    })

    test('March through August result in period 2 of the same year', () => {
      const expectedSemester = '20242'
      expect(generateSelectedSemesterBasedOnDate(new Date('2024-03-01'))).toBe(expectedSemester)
      expect(generateSelectedSemesterBasedOnDate(new Date('2024-04-29'))).toBe(expectedSemester)
      expect(generateSelectedSemesterBasedOnDate(new Date('2024-05-29'))).toBe(expectedSemester)
      expect(generateSelectedSemesterBasedOnDate(new Date('2024-06-29'))).toBe(expectedSemester)
      expect(generateSelectedSemesterBasedOnDate(new Date('2024-07-29'))).toBe(expectedSemester)
      expect(generateSelectedSemesterBasedOnDate(new Date('2024-08-29'))).toBe(expectedSemester)
    })

    test('September through december result in period 1 of the next year', () => {
      const expectedSemester = '20251'
      expect(generateSelectedSemesterBasedOnDate(new Date('2024-09-01'))).toBe(expectedSemester)
      expect(generateSelectedSemesterBasedOnDate(new Date('2024-10-01'))).toBe(expectedSemester)
      expect(generateSelectedSemesterBasedOnDate(new Date('2024-11-01'))).toBe(expectedSemester)
      expect(generateSelectedSemesterBasedOnDate(new Date('2024-12-01'))).toBe(expectedSemester)
    })
  })
})
