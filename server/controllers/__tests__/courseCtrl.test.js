'use strict'

import { mockedCourseMemosForDiscontinuedCourse, mockedDiscontinuedCourse } from '../mocks/mockedDiscontinuedCourse'

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
jest.mock('kth-node-express-routing', () => ({
  getPaths: jest.fn(() => applicationPaths),
}))
// jest.mock('@kth/kth-node-response')
jest.mock('../../configuration', () => ({
  server: {
    logging: { log: { level: 'debug' } },
    proxyPrefixPath: { uri: '/student/kurser/kurs' },
    session: { sessionOptions: { secret: '' } },
    sessionSecret: 'xxx',
  },
  browser: { session: {}, sessionSecret: 'xxx' },
}))
jest.mock('../../api', () => ({ kursPmDataApi: { connected: true } }))
jest.mock('../../apiCalls/kursinfoAdmin', () => ({
  getSellingText: () => ({ sellingText: '<p>This course is awesome</p>', imageInfo: 'own_image' }),
}))
jest.mock('../../apiCalls/memoApi', () => ({
  getPrioritizedCourseMemos: () => ({ body: mockedCourseMemosForDiscontinuedCourse }),
}))
jest.mock('../../apiCalls/koppsCourseData', () => ({ getKoppsCourseData: () => ({ body: mockedDiscontinuedCourse }) }))
jest.mock('../../apiCalls/ugRedisApi', () => ({
  getCourseEmployees: jest.fn(() => ({ examiners: '<p>Examiner 1 </p>' })),
}))
let testResponse, errorResponse

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
  errorResponse = null
  response = { render: jest.fn().mockImplementation((name, values) => (testResponse = values)) }
})

afterEach(() => {
  response = {}
})

