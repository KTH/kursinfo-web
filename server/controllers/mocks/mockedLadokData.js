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

const mockedLadokData = { mockedLadokCourseVersion, mockedLadokRounds }

module.exports = { mockedLadokData }
