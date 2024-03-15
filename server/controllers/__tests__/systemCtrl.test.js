jest.mock('../../configuration', () => ({ server: {} }))
jest.mock('../../api', () => {})

const systemCtrl = require('../systemCtrl')

const next = jest.fn()

describe('Not found', () => {
  test('Gets correct error code', () => {
    const req = { originalUrl: 'http://localhost' }

    systemCtrl.notFound(req, {}, next)

    const expectedError = new Error('Not Found: http://localhost')
    expectedError.status = 404

    expect(next).toHaveBeenCalledWith(expectedError)
  })
})
