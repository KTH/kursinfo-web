'use strict'

function setBrowserConfig(config, paths, hostUrl) {
  this.browserConfig = config
  this.paths = paths
  this.hostUrl = hostUrl
}

function createServerSideContext() {
  const context = {
    isCancelledOrDeactivated: false, // Done
    initiallySelectedRoundIndex: undefined, // Source // Done
    setBrowserConfig,
  }
  return context
}

module.exports = { createServerSideContext }
