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
  },
  huvudomraden: [],
}

const mockedLadokRounds = []

const mockedExaminationModules = [
  {
    ladokUID: '7f20dbb6-73d8-11e8-b4e0-063f9afb40e3',
    kod: 'TEN1',
    benamning: 'Examination',
    betygsskala: {
      id: '131657',
      code: 'AF',
      name: 'Seven point grading scale',
      nameOther: 'Sjugradig betygsskala',
    },
    omfattning: {
      number: '7.5',
      formattedWithUnit: '7.5 credits',
    },
    giltigFrom: {
      id: '133040',
      code: 'HT2007',
      sv: 'Hösttermin 2007',
      en: 'Autumn semester 2007',
    },
  },
]

const mockedLadokData = { mockedLadokCourseVersion, mockedLadokRounds, mockedExaminationModules }

module.exports = { mockedLadokData }
