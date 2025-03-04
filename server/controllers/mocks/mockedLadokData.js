const mockedLadokCourseVersion = {
  kod: 'FCK3305',
  benamning: 'Kolhydratteknik inom glykovetenskap',
  omfattning: { number: '7.5', formattedWithUnit: '7,5 hp' },
  organisation: {
    code: 'CE',
    name: 'CBH/Kemi',
  },
  utbildningstyp: {
    creditsUnit: { code: 'HP' },
    level: {
      code: '3',
      name: 'Grundnivå',
    },
  },
  betygsskala: {
    code: 'PF',
    formatted: 'P, F',
  },
  huvudomraden: [],
}

const mockedLadokRounds = []

const mockedExaminationModules = {
  completeExaminationStrings: ['TEN1 - Examination, 7.5 credits, Seven point grading scale: A, B, C, D, E, FX, F'],
  titles: ['TEN1 - Examination, 7.5 credits'],
}

const mockedCourseSyllabus = {
  course: {
    kod: 'HS1732',
    benamning: {
      sv: 'Fältmätning',
      en: 'Surveying',
    },
    omfattning: {
      number: '7.5',
      formattedWithUnit: '7,5 hp',
    },
    betygsskala: 'A, B, C, D, E, FX, F',
    nivainomstudieordning: {
      id: '22',
      code: '2007GKURS',
      sv: 'Kurs, grundnivå',
      en: 'Course, First-cycle',
      creditsUnit: {
        code: 'HP',
        sv: 'Högskolepoäng',
        en: 'Credits',
      },
      level: {
        code: '1',
        sv: 'Grundnivå',
        en: 'First cycle',
      },
    },
    huvudomraden: [
      {
        id: '16263',
        code: 'SZABD',
        sv: 'Samhällsbyggnad',
        en: 'The Built Environment',
      },
      {
        id: '16268',
        code: 'TEKNK',
        sv: 'Teknik',
        en: 'Technology',
      },
    ],
    overgangsbestammelser:
      '<p>Sista examinationstillfället: VT21</p>\n<p>Antal examinationstillfällen per läsår under övergångsperioden: 2</p>\n<p>Undervisning under övergångsperioden: Nej</p>\n<p>Kursen ersätts av annan kurs: AF1736</p>',
  },
  kursplan: {
    giltigfrom: 'HT2019',
    utgava: '1',
    undervisningssprak: '<p>Undervisningsspråk anges i kurstillfällesinformationen i kurs- och programkatalogen.</p>',
    larandemal:
      '<p>Målformulering för betyget E.</p>\n<p>Efter genomgången kurs skall studenten kunna:</p>\n<p>Beräkna polära utsättningsdata för punkter</p>\n<p>Beräkna plankoordinater för nya punkter med inmätningsmetoderna:</p>\n<ul>\n<li>Polär inmätning</li>\n<li>Ortogonal inmätning</li>\n<li>Inbindning</li>\n<li>Skärbindning</li>\n</ul>\n<p>Beräkna höjdkoordinater för nya punkter med inmätningsmetoderna:</p>\n<ul>\n<li>Avvägning</li>\n<li>Trigonometrisk höjdmätning</li>\n</ul>\n<p>Instrumentuppställning och mätning med totalstation och avvägningsinstrument<br />\nProtokollföring och beräkning av mätprotokoll<br />\nFörstå GPS-systemets uppbyggnad och funktion</p>\n<p>Kunna redogöra för:</p>\n<ul>\n<li>Täktverksamhet</li>\n<li>Fältundersökningar, kartering av markegenskaper.</li>\n</ul>',
    kursinnehall:
      '<ul>\n<li>Referenssystem i plan och höjd</li>\n<li>Polär utsättning</li>\n<li>Polär- och ortogonal inmätning</li>\n<li>Fri station</li>\n<li>Polygontåg</li>\n<li>Avvägning och trigonometrisk höjdmätning</li>\n<li>GPS</li>\n<li>Studiebesök</li>\n<li>Täktverksamhet</li>\n<li>Fältundersökning - kartering av markegenskaper</li>\n</ul>',
    etisktforhallandesatt:
      '<ul>\n<li>Vid grupparbete har alla i gruppen ansvar för gruppens arbete.</li>\n<li>Vid examination ska varje student ärligt redovisa hjälp som erhållits och källor som använts.</li>\n<li>Vid muntlig examination ska varje student kunna redogöra för hela uppgiften och hela lösningen.</li>\n</ul>',
    faststallande: '<p>Kursplanen gäller från HT19.</p>',
    examinationModules: {
      completeExaminationStrings: [
        'ÖVN1 - Fältövningar, 3,0 hp, Tvågradig betygsskala: P, F',
        'TEN1 - Tentamen, 4,5 hp, Sjugradig betygsskala: A, B, C, D, E, FX, F',
      ],
      titles: ['ÖVN1 - Fältövningar, 3,0 hp', 'TEN1 - Tentamen, 4,5 hp'],
    },
    kommentartillexamination:
      '<p>Examinator beslutar, baserat på rekommendation från KTH:s handläggare av stöd till studenter med funktionsnedsättning, om eventuell anpassad examination för studenter med dokumenterad, varaktig funktionsnedsättning.</p>\n<p>Examinator får medge annan examinationsform vid omexamination av enstaka studenter.</p>\n<p>När kurs inte längre ges har student möjlighet att examineras under ytterligare två läsår.</p>',
    ovrigakravforslutbetyg:
      '<p>Godkänd tentamen (TEN1, 4,5 hp) betygsskala: A-F&nbsp;<br />\nGodkända fältövningar (ÖVN1 3,0 hp) betygsskala: P/F<br />\nSlutbetyg sätts enligt betygsskala A-F.</p>\n<p>Obligatorisk närvaro på fältövningar och avslutande redovisning.</p>',
    sarskildbehorighet: '<p>Studerande i åk 2 på högskoleprogrammet Byggproduktion</p>',
    avvecklingsbeslut:
      '<p>Skolchef vid ABE-skolan har 2019-10-09 beslutat att kursen avvecklas från och med HT 2019, diarienummer: A-2019-2027.</p>',
  },
}

const mockedUndefinedCourseSyllabus = {
  course: {
    kod: '',
    benamning: {
      sv: '',
      en: '',
    },
    omfattning: {
      number: '',
      formattedWithUnit: '',
    },
    betygsskala: '',
    nivainomstudieordning: {
      id: '',
      code: '',
      sv: '',
      en: '',
      creditsUnit: {
        code: '',
        sv: '',
        en: '',
      },
      level: {
        code: '',
        sv: '',
        en: '',
      },
    },
    huvudomraden: [
      {
        id: '',
        code: '',
        sv: '',
        en: '',
      },
      {
        id: '',
        code: '',
        sv: '',
        en: '',
      },
    ],
    overgangsbestammelser: '',
  },
  kursplan: {
    giltigfrom: 'HT2019',
    utgava: '',
    undervisningssprak: '',
    larandemal: '',
    kursinnehall: '',
    etisktforhallandesatt: '',
    faststallande: '',
    examinationModules: {
      completeExaminationStrings: ['', ''],
      titles: ['', ''],
    },
    kommentartillexamination: '',
    ovrigakravforslutbetyg: '',
    sarskildbehorighet: '',
    avvecklingsbeslut: '',
  },
}

const mockedLadokData = {
  mockedLadokCourseVersion,
  mockedLadokRounds,
  mockedExaminationModules,
  mockedCourseSyllabus,
  mockedUndefinedCourseSyllabus,
}

module.exports = { mockedLadokData }
