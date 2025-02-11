import axios from 'axios'
import { DOCS } from '../../components/statistics/domain/formConfigurations'
import { periods as periodsLib } from '../../components/statistics/domain/index'
import {
  missingParametersError,
  findMissingParametersKeys,
  noYearFoundInDocsApiError,
} from '../../components/statistics/domain/validation'

function _formQueryByDocumentType(documentType, params) {
  return documentType === DOCS.courseMemo
    ? { periods: periodsLib.parsePeriods(params.periods), seasons: periodsLib.parsePeriodsToOrdinarieSeasons(params) }
    : { semester: Number(params.semester) }
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
    const missingParams = findMissingParametersKeys(params)
    if (missingParams.length > 0) return missingParametersError(missingParams, language)
    if (Number(year) < 2019) return noYearFoundInDocsApiError(year)

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
