'use strict'

const { createProxyMiddleware } = require('http-proxy-middleware')

function pathRewrite (path) {
  const pathRegEx = /(\/student\/kurser\/kurs\/kursplan\/)(.*)-(.*).pdf\?lang=(.*)/g
  const pathArgs = pathRegEx.exec(path)
  return `/api/kursplan/v1/syllabus/${pathArgs[2]}/${pathArgs[3]}/${pathArgs[4] || 'sv'}`
}

function setApiKey (key) {
  return function onProxyReq (proxyReq) {
    proxyReq.setHeader('api_key', key)
  }
}

function logProvider () {
  return require('kth-node-log')
}

function getPdfProxy (config, key) {
  console.log('config', config)
  console.log('key', key)
  const { https, host, port } = config
  const target = `${https ? 'https' : 'http'}://${host}${port ? ':' + port : ''}`
  const options = {
    target,
    changeOrigin: true,
    pathRewrite,
    onProxyReq: setApiKey(key),
    logProvider
  }
  return createProxyMiddleware(options)
}

module.exports = {
  getPdfProxy
}
