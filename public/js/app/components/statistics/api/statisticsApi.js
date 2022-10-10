import axios from 'axios'
import { DOCS, paramsByDocumentType } from '../domain/formConfigurations'
import { periods as periodsLib, semesters as semestersLib } from '../domain/index'

import i18n from '../../../../../../i18n'

const queryString = params => '?' + new URLSearchParams(params).toString()

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
  const { formSubHeaders } = formLabels
  return {
    errorType: 'missing-parameters-in-query',
    missingValues: missingParams.map(paramName => formSubHeaders[paramName] || paramName).join(', '),
  }
}
function _formSeasongByDocumentType(documentType, params) {
  return documentType === DOCS.courseMemo
    ? periodsLib.parsePeriodsToOrdinarieSeasons(params)
    : semestersLib.parseSemestersToOrdinarieSeasons({ seasons: params.semesters })
}

/**
 * @param {string} language
 * @param {string} proxyUrl
 * @param {object} params
 * @throws
 * @returns {object}
 */
// eslint-disable-next-line consistent-return
async function fetchStatistics(language, proxyUrl, params) {
  try {
    const { documentType, year } = params
    const missingParams = _missingParameters(params)
    if (missingParams.length > 0) return _missingParametersError(missingParams, language)

    const seasons = _formSeasongByDocumentType(documentType, params)

    // const url = `${proxyUrl}/api/kursinfo/statistics/${documentType}/${year}/${language}`
    const url = `${proxyUrl}/api/kursinfo/statistics/${documentType}/year/${year}` // ${queryString(seasons)}&l=${language}

    const result = await axios.get(url, {
      params: { seasons: seasons.join(','), l: language },
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
