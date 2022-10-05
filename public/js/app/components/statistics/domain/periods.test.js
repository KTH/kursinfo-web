import { seasons as seasonsLib, periods as periodsLib } from './index'
// seasonConstants

describe('Get list of seasons', () => {
  test('get both seasons if summer is chosen', () => {
    const summer = [0]
    const seasonsList = periodsLib.parsePeriodsToOrdinarieSeasons(summer)
    expect(seasonsList.length).toBe(2)
    expect(seasonsList).toMatchInlineSnapshot(`
      [
        1,
        2,
      ]
    `)
  })

  test('get both seasons if all periods are chosen', () => {
    const summer = [0, 1, 2, 3, 4]
    const seasonsList = periodsLib.parsePeriodsToOrdinarieSeasons(summer)
    expect(seasonsList.length).toBe(2)
    expect(seasonsList).toMatchInlineSnapshot(`
      [
        1,
        2,
      ]
    `)
  })

  test('get autumn season for P1 and P2', () => {
    const periods = [1, 2]
    const seasonsList = periodsLib.parsePeriodsToOrdinarieSeasons({ periods })
    expect(seasonsList.length).toBe(1)
    expect(seasonsList).toMatchInlineSnapshot(`
      [
        2,
      ]
    `)
  })
  test('get autumn season for P1', () => {
    const periods = [1]
    const seasonsList = periodsLib.parsePeriodsToOrdinarieSeasons({ periods })
    expect(seasonsList.length).toBe(1)
    expect(seasonsList).toMatchInlineSnapshot(`
      [
        2,
      ]
    `)
  })
  test('get autumn season for P2', () => {
    const periods = [2]
    const seasonsList = periodsLib.parsePeriodsToOrdinarieSeasons({ periods })
    expect(seasonsList.length).toBe(1)
    expect(seasonsList).toMatchInlineSnapshot(`
      [
        2,
      ]
    `)
  })

  test('get spring season for P3 and P4', () => {
    const periods = [3, 4]
    const seasonsList = periodsLib.parsePeriodsToOrdinarieSeasons({ periods })
    expect(seasonsList.length).toBe(1)
    expect(seasonsList).toMatchInlineSnapshot(`
      [
        1,
      ]
    `)
  })
  test('get spring season for P3', () => {
    const periods = [3]
    const seasonsList = periodsLib.parsePeriodsToOrdinarieSeasons({ periods })
    expect(seasonsList.length).toBe(1)
    expect(seasonsList).toMatchInlineSnapshot(`
      [
        1,
      ]
    `)
  })
  test('get autumn season for P4', () => {
    const periods = [4]
    const seasonsList = periodsLib.parsePeriodsToOrdinarieSeasons({ periods })
    expect(seasonsList.length).toBe(1)
    expect(seasonsList).toMatchInlineSnapshot(`
      [
        1,
      ]
    `)
  })
})
