import i18n from '../../../../../../i18n'
import { paramsByDocumentType } from './formConfigurations'

export function hasValue(param) {
  if (!param || param === null || param === 'null' || param === '') return false
  if (typeof param === 'object' && param.length === 0) return false
  if (typeof param === 'string' && param.trim().length === 0) return false
  return true
}

export function hasParameter(paramName, params) {
  const param = params[paramName]
  return hasValue(param)
}

export const findMissingParametersKeys = params => {
  const { documentType } = params
  const expectedParams = paramsByDocumentType(documentType)
  return expectedParams.filter(paramName => !hasParameter(paramName, params))
}

export const missingParametersError = (missingParams, language) => {
  const { formLabels } = i18n.messages[language === 'en' ? 0 : 1].statisticsLabels
  const { and, formSubHeaders, missingParameters } = formLabels
  return {
    errorType: 'error-missing-parameters-in-query',
    missingValues: () => {
      const labels = missingParams.map(paramName => formSubHeaders[paramName].toLowerCase() || paramName)
      const lastLabel = labels.length > 1 ? ` ${and} ${labels.pop()}` : ''

      const missingValues = `${labels.join(', ')}${lastLabel}`

      return missingParameters.text(missingValues)
    },
  }
}

export const noYearFoundInDocsApiError = year => ({
  errorType: 'error-earlier-year-than-2019',
  year,
})
