import i18n from '../../../../../../i18n'
import { periods, schools, semester, year } from './index'

const PARAMS = {
  documentType: 'documentType',
  periods: 'periods',
  school: 'school',
  semesters: 'semesters',
  year: 'year',
}

const DOCUMENT_TYPES = ['courseMemo', 'courseAnalysis']

// Parse functions
/**
 * @param {array} values
 * @param {number} langIndex
 * @throws
 * @returns {array}
 */
function parseData(values, langIndex, labelFn = null) {
  const { statisticsLabels: labels } = i18n.messages[langIndex]

  // const valuesList = fn ? fn(values, langIndex) : values

  return values.map(value => {
    const id = value
    const label = labelFn ? labelFn(value, langIndex) : labels[value] || value
    return { label, id, value }
  })
}

/**
 * @param {string} paramName
 * @param {number} langIndex
 * @throws
 * @returns {array}
 */
function getOptionsValues(paramName, langIndex) {
  switch (paramName) {
    case PARAMS.documentType:
      return parseData(DOCUMENT_TYPES, langIndex)
    case PARAMS.school:
      return parseData(schools.ORDERED_SCHOOL_OPTIONS, langIndex)
    case PARAMS.year:
      return parseData(year.getYears(), langIndex)
    case PARAMS.semesters: // Course analysis
      return parseData(semester.ORDERED_SEASONS, langIndex, semester.labelSeason)
    case PARAMS.periods: // Kurs-pm
      return parseData(periods.ORDERED_PERIODS, langIndex, periods.labelPeriod)
    default: {
      if (typeof paramName !== 'string')
        throw new Error(`Check the type of parameter name: ${paramName} has the type ${typeof paramName}`)
      throw new Error(`Unknown search options: ${paramName}. Allowed options: ${Object.values(PARAMS).join(', ')}`)
    }
  }
}

export { DOCUMENT_TYPES, getOptionsValues, PARAMS }
