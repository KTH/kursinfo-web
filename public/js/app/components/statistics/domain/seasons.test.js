import { seasons as seasonsLib } from './index'
// seasonConstants

describe('Get list of seasons', () => {
  test('get both seasons if summer is chosen', () => {
    const summer = [0]
    const seasonsList = seasonsLib.parseToSpringOrAutumnSeasons({ seasons: summer })
    expect(seasonsList.length).toBe(2)
    expect(seasonsList).toMatchInlineSnapshot(`
      [
        1,
        2,
      ]
    `)
  })

  test('get both seasons if all seasons are chosen', () => {
    const summer = [0, 1, 2]
    const seasonsList = seasonsLib.parseToSpringOrAutumnSeasons({ seasons: summer })
    expect(seasonsList.length).toBe(2)
    expect(seasonsList).toMatchInlineSnapshot(`
      [
        1,
        2,
      ]
    `)
  })

  test('get both seasons if all seasons are chosen and are strings', () => {
    const summer = ['0', '1', '2']
    const seasonsList = seasonsLib.parseToSpringOrAutumnSeasons({ seasons: summer })
    expect(seasonsList.length).toBe(2)
    expect(seasonsList).toMatchInlineSnapshot(`
      [
        1,
        2,
      ]
    `)
  })

  test('get autumn season for Autumn and Spring', () => {
    const seasons = [1, 2]
    const seasonsList = seasonsLib.parseToSpringOrAutumnSeasons({ seasons })
    expect(seasonsList.length).toBe(2)
    expect(seasonsList).toMatchInlineSnapshot(`
      [
        1,
        2,
      ]
    `)
  })
  test('get autumn season for Autumn', () => {
    const seasons = [1]
    const seasonsList = seasonsLib.parseToSpringOrAutumnSeasons({ seasons })
    expect(seasonsList.length).toBe(1)
    expect(seasonsList).toMatchInlineSnapshot(`
      [
        1,
      ]
    `)
  })
  test('get autumn season for Spring', () => {
    const seasons = [2]
    const seasonsList = seasonsLib.parseToSpringOrAutumnSeasons({ seasons })
    expect(seasonsList.length).toBe(1)
    expect(seasonsList).toMatchInlineSnapshot(`
      [
        2,
      ]
    `)
  })
})
