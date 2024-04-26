const extractOfferingsFromReservation = reservations => {
  const offerings = reservations.map(reservation => reservation.offerings).flat()

  return offerings.filter(({ modules }) => modules && modules.length > 0)
}

module.exports = {
  extractOfferingsFromReservation,
}
