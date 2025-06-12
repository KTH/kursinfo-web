jest.mock('../../configuration', () => ({
  server: {
    ugRestApiURL: {
      url: 'https://ug.test.api',
      key: 'dummy-subscription-key',
    },
    ugAuth: {
      authTokenURL: 'https://auth.test.token',
      authClientId: 'dummy-client-id',
      authClientSecret: 'dummy-client-secret',
    },
  },
}))

jest.mock('@kth/ug-rest-api-helper', () => ({
  ugRestApiHelper: {
    initConnectionProperties: jest.fn(),
    getUGGroups: jest.fn(),
    getUGUsers: jest.fn(),
  },
}))

const { faker } = require('@faker-js/faker')
const { ugRestApiHelper } = require('@kth/ug-rest-api-helper')
const log = require('@kth/log')

jest.mock('@kth/log')
log.info = jest.fn()
log.debug = jest.fn()
log.error = jest.fn()

const { getCourseEmployees } = require('../ugRestApi')

describe('getCourseEmployees', () => {
  const createUser = () => ({
    username: faker.internet.userName(),
    kthid: faker.string.uuid(),
    givenName: faker.person.firstName(),
    surname: faker.person.lastName(),
  })

  const examiners = [createUser(), createUser()]
  const teachers = [createUser()]
  const courseCoordinators = [createUser()]

  const mockGroups = [
    {
      name: 'edu.courses.SF.1624',
      examiners: examiners.map(u => u.kthid),
    },
    {
      name: 'edu.courses.SF.1624.20222.11111',
      teachers: teachers.map(u => u.kthid),
      courseCoordinators: courseCoordinators.map(u => u.kthid),
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()

    ugRestApiHelper.getUGGroups.mockResolvedValue(mockGroups)

    ugRestApiHelper.getUGUsers.mockImplementation((_key, _op, kthid) => {
      const all = [...examiners, ...teachers, ...courseCoordinators]
      return Promise.resolve([all.find(u => u.kthid === kthid)])
    })
  })

  test('should return expected HTML for examiners, teachers, and courseCoordinators', async () => {
    const result = await getCourseEmployees({
      courseCode: 'SF1624',
      semester: '20222',
      applicationCodes: ['11111'],
    })

    // Basic structural assertions
    expect(result.examiners).toContain('<p class="person">')
    expect(result.teachers).toContain('<p class="person">')
    expect(result.courseCoordinators).toContain('<p class="person">')

    // Spot-check known names in the HTML output
    examiners.forEach(user => {
      expect(result.examiners).toContain(user.username)
      expect(result.examiners).toContain(user.givenName)
    })

    teachers.forEach(user => {
      expect(result.teachers).toContain(user.username)
    })

    courseCoordinators.forEach(user => {
      expect(result.courseCoordinators).toContain(user.username)
    })
  })

  test('should return undefined for missing roles', async () => {
    const modifiedGroups = mockGroups.map(group => ({
      ...group,
      teachers: [],
      courseCoordinators: [],
    }))
    ugRestApiHelper.getUGGroups.mockResolvedValue(modifiedGroups)

    const result = await getCourseEmployees({
      courseCode: 'SF1624',
      semester: '20222',
      applicationCodes: ['11111'],
    })

    expect(result.teachers).toBeUndefined()
    expect(result.courseCoordinators).toBeUndefined()
    expect(result.examiners).toContain('<p class="person">')
  })

  test('should handle UG API error and log it', async () => {
    const error = new Error('UG API failure')
    ugRestApiHelper.getUGGroups.mockRejectedValue(error)

    const result = await getCourseEmployees({
      courseCode: 'SF1624',
      semester: '20222',
      applicationCodes: ['11111'],
    })

    expect(log.info).toHaveBeenCalledWith('Exception from UG Rest API - multi', { error })
    expect(result).toBe(error)
  })

  test('should return empty object when no groups found', async () => {
    ugRestApiHelper.getUGGroups.mockResolvedValue([])

    const result = await getCourseEmployees({
      courseCode: 'SF1624',
      semester: '20222',
      applicationCodes: ['11111'],
    })

    expect(result).toEqual({})
  })
})
