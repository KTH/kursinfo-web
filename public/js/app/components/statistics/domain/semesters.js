import seasonsLib from './seasons'

/**
 * @param {array} seasons
 * @returns {array}
 */
function parseSemestersToOrdinarieSeasons({ seasons = [] }) {
  if (seasons.includes(seasonsLib.SUMMER_TERM_NUMBER)) return [seasons.SPRING_TERM_NUMBER, seasons.AUTUMN_TERM_NUMBER]

  return seasons.sort()
}

export default {
  parseSemestersToOrdinarieSeasons,
}
