const {
  calcPreviousSemester,
  parseSemesterIntoYearSemesterNumber,
  convertToYearSemesterNumberOrGetCurrent,
} = require('../semesterUtils')

describe('semesterUtils', () => {
  describe('calcPreviousSemester', () => {
    test.each([2024, 2025, 1990])('returns yearTerm with semesterNumber: 1 if semesterNumber is 2', year => {
      expect(calcPreviousSemester({ year, semesterNumber: 2 })).toStrictEqual({ year, semesterNumber: 1 })
    })

    test.each([2024, 2025, 1990])('returns yearTerm with year -1 and semesterNumber 2 if semesterNumber is 1', year => {
      expect(calcPreviousSemester({ year, semesterNumber: 1 })).toStrictEqual({ year: year - 1, semesterNumber: 2 })
    })
  })

  describe('parseSemesterIntoYearSemesterNumber', () => {
    test('correctly parses terms with semesterNumber 1', () => {
      expect(parseSemesterIntoYearSemesterNumber(19901)).toEqual({ year: 1990, semesterNumber: 1 })
      expect(parseSemesterIntoYearSemesterNumber(20241)).toEqual({ year: 2024, semesterNumber: 1 })
    })

    test('correctly parses terms with semesterNumber 2', () => {
      expect(parseSemesterIntoYearSemesterNumber(20002)).toEqual({ year: 2000, semesterNumber: 2 })
      expect(parseSemesterIntoYearSemesterNumber(20202)).toEqual({ year: 2020, semesterNumber: 2 })
    })
  })

  describe('convertToYearSemesterNumberOrGetCurrent', () => {
    test.each([202422, 2024, 'asdf', 'asdfg'])(
      'if given semester is not a five digit number, return current yearAndSemesterNumber (spring semester)',
      semester => {
        jest.useFakeTimers()
        jest.setSystemTime(new Date('2023-03-23'))

        expect(convertToYearSemesterNumberOrGetCurrent(semester)).toEqual({
          year: 2023,
          semesterNumber: 1,
        })

        jest.useRealTimers()
      }
    )
    test.each([202422, 2024, 'asdf', 'asdfg'])(
      'if given semester is not a five digit number, return current yearAndSemesterNumber (fall semester)',
      semester => {
        jest.useFakeTimers()
        jest.setSystemTime(new Date('2023-07-23'))

        expect(convertToYearSemesterNumberOrGetCurrent(semester)).toEqual({
          year: 2023,
          semesterNumber: 2,
        })

        jest.useRealTimers()
      }
    )

    test.each([
      ['20241', { year: 2024, semesterNumber: 1 }],
      ['20242', { year: 2024, semesterNumber: 2 }],
      [19901, { year: 1990, semesterNumber: 1 }],
      [20302, { year: 2030, semesterNumber: 2 }],
    ])('if given semester is valid, returns converted year and semesterNumber', (semester, expected) => {
      expect(convertToYearSemesterNumberOrGetCurrent(semester)).toEqual(expected)
    })
  })
})
