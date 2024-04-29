const { convertSemesterIntoStartEndDates, convertSemesterToSeasonString } = require('../semesterUtils')

describe('semesterUtils', () => {
  describe('convertSemesterIntoStartEndDates', () => {
    test('returns start/end as string', () => {
      const { start, end } = convertSemesterIntoStartEndDates(20241)

      expect(start).toBeDefined()
      expect(end).toBeDefined()
      expect(typeof start).toBe('string')
      expect(typeof end).toBe('string')
    })

    test.each(['', 1234, 123456])(
      'if invalid semester "%s" is given, returns start/end based on current semester 20231',
      semester => {
        jest.useFakeTimers()
        jest.setSystemTime(new Date('2023-04-24'))
        const { start, end } = convertSemesterIntoStartEndDates(semester)

        expect(start).toBe('2023-01-01T00:00:00')
        expect(end).toBe('2023-06-30T23:59:59')

        jest.useRealTimers()
      }
    )

    test.each(['', 1234, 123456])(
      'if invalid semester "%s" is given, returns start/end based on current semester 20241',
      semester => {
        jest.useFakeTimers()
        jest.setSystemTime(new Date('2024-04-24'))
        const { start, end } = convertSemesterIntoStartEndDates(semester)

        expect(start).toBe('2024-01-01T00:00:00')
        expect(end).toBe('2024-06-30T23:59:59')

        jest.useRealTimers()
      }
    )

    test.each(['', 1234, 123456])(
      'if invalid semester "%s" is given, returns start/end based on current semester 20242',
      semester => {
        jest.useFakeTimers()
        jest.setSystemTime(new Date('2024-08-24'))
        const { start, end } = convertSemesterIntoStartEndDates(semester)

        expect(start).toBe('2024-07-01T00:00:00')
        expect(end).toBe('2025-01-31T23:59:59')

        jest.useRealTimers()
      }
    )

    test.each([20241, 19901, 20151])('returns valid start/end for spring semester', semester => {
      const expectedYear = semester.toString().substring(0, 4)

      const { start, end } = convertSemesterIntoStartEndDates(semester)

      expect(start).toBe(`${expectedYear}-01-01T00:00:00`)
      expect(end).toBe(`${expectedYear}-06-30T23:59:59`)
    })

    test.each([20242, 19902, 20152])('returns valid start/end for fall semester', semester => {
      const expectedYear = Number(semester.toString().substring(0, 4))

      const { start, end } = convertSemesterIntoStartEndDates(semester)

      expect(start).toBe(`${expectedYear}-07-01T00:00:00`)
      expect(end).toBe(`${expectedYear + 1}-01-31T23:59:59`)
    })
  })

  describe('convertSemesterToTermString', () => {
    test.each([
      ['HT24', 20242],
      ['HT23', 20232],
      ['HT22', 20222],
    ])('Fall term: returns %s for %s', (expected, semester) => {
      expect(convertSemesterToSeasonString(semester)).toStrictEqual(expected)
    })

    test.each([
      ['VT24', 20241],
      ['VT23', 20231],
      ['VT22', 20221],
    ])('Spring term: returns %s for %s', (expected, semester) => {
      expect(convertSemesterToSeasonString(semester)).toStrictEqual(expected)
    })
  })
})
