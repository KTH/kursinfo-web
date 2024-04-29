const {
  reservations,
  offeringWithoutModules,
  validOffering1,
  validOffering2,
  offeringsWithMultipleValid,
} = require('../../mockData/timeTableApiResponse')

const { extractOfferingsFromReservation } = require('../extractOfferingsFromReservation')

describe('extractOfferingsFromReservation', () => {
  test('if called with empty reservations, returns empty array', () => {
    expect(extractOfferingsFromReservation([])).toStrictEqual([])
  })

  test('returns array of offerings', () => {
    const [firstOffering] = extractOfferingsFromReservation(reservations)

    expect(firstOffering.id).toBeDefined()
    expect(firstOffering.modules).toBeDefined()
  })

  test('filters out offerings with modules', () => {
    expect(extractOfferingsFromReservation(reservations)).not.toContain(offeringWithoutModules)
  })

  test('contains validOfferings', () => {
    expect(extractOfferingsFromReservation(reservations)).toContain(validOffering1)
    expect(extractOfferingsFromReservation(reservations)).toContain(validOffering2)
    expect(extractOfferingsFromReservation(reservations)).toContain(offeringsWithMultipleValid[0])
    expect(extractOfferingsFromReservation(reservations)).toContain(offeringsWithMultipleValid[1])
  })

  test('contains correct amount of offerings', () => {
    expect(extractOfferingsFromReservation(reservations)).toHaveLength(4)
  })
})
