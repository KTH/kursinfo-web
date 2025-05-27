const { createSyllabusList } = require('../createSyllabusList')
const { mockedLadokData } = require('../mocks/mockedLadokData')

const expectedSyllabusList = [
  {
    course_goals:
      '<p>Målformulering för betyget E.</p>\n<p>Efter genomgången kurs skall studenten kunna:</p>\n<p>Beräkna polära utsättningsdata för punkter</p>\n<p>Beräkna plankoordinater för nya punkter med inmätningsmetoderna:</p>\n<ul>\n<li>Polär inmätning</li>\n<li>Ortogonal inmätning</li>\n<li>Inbindning</li>\n<li>Skärbindning</li>\n</ul>\n<p>Beräkna höjdkoordinater för nya punkter med inmätningsmetoderna:</p>\n<ul>\n<li>Avvägning</li>\n<li>Trigonometrisk höjdmätning</li>\n</ul>\n<p>Instrumentuppställning och mätning med totalstation och avvägningsinstrument<br />\nProtokollföring och beräkning av mätprotokoll<br />\nFörstå GPS-systemets uppbyggnad och funktion</p>\n<p>Kunna redogöra för:</p>\n<ul>\n<li>Täktverksamhet</li>\n<li>Fältundersökningar, kartering av markegenskaper.</li>\n</ul>',
    course_content:
      '<ul>\n<li>Referenssystem i plan och höjd</li>\n<li>Polär utsättning</li>\n<li>Polär- och ortogonal inmätning</li>\n<li>Fri station</li>\n<li>Polygontåg</li>\n<li>Avvägning och trigonometrisk höjdmätning</li>\n<li>GPS</li>\n<li>Studiebesök</li>\n<li>Täktverksamhet</li>\n<li>Fältundersökning - kartering av markegenskaper</li>\n</ul>',
    course_eligibility: '<p>Studerande i åk 2 på högskoleprogrammet Byggproduktion</p>',
    course_requirments_for_final_grade:
      '<p>Godkänd tentamen (TEN1, 4,5 hp) betygsskala: A-F&nbsp;<br />\nGodkända fältövningar (ÖVN1 3,0 hp) betygsskala: P/F<br />\nSlutbetyg sätts enligt betygsskala A-F.</p>\n<p>Obligatorisk närvaro på fältövningar och avslutande redovisning.</p>',
    course_literature: '<i>Ingen information tillagd</i>',
    course_valid_from: {
      year: 2019,
      semesterNumber: 2,
    },
    course_valid_to: undefined,
    course_examination:
      "<ul class='ul-no-padding' ><li>ÖVN1 - Fältövningar, 3,0 hp, Tvågradig betygsskala: P, F</li><li>TEN1 - Tentamen, 4,5 hp, Sjugradig betygsskala: A, B, C, D, E, FX, F</li></ul>",
    course_examination_comments:
      '<p>Examinator beslutar, baserat på rekommendation från KTH:s handläggare av stöd till studenter med funktionsnedsättning, om eventuell anpassad examination för studenter med dokumenterad, varaktig funktionsnedsättning.</p>\n<p>Examinator får medge annan examinationsform vid omexamination av enstaka studenter.</p>\n<p>När kurs inte längre ges har student möjlighet att examineras under ytterligare två läsår.</p>',
    course_ethical:
      '<ul>\n<li>Vid grupparbete har alla i gruppen ansvar för gruppens arbete.</li>\n<li>Vid examination ska varje student ärligt redovisa hjälp som erhållits och källor som använts.</li>\n<li>Vid muntlig examination ska varje student kunna redogöra för hela uppgiften och hela lösningen.</li>\n</ul>',
    course_additional_regulations:
      '<p>The course is primarily open for PhD students in environmental strategic analysis.</p>',
    course_transitional_reg:
      '<p>Sista examinationstillfället: VT21</p>\n<p>Antal examinationstillfällen per läsår under övergångsperioden: 2</p>\n<p>Undervisning under övergångsperioden: Nej</p>\n<p>Kursen ersätts av annan kurs: AF1736</p>',
    course_decision_to_discontinue:
      '<p>Skolchef vid ABE-skolan har 2019-10-09 beslutat att kursen avvecklas från och med HT 2019, diarienummer: A-2019-2027.</p>',
  },
]

const expectedEmpty = [
  {
    course_additional_regulations: '',
    course_content: '<i>Ingen information tillagd</i>',
    course_decision_to_discontinue: '<i>Ingen information tillagd</i>',
    course_eligibility: '<i>Ingen information tillagd</i>',
    course_ethical: '',
    course_examination: "<ul class='ul-no-padding' ><li></li><li></li></ul>",
    course_examination_comments: '',
    course_goals: '<i>Ingen information tillagd</i>',
    course_literature: '<i>Ingen information tillagd</i>',
    course_requirments_for_final_grade: '',
    course_transitional_reg: '',
    course_valid_from: {
      semesterNumber: 2,
      year: 2019,
    },
    course_valid_to: undefined,
  },
]

describe('createSyllabusList', () => {
  test('creates syllabus list', () => {
    const { syllabusList } = createSyllabusList(mockedLadokData.mockedCourseSyllabus, 'sv')

    expect(syllabusList).toEqual(expectedSyllabusList)
  })
  test('if empty publicSyllabusVersions, returns empty array', () => {
    const { syllabusList } = createSyllabusList(mockedLadokData.mockedUndefinedCourseSyllabus, 'sv')

    expect(syllabusList).toEqual(expectedEmpty)
  })
})
