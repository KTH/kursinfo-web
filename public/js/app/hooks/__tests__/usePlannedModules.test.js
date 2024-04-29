const { renderHook, waitFor } = require('@testing-library/react')
const { usePlannedModules } = require('../usePlannedModules')
const { getPlannedModules, STATUS } = require('../api/getPlannedModules')
const { useWebContext } = require('../../context/WebContext')
const { useLanguage } = require('../useLanguage')
const { INFORM_IF_IMPORTANT_INFO_IS_MISSING } = require('../../util/constants')

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
const baseParamsWithPath = { ...baseParams, basePath: mockContext.paths.api.plannedSchemaModules.uri }

describe('usePlannedModules', () => {
  beforeAll(() => {
    useWebContext.mockReturnValue([mockContext])
    getPlannedModules.mockResolvedValue({
      status: STATUS.OK,
      plannedModules: 'somePlannedModules',
    })
    useLanguage.mockReturnValue({
      isEnglish: true,
      languageIndex: 0,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test.each([undefined, null, ''])(
    'if courseCode is "%s", should return INFORM_IF_IMPORTANT_INFO_IS_MISSING',
    invalidInput => {
      const { result } = renderHook(() => usePlannedModules({ ...defaultParams, courseCode: invalidInput }))

      expect(getPlannedModules).not.toHaveBeenCalled()

      expect(result.current.plannedModules).toStrictEqual(INFORM_IF_IMPORTANT_INFO_IS_MISSING[0])
    }
  )

  test.each([undefined, null, ''])(
    'if semester is "%s", should return INFORM_IF_IMPORTANT_INFO_IS_MISSING',
    invalidInput => {
      const { result } = renderHook(() => usePlannedModules({ ...defaultParams, semester: invalidInput }))

      expect(getPlannedModules).not.toHaveBeenCalled()

      expect(result.current.plannedModules).toStrictEqual(INFORM_IF_IMPORTANT_INFO_IS_MISSING[0])
    }
  )

  test.each([undefined, null, ''])(
    'if applicationCode is "%s", should return INFORM_IF_IMPORTANT_INFO_IS_MISSING',
    invalidInput => {
      const { result } = renderHook(() => usePlannedModules({ ...defaultParams, applicationCode: invalidInput }))

      expect(getPlannedModules).not.toHaveBeenCalled()

      expect(result.current.plannedModules).toStrictEqual(INFORM_IF_IMPORTANT_INFO_IS_MISSING[0])
    }
  )

  test('if showRoundData is not true, should return null', () => {
    const { result } = renderHook(() => usePlannedModules({ ...defaultParams, showRoundData: false }))

    expect(getPlannedModules).not.toHaveBeenCalled()

    expect(result.current.plannedModules).toStrictEqual(null)
  })

  test('calls getPlannedModules with correct parameters', async () => {
    const { result } = renderHook(() => usePlannedModules(defaultParams))
    expect(getPlannedModules).toHaveBeenCalledWith(baseParamsWithPath)

    // We have to await a state change to `plannedModules`, because testing-library/react will  complain about it otherwise
    await waitFor(() => expect(result.current.plannedModules).toStrictEqual('somePlannedModules'))
  })

  test('returns plannedModules from getPlannedModules', async () => {
    const { result } = renderHook(() => usePlannedModules(defaultParams))

    await waitFor(() => expect(result.current.plannedModules).toStrictEqual('somePlannedModules'))
  })

  test('on rerender, calls getPlannedModules again and initially sets plannedModules to null', async () => {
    const { result, rerender } = renderHook(({ params = defaultParams } = {}) => usePlannedModules(params))

    expect(result.current.plannedModules).toStrictEqual(null)

    expect(getPlannedModules).toHaveBeenCalledTimes(1)

    await waitFor(() => expect(result.current.plannedModules).toStrictEqual('somePlannedModules'))

    getPlannedModules.mockResolvedValueOnce({
      status: STATUS.OK,
      plannedModules: 'someOtherPlannedModules',
    })

    rerender({ params: { ...defaultParams, applicationCode: 54321 } })

    await waitFor(() => expect(result.current.plannedModules).toStrictEqual(null))

    expect(getPlannedModules).toHaveBeenCalledTimes(2)

    await waitFor(() => expect(result.current.plannedModules).toStrictEqual('someOtherPlannedModules'))
  })

  test('if all goes well, isError should be false', async () => {
    const { result } = renderHook(() => usePlannedModules(defaultParams))
    await waitFor(() => expect(result.current.isError).toStrictEqual(false))
  })

  test('if all goes well, but plannedModules is an empty string, should return INFORM_IF_IMPORTANT_INFO_IS_MISSING', async () => {
    getPlannedModules.mockResolvedValueOnce({
      status: STATUS.OK,
      plannedModules: '',
    })
    const { result } = renderHook(() => usePlannedModules(defaultParams))

    await waitFor(() => expect(result.current.plannedModules).toStrictEqual(INFORM_IF_IMPORTANT_INFO_IS_MISSING[0]))
  })

  test('if all goes well, but plannedModules is an empty string, should return INFORM_IF_IMPORTANT_INFO_IS_MISSING also in swedish', async () => {
    getPlannedModules.mockResolvedValueOnce({
      status: STATUS.OK,
      plannedModules: '',
    })

    // Apparently useLanguage is called twice here, so we have to mock the non-default value twice.
    useLanguage.mockReturnValueOnce({
      isEnglish: false,
      languageIndex: 1,
    })
    useLanguage.mockReturnValueOnce({
      isEnglish: false,
      languageIndex: 1,
    })
    const { result } = renderHook(() => usePlannedModules(defaultParams))

    await waitFor(() => expect(result.current.plannedModules).toStrictEqual(INFORM_IF_IMPORTANT_INFO_IS_MISSING[1]))
  })

  describe('if getPlannedModules returns status: ERROR', () => {
    test('isError is true', async () => {
      getPlannedModules.mockResolvedValueOnce({
        status: STATUS.ERROR,
        plannedModules: null,
      })

      const { result } = renderHook(() => usePlannedModules(defaultParams))

      await waitFor(() => expect(result.current.isError).toStrictEqual(true))
    })

    test('isError should be reset to false in between calls', async () => {
      getPlannedModules.mockResolvedValueOnce({
        status: STATUS.ERROR,
        plannedModules: null,
      })

      const { result, rerender } = renderHook(({ params = defaultParams } = {}) => usePlannedModules(params))

      await waitFor(() => expect(result.current.isError).toStrictEqual(true))

      getPlannedModules.mockResolvedValueOnce({
        status: STATUS.ERROR,
        plannedModules: null,
      })

      rerender({ params: { ...defaultParams, applicationCode: 54321 } })

      await waitFor(() => expect(result.current.isError).toStrictEqual(false))

      await waitFor(() => expect(result.current.isError).toStrictEqual(true))
    })

    test('plannedModules is set to INFORM_IF_IMPORTANT_INFO_IS_MISSING', async () => {
      getPlannedModules.mockResolvedValueOnce({
        status: STATUS.ERROR,
        plannedModules: null,
      })

      const { result } = renderHook(() => usePlannedModules(defaultParams))

      await waitFor(() => expect(result.current.plannedModules).toStrictEqual(INFORM_IF_IMPORTANT_INFO_IS_MISSING[0]))
    })

    test('plannedModules is set to INFORM_IF_IMPORTANT_INFO_IS_MISSING also in swedish', async () => {
      getPlannedModules.mockResolvedValueOnce({
        status: STATUS.ERROR,
        plannedModules: null,
      })

      // Apparently useLanguage is called twice here, so we have to mock the non-default value twice.
      useLanguage.mockReturnValueOnce({
        isEnglish: false,
        languageIndex: 1,
      })
      useLanguage.mockReturnValueOnce({
        isEnglish: false,
        languageIndex: 1,
      })

      const { result } = renderHook(() => usePlannedModules(defaultParams))

      expect(getPlannedModules).toHaveBeenCalledTimes(1)

      await waitFor(() => expect(result.current.plannedModules).toStrictEqual(INFORM_IF_IMPORTANT_INFO_IS_MISSING[1]))
    })
  })
})
