const { renderHook, waitFor } = require('@testing-library/react')
const { usePlannedModules } = require('../usePlannedModules')
const { getPlannedModules } = require('../api/getPlannedModules')
const { useWebContext } = require('../../context/WebContext')
const { useLanguage } = require('../useLanguage')
const { INFORM_IF_IMPORTANT_INFO_IS_MISSING } = require('../../util/constants')
const { STATUS } = require('../api/status')

jest.mock('../api/getPlannedModules')
jest.mock('../../context/WebContext')
jest.mock('../useLanguage')

const mockContext = {
  paths: {
    api: {
      plannedSchemaModules: {
        uri: '/:courseCode/:semester/:applicationCode',
      },
    },
  },
}

const baseParams = { courseCode: 'SF1624', semester: 20241, applicationCode: 12345 }
const defaultParams = { ...baseParams, showRoundData: true }

describe('usePlannedModules', () => {
  beforeEach(() => {
    useWebContext.mockReturnValue(mockContext)
    getPlannedModules.mockResolvedValue({
      status: STATUS.OK,
      data: 'somePlannedModules',
    })
    useLanguage.mockReturnValue({
      isEnglish: true,
      languageIndex: 0,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('if data is empty string, should return INFORM_IF_IMPORTANT_INFO_IS_MISSING', async () => {
    getPlannedModules.mockResolvedValue({
      status: STATUS.OK,
      data: '',
    })

    const { result } = renderHook(() => usePlannedModules(defaultParams))

    await waitFor(() => expect(result.current.plannedModules).toStrictEqual(INFORM_IF_IMPORTANT_INFO_IS_MISSING[0]))
  })

  test('if showRoundData is not true, should return null', () => {
    const { result } = renderHook(() => usePlannedModules({ ...defaultParams, showRoundData: false }))

    expect(result.current.plannedModules).toStrictEqual(null)
  })

  test('returns plannedModules from getPlannedModules', async () => {
    const { result } = renderHook(() => usePlannedModules(defaultParams))

    await waitFor(() => expect(result.current.plannedModules).toStrictEqual('somePlannedModules'))
  })

  test('on rerender, calls getPlannedModules again and initially sets plannedModules to null', async () => {
    const { result, rerender } = renderHook(({ params = defaultParams } = {}) => usePlannedModules(params))

    expect(result.current.plannedModules).toStrictEqual(null)

    await waitFor(() => expect(result.current.plannedModules).toStrictEqual('somePlannedModules'))

    getPlannedModules.mockResolvedValueOnce({
      status: STATUS.OK,
      data: 'someOtherPlannedModules',
    })

    rerender({ params: { ...defaultParams, applicationCode: 54321 } })

    await waitFor(() => expect(result.current.plannedModules).toStrictEqual(null))

    await waitFor(() => expect(result.current.plannedModules).toStrictEqual('someOtherPlannedModules'))
  })

  test('if all goes well, isError should be false', async () => {
    const { result } = renderHook(() => usePlannedModules(defaultParams))
    await waitFor(() => expect(result.current.isError).toStrictEqual(false))
  })

  test('if all goes well, but plannedModules is an empty string, should return INFORM_IF_IMPORTANT_INFO_IS_MISSING', async () => {
    getPlannedModules.mockResolvedValue({
      status: STATUS.OK,
      data: '',
    })
    const { result } = renderHook(() => usePlannedModules(defaultParams))

    await waitFor(() => expect(result.current.plannedModules).toStrictEqual(INFORM_IF_IMPORTANT_INFO_IS_MISSING[0]))
  })

  test('if all goes well, but plannedModules is an empty string, should return INFORM_IF_IMPORTANT_INFO_IS_MISSING also in swedish', async () => {
    getPlannedModules.mockResolvedValue({
      status: STATUS.OK,
      data: '',
    })

    useLanguage.mockReturnValue({
      isEnglish: false,
      languageIndex: 1,
    })

    const { result } = renderHook(() => usePlannedModules(defaultParams))

    await waitFor(() => expect(result.current.plannedModules).toStrictEqual(INFORM_IF_IMPORTANT_INFO_IS_MISSING[1]))
  })

  describe('if getPlannedModules returns status: ERROR', () => {
    test('isError is true', async () => {
      getPlannedModules.mockResolvedValue({
        status: STATUS.ERROR,
        data: null,
      })

      const { result } = renderHook(() => usePlannedModules(defaultParams))

      await waitFor(() => expect(result.current.isError).toStrictEqual(true))
    })

    test('plannedModules is set to INFORM_IF_IMPORTANT_INFO_IS_MISSING', async () => {
      getPlannedModules.mockResolvedValue({
        status: STATUS.ERROR,
        data: null,
      })

      const { result } = renderHook(() => usePlannedModules(defaultParams))

      await waitFor(() => expect(result.current.plannedModules).toStrictEqual(INFORM_IF_IMPORTANT_INFO_IS_MISSING[0]))
    })

    test('plannedModules is set to INFORM_IF_IMPORTANT_INFO_IS_MISSING also in swedish', async () => {
      getPlannedModules.mockResolvedValue({
        status: STATUS.ERROR,
        data: null,
      })

      useLanguage.mockReturnValue({
        isEnglish: false,
        languageIndex: 1,
      })

      const { result } = renderHook(() => usePlannedModules(defaultParams))

      await waitFor(() => expect(result.current.plannedModules).toStrictEqual(INFORM_IF_IMPORTANT_INFO_IS_MISSING[1]))
    })
  })
})
