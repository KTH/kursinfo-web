const { getKoppsCourseData } = require('../koppsCourseData')

jest.mock('../../configuration', () => ({
  server: {
    cache: '',
    koppsApi: {
      basePath: 'basePath/',
    },
  },
}))

jest.mock('@kth/api-call', () => {
  const { mockGetAsync } = require('../mocks/mockedKthApiCall')

  return {
    Connections: {
      setup: () => ({
        koppsApi: {
          client: {
            getAsync: mockGetAsync,
          },
        },
      }),
    },
  }
})

describe('getKoppsCourseData', () => {
  it('should call Kopps detailedinformation with correct values', () => {
    const { mockGetAsync } = require('../mocks/mockedKthApiCall')

    let courseCode = 'someCourseCode'
    let language = 'en'

    getKoppsCourseData(courseCode, language)

    expect(mockGetAsync).toHaveBeenCalledWith({
      uri: `basePath/course/${courseCode}/detailedinformation?l=${language}`,
      useCache: true,
    })

    courseCode = 'someOtherCourseCode'
    language = 'sv'

    getKoppsCourseData(courseCode, language)

    expect(mockGetAsync).toHaveBeenCalledWith({
      uri: `basePath/course/${courseCode}/detailedinformation?l=${language}`,
      useCache: true,
    })
  })

  const getError = async promise => {
    try {
      await promise

      throw new Error('No error thrown!')
    } catch (error) {
      return error
    }
  }

  const expectedReturnedObjectOn404 = { statusCode: 404, body: {} }

  it('should ignore error if getAsync called with language=en and resolves with 404', async () => {
    const { mockGetAsync } = require('../mocks/mockedKthApiCall')

    mockGetAsync.mockResolvedValueOnce({
      statusCode: 404,
    })

    const error = await getKoppsCourseData('someCourseCode', 'en')

    expect(error).toEqual(expectedReturnedObjectOn404)
  })

  it('should ignore error if getAsync called with language=sv and resolves with 404', async () => {
    const { mockGetAsync } = require('../mocks/mockedKthApiCall')

    mockGetAsync.mockResolvedValueOnce({
      statusCode: 404,
    })

    const error = await getKoppsCourseData('someCourseCode', 'sv')

    expect(error).toEqual(expectedReturnedObjectOn404)
  })

  it('should throw error if getAsync rejects with error', async () => {
    const { mockGetAsync } = require('../mocks/mockedKthApiCall')

    const expectedError = new Error(`Some error from getAsync`)
    mockGetAsync.mockRejectedValueOnce(expectedError)

    const error = await getError(getKoppsCourseData('someCourseCode', 'en'))
    expect(error).toStrictEqual(expectedError)
  })

  it('should return response from getAsync', async () => {
    const response = {
      statusCode: 200,
      someOtherParameter: 'someKey',
    }

    const { mockGetAsync } = require('../mocks/mockedKthApiCall')

    mockGetAsync.mockResolvedValueOnce(response)

    const result = await getKoppsCourseData('someCourseCode', 'en')

    expect(result).toStrictEqual(response)
  })
})
