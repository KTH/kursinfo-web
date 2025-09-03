'use strict'

import { mockedFilteredData, mockedCourseMemos } from '../mocks/mockedCourse'
import { mockedLadokData } from '../mocks/mockedLadokData'
import { mockedSocialApiResponse } from '../mocks/mockedSocialApiResponse'

const applicationPaths = {
  system: {
    monitor: {
      uri: '/_monitor',
    },
    robots: {
      uri: '/robots.txt',
    },
  },
}

jest.mock('../../server', () => ({
  use: jest.fn(() => {}),
  getPaths: jest.fn(() => applicationPaths),
}))
jest.mock('@kth/log', () => ({
  init: jest.fn(() => {}),
  info: jest.fn(() => {}),
  debug: jest.fn(() => {}),
  error: jest.fn(() => {}),
}))
jest.mock('@kth/session')

jest.mock('@kth/kth-node-web-common/lib/handlebars/helpers/headerContent')
jest.mock('@kth/kth-node-web-common/lib/language', () => ({
  getLanguage: jest.fn(() => 'en'),
}))
jest.mock('kth-node-express-routing', () => ({
  getPaths: jest.fn(() => applicationPaths),
}))
jest.mock('@kth/om-kursen-ladok-client', () => ({
  createApiClient: () => ({
    getLatestCourseVersion: () => mockedLadokData.mockedLadokCourseVersion,
    getActiveAndFutureCourseInstances: () => mockedLadokData.mockedLadokRounds,
    getExaminationModulesByUtbildningstillfalleUid: () => mockedLadokData.mockedExaminationModules,
    getExaminationModulesByUtbildningsinstansUid: () => mockedLadokData.mockedExaminationModules,
    getCourseSyllabus: () => mockedLadokData.mockedCourseSyllabus,
    getPeriods: () => mockedLadokData.mockedPeriods,
  }),
}))

jest.mock('../../configuration', () => ({
  server: {
    logging: { log: { level: 'debug' } },
    proxyPrefixPath: { uri: '/student/kurser/kurs' },
    session: { sessionOptions: { secret: '' } },
    sessionSecret: 'xxx',
    toolbar: { url: 'toolbarUrl' },
  },
  browser: { session: {}, sessionSecret: 'xxx' },
}))
jest.mock('../../api', () => ({ kursPmDataApi: { connected: true } }))
jest.mock('../../apiCalls/memoApi', () => ({
  getPrioritizedCourseMemos: jest.fn(() => ({ body: mockedCourseMemos })),
}))
jest.mock('../../apiCalls/socialApi', () => ({
  getSocial: () => ({ body: mockedSocialApiResponse }),
}))
jest.mock('../../apiCalls/ugRestApi', () => ({
  getCourseEmployees: jest.fn(() => ({ examiners: '<p>Examiner 1 </p>' })),
}))

jest.mock('../../apiCalls/getFilteredData', () => ({
  getFilteredData: jest.fn(() => mockedFilteredData),
}))

jest.mock('../../utils/breadcrumbUtil', () => ({
  createBreadcrumbs: jest.fn(() => [{ label: 'Course', url: '/kurs/HM1012' }]),
}))

jest.mock('../../utils/serverSideRendering', () => ({
  getServerSideFunctions: jest.fn(() => ({
    getCompressedData: jest.fn().mockImplementation(values => values),
    renderStaticPage: jest.fn().mockImplementation(values => values),
  })),
}))

jest.mock('../../util/webContextUtil', () => ({
  createCourseWebContext: jest.fn(({ courseCode, language, examiners, filteredData }) => ({
    courseCode,
    language,
    examiners,
    filteredData,
  })),
}))

jest.mock('../../util/constants', () => ({
  INFORM_IF_IMPORTANT_INFO_IS_MISSING: { en: 'Missing examiner info' },
}))

jest.mock('../courseCtrlHelpers', () => ({
  isValidCourseCode: jest.fn(() => true),
  calculateInitiallySelectedSemester: jest.fn(() => '20241'),
}))

function buildReq(overrides = {}) {
  return {
    params: { courseCode: 'HM1012' },
    query: {},
    cookies: {},
    url: '/kurs/HM1012',
    ...overrides,
  }
}

const courseCtrl = require('../courseCtrl')

let testResponse
let response
beforeEach(() => {
  testResponse = {}
  response = {
    render: jest.fn().mockImplementation((name, values) => {
      testResponse = values
    }),
    locals: {},
  }
})

afterEach(() => {
  jest.clearAllMocks()
})

// ----- Tests -----

describe('getIndex', () => {
  test('renders correctly with valid data', async () => {
    const req = buildReq()
    const next = jest.fn()

    await courseCtrl.getIndex(req, response, next)

    expect(response.render).toHaveBeenCalled()
    expect(testResponse.title).toBe('HM1012')
    expect(testResponse.lang).toBe('en')
    expect(testResponse.klaroAnalyticsConsentCookie).toBe(false)
    expect(testResponse.compressedData.courseCode).toBe('HM1012')
    expect(testResponse.html.context.courseCode).toBe('HM1012')
  })

  test('matches snapshot for valid data', async () => {
    const req = buildReq()
    const next = jest.fn()

    await courseCtrl.getIndex(req, response, next)

    expect(testResponse).toMatchSnapshot()
  })

  test('uses fallback examiners when API fails', async () => {
    const req = buildReq()
    const next = jest.fn()
    const { getCourseEmployees } = require('../../apiCalls/ugRestApi')
    getCourseEmployees.mockRejectedValue(new Error('fail'))

    await courseCtrl.getIndex(req, response, next)

    expect(testResponse.html.context.examiners).toBe('Missing examiner info')
  })

  test('calls next() with error on thrown exception', async () => {
    const req = buildReq()
    const next = jest.fn()
    const { getPrioritizedCourseMemos } = require('../../apiCalls/memoApi')
    getPrioritizedCourseMemos.mockImplementationOnce(() => {
      throw new Error('test error')
    })

    await courseCtrl.getIndex(req, response, next)

    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })

  test('returns 400 if courseCode param is missing', async () => {
    const req = buildReq({ params: {} })
    const next = jest.fn()

    await courseCtrl.getIndex(req, response, next)

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 400 }))
  })

  test('returns 400 if courseCode is invalid', async () => {
    const { isValidCourseCode } = require('../courseCtrlHelpers')
    isValidCourseCode.mockReturnValueOnce(false)
    const req = buildReq({ params: { courseCode: 'invalid!!' } })
    const next = jest.fn()

    await courseCtrl.getIndex(req, response, next)

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 400 }))
  })
})
