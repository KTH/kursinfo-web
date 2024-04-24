const { getReservationsByCourseCodeAndSemester } = require('../timeTableApi')

describe('timeTableApi', () => {
  test('api', async () => {
    const result = await getReservationsByCourseCodeAndSemester('SF1624', 2024)

    const foo = 'bar'
  })
})
