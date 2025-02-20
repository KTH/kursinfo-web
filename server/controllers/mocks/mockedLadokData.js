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

const mockedLadokData = { mockedLadokCourseVersion, mockedLadokRounds, mockedExaminationModules }

module.exports = { mockedLadokData }
