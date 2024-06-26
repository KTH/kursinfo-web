import {
  calculateInitiallySelectedSemester,
  generateSelectedSemesterBasedOnDate,
  isValidCourseCode,
} from '../courseCtrlHelpers'

const activeSemesters = [
  {
    year: '2023',
    semesterNumber: '2',
    semester: '20232',
  },
  {
    year: '2024',
    semesterNumber: '2',
    semester: '20242',
  },
  {
    year: '2025',
    semesterNumber: '1',
    semester: '20251',
  },
]

const activeSemestersEverySemester = [
  {
    year: '2023',
    semesterNumber: '1',
    semester: '20231',
  },
  {
    year: '2023',
    semesterNumber: '2',
    semester: '20232',
  },
  {
    year: '2024',
    semesterNumber: '1',
    semester: '20241',
  },
  {
    year: '2024',
    semesterNumber: '2',
    semester: '20242',
  },
  {
    year: '2025',
    semesterNumber: '1',
    semester: '20251',
  },
  {
    year: '2025',
    semesterNumber: '2',
    semester: '20252',
  },
]

describe('courseCtrlHelpers', () => {
  describe('calculateInitiallySelectedSemester', () => {
    test('should return null if activeSemesters is undefined', () => {
      expect(calculateInitiallySelectedSemester(undefined, '')).toBe(null)
    })

    test('should return null if activeSemesters is empty', () => {
      expect(calculateInitiallySelectedSemester([], '')).toBe(null)
    })

    test.each(['20232', '20242', '20251'])(
      'should return startSemesterFromQuery if it exists in array',
      startSemesterFromQuery => {
        expect(calculateInitiallySelectedSemester(activeSemesters, startSemesterFromQuery)).toBe(
          Number(startSemesterFromQuery)
        )
      }
    )

    test.each(['20202', '20212', '20221'])(
      'should NOT return startSemesterFromQuery if it does not exist in array',
      startSemesterFromQuery => {
        expect(calculateInitiallySelectedSemester(activeSemesters, startSemesterFromQuery)).not.toBe(
          startSemesterFromQuery
        )
      }
    )

    describe('if no startSemester has been given,', () => {
      describe('try to find a semester based on the current date', () => {
        beforeAll(() => {
          jest.useFakeTimers()
        })

        test.each([
          ['2022-10-20', 20231],
          ['2023-04-22', 20232],
          ['2023-12-30', 20241],
          ['2024-07-04', 20242],
        ])('should match the date %s to the active semester %s', (currentDate, expectedTerm) => {
          jest.setSystemTime(new Date(currentDate))

          expect(calculateInitiallySelectedSemester(activeSemestersEverySemester, '')).toBe(expectedTerm)
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

            expect(calculateInitiallySelectedSemester(activeSemesters, '')).toBe(
              Number(activeSemesters.at(-1).semester)
            )
          }
        )

        afterAll(() => {
          jest.useRealTimers()
        })
      })
    })
  })

  describe('generateSemesterBasedOnDate', () => {
    test('January through March result in period 1 of the same year', () => {
      const expectedSemester = '20241'
      expect(generateSelectedSemesterBasedOnDate(new Date('2024-01-01'))).toBe(expectedSemester)
      expect(generateSelectedSemesterBasedOnDate(new Date('2024-02-29'))).toBe(expectedSemester)
      expect(generateSelectedSemesterBasedOnDate(new Date('2024-03-01'))).toBe(expectedSemester)
    })

    test('April 1st through April 19th result in period 1 of the same year', () => {
      const expectedSemester = '20241'
      expect(generateSelectedSemesterBasedOnDate(new Date('2024-04-01'))).toBe(expectedSemester)
      expect(generateSelectedSemesterBasedOnDate(new Date('2024-04-10'))).toBe(expectedSemester)
      expect(generateSelectedSemesterBasedOnDate(new Date('2024-04-19'))).toBe(expectedSemester)
    })

    test('April 20th through April 30th result in period 2 of the same year', () => {
      const expectedSemester = '20242'
      expect(generateSelectedSemesterBasedOnDate(new Date('2024-04-20'))).toBe(expectedSemester)
      expect(generateSelectedSemesterBasedOnDate(new Date('2024-04-25'))).toBe(expectedSemester)
      expect(generateSelectedSemesterBasedOnDate(new Date('2024-04-30'))).toBe(expectedSemester)
    })

    test('May through September result in period 2 of the same year', () => {
      const expectedSemester = '20242'
      expect(generateSelectedSemesterBasedOnDate(new Date('2024-05-01'))).toBe(expectedSemester)
      expect(generateSelectedSemesterBasedOnDate(new Date('2024-05-29'))).toBe(expectedSemester)
      expect(generateSelectedSemesterBasedOnDate(new Date('2024-06-29'))).toBe(expectedSemester)
      expect(generateSelectedSemesterBasedOnDate(new Date('2024-07-29'))).toBe(expectedSemester)
      expect(generateSelectedSemesterBasedOnDate(new Date('2024-08-29'))).toBe(expectedSemester)
      expect(generateSelectedSemesterBasedOnDate(new Date('2024-09-01'))).toBe(expectedSemester)
      expect(generateSelectedSemesterBasedOnDate(new Date('2024-09-30'))).toBe(expectedSemester)
    })

    test('October 1st through October 19th result in period 1 of the same year', () => {
      const expectedSemester = '20242'
      expect(generateSelectedSemesterBasedOnDate(new Date('2024-10-01'))).toBe(expectedSemester)
      expect(generateSelectedSemesterBasedOnDate(new Date('2024-10-10'))).toBe(expectedSemester)
      expect(generateSelectedSemesterBasedOnDate(new Date('2024-10-19'))).toBe(expectedSemester)
    })

    test('October 20th through October 30th result in period 1 of the next year', () => {
      const expectedSemester = '20251'
      expect(generateSelectedSemesterBasedOnDate(new Date('2024-10-20'))).toBe(expectedSemester)
      expect(generateSelectedSemesterBasedOnDate(new Date('2024-10-25'))).toBe(expectedSemester)
      expect(generateSelectedSemesterBasedOnDate(new Date('2024-10-30'))).toBe(expectedSemester)
    })

    test('November through December result in period 1 of the next year', () => {
      const expectedSemester = '20251'
      expect(generateSelectedSemesterBasedOnDate(new Date('2024-11-01'))).toBe(expectedSemester)
      expect(generateSelectedSemesterBasedOnDate(new Date('2024-12-01'))).toBe(expectedSemester)
    })
  })

  describe('isValidCourseCode', () => {
    test.each([null, undefined])('returns false if given courseCode is %s', courseCode => {
      expect(isValidCourseCode(courseCode)).toBe(false)
    })
    test.each(['', '1', '12', 123, '1234', 'asdfg'])(
      'returns false if given courseCode is shorter than 6 characters: %s',
      courseCode => {
        expect(isValidCourseCode(courseCode)).toBe(false)
      }
    )

    test.each(['12345678', 'SF1523423490234'])(
      'returns false if given courseCode is longer than 7 characters: %s',
      courseCode => {
        expect(isValidCourseCode(courseCode)).toBe(false)
      }
    )

    test.each(['123456', 123456, '1234567', 1234567])(
      'returns true if given courseCode has length of 6 or 7 characters: %s',
      courseCode => {
        expect(isValidCourseCode(courseCode)).toBe(true)
      }
    )
  })
})
