const httpMocks = require('node-mocks-http')

const noIndexMiddleware = require('./noIndexMiddleware')

const mockedServerHost = 'mockedserverhost.example.com'
jest.mock('../configuration', () => ({
  server: { hostUrl: 'https://mockedserverhost.example.com' },
}))

describe('noIndexMiddleware', () => {
  it('should not set "X-Robots-Tag" header if "X-Forwarded-Host" is missing', () => {
    const next = jest.fn()
    const { req, res } = httpMocks.createMocks({
      headers: {},
    })

    noIndexMiddleware(req, res, next)

    expect(res.getHeader('X-Robots-Tag')).toBeUndefined()
    expect(next).toHaveBeenCalledOnce()
  })

  it('should not set "X-Robots-Tag" header if "X-Forwarded-Host" match SERVER_HOST_URL', () => {
    const next = jest.fn()
    const { req, res } = httpMocks.createMocks({
      headers: {
        'X-Forwarded-Host': mockedServerHost,
      },
    })

    noIndexMiddleware(req, res, next)

    expect(res.getHeader('X-Robots-Tag')).toBeUndefined()
    expect(next).toHaveBeenCalledOnce()
  })

  it('should set "X-Robots-Tag" header if "X-Forwarded-Host" does not match SERVER_HOST_URL', () => {
    const next = jest.fn()
    const { req, res } = httpMocks.createMocks({
      headers: {
        'X-Forwarded-Host': 'anotherhost.example.com',
      },
    })

    noIndexMiddleware(req, res, next)

    expect(res.getHeader('X-Robots-Tag')).toBe('noindex')
    expect(next).toHaveBeenCalledOnce()
  })
})
