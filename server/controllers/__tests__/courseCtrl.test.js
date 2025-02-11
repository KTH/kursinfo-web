'use strict'

import { mockedCourseMemosForDiscontinuedCourse, mockedDiscontinuedCourse } from '../mocks/mockedDiscontinuedCourse'
import { mockedLadokData } from '../mocks/mockedLadokData'

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
    getActiveCourseRounds: () => mockedLadokData.mockedLadokRounds,
    getExaminationModulesByUtbildningstillfalleUid: () => mockedLadokData.mockedExaminationModules,
    getExaminationModulesByUtbildningsinstansUid: () => mockedLadokData.mockedExaminationModules,
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
        "course_grade_scale": "P, F",
        "course_last_exam": [],
        "course_level_code": "3",
        "course_literature": "<i>Ingen information tillagd</i>",
        "course_main_subject": "Denna kurs tillhör inget huvudområde.",
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
        "course_literature_comment": "<i>Ingen information tillagd</i>",
        "course_requirments_for_final_grade": "",
        "course_transitional_reg": "",
        "course_valid_from": undefined,
        "course_valid_to": undefined,
      },
      "language": "sv",
      "roundsBySemester": {},
      "syllabusList": [
        {
          "course_additional_regulations": "",
          "course_content": "<p>Glykovetenskap &#228;r ett tv&#228;rvetenskapligt forskningsomr&#229;de som fokuserar p&#229; att f&#246;rst&#229; strukturer och funktionella roller f&#246;r glykaner (kolhydrater) i biologiska system. Det t&#228;cker &#228;mnesomr&#229;den som biologi, biokemi, kemi, medicin, materialvetenskap, nanoteknologi och ber&#228;kningsvetenskap. Kursens m&#229;l &#228;r att ge en &#246;versikt &#246;ver aktuell kunskap och teknik inom glykovetenskap, utmaningar och m&#246;jligheter f&#246;r bred till&#228;mpning av kolhydratteknik inom h&#228;lsa, energi och materialvetenskap, samt god teoretisk insikt och praktiska f&#228;rdigheter i hur kolhydratteknik kan bidra till h&#229;llbar utveckling inom energi- och materialvetenskap.</p><p>&#196;mnen som avhandlas omfattar kolhydratteknik inom h&#228;lsa, energi och materialvetenskap, glykaners funktioner, kolhydratanalys av komplexa kolhydrater, glykaner och glykokonjugat, uppbyggnaden av v&#228;xters cellv&#228;gg, kolhydrataktiva enzymer, enzymatisk nedbrytning av v&#228;xtbiomassa och modifiering av v&#228;xtbaserade fibrer, biosyntes och av cellulosa och kitin, skapande av nya kompositer genom bioteknologisk modifiering av v&#228;xtcellv&#228;ggen, modifiering av glykaner genom att f&#246;r&#228;ndra syntesv&#228;gar, omvandling av v&#228;xtbiomassa till finkemikalier och r&#229;material, polymera material och nanomaterial, anv&#228;ndande av biomassabaserade nanomaterial f&#246;r nya material och till&#228;mpningar.</p>",
          "course_decision_to_discontinue": "<i>Ingen information tillagd</i>",
          "course_eligibility": "<p>Beh&#246;rig till studier p&#229; forskarniv&#229;. Goda kunskaper i engelska.</p>",
          "course_ethical": "<ul><li>Vid grupparbete har alla i gruppen ansvar för gruppens arbete.</li><li>Vid examination ska varje student ärligt redovisa hjälp som erhållits och källor som använts.</li><li>Vid muntlig examination ska varje student kunna redogöra för hela uppgiften och hela lösningen.</li></ul>",
          "course_examination": "<ul class='ul-no-padding' ><li>TEN1 - 
                            Examination,
                            7.5 credits,  
                            Seven point grading scale: A, B, C, D, E, FX, F              
                            </li></ul>",
          "course_examination_comments": "Examinator beslutar, baserat på rekommendation från KTH:s samordnare för funktionsnedsättning, om eventuell anpassad examination för studenter med dokumenterad, varaktig funktionsnedsättning. <br><br>Examinator får medge annan examinationsform vid omexamination av enstaka studenter.<p>Betygskriterier redovisas i kurs-PM.</p>",
          "course_goals": "<p>Efter fullf&#246;ljande av kursen f&#246;rv&#228;ntas studenten kunna</p><ul><li>Visa kunskap om kolhydraters m&#229;ngfald, dess betydelse f&#246;r biologiska system, samt hur de kan f&#246;r&#228;ndra struktur och funktion hos andra biologiska molekyler.</li><li>Visa kunskap om cellv&#228;ggens struktur och funktion hos vedbildande v&#228;xter, samt &#246;vergripande f&#246;rst&#229;else f&#246;r hur dess sammans&#228;ttning kan f&#246;r&#228;ndras f&#246;r att m&#246;jligg&#246;ra nya till&#228;mpningar, t.ex. f&#246;r att underl&#228;tta bearbetning f&#246;r energi- och biomaterialproduktion.</li><li>Visa f&#246;rm&#229;ga att redog&#246;ra och reflektera &#246;ver koncept och metoder som anv&#228;nds f&#246;r att producera byggstenar fr&#229;n v&#228;xtbiomassa, och hur de kan s&#228;ttas ihop till nya material med skr&#228;ddarsydda egenskaper och funktionaliteter.</li><li>Visa f&#246;rm&#229;ga att planera och utf&#246;ra praktiska experiment inom kolhydratteknik, samt att analysera och redog&#246;ra resultaten i form av skriftliga rapporter.</li><li>Visa f&#246;rm&#229;ga att identifiera och diskutera hur kolhydratteknik kan bidra till en h&#229;llbar samh&#228;llsutveckling inom konsumtion, produktion och material, t.ex. genom att &#229;teranv&#228;nda redan existerande produkter, eller tillverkning av nya resurssmarta och f&#246;rnyelsebara material.</li></ul>",
          "course_literature": "<i>Ingen information tillagd</i>",
          "course_literature_comment": "<i>Ingen information tillagd</i>",
          "course_requirments_for_final_grade": "<p>Godk&#228;nd skriftlig tentamen, godk&#228;nda inl&#228;mningsuppgifter kopplade till f&#246;rel&#228;sningarna, 100% n&#228;rvaro p&#229; laborationer och slutf&#246;rande av laborationer, samt godk&#228;nda laborationsrapporter.</p>",
          "course_transitional_reg": "",
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
