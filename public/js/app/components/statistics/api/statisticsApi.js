import axios from 'axios'

// eslint-disable-next-line consistent-return
async function fetchStatistics(language, proxyUrl, params) {
  try {
    // To-do send all data as a string documentType and year in url so we can see it in
    // Application insights
    const { documentType, year } = params
    const result = await axios.get(`${proxyUrl}/api/statistics/${documentType}/${year}/${language}`, {
      params,
    })
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
