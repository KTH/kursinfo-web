const { getOfferingsWithModules } = require('../../timeTableApi')
const { createPlannedModularString } = require('../createPlannedModularString')
const { findOffering } = require('../findOffering')
const { getPlannedModularSchedule } = require('../getPlannedModularSchedule')

jest.mock('../../timeTableApi')
jest.mock('../findOffering')
jest.mock('../createPlannedModularString')

const defaultOfferings = [{ id: 'someId' }, { id: 'someOtherId' }]

const defaultMatchingOffering = {
  id: 'someId',
  modules: ['module_p3_A2', 'module_p1_C1'],
}

const defaultParams = {
  courseCode: 'SF1624',
  semester: 20242,
  applicationCode: 12345,
}

describe('getPlannedModularSchedule', () => {
  beforeAll(() => {
    findOffering.mockReturnValue(defaultMatchingOffering)
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  test.each([
    ['SF1624', 20242],
    ['SH2702', 20231],
    ['SF1610', 20252],
  ])('calls getOfferingsWithModules with courseCode %s and semester %s', async (courseCode, semester) => {
    await getPlannedModularSchedule({ courseCode, semester, applicationCode: defaultParams.applicationCode })

    expect(getOfferingsWithModules).toHaveBeenCalledWith(courseCode, semester)
  })

  test.each([
    [{ id: 'someId' }, { id: 'someOtherId' }],
    [{ id: 'anotherId' }, { id: 'andAnotherId' }],
  ])('calls findOffering with response from getOfferingsWithModules', async offerings => {
    getOfferingsWithModules.mockResolvedValueOnce(offerings)
    const { courseCode, semester, applicationCode } = defaultParams
    await getPlannedModularSchedule({ courseCode, semester, applicationCode })

    expect(findOffering).toHaveBeenCalledWith({ offerings, courseCode, semester, applicationCode })
  })

  test.each([
    ['SF1630', 20242, 12345],
    ['SF1625', 19902, 54321],
    ['SH2702', 20221, 22222],
  ])(
    'calls findOffering with courseCode %s, semester %s and applicationCode %s',
    async (courseCode, semester, applicationCode) => {
      getOfferingsWithModules.mockResolvedValueOnce(defaultOfferings)

      await getPlannedModularSchedule({ courseCode, semester, applicationCode })

      expect(findOffering).toHaveBeenCalledWith({
        offerings: defaultOfferings,
        courseCode,
        semester,
        applicationCode,
      })
    }
  )

  test('if findOffering returns undefined, returns empty string', async () => {
    findOffering.mockReturnValueOnce(undefined)

    const result = await getPlannedModularSchedule(defaultParams)

    expect(result).toStrictEqual('')
  })

  test('if findOffering returns undefined, does not call createPlannedModularString', async () => {
    findOffering.mockReturnValueOnce(undefined)

    await getPlannedModularSchedule(defaultParams)

    expect(createPlannedModularString).not.toHaveBeenCalled()
  })

  test('calls createPlannedModularString with result of findOffering', async () => {
    await getPlannedModularSchedule(defaultParams)

    expect(createPlannedModularString).toHaveBeenCalledTimes(1)
    expect(createPlannedModularString).toHaveBeenCalledWith(defaultMatchingOffering.modules)

    const offering = {
      id: 'SF1624-something',
      modules: ['module_p1_C1', 'module_p1_C1'],
    }

    findOffering.mockReturnValueOnce(offering)

    await getPlannedModularSchedule(defaultParams)

    expect(createPlannedModularString).toHaveBeenCalledWith(offering.modules)
  })

  test.each(['P3: A2.', 'P2: C1, I2.'])(
    'returns "%s" from createPlannedModularString',
    async expectedPlannedModularString => {
      createPlannedModularString.mockReturnValueOnce(expectedPlannedModularString)

      const result = await getPlannedModularSchedule(defaultParams)

      expect(result).toStrictEqual(expectedPlannedModularString)
    }
  )

  test('if getOfferingsWithModules rejects, return empty string', async () => {
    getOfferingsWithModules.mockRejectedValueOnce(new Error('some Error'))
    findOffering.mockReturnValueOnce(undefined)

    const result = await getPlannedModularSchedule(defaultParams)

    expect(result).toStrictEqual('')
  })
})
