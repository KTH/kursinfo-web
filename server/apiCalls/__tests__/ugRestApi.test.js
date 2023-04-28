jest.mock('../../configuration', () => ({ server: {} }))
jest.mock('@kth/ug-rest-api-helper', () => ({}))
const log = require('@kth/log')
const { faker } = require('@faker-js/faker')
const { getMembersFromGroups } = require('../ugRestApi')

jest.mock('@kth/log')
log.info = jest.fn()
log.debug = jest.fn()
log.error = jest.fn()

jest.mock('../koppsCourseData', () => ({ getLadokRoundIdsFromApplicationCodes: () => [] }))

const userInfoToCheckDuplicate = {
  email: faker.internet.email(),
  givenName: faker.name.firstName(),
  id: faker.datatype.uuid(),
  surname: faker.name.lastName(),
}

const users = [
  {
    email: faker.internet.email(),
    givenName: faker.name.firstName(),
    id: faker.datatype.uuid(),
    surname: faker.name.lastName(),
  },
  {
    email: faker.internet.email(),
    givenName: faker.name.firstName(),
    id: faker.datatype.uuid(),
    surname: faker.name.lastName(),
  },
  {
    email: faker.internet.email(),
    givenName: faker.name.firstName(),
    id: faker.datatype.uuid(),
    surname: faker.name.lastName(),
  },
  userInfoToCheckDuplicate,
  userInfoToCheckDuplicate,
]

const groupData = [
  {
    name: 'edu.courses.SF.SF1624.examiner',
    members: users,
  },
  {
    name: 'edu.courses.SF.SF1624.1.courseresponsible',
    members: users,
  },
]

describe('Check Examiner and responsilbes with duplicate list', () => {
  test('Passing examiner list and responsible list to check duplicate list', async () => {
    const employeeTestData = getMembersFromGroups(
      groupData,
      ['edu.courses.SF.SF1624.1.assistants'],
      ['edu.courses.SF.SF1624.1.teachers'],
      ['edu.courses.SF.SF1624.examiner'],
      ['edu.courses.SF.SF1624.1.courseresponsible', 'edu.courses.SF.SF1624.2.courseresponsible'],
      'SF1624',
      20222
    )
    const { examiner, teacher, responsibles, assistants } = employeeTestData
    expect(teacher.length).toEqual(0)
    expect(assistants.length).toEqual(0)
    expect(examiner.length).toEqual(4)
    expect(responsibles.length).toEqual(4)
    expect(examiner.filter(x => x.id === userInfoToCheckDuplicate.id).length).toEqual(1)
    expect(responsibles.filter(x => x.id === userInfoToCheckDuplicate.id).length).toEqual(1)
  })
})
