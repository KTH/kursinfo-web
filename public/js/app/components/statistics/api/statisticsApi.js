import axios from 'axios'

// eslint-disable-next-line consistent-return
async function fetchStatistics(language, proxyUrl, params) {
  try {
    const { documentType, year } = params
    const values = Object.values(params)

    if (values.length < 4 || values.includes('undefined') || values.includes('') || values.includes('null'))
      return 'missing-parameters-in-query'

    // To-do send all data as a string documentType and year in url so we can see it in
    // Application insights

    const url = `${proxyUrl}/api/kursinfo/statistics/${documentType}/${year}/${language}`
    const result = await axios.get(
      url /* , {
      params,
    }*/
    )
    if (result) {
      if (result.status >= 400) {
        return 'ERROR-fetchStatistics-' + result.status
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
