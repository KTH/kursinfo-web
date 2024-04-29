/**
 * Returns offerings with modules contained in the given array of reservations
 *
 * @param {Array} reservations an array of reservations
 * @returns an array of offerings
 */
const extractOfferingsFromReservation = reservations => {
  const offerings = reservations.map(reservation => reservation.offerings).flat()

  return offerings.filter(({ modules }) => modules && modules.length > 0)
}

module.exports = {
  extractOfferingsFromReservation,
}
