import i18n from '../../../../../../i18n'

// eslint-disable-next-line no-unused-vars
const termConstants = {
  SPRING_TERM_NUMBER: 1, // Minimum possible term number.
  AUTUMN_TERM_NUMBER: 2, // Maximum possible term number.
  SPRING_TERM_NAME_SV: 'VT', // Swedish user-friendly name of Spring term.
  AUTUMN_TERM_NAME_SV: 'HT', // Swedish user-friendly name of Autumn term.
  SPRING_TERM_NAME_EN: 'spring ', // English user-friendly name of Spring term.
  AUTUMN_TERM_NAME_EN: 'autumn ', // English user-friendly name of Autumn term.
  YEAR_MINIMUM: 1945, // The earliest year accepted by the system.
}
const ORDERED_SEASONS = [termConstants.AUTUMN_TERM_NUMBER, termConstants.SPRING_TERM_NUMBER]

function _isSpringTerm(term) {
  if (typeof term === 'number') {
    return term % 2 === 1
  }
  return term.slice(-1) === '1'
}

function _isFallTerm(term) {
  if (typeof term === 'number') {
    return term % 2 === 0
  }
  return term.slice(-1) === '2'
}

/**
 * @param {number} seasonNumber
 * @throws
 * @returns {boolean}
 */
function _isFallSeason(seasonNumber) {
  if (!seasonNumber) throw new Error(`Missing seasonNumber: ${seasonNumber}.`)
  return Number(termConstants.AUTUMN_TERM_NUMBER) === Number(seasonNumber)
}

/**
 * @param {number} langIndex
 * @throws
 * @returns {string}
 */
function labelSeason(seasonNumber, langIndex) {
  const { statisticsLabels: labels } = i18n.messages[langIndex]
  const seasonName = _isFallSeason(seasonNumber) ? labels.seasonAutumn : labels.seasonSpring

  return `${seasonName}`
}

export default {
  labelSeason,
  ORDERED_SEASONS,
  termConstants,
  _isSpringTerm,
  _isFallTerm,
}
