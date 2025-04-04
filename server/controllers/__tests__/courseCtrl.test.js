'use strict'

import { mockedCourseMemosForDiscontinuedCourse, mockedDiscontinuedCourse } from '../mocks/mockedDiscontinuedCourse'
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
  getLanguage: jest.fn(() => 'sv'),
}))
jest.mock('kth-node-express-routing', () => ({
  getPaths: jest.fn(() => applicationPaths),
}))
jest.mock('@kth/om-kursen-ladok-client', () => ({
  createApiClient: () => ({
    getLatestCourseVersion: () => mockedLadokData.mockedLadokCourseVersion,
    getActiveAndFutureCourseRounds: () => mockedLadokData.mockedLadokRounds,
    getExaminationModulesByUtbildningstillfalleUid: () => mockedLadokData.mockedExaminationModules,
    getExaminationModulesByUtbildningsinstansUid: () => mockedLadokData.mockedExaminationModules,
    getCourseSyllabus: () => mockedLadokData.mockedCourseSyllabus,
    getPeriods: () => mockedLadokData.mockedPeriods,
  }),
}))
// jest.mock('@kth/kth-node-response')
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
jest.mock('../../apiCalls/kursinfoApi', () => ({
  getCourseInfo: () => ({
    sellingText: { sv: '<p>Fantastisk kurs</p>', en: '<p>This course is awesome</p>' },
    courseDisposition: { sv: '<p>Kursupplägg på svenska</p>', en: '<p>Course Disposition in english</p>' },
    imageInfo: 'own_image',
  }),
}))
jest.mock('../../apiCalls/memoApi', () => ({
  getPrioritizedCourseMemos: () => ({ body: mockedCourseMemosForDiscontinuedCourse }),
}))
jest.mock('../../apiCalls/socialApi', () => ({
  getSocial: () => ({ body: mockedSocialApiResponse }),
}))
jest.mock('../../apiCalls/koppsCourseData', () => ({ getKoppsCourseData: () => ({ body: mockedDiscontinuedCourse }) }))
jest.mock('../../apiCalls/ugRestApi', () => ({
  getCourseEmployees: jest.fn(() => ({ examiners: '<p>Examiner 1 </p>' })),
}))
let testResponse

jest.mock('../../utils/serverSideRendering', () => ({
  getServerSideFunctions: jest.fn(() => ({
    getCompressedData: jest.fn().mockImplementation(values => values),
    renderStaticPage: jest.fn().mockImplementation(values => values),
  })),
}))
function buildReq(overrides) {
  const req = { headers: { accept: 'application/json' }, body: {}, params: {}, ...overrides }
  return req
}

const courseCtrl = require('../courseCtrl')

let response
beforeEach(() => {
  testResponse = {}
  response = { render: jest.fn().mockImplementation((name, values) => (testResponse = values)) }
})

afterEach(() => {
  response = {}
})

