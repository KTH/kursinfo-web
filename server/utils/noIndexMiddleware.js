const { server: serverConfig } = require('../configuration')

/**
 * Middleware that adds "noindex" robots header if "server host" and the request
 * host ("forwarded host") doesn't match. This is done to prevent Google from
 * indexing app.kth.se/* when we want the user to use www.kth.se/*
 *
 * The "server host" (SERVER_HOST_URL) is the primary host we expected the
 * app to be hosted on (ie https://www.kth.se).
 *
 * The orginal host of the request is replaced with an Azure host
 * (*.azurewebsites.net) before reaching our app so we look at the "forwarded
 * host" ("x-forwarded-host" header) .
 *
 * Default, if x-forwarded-host is missing, is to do nothing.
 */
const noIndexMiddleware = function (req, res, next) {
  const forwardedHost = req.header('x-forwarded-host')
  if (forwardedHost) {
    const serverHostUrl = new URL(serverConfig.hostUrl)
    const serverHost = serverHostUrl.host
    if (serverHost !== forwardedHost) {
      res.set('x-robots-tag', 'noindex')
    }
  }
  next()
}
module.exports = noIndexMiddleware
