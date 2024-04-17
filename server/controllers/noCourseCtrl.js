'use strict'

const languageUtils = require('@kth/kth-node-web-common/lib/language')
const serverConfig = require('../configuration').server
const { createBreadcrumbs } = require('../utils/breadcrumbUtil')

function getIndex(req, res) {
  const lang = languageUtils.getLanguage(res) || 'sv'
  const html =
    lang === 'en'
      ? 'No course code was entered. Try to add a course code to the existing web browser address'
      : 'Webbaddressen saknar kurskod. Försök att lägga till en kurskod till addressen.'
  const title = lang === 'en' ? 'No course code was entered' : 'Ingen kurskod'
  const { uri: proxyPrefix } = serverConfig.proxyPrefixPath
  const breadcrumbsList = createBreadcrumbs(lang)

  res.render('noCourse/index', {
    debug: 'debug' in req.query,
    html,
    lang,
    title,
    compressedData: title,
    toolbarUrl: serverConfig.toolbar.url,
    proxyPrefix,
    breadcrumbsList,
    theme: 'student-web',
  })
}

module.exports = {
  getIndex,
}
