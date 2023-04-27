const { getKoppsCourseData } = require('./koppsCourseData')

jest.mock('../configuration', () => ({
  server: {
    cache: '',
    koppsApi: {},
  },
}))

jest.mock('@kth/api-call', () => {
  const { mockGetAsync } = require('./mockKthApiCall')

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
    const { mockGetAsync } = require('./mockKthApiCall')

    let courseCode = 'someCourseCode'
    let language = 'en'

    getKoppsCourseData(courseCode, language)

    expect(mockGetAsync).toHaveBeenCalledWith({
      uri: `undefinedcourse/${courseCode}/detailedinformation?l=${language}`,
      useCache: true,
    })

    courseCode = 'someOtherCourseCode'
    language = 'sv'

    getKoppsCourseData(courseCode, language)

    expect(mockGetAsync).toHaveBeenCalledWith({
      uri: `undefinedcourse/${courseCode}/detailedinformation?l=${language}`,
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

  it('should reject with error if getAsync called with language=en and resolves with 404', async () => {
    const { mockGetAsync } = require('./mockKthApiCall')

    const expectedErrorEnglish = new Error(`Sorry, we can't find your requested page`)
    mockGetAsync.mockResolvedValueOnce({
      response: {
        statusCode: 404,
      },
    })

    const error = await getError(getKoppsCourseData('someCourseCode', 'en'))

    expect(error).toStrictEqual(expectedErrorEnglish)
  })

  it('should reject with error if getAsync called with language=sv and resolves with 404', async () => {
    const { mockGetAsync } = require('./mockKthApiCall')

    const expectedErrorSwedish = new Error(`Tyvärr kunde vi inte hitta sidan du efterfrågade`)
    mockGetAsync.mockResolvedValueOnce({
      response: {
        statusCode: 404,
      },
    })

    const error = await getError(getKoppsCourseData('someCourseCode', 'sv'))

    expect(error).toStrictEqual(expectedErrorSwedish)
  })

  it('should reject with error if getAsync rejects with error', async () => {
    const { mockGetAsync } = require('./mockKthApiCall')

    const expectedError = new Error(`Some error from getAsync`)
    mockGetAsync.mockRejectedValueOnce(expectedError)

    const error = await getError(getKoppsCourseData('someCourseCode', 'en'))
    expect(error).toStrictEqual(expectedError)
  })

  it('should resolve with response from getAsync', async () => {
    const response = {
      statusCode: 200,
      someOtherParameter: 'someKey',
    }

    const { mockGetAsync } = require('./mockKthApiCall')

    mockGetAsync.mockResolvedValueOnce({
      response,
    })

    const result = await getKoppsCourseData('someCourseCode', 'en')

    expect(result).toStrictEqual(response)
  })
})
