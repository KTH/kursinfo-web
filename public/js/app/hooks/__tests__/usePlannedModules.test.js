const { renderHook } = require('@testing-library/react')
const { usePlannedModules } = require('../usePlannedModules')
const { getPlannedModules } = require('../api/getPlannedModules')
const { useWebContext } = require('../../context/WebContext')

jest.mock('../api/getPlannedModules')
jest.mock('../../context/WebContext')

const mockContext = [
  {
    paths: {
      api: {
        plannedSchemaModules: {
          uri: '/:courseCode/:semester/:applicationCode',
        },
      },
    },
  },
]

describe('usePlannedModules', () => {
  beforeAll(() => {
    useWebContext.mockReturnValue(mockContext)
  })

  test('exists', () => {
    // renderHook(() => usePlannedModules())
  })
})
