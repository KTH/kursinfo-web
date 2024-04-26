const { getOfferingsWithModules: getOfferingsWithModules } = require('../../apiCalls/timeTableApi')
const { createPlannedModularString } = require('../createPlannedModularString')
const { filterOfferings } = require('../filterOfferings')
const { getPlannedModularSchedule } = require('../getPlannedModularSchedule')

jest.mock('../../apiCalls/timeTableApi')
jest.mock('../filterOfferings')
jest.mock('../createPlannedModularString')

const defaultModules = [{ id: 'someId' }, { id: 'someOtherId' }]

const defaultFiltered = [
  {
    id: 'someId',
    modules: ['module_p3_A2'],
  },
  {
    id: 'someOtherId',
    modules: ['module_p1_C1'],
  },
]

const defaultParams = {
  courseCode: 'SF1624',
  semester: 20242,
  applicationCode: 12345,
}

describe('getPlannedModularSchedule', () => {
  beforeAll(() => {
    filterOfferings.mockReturnValue(defaultFiltered)
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
  ])('calls filterOfferings with response from getOfferingsWithModules', async offerings => {
    getOfferingsWithModules.mockResolvedValueOnce(offerings)
    const { courseCode, semester, applicationCode } = defaultParams
    await getPlannedModularSchedule({ courseCode, semester, applicationCode })

    expect(filterOfferings).toHaveBeenCalledWith(offerings, courseCode, semester, applicationCode)
  })

  test.each([
    ['SF1630', 20242, 12345],
    ['SF1625', 19902, 54321],
    ['SH2702', 20221, 22222],
  ])(
    'calls filterOfferings with courseCode %s, semester %s and applicationCode %s',
    async (courseCode, semester, applicationCode) => {
      getOfferingsWithModules.mockResolvedValueOnce(defaultModules)

      await getPlannedModularSchedule({ courseCode, semester, applicationCode })

      expect(filterOfferings).toHaveBeenCalledWith(defaultModules, courseCode, semester, applicationCode)
    }
  )

  test('if filterOfferings returns empty array, returns empty string', async () => {
    filterOfferings.mockReturnValueOnce([])

    const result = await getPlannedModularSchedule(defaultParams)

    expect(result).toStrictEqual('')
  })

  test('if filterOfferings returns empty array, does not call createPlannedModularString', async () => {
    filterOfferings.mockReturnValueOnce([])

    await getPlannedModularSchedule(defaultParams)

    expect(createPlannedModularString).not.toHaveBeenCalled()
  })

  test('calls createPlannedModularString with first result of filterOfferings', async () => {
    await getPlannedModularSchedule(defaultParams)

    expect(createPlannedModularString).toHaveBeenCalledTimes(1)
    expect(createPlannedModularString).toHaveBeenCalledWith(defaultFiltered[0])

    const filtered = [
      {
        id: 'SF1624-something',
        modules: ['module_p1_C1'],
      },
      {
        id: 'DoNotTakeThis',
        modules: ['module_p1_C1'],
      },
    ]

    filterOfferings.mockReturnValueOnce(filtered)

    await getPlannedModularSchedule(defaultParams)

    expect(createPlannedModularString).toHaveBeenCalledWith(filtered[0])
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
    filterOfferings.mockReturnValueOnce([])

    const result = await getPlannedModularSchedule(defaultParams)

    expect(result).toStrictEqual('')
  })
})
