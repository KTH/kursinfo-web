import seasonsLib from './seasons'

/**
 * @param {array} seasons
 * @returns {array}
 */
function parseSemestersToOrdinarieSeasons({ seasons = [] }) {
  if (seasons.includes(seasonsLib.seasonConstants.SUMMER_TERM_NUMBER))
    return [seasonsLib.seasonConstants.SPRING_TERM_NUMBER, seasonsLib.seasonConstants.AUTUMN_TERM_NUMBER]

  return seasons
}

export default {
  parseSemestersToOrdinarieSeasons,
}
