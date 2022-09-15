'use strict'

function setBrowserConfig(config, paths, hostUrl) {
  this.browserConfig = config
  this.paths = paths
  this.hostUrl = hostUrl
}

function setLanguage(language) {
  this.language = language
  this.languageIndex = language === 'en' ? 0 : 1
}

function createStatisticsServerSideContext() {
  const context = {
    /**
     * @property {string} documentType
     * @property {array} periods
     * @property {string} school
     * @property {number} year
     */
    documentType: null,
    periods: null,
    school: null,
    year: null,
    setBrowserConfig,
    setLanguage,
  }
  return context
}

module.exports = { createStatisticsServerSideContext }
