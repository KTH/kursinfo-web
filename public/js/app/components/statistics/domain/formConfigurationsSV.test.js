import { getOptionsValues, PARAMS } from './formConfigurations'

const SV_INDEX = 1
const mockDate = new Date('2022-03-23 16:00')

describe('Get list of  for each option on statistics page  in Swedish', () => {
  beforeAll(() => {
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate)
  })

  afterAll(() => {
    jest.spyOn(global, 'Date').mockRestore()
  })

  test('with override spring date', () => {
    const documents = getOptionsValues(PARAMS.documentType, SV_INDEX)
    expect(documents).toMatchInlineSnapshot(`
      [
        {
          "id": "courseMemo",
          "label": "Kurs-PM",
          "value": "courseMemo",
        },
        {
          "id": "courseAnalysis",
          "label": "Kursanalys",
          "value": "courseAnalysis",
        },
      ]
    `)
  })

  test('get options list of schools', () => {
    const schools = getOptionsValues(PARAMS.school, SV_INDEX)
    expect(schools).toMatchInlineSnapshot(`
      [
        {
          "id": "ABE",
          "label": "ABE",
          "value": "ABE",
        },
        {
          "id": "ITM",
          "label": "ITM",
          "value": "ITM",
        },
        {
          "id": "CBH",
          "label": "CBH",
          "value": "CBH",
        },
        {
          "id": "SCI",
          "label": "SCI",
          "value": "SCI",
        },
        {
          "id": "EECS",
          "label": "EECS",
          "value": "EECS",
        },
        {
          "id": "allSchools",
          "label": "Alla skolor",
          "value": "allSchools",
        },
      ]
    `)
  })

  test('get options list of years, starting from 2019 until today', () => {
    const years = getOptionsValues(PARAMS.year, SV_INDEX)
    expect(years).toMatchInlineSnapshot(`
      [
        {
          "id": 2019,
          "label": 2019,
          "value": 2019,
        },
        {
          "id": 2020,
          "label": 2020,
          "value": 2020,
        },
        {
          "id": 2021,
          "label": 2021,
          "value": 2021,
        },
        {
          "id": 2022,
          "label": 2022,
          "value": 2022,
        },
      ]
    `)
  })

  test('get autumn options out of list of seasons seasons', () => {
    const seasons = getOptionsValues(PARAMS.seasons, SV_INDEX)
    const autumn = seasons.find(season => (season.id = 2))
    expect(autumn.label).toBe('HT')
  })

  test('get options list of seasons seasons', () => {
    const seasons = getOptionsValues(PARAMS.seasons, SV_INDEX)

    expect(seasons).toMatchInlineSnapshot(`
      [
        {
          "id": 2,
          "label": "HT",
          "value": 2,
        },
        {
          "id": 1,
          "label": "VT",
          "value": 1,
        },
        {
          "id": 0,
          "label": "Sommar",
          "value": 0,
        },
      ]
    `)
  })

  test('get options list of periods', () => {
    const periods = getOptionsValues(PARAMS.periods, SV_INDEX)
    expect(periods).toMatchInlineSnapshot(`
      [
        {
          "id": 1,
          "label": "Period 1, HT",
          "value": 1,
        },
        {
          "id": 3,
          "label": "Period 3, VT",
          "value": 3,
        },
        {
          "id": 0,
          "label": "Sommar",
          "value": 0,
        },
        {
          "id": 2,
          "label": "Period 2, HT",
          "value": 2,
        },
        {
          "id": 4,
          "label": "Period 4, VT",
          "value": 4,
        },
      ]
    `)
  })
})
