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

/**
 * @param {array} language
 * @param {number} proxyUrl
 * @param {object} params
 * @throws
 * @returns {object}
 */
// eslint-disable-next-line consistent-return
async function fetchStatistics(language, proxyUrl, params) {
  try {
    const { documentType, year } = params
    const expectedParams = paramsByDocumentType(documentType)
    const missingParams = expectedParams.filter(paramName => !hasValue(paramName, params))

    if (missingParams.length > 0) {
      const { formLabels } = i18n.messages[language === 'en' ? 0 : 1].statisticsLabels
      const { formSubHeaders } = formLabels
      return {
        errorType: 'missing-parameters-in-query',
        missingValues: missingParams.map(paramName => formSubHeaders[paramName] || paramName).join(', '),
      }
    }

    // To-do send all data as a string documentType and year in url so we can see it in
    // Application insights

    // IF PERIODS, TRANSFORM TO SEMESTERS
    // IF SUMMER SEMESTERS TRANSFORMS TO HT, VT

    const seasons =
      documentType === DOCS.courseMemo
        ? periodsLib.parsePeriodsToOrdinarieSeasons(params)
        : semestersLib.parseSemestersToOrdinarieSeasons(params)

    // const url = `${proxyUrl}/api/kursinfo/statistics/${documentType}/${year}/${language}`
    const url = `${proxyUrl}/api/kursinfo/statistics/${documentType}/year/${year}/${queryString({
      seasons,
    })}&l=${language}`
    const result = await axios.get(
      url /* , {
      params,
    }*/
    )
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
