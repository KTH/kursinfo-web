/**
 * An error that can be passed to express' `next()` method.
 * The `status` will be picked up by KTH middleware and set as statusCode in the response.
 */
class HttpError extends Error {
  /**
   *
   * @param {Number} status HTTP status code that should be sent in the response
   * @param {string} message Easy-to-read message
   */
  constructor(status, message) {
    super(message)
    this.status = status
    /** True because this is a HttpError */
    this.isHttpError = true
  }
}

module.exports = {
  HttpError,
}
