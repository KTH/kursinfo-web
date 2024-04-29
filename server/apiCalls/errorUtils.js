const { HttpError } = require('../HttpError')
const i18n = require('../../i18n')

const HTTP_CODE_404 = 404

const createInvalidCourseCodeError = lang => {
  const errorMessage = i18n.message('error_not_found', lang)
  const error = new HttpError(HTTP_CODE_404, errorMessage)
  return error
}

const callApiAndPossiblyHandle404 = async ({ client, uri, lang = undefined }) => {
  const response = await client.getAsync({ uri, useCache: true })
  if (response.statusCode === HTTP_CODE_404) {
    const error = createInvalidCourseCodeError(lang)
    throw error
  }
  return response
}

module.exports = {
  callApiAndPossiblyHandle404,
}
