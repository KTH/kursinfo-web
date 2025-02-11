import i18n from '../../../../../../i18n'
import { periods, schools, seasons, year } from './index'

const PARAMS = {
  documentType: 'documentType',
  periods: 'periods',
  school: 'school',
  semester: 'semester',
  year: 'year',
}
const DOCS = { courseMemo: 'courseMemo', courseAnalysis: 'courseAnalysis' }

const documentTypes = () => [DOCS.courseMemo, DOCS.courseAnalysis]

const studyLengthParamName = documentType => (documentType === DOCS.courseMemo ? PARAMS.periods : PARAMS.semester)

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
      return parseData(documentTypes(), langIndex)
    case PARAMS.school:
      return parseData(schools.orderedSchoolsFormOptions(), langIndex)
    case PARAMS.year:
      return parseData(year.getYears(), langIndex)
    case PARAMS.semester: // Course analysis
      return parseData(seasons.orderedSeasons(), langIndex, seasons.labelSeason)
    case PARAMS.periods: // Kurs-pm
      return parseData(periods.orderedPeriods(), langIndex, periods.labelPeriod)
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

export { DOCS, documentTypes, getOptionsValues, PARAMS, paramsByDocumentType, splitToBulks, studyLengthParamName }
