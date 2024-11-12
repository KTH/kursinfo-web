const i18n = require('../../i18n')

const seasonConstants = {
  SPRING_TERM_NUMBER: 1,
  AUTUMN_TERM_NUMBER: 2,
}
const orderedSeasons = () => [seasonConstants.AUTUMN_TERM_NUMBER, seasonConstants.SPRING_TERM_NUMBER]
/**
 * @param {number} seasonNumber
 * @param {number} langIndex
 * @throws
 * @returns {string}
 */
function labelSeason(seasonNumber, langIndex) {
  const { statisticsLabels: labels } = i18n.messages[langIndex]

  switch (Number(seasonNumber)) {
    case seasonConstants.AUTUMN_TERM_NUMBER:
      return labels.seasonAutumn
    case seasonConstants.SPRING_TERM_NUMBER:
      return labels.seasonSpring
    default: {
      throw new Error(
        `Unknown search options: ${seasonNumber} with type ${typeof seasonNumber}. Allowed options: ${Object.values(
          seasonConstants
        ).join(', ')}`
      )
    }
  }
}

module.exports = { labelSeason, orderedSeasons, seasonConstants }