describe('Discontinued course to test', () => {
  test('Gets correct data', async () => {
    const req = buildReq({
      params: { courseCode: mockedDiscontinuedCourse.course.courseCode },
      cookies: {
        'required-consent': true,
        'media-consent': true,
        'analytics-consent': true,
        'marketing-consent': true,
      },
      language: 'sv',
    })
    const next = jest.fn()

    await courseCtrl.getIndex(req, response, next)

    expect(response.render).toHaveBeenCalled()
    expect(testResponse.title).toBe(mockedDiscontinuedCourse.course.courseCode)
    expect(testResponse.compressedData.courseCode).toBe(mockedDiscontinuedCourse.course.courseCode)
    expect(testResponse.html.context.courseCode).toBe(mockedDiscontinuedCourse.course.courseCode)

    expect(testResponse.html).toMatchInlineSnapshot(`
{
  "applicationStore": {},
  "basename": "/student/kurser/kurs",
  "context": {
    "activeSemesters": [],
    "browserConfig": {
      "session": {},
      "sessionSecret": "xxx",
    },
    "courseCode": "FCK3305",
    "courseData": {
      "courseInfo": {
        "course_code": "FCK3305",
        "course_department": "CBH/Kemi",
        "course_department_code": "CE",
        "course_department_link": "<a href="/cbh/" target="blank">CBH/Kemi</a>",
        "course_disposition": "<p>Kursupplägg på svenska</p>",
        "course_education_type_id": undefined,
        "course_examiners": "<p>Examiner 1 </p>",
        "course_grade_scale": "A, B, C, D, E, FX, F",
        "course_last_exam": [],
        "course_level_code": "1",
        "course_literature": "<i>Ingen information tillagd</i>",
        "course_main_subject": "Samhällsbyggnad, Teknik",
        "course_prerequisites": "<i>Ingen information tillagd</i>",
        "course_recommended_prerequisites": "",
        "course_state": "ESTABLISHED",
        "course_supplemental_information": "",
        "imageFromAdmin": "own_image",
        "sellingText": "<p>Fantastisk kurs</p>",
      },
      "courseTitleData": {
        "course_code": "FCK3305",
        "course_credits_label": "7,5 hp",
        "course_title": "Kolhydratteknik inom glykovetenskap",
      },
      "emptySyllabusData": {
        "course_additional_regulations": "",
        "course_content": "<i>Ingen information tillagd</i>",
        "course_decision_to_discontinue": "",
        "course_eligibility": "<i>Ingen information tillagd</i>",
        "course_ethical": "",
        "course_examination": "<i>Ingen information tillagd</i>",
        "course_examination_comments": "",
        "course_goals": "<i>Ingen information tillagd</i>",
        "course_literature": "<i>Ingen information tillagd</i>",
        "course_requirments_for_final_grade": "",
        "course_transitional_reg": "",
        "course_valid_from": undefined,
        "course_valid_to": undefined,
      },
      "language": "sv",
      "roundsBySemester": {},
      "syllabusList": [
        {
          "course_additional_regulations": "<p>Kursplanen gäller från HT19.</p>",
          "course_content": "<ul>
<li>Referenssystem i plan och höjd</li>
<li>Polär utsättning</li>
<li>Polär- och ortogonal inmätning</li>
<li>Fri station</li>
<li>Polygontåg</li>
<li>Avvägning och trigonometrisk höjdmätning</li>
<li>GPS</li>
<li>Studiebesök</li>
<li>Täktverksamhet</li>
<li>Fältundersökning - kartering av markegenskaper</li>
</ul>",
          "course_decision_to_discontinue": "<p>Skolchef vid ABE-skolan har 2019-10-09 beslutat att kursen avvecklas från och med HT 2019, diarienummer: A-2019-2027.</p>",
          "course_eligibility": "<p>Studerande i åk 2 på högskoleprogrammet Byggproduktion</p>",
          "course_ethical": "<ul>
<li>Vid grupparbete har alla i gruppen ansvar för gruppens arbete.</li>
<li>Vid examination ska varje student ärligt redovisa hjälp som erhållits och källor som använts.</li>
<li>Vid muntlig examination ska varje student kunna redogöra för hela uppgiften och hela lösningen.</li>
</ul>",
          "course_examination": "<ul class='ul-no-padding' ><li>ÖVN1 - Fältövningar, 3,0 hp, Tvågradig betygsskala: P, F</li><li>TEN1 - Tentamen, 4,5 hp, Sjugradig betygsskala: A, B, C, D, E, FX, F</li></ul>",
          "course_examination_comments": "<p>Examinator beslutar, baserat på rekommendation från KTH:s handläggare av stöd till studenter med funktionsnedsättning, om eventuell anpassad examination för studenter med dokumenterad, varaktig funktionsnedsättning.</p>
<p>Examinator får medge annan examinationsform vid omexamination av enstaka studenter.</p>
<p>När kurs inte längre ges har student möjlighet att examineras under ytterligare två läsår.</p>",
          "course_goals": "<p>Målformulering för betyget E.</p>
<p>Efter genomgången kurs skall studenten kunna:</p>
<p>Beräkna polära utsättningsdata för punkter</p>
<p>Beräkna plankoordinater för nya punkter med inmätningsmetoderna:</p>
<ul>
<li>Polär inmätning</li>
<li>Ortogonal inmätning</li>
<li>Inbindning</li>
<li>Skärbindning</li>
</ul>
<p>Beräkna höjdkoordinater för nya punkter med inmätningsmetoderna:</p>
<ul>
<li>Avvägning</li>
<li>Trigonometrisk höjdmätning</li>
</ul>
<p>Instrumentuppställning och mätning med totalstation och avvägningsinstrument<br />
Protokollföring och beräkning av mätprotokoll<br />
Förstå GPS-systemets uppbyggnad och funktion</p>
<p>Kunna redogöra för:</p>
<ul>
<li>Täktverksamhet</li>
<li>Fältundersökningar, kartering av markegenskaper.</li>
</ul>",
          "course_literature": "<i>Ingen information tillagd</i>",
          "course_requirments_for_final_grade": "<p>Godkänd tentamen (TEN1, 4,5 hp) betygsskala: A-F&nbsp;<br />
Godkända fältövningar (ÖVN1 3,0 hp) betygsskala: P/F<br />
Slutbetyg sätts enligt betygsskala A-F.</p>
<p>Obligatorisk närvaro på fältövningar och avslutande redovisning.</p>",
          "course_transitional_reg": "<p>Sista examinationstillfället: VT21</p>
<p>Antal examinationstillfällen per läsår under övergångsperioden: 2</p>
<p>Undervisning under övergångsperioden: Nej</p>
<p>Kursen ersätts av annan kurs: AF1736</p>",
          "course_valid_from": {
            "semesterNumber": 2,
            "year": 2019,
          },
          "course_valid_to": undefined,
        },
      ],
    },
    "employees": {
      "responsibles": [],
      "teachers": [],
    },
    "hostUrl": undefined,
    "initiallySelectedRoundIndex": undefined,
    "initiallySelectedSemester": null,
    "isCancelledOrDeactivated": false,
    "lang": "sv",
    "paths": {
      "system": {
        "monitor": {
          "uri": "/_monitor",
        },
        "robots": {
          "uri": "/robots.txt",
        },
      },
    },
    "proxyPrefixPath": {
      "uri": "/student/kurser/kurs",
    },
  },
  "location": undefined,
}
`)
  })
})