describe('Discontinued course to test', () => {
  test('Gets correct data', async () => {
    const req = buildReq({ params: { courseCode: mockedDiscontinuedCourse.course.courseCode }, language: 'sv' })
    const next = jest.fn().mockImplementation(error => (errorResponse = error))

    await courseCtrl.getIndex(req, response, next)
    if (errorResponse) console.error('errorResponse', errorResponse)

    expect(response.render).toHaveBeenCalled()
    expect(testResponse.title).toBe(mockedDiscontinuedCourse.course.courseCode)
    expect(testResponse.compressedData.courseCode).toBe(mockedDiscontinuedCourse.course.courseCode)
    expect(testResponse.compressedData.courseData.courseInfo.course_application_info).toBe(
      mockedDiscontinuedCourse.course.applicationInfo
    )
    expect(testResponse.html.context.courseCode).toBe(mockedDiscontinuedCourse.course.courseCode)
    expect(testResponse.html.context.courseData.courseInfo.course_application_info).toBe(
      mockedDiscontinuedCourse.course.applicationInfo
    )

    expect(testResponse.html).toMatchInlineSnapshot(`
      {
        "applicationStore": {},
        "basename": "/student/kurser/kurs",
        "context": {
          "activeRoundIndex": 0,
          "activeSemester": null,
          "activeSemesterIndex": 0,
          "activeSemesters": [],
          "activeSemestersIndexesWithValidSyllabusesIndexes": [],
          "activeSyllabusIndex": 0,
          "browserConfig": {
            "session": {},
            "sessionSecret": "xxx",
          },
          "courseCode": "FCK3305",
          "courseData": {
            "courseInfo": {
              "course_application_info": "<p>Kursen ges inte l&#228;s&#229;ret 22/23.</p><p>Kontakta examinator / kursansvarig f&#246;r information.</p>",
              "course_code": "FCK3305",
              "course_contact_name": "<i>Ingen information tillagd</i>",
              "course_department": "CBH/Kemi",
              "course_department_code": "CE",
              "course_department_link": "<a href="/cbh/" target="blank">CBH/Kemi</a>",
              "course_disposition": "<p>Kursen omfattar cirka 200 heltidsstudietimmar och utg&#246;rs av f&#246;rel&#228;sningar och praktiska laborationer. Laborationerna omfattar relevanta och aktuella experimentella metoder inom kolhydratteknik, t.ex. kolhydratanalys, produktion av kolhydrataktiva enzymer, preparation och karakterisering av vedbaserade nanomaterial och kolhydratsyntes. En mer detaljerad beskrivning av kursens inneh&#229;ll och uppl&#228;gg &#229;terfinns i kurs-PM.</p>",
              "course_education_type_id": null,
              "course_examiners": "<p>Examiner 1 </p>",
              "course_grade_scale": "P, F",
              "course_last_exam": [],
              "course_level_code": "RESEARCH",
              "course_literature": "<p>Litteratur anvisas vid kursstart.</p>",
              "course_main_subject": "Denna kurs tillhör inget huvudområde.",
              "course_possibility_to_addition": "<i>Ingen information tillagd</i>",
              "course_possibility_to_completions": "<i>Ingen information tillagd</i>",
              "course_prerequisites": "<i>Ingen information tillagd</i>",
              "course_recruitment_text": "<p>Teori och metoder inom glykovetenskap.</p>",
              "course_required_equipment": "<i>Ingen information tillagd</i>",
              "course_state": "ESTABLISHED",
              "course_suggested_addon_studies": "<i>Ingen information tillagd</i>",
              "course_supplemental_information": "<p>Ers&#228;tter kurs FBB3640.</p>",
              "course_supplemental_information_url": "<i>Ingen information tillagd</i>",
              "course_supplemental_information_url_text": "<i>Ingen information tillagd</i>",
              "course_web_link": "https://www.kth.se/social/course/FCK3305/",
            },
            "courseTitleData": {
              "course_code": "FCK3305",
              "course_credits": 7.5,
              "course_credits_text": "hp",
              "course_other_title": "Carbohydrate Technologies in Glycoscience",
              "course_title": "Kolhydratteknik inom glykovetenskap",
            },
            "language": "sv",
            "roundList": {},
            "syllabusList": [
              {
                "course_additional_regulations": "",
                "course_content": "<p>Glykovetenskap &#228;r ett tv&#228;rvetenskapligt forskningsomr&#229;de som fokuserar p&#229; att f&#246;rst&#229; strukturer och funktionella roller f&#246;r glykaner (kolhydrater) i biologiska system. Det t&#228;cker &#228;mnesomr&#229;den som biologi, biokemi, kemi, medicin, materialvetenskap, nanoteknologi och ber&#228;kningsvetenskap. Kursens m&#229;l &#228;r att ge en &#246;versikt &#246;ver aktuell kunskap och teknik inom glykovetenskap, utmaningar och m&#246;jligheter f&#246;r bred till&#228;mpning av kolhydratteknik inom h&#228;lsa, energi och materialvetenskap, samt god teoretisk insikt och praktiska f&#228;rdigheter i hur kolhydratteknik kan bidra till h&#229;llbar utveckling inom energi- och materialvetenskap.</p><p>&#196;mnen som avhandlas omfattar kolhydratteknik inom h&#228;lsa, energi och materialvetenskap, glykaners funktioner, kolhydratanalys av komplexa kolhydrater, glykaner och glykokonjugat, uppbyggnaden av v&#228;xters cellv&#228;gg, kolhydrataktiva enzymer, enzymatisk nedbrytning av v&#228;xtbiomassa och modifiering av v&#228;xtbaserade fibrer, biosyntes och av cellulosa och kitin, skapande av nya kompositer genom bioteknologisk modifiering av v&#228;xtcellv&#228;ggen, modifiering av glykaner genom att f&#246;r&#228;ndra syntesv&#228;gar, omvandling av v&#228;xtbiomassa till finkemikalier och r&#229;material, polymera material och nanomaterial, anv&#228;ndande av biomassabaserade nanomaterial f&#246;r nya material och till&#228;mpningar.</p>",
                "course_decision_to_discontinue": "<i>Ingen information tillagd</i>",
                "course_disposition": "<i>Ingen information tillagd</i>",
                "course_eligibility": "<p>Beh&#246;rig till studier p&#229; forskarniv&#229;. Goda kunskaper i engelska.</p>",
                "course_establishment": "<p>Skolchef vid CBH-skolan har 2019-10-23 beslutat att fastst&#228;lla denna kursplan att g&#228;lla fr&#229;n och med HT2019 (diarienummer C-2019-2209).</p>",
                "course_ethical": "<ul><li>Vid grupparbete har alla i gruppen ansvar för gruppens arbete.</li><li>Vid examination ska varje student ärligt redovisa hjälp som erhållits och källor som använts.</li><li>Vid muntlig examination ska varje student kunna redogöra för hela uppgiften och hela lösningen.</li></ul>",
                "course_examination": "<ul class='ul-no-padding' ><li>INL1 - 
                              Inlämningsuppgift,
                              2,0 hp,  
                              betygsskala: P, F              
                              </li><li>LAB1 - 
                              Laborationer,
                              4,0 hp,  
                              betygsskala: P, F              
                              </li><li>TEN1 - 
                              Skriftlig tentamen,
                              1,5 hp,  
                              betygsskala: P, F              
                              </li></ul>",
                "course_examination_comments": "Examinator beslutar, baserat på rekommendation från KTH:s samordnare för funktionsnedsättning, om eventuell anpassad examination för studenter med dokumenterad, varaktig funktionsnedsättning. <br><br>Examinator får medge annan examinationsform vid omexamination av enstaka studenter.<p>Betygskriterier redovisas i kurs-PM.</p>",
                "course_goals": "<p>Efter fullf&#246;ljande av kursen f&#246;rv&#228;ntas studenten kunna</p><ul><li>Visa kunskap om kolhydraters m&#229;ngfald, dess betydelse f&#246;r biologiska system, samt hur de kan f&#246;r&#228;ndra struktur och funktion hos andra biologiska molekyler.</li><li>Visa kunskap om cellv&#228;ggens struktur och funktion hos vedbildande v&#228;xter, samt &#246;vergripande f&#246;rst&#229;else f&#246;r hur dess sammans&#228;ttning kan f&#246;r&#228;ndras f&#246;r att m&#246;jligg&#246;ra nya till&#228;mpningar, t.ex. f&#246;r att underl&#228;tta bearbetning f&#246;r energi- och biomaterialproduktion.</li><li>Visa f&#246;rm&#229;ga att redog&#246;ra och reflektera &#246;ver koncept och metoder som anv&#228;nds f&#246;r att producera byggstenar fr&#229;n v&#228;xtbiomassa, och hur de kan s&#228;ttas ihop till nya material med skr&#228;ddarsydda egenskaper och funktionaliteter.</li><li>Visa f&#246;rm&#229;ga att planera och utf&#246;ra praktiska experiment inom kolhydratteknik, samt att analysera och redog&#246;ra resultaten i form av skriftliga rapporter.</li><li>Visa f&#246;rm&#229;ga att identifiera och diskutera hur kolhydratteknik kan bidra till en h&#229;llbar samh&#228;llsutveckling inom konsumtion, produktion och material, t.ex. genom att &#229;teranv&#228;nda redan existerande produkter, eller tillverkning av nya resurssmarta och f&#246;rnyelsebara material.</li></ul>",
                "course_literature": "<i>Ingen information tillagd</i>",
                "course_literature_comment": "<i>Ingen information tillagd</i>",
                "course_required_equipment": "<i>Ingen information tillagd</i>",
                "course_requirments_for_final_grade": "<p>Godk&#228;nd skriftlig tentamen, godk&#228;nda inl&#228;mningsuppgifter kopplade till f&#246;rel&#228;sningarna, 100% n&#228;rvaro p&#229; laborationer och slutf&#246;rande av laborationer, samt godk&#228;nda laborationsrapporter.</p>",
                "course_transitional_reg": "",
                "course_valid_from": [
                  "2019",
                  "2",
                ],
                "course_valid_to": [],
              },
            ],
            "syllabusSemesterList": [
              [
                20192,
                "",
              ],
            ],
          },
          "defaultIndex": 0,
          "dropdownsOpen": {
            "roundsDropdown": false,
            "semesterDropdown": false,
          },
          "hasStartPeriodFromQuery": false,
          "hostUrl": undefined,
          "imageFromAdmin": "",
          "isCancelled": false,
          "isDeactivated": false,
          "keyList": {
            "responsibles": [],
            "teachers": [],
          },
          "lang": "sv",
          "memoList": {
            "20232": {
              "1": {
                "courseCode": "FCK3305",
                "isPdf": false,
                "ladokRoundIds": [
                  "1",
                ],
                "lastChangeDate": "Fri Aug 26 2022 14:42:34 GMT+0200 (Central European Summer Time)",
                "memoCommonLangAbbr": "en",
                "memoEndPoint": "FCK330520232-1",
                "memoName": "Autumn 2023-1 (Start date 30/10/2023, English)",
                "semester": "20232",
                "version": 1,
              },
            },
          },
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
          "roundDisabled": false,
          "roundInfoFade": false,
          "roundSelectedIndex": 0,
          "sellingText": {
            "en": "",
            "sv": "",
          },
          "semesterSelectedIndex": 0,
          "setBrowserConfig": [Function],
          "showCourseWebbLink": true,
          "showRoundData": false,
          "syllabusInfoFade": false,
          "useStartSemesterFromQuery": false,
        },
        "location": undefined,
      }
    `)
  })
})
