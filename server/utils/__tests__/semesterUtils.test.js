const { convertSemesterIntoFromToDates } = require('../semesterUtils')

describe('semesterUtils', () => {
  describe('convertSemesterIntoFromToDates', () => {
    test('takes semester', () => {
      convertSemesterIntoFromToDates(20242)
    })
    test('returns start/end as string', () => {
      const { start, end } = convertSemesterIntoFromToDates(20241)

      expect(start).toBeDefined()
      expect(end).toBeDefined()
      expect(typeof start).toBe('string')
      expect(typeof end).toBe('string')
    })

    test.only.each(['', 1234, 123456])(
      'if invalid semester "%s" is given, returns start/end based on current semester',
      semester => {
        jest.useFakeTimers()
        jest.setSystemTime(new Date('2023-04-24'))
        const { start, end } = convertSemesterIntoFromToDates(semester)

        expect(start).toBe('2023-01-01T00:00:00')
        expect(end).toBe('2023-06-30T23:59:59')

        jest.useRealTimers()
      }
    )

    // TODO Benni - bättre att fela åt rätt håll
    // https://intra.kth.se/utbildning/schema-och-lokalbokning/lasarsindelning/lasaret-2024-2025-1.1212249
    // 1: 1 jan till 30 juni
    // 2: 1 juli till 30 jan

    test.each([20241, 19901, 20151])('returns valid start/end for spring semester', semester => {
      const expectedYear = semester.toString().substring(0, 4)

      const { start, end } = convertSemesterIntoFromToDates('')

      expect(start).toBe(`${expectedYear}-01-01T00:00:00`)
      expect(end).toBe(`${expectedYear}-06-30T23:59:59`)
    })
    test.todo('returns valid start/end for fall semester')
  })
})
