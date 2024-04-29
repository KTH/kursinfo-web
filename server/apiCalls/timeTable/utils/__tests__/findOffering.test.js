const { findOffering: findOffering } = require('../findOffering')

describe('findOffering', () => {
  test('returns undefined if called with empty offerings', () => {
    expect(
      findOffering({ offerings: [], courseCode: 'SF1624', applicationCode: 12345, semester: 20241 })
    ).toStrictEqual(undefined)
  })

  test('returns undefined if no matching offerings', () => {
    const offerings = [
      {
        id: 'someNonMatchingId',
      },
      {
        id: 'someOtherNonMatchingId',
      },
    ]
    expect(findOffering({ offerings, courseCode: 'SF1624', applicationCode: 12345, semester: 20241 })).toStrictEqual(
      undefined
    )
  })

  test.each([12345, 54321, 12345])('returns array with matching ids changing applicationCode', applicationCode => {
    const offerings = [
      {
        id: 'SF1624-54321 (HT24)',
      },
      {
        id: 'SF1624-424242 (HT24)',
      },
      {
        id: 'SF1624-12345 (HT24)',
      },
    ]

    const filtered = findOffering({ offerings, courseCode: 'SF1624', applicationCode, semester: 20242 })

    expect(filtered.id).toStrictEqual(`SF1624-${applicationCode} (HT24)`)
  })

  test.each(['SF1624', 'SF1625', 'SF1626'])('returns array with matching ids, changing courseCode', courseCode => {
    const offerings = [
      {
        id: 'SF1624-12345 (HT24)',
      },
      {
        id: 'SF1625-12345 (HT24)',
      },
      {
        id: 'SF1626-12345 (HT24)',
      },
    ]

    const filtered = findOffering({ offerings, courseCode, applicationCode: '12345', semester: 20242 })

    expect(filtered.id).toStrictEqual(`${courseCode}-12345 (HT24)`)
  })

  test.each([
    [20242, 'HT24'],
    [20252, 'HT25'],
    [20262, 'HT26'],
    [20241, 'VT24'],
    [20251, 'VT25'],
    [20261, 'VT26'],
  ])('returns array with matching ids, changing semester', (semester, expectedSeason) => {
    const offerings = [
      {
        id: 'SF1624-12345 (HT24)',
      },
      {
        id: 'SF1624-12345 (HT25)',
      },
      {
        id: 'SF1624-12345 (HT26)',
      },
      {
        id: 'SF1624-12345 (VT24)',
      },
      {
        id: 'SF1624-12345 (VT25)',
      },
      {
        id: 'SF1624-12345 (VT26)',
      },
    ]

    const filtered = findOffering({ offerings, courseCode: 'SF1624', applicationCode: '12345', semester })

    expect(filtered.id).toStrictEqual(`SF1624-12345 (${expectedSeason})`)
  })
})
