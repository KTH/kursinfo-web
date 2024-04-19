const { calcPreviousSemester, parseTermIntoYearTerm } = require('../semesterUtils')

describe('semesterUtils', () => {
  describe('calcPreviousSemester', () => {
    test.each([2024, 2025, 1990])('returns yearTerm with termNumber: 1 if termNumber is 2', year => {
      expect(calcPreviousSemester({ year, termNumber: 2 })).toStrictEqual({ year, termNumber: 1 })
    })

    test.each([2024, 2025, 1990])('returns yearTerm with year -1 and termNumber 2 if termNumber is 1', year => {
      expect(calcPreviousSemester({ year, termNumber: 1 })).toStrictEqual({ year: year - 1, termNumber: 2 })
    })
  })

  describe('parseTermIntoYearTerm', () => {
    test('correctly parses terms with termNumber 1', () => {
      expect(parseTermIntoYearTerm(19901)).toEqual({ year: 1990, termNumber: 1 })
      expect(parseTermIntoYearTerm(20241)).toEqual({ year: 2024, termNumber: 1 })
    })

    test('correctly parses terms with termNumber 2', () => {
      expect(parseTermIntoYearTerm(20002)).toEqual({ year: 2000, termNumber: 2 })
      expect(parseTermIntoYearTerm(20202)).toEqual({ year: 2020, termNumber: 2 })
    })
  })
})
