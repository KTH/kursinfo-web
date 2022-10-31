import i18n from '../../../../../../i18n'
import { periods, schools, seasons, year } from './index'

const PARAMS = {
  documentType: 'documentType',
  periods: 'periods',
  school: 'school',
  seasons: 'seasons',
  year: 'year',
}
const DOCS = { courseMemo: 'courseMemo', courseAnalysis: 'courseAnalysis' }

const DOCUMENT_TYPES = [DOCS.courseMemo, DOCS.courseAnalysis]

const studyLengthParamName = documentType => (documentType === DOCS.courseMemo ? PARAMS.periods : PARAMS.seasons)

const paramsByDocumentType = documentType => [
  PARAMS.documentType,
  PARAMS.school,
  PARAMS.year,
  studyLengthParamName(documentType),
]
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
    case PARAMS.seasons: // Course analysis
      return parseData(seasons.ORDERED_SEASONS, langIndex, seasons.labelSeason)
    case PARAMS.periods: // Kurs-pm
      return parseData(periods.ORDERED_PERIODS, langIndex, periods.labelPeriod)
    default: {
      if (typeof paramName !== 'string')
        throw new Error(`Check the type of parameter name: ${paramName} has the type ${typeof paramName}`)
      throw new Error(`Unknown search options: ${paramName}. Allowed options: ${Object.values(PARAMS).join(', ')}`)
    }
  }
}

function splitToBulks(arr, bulkSize = 2) {
  const bulks = []
  for (let i = 0; i < Math.ceil(arr.length / bulkSize); i++) {
    bulks.push(arr.slice(i * bulkSize, (i + 1) * bulkSize))
  }
  return bulks
}

export { DOCS, DOCUMENT_TYPES, getOptionsValues, PARAMS, paramsByDocumentType, splitToBulks, studyLengthParamName }
