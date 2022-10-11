const SCHOOL_MAP = {
  ABE: 'ABE',
  CBH: 'CBH',
  STH: 'CBH',
  CHE: 'CBH',
  BIO: 'CBH',
  CSC: 'EECS',
  ECE: 'ITM',
  EECS: 'EECS',
  EES: 'EECS',
  ICT: 'EECS',
  ITM: 'ITM',
  SCI: 'SCI',
}

const isCorrectSchool = (chosenSchool, courseSchool) =>
  chosenSchool === 'allSchools' || chosenSchool.toUpperCase() === SCHOOL_MAP[courseSchool.toUpperCase()]

module.exports = {
  isCorrectSchool,
  SCHOOL_MAP,
}
