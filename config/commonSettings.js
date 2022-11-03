/**
 *
 *     Common settings for server and browser
 *
 * **************************************************
 * * WARNING! Never access any secrets in this file *
 * **************************************************
 *
 */
const { getEnv, devDefaults } = require('kth-node-configuration')

const devPort = 3000
const devUrl = 'http://localhost:' + devPort
const devSsl = false
const devPrefixPath = devDefaults('/student/kurser/kurs')
const devImageStorageUri = 'https://kursinfostoragestage.blob.core.windows.net/kursinfo-image-container/'
const devMemoStorageUri = 'https://kursinfostoragestage.blob.core.windows.net/memo-blob-container/'
const devAnalysisStorageUri = 'https://kursinfostoragestage.blob.core.windows.net/kursutveckling-blob-container/'

module.exports = {
  hostUrl: getEnv('SERVER_HOST_URL', devUrl),
  useSsl: String(getEnv('SERVER_SSL', devSsl)).toLowerCase() === 'true',
  port: getEnv('SERVER_PORT', devPort),
  // The proxy prefix path if the application is proxied. E.g /places
  proxyPrefixPath: {
    uri: getEnv('SERVICE_PUBLISH', devPrefixPath),
  },
  imageStorageUri: getEnv('IMAGE_STORAGE_URI', devImageStorageUri),
  memoStorageUri: getEnv('MEMO_STORAGE_URI', devMemoStorageUri),
  analysisStorageUri: getEnv('ANALYSES_STORAGE_URL', devAnalysisStorageUri),
}
