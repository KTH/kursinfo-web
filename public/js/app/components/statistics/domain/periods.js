import i18n from '../../../../../../i18n'
import seasonsLib from './seasons'

const KthPeriod = {
  P0: 0,
  P1: 1,
  P2: 2,
  P3: 3,
  P4: 4,
  P5: 5,
}
const AUTUMN_FIRST_PERIOD = KthPeriod.P1
/**
 * Period number of 2nd autumn period.
 */
const AUTUMN_SECOND_PERIOD = KthPeriod.P2
/**
 * Period number of first spring period.
 */
const SPRING_FIRST_PERIOD = KthPeriod.P3
/**
 * Period number of 2nd autumn period.
 */
const SPRING_SECOND_PERIOD = KthPeriod.P4
/**
 * Period number of spring summer period.
 */
const SUMMER_PERIOD_SPRING = KthPeriod.P5
/**
 * Period number of autumn summer period.
 */
const SUMMER_PERIOD_AUTUMN = KthPeriod.P0

const SUMMER_PERIOD_GROUPED = KthPeriod.P0 // will mean both periods P0 and P5

const ORDERED_PERIODS = [
  AUTUMN_FIRST_PERIOD,
  SPRING_FIRST_PERIOD,
  SUMMER_PERIOD_GROUPED,
  AUTUMN_SECOND_PERIOD,
  SPRING_SECOND_PERIOD,
]

const groupedPeriodsBySeasonInCorrectOrder = {
  spring: [SPRING_FIRST_PERIOD, SPRING_SECOND_PERIOD],
  summerGroup: [SUMMER_PERIOD_SPRING, SUMMER_PERIOD_AUTUMN],
  autumn: [AUTUMN_FIRST_PERIOD, AUTUMN_SECOND_PERIOD],
}

/**
 * @param {number} periodNumber
 * @throws
 * @returns {boolean}
 */
function _isFallPeriod(periodNumber) {
  if (!periodNumber) throw new Error(`Missing periodNumber: ${periodNumber}.`)
  const { autumn } = groupedPeriodsBySeasonInCorrectOrder
  return autumn.includes(Number(periodNumber))
}

/**
 * @param {number} langIndex
 * @throws
 * @returns {string}
 */
function labelPeriod(periodNumber, langIndex) {
  const { statisticsLabels: labels } = i18n.messages[langIndex]
  if (periodNumber === SUMMER_PERIOD_GROUPED) return labels.seasonSummer

  const seasonName = _isFallPeriod(periodNumber) ? labels.seasonAutumn : labels.seasonSpring
  return `${labels.period} ${periodNumber}, ${langIndex === 0 ? seasonName.toLowerCase() : seasonName}`
}

/**
 * @param {array} periods
 * @throws
 * @returns {array}
 */
function parsePeriodsToOrdinarieSeasons({ periods }) {
  if (!periods) throw new Error(`Missing periods: ${periods}.`)

  if (periods.includes(SUMMER_PERIOD_GROUPED))
    return [seasonsLib.seasonConstants.SPRING_TERM_NUMBER, seasonsLib.seasonConstants.AUTUMN_TERM_NUMBER]

  const ordinarieSeasons = []
  periods.forEach(periodNumber => {
    const season = _isFallPeriod(periodNumber)
      ? seasonsLib.seasonConstants.AUTUMN_TERM_NUMBER
      : seasonsLib.seasonConstants.SPRING_TERM_NUMBER
    if (!ordinarieSeasons.includes(season)) ordinarieSeasons.push(season)
  })

  return ordinarieSeasons.sort()
}

export default {
  labelPeriod,
  ORDERED_PERIODS,
  parsePeriodsToOrdinarieSeasons,
  SUMMER_PERIOD_GROUPED,
}
