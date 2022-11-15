import axios from 'axios'
import { DOCS, paramsByDocumentType } from '../../components/statistics/domain/formConfigurations'
import { periods as periodsLib, seasons as seasonsLib } from '../../components/statistics/domain/index'

import i18n from '../../../../../i18n'

function hasValue(paramName, params) {
  const param = params[paramName]
  if (!param || param === null || param === 'null' || param === '') return false
  if (typeof param === 'object' && param.length === 0) return false
  if (typeof param === 'string' && param.trim().length === 0) return false
  return true
}
const _missingParameters = params => {
  const { documentType } = params
  const expectedParams = paramsByDocumentType(documentType)
  return expectedParams.filter(paramName => !hasValue(paramName, params))
}
const _missingParametersError = (missingParams, language) => {
  const { formLabels } = i18n.messages[language === 'en' ? 0 : 1].statisticsLabels
  const { and, formSubHeaders, missingParameters } = formLabels
  return {
    errorType: 'missing-parameters-in-query',
    missingValues: () => {
      const labels = missingParams.map(paramName => formSubHeaders[paramName].toLowerCase() || paramName)
      const lastLabel = labels.length > 1 ? ` ${and} ${labels.pop()}` : ''

      const missingValues = `${labels.join(', ')}${lastLabel}`

      return missingParameters.text(missingValues)
    },
  }
}

const _noYearFoundInDocsApiError = year => ({
  errorType: 'earlier-year-than-2019',
  year,
})

function _formQueryByDocumentType(documentType, params) {
  return documentType === DOCS.courseMemo
    ? { periods: periodsLib.parsePeriods(params.periods), seasons: periodsLib.parsePeriodsToOrdinarieSeasons(params) }
    : {
        // in analysis api, exists only autumn and spring semester
        analysesSeasons: seasonsLib.parseToSpringOrAutumnSeasons({ seasons: params.seasons }),
        // seasons chosen by user, summer/autumn/spring
        seasons: seasonsLib.parseSeasons(params.seasons || []),
      }
}

/**
 * @param {string} language
 * @param {string} proxyUrl
 * @param {Object} params
 * @throws
 * @returns {Object}
 */
// eslint-disable-next-line consistent-return
async function fetchStatistics(language, proxyUrl, params) {
  try {
    const { documentType, year, school } = params
    const missingParams = _missingParameters(params)
    if (missingParams.length > 0) return _missingParametersError(missingParams, language)
    if (Number(year) < 2019) return _noYearFoundInDocsApiError(year)

    const queryParamsByDocumentType = _formQueryByDocumentType(documentType, params)

    const url = `${proxyUrl}/api/kursinfo/statistics/${documentType}/year/${year}` // ${queryString(seasons)}&l=${language}

    const result = await axios.get(url, {
      params: { school, l: language, ...queryParamsByDocumentType },
    })
    if (result) {
      if (result.status >= 400) {
        return { errorType: 'error-unknown', message: 'ERROR-fetchStatistics-' + result.status }
      }
      const { data } = result
      return data
    }
  } catch (error) {
    if (error.response) {
      throw new Error('Unexpected error from fetchStatistics-' + error.message)
    }
    throw error
  }
}

export default fetchStatistics
