const mockedLadokCourseVersion = {
  kod: 'FCK3305',
  benamning: 'Kolhydratteknik inom glykovetenskap',
  omfattning: 7.5,
  organisation: {
    code: 'CE',
    name: 'CBH/Kemi',
  },
  utbildningstyp: {
    creditsUnitCode: 'HP',
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
