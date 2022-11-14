import { labelSeason, orderedSeasons, seasonConstants } from '../../../../../../domain/statistics/seasons.js'

/**
 * @param {array} seasons
 * @param {number | string} seasons[]
 * @returns {array}
 */
function parseSeasons(seasons) {
  return seasons.map(season => Number(season)).sort()
}

/**
 * @param {array} seasons
 * @param {number | string} seasons[]
 * @returns {array}
 */
function parseToSpringOrAutumnSeasons({ seasons = [] }) {
  const seasonsNumbers = parseSeasons(seasons)
  if (seasonsNumbers.includes(seasonConstants.SUMMER_TERM_NUMBER))
    return [seasonConstants.SPRING_TERM_NUMBER, seasonConstants.AUTUMN_TERM_NUMBER]

  return seasonsNumbers
}

export default {
  labelSeason,
  orderedSeasons,
  parseSeasons,
  parseToSpringOrAutumnSeasons,
  seasonConstants,
}
