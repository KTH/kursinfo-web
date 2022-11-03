import { labelSeason, ORDERED_SEASONS, seasonConstants } from '../../../../../../domain/statistics/seasons.js'

/**
 * @param {array} seasons
 * @returns {array}
 */
function parseToSpringOrAutumnSeasons({ seasons = [] }) {
  if (seasons.includes(seasonConstants.SUMMER_TERM_NUMBER))
    return [seasonConstants.SPRING_TERM_NUMBER, seasonConstants.AUTUMN_TERM_NUMBER]

  return seasons
}

export default {
  labelSeason,
  ORDERED_SEASONS,
  parseToSpringOrAutumnSeasons,
  seasonConstants,
}
