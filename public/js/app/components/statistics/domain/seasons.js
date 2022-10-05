import i18n from '../../../../../../i18n'

// eslint-disable-next-line no-unused-vars
const seasonConstants = {
  SPRING_TERM_NUMBER: 1, // Minimum possible term number.
  AUTUMN_TERM_NUMBER: 2, // Maximum possible term number.
  SUMMER_TERM_NUMBER: 0,
}
const ORDERED_SEASONS = [
  seasonConstants.AUTUMN_TERM_NUMBER,
  seasonConstants.SPRING_TERM_NUMBER,
  seasonConstants.SUMMER_TERM_NUMBER,
]
/**
 * @param {number} langIndex
 * @throws
 * @returns {string}
 */
function labelSeason(seasonNumber, langIndex) {
  const { statisticsLabels: labels } = i18n.messages[langIndex]

  switch (seasonNumber) {
    case seasonConstants.SUMMER_TERM_NUMBER:
      return labels.seasonSummer
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

export default {
  labelSeason,
  ORDERED_SEASONS,
  seasonConstants,
}
