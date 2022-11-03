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

const isCorrectSchool = (chosenSchool, courseSchool) => {
  const chosenSchoolUp = chosenSchool.toUpperCase()
  const courseSchoolMainCode = SCHOOL_MAP[courseSchool.toUpperCase()]
  if (chosenSchool === 'allSchools') {
    // to sort out others schools which are not in the school map
    return !!courseSchoolMainCode
  }

  return chosenSchoolUp === courseSchoolMainCode
}

module.exports = {
  isCorrectSchool,
  SCHOOL_MAP,
}
