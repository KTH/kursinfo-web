const mockedLadokCourseVersion = {
  kod: 'FCK3305',
  benamning: { sv: 'Kolhydratteknik inom glykovetenskap', en: 'Carbohydrate Technologies in Glycoscience' },
  omfattning: 7.5,
  organisation: {
    code: 'CE',
    sv: 'CBH/Kemi',
    en: 'CBH/Kemi',
  },
  utbildningstyp: {
    creditsUnitCode: 'HP',
    level: {
      code: '3',
      sv: 'Grundnivå',
      en: 'First cycle',
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
