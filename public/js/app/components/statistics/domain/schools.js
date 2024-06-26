const SCHOOLS = {
  ABE: 'ABE',
  CBH: 'CBH',
  EECS: 'EECS',
  ITM: 'ITM',
  SCI: 'SCI',
}
const ORDERED_SCHOOLS_FORM = [SCHOOLS.ABE, SCHOOLS.ITM, SCHOOLS.CBH, SCHOOLS.SCI, SCHOOLS.EECS]
const ORDERED_SCHOOLS = [SCHOOLS.ABE, SCHOOLS.CBH, SCHOOLS.EECS, SCHOOLS.ITM, SCHOOLS.SCI]

const orderedSchoolsFormOptions = () => [...ORDERED_SCHOOLS_FORM, 'allSchools']
const orderedSchoolsOptions = () => [...ORDERED_SCHOOLS, 'allSchools']
const DEPARTMENT_TO_SCHOOL_MAP = {
  ABE: SCHOOLS.ABE,
  CBH: SCHOOLS.CBH,
  STH: SCHOOLS.CBH,
  CHE: SCHOOLS.CBH,
  BIO: SCHOOLS.CBH,
  CSC: SCHOOLS.EECS,
  ECE: SCHOOLS.ITM,
  EECS: SCHOOLS.EECS,
  EES: SCHOOLS.EECS,
  ICT: SCHOOLS.EECS,
  ITM: SCHOOLS.ITM,
  SCI: SCHOOLS.SCI,
}
export default { DEPARTMENT_TO_SCHOOL_MAP, ORDERED_SCHOOLS, orderedSchoolsFormOptions, orderedSchoolsOptions, SCHOOLS }
