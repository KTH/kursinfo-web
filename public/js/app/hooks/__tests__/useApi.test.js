const { renderHook, waitFor } = require('@testing-library/react')
const { useApi } = require('../useApi')
const { useWebContext } = require('../../context/WebContext')
const { useLanguage } = require('../useLanguage')
const { STATUS } = require('../api/status')

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

const apiToCall = jest.fn()

const defaultParams = { courseCode: 'SF1624', semester: 20241, applicationCode: 12345 }

describe('useApi', () => {
  beforeAll(() => {
    useWebContext.mockReturnValue([mockContext])
    apiToCall.mockResolvedValue({
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

  test('calls apiToCall with given parameters', async () => {
    const { result } = renderHook(() => useApi(apiToCall, { one: 'one', two: 2 }, null, null))

    expect(apiToCall).toHaveBeenLastCalledWith({ one: 'one', two: 2 })

    await waitFor(() => expect(result.current.data).toStrictEqual('somePlannedModules'))

    const anotherApiToCall = jest.fn().mockResolvedValue({
      status: STATUS.OK,
      data: 'someData',
    })

    const { result: result2 } = renderHook(() => useApi(anotherApiToCall, { two: 'two', three: 3 }, null, null))

    expect(anotherApiToCall).toHaveBeenLastCalledWith({ two: 'two', three: 3 })

    await waitFor(() => expect(result2.current.data).toStrictEqual('someData'))
  })

  test('returns data from apiToCall', async () => {
    const { result } = renderHook(() => useApi(apiToCall, {}, null, null))

    await waitFor(() => expect(result.current.data).toStrictEqual('somePlannedModules'))
  })

  test.each(['someDefaultValue', null])('on parameter change sets data to defaultValue: %s', async defaultValue => {
    jest.useFakeTimers()

    apiToCall.mockImplementationOnce(
      () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve({
              status: STATUS.OK,
              data: 'someNewPlannedModules',
            })
          }, 100)
        })
    )

    apiToCall.mockImplementationOnce(
      () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve({
              status: STATUS.OK,
              data: 'someOtherPlannedModules',
            })
          }, 100)
        })
    )

    const { result } = renderHook(() => useApi(apiToCall, defaultParams, defaultValue, null))

    expect(result.current.data).toStrictEqual(defaultValue)
    expect(result.current.isError).toStrictEqual(false)

    jest.advanceTimersByTime(100)
    expect(apiToCall).toHaveBeenCalledTimes(1)

    await waitFor(() => expect(result.current.data).toStrictEqual('someNewPlannedModules'))
    await waitFor(() => expect(result.current.isError).toStrictEqual(false))

    result.current.setApiParams({ other: 'params' })

    await waitFor(() => expect(result.current.data).toStrictEqual(defaultValue))
    await waitFor(() => expect(result.current.isError).toStrictEqual(false))

    jest.advanceTimersByTime(100)

    expect(apiToCall).toHaveBeenCalledTimes(2)

    await waitFor(() => expect(result.current.data).toStrictEqual('someOtherPlannedModules'))
    await waitFor(() => expect(result.current.isError).toStrictEqual(false))

    jest.useRealTimers()
  })

  test('if all goes well, isError should be false', async () => {
    const { result } = renderHook(() => useApi(apiToCall, defaultParams, null, null))
    await waitFor(() => expect(result.current.isError).toStrictEqual(false))
  })

  test.each(['', undefined, null])(
    'if all goes well, but data is falsy: %s, should return defaulValueIfNullResponse',
    async data => {
      apiToCall.mockResolvedValueOnce({
        status: STATUS.OK,
        data,
      })
      const { result } = renderHook(() => useApi(apiToCall, defaultParams, null, 'defaulValueIfNullResponse'))

      await waitFor(() => expect(result.current.data).toStrictEqual('defaulValueIfNullResponse'))
    }
  )

  test.each(['', undefined, null])(
    'if all goes well, but data is falsy: %s, should return defaulValueIfNullResponse',
    async data => {
      apiToCall.mockResolvedValueOnce({
        status: STATUS.OK,
        data,
      })
      const { result } = renderHook(() => useApi(apiToCall, defaultParams, null, 'defaulValueIfNullResponseOther'))

      await waitFor(() => expect(result.current.data).toStrictEqual('defaulValueIfNullResponseOther'))
    }
  )

  describe('if apiToCall returns status: ERROR', () => {
    test('isError is true', async () => {
      apiToCall.mockResolvedValueOnce({
        status: STATUS.ERROR,
        data: null,
      })

      const { result } = renderHook(() => useApi(apiToCall, defaultParams, null, null))

      await waitFor(() => expect(result.current.isError).toStrictEqual(true))
    })

    test('isError should be reset to false in between calls', async () => {
      jest.useFakeTimers()

      apiToCall.mockImplementationOnce(
        () =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve({
                status: STATUS.ERROR,
                data: null,
              })
            }, 100)
          })
      )

      apiToCall.mockImplementationOnce(
        () =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve({
                status: STATUS.ERROR,
                data: null,
              })
            }, 100)
          })
      )

      const { result } = renderHook(() => useApi(apiToCall, defaultParams, null, null))

      jest.advanceTimersByTime(100)

      await waitFor(() => expect(result.current.isError).toStrictEqual(true))

      result.current.setApiParams({ ...defaultParams, applicationCode: 54321 })

      await waitFor(() => expect(result.current.isError).toStrictEqual(false))
      jest.advanceTimersByTime(100)

      await waitFor(() => expect(result.current.isError).toStrictEqual(true))

      jest.useRealTimers()
    })

    test.each(['defaulValueIfNullResponse', 'defaulValueIfNullResponseOther'])(
      'plannedModules is set to defaulValueIfNullResponse',
      async defaulValueIfNullResponse => {
        apiToCall.mockResolvedValueOnce({
          status: STATUS.ERROR,
          data: null,
        })

        const { result } = renderHook(() => useApi(apiToCall, defaultParams, null, defaulValueIfNullResponse))

        await waitFor(() => expect(result.current.data).toStrictEqual(defaulValueIfNullResponse))
      }
    )
  })
})
