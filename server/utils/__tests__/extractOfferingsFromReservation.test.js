const { reservations, offeringWithoutModules } = require('../../apiCalls/__mocks__/timeTableApiResponse')

// TODO Benni, where should we put testdata?

const { extractOfferingsFromReservation } = require('../extractOfferingsFromReservation')

describe('extractOfferingsFromReservation', () => {
  test('if called with empty reservations, returns empty array', () => {
    expect(extractOfferingsFromReservation([])).toStrictEqual([])
  })

  //   test('filters out reservations with empty offerings', () => {
  //     expect(extractOfferingsFromReservation(reservations)).not.toContain(reservationWithEmptyOfferings)
  //   })

  test('returns array of offerings', () => {
    const [firstOffering] = extractOfferingsFromReservation(reservations)

    expect(Object.hasOwnProperty.call(firstOffering, 'id')).toBe(true)
  })

  test('filters out reservations without offerings with modules', () => {
    expect(extractOfferingsFromReservation(reservations)).not.toContain(offeringWithoutModules)
  })

  //   test('')
})
