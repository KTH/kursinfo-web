import { getOptionsValues, PARAMS } from './formConfigurations'

const EN_INDEX = 0
const mockDate = new Date('2022-03-23 16:00')

describe('Get list of  for each option on statistics page in English', () => {
  beforeAll(() => {
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate)
  })

  afterAll(() => {
    jest.spyOn(global, 'Date').mockRestore()
  })

  test('get options list of document types', () => {
    const documents = getOptionsValues(PARAMS.documentType, EN_INDEX)
    expect(documents).toMatchInlineSnapshot(`
      [
        {
          "id": "courseMemo",
          "label": "Course memo",
          "value": "courseMemo",
        },
        {
          "id": "courseAnalysis",
          "label": "Course analysis",
          "value": "courseAnalysis",
        },
      ]
    `)
  })

  test('get options list of schools', () => {
    const schools = getOptionsValues(PARAMS.school, EN_INDEX)
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
          "label": "All schools",
          "value": "allSchools",
        },
      ]
    `)
  })

  test('get options list of years, starting from 2019 until today', () => {
    const years = getOptionsValues(PARAMS.year, EN_INDEX)
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
        {
          "id": 2023,
          "label": 2023,
          "value": 2023,
        },
      ]
    `)
  })

  test('get options list of seasons seasons', () => {
    const seasons = getOptionsValues(PARAMS.seasons, EN_INDEX)
    expect(seasons).toMatchInlineSnapshot(`
      [
        {
          "id": 2,
          "label": "Autumn",
          "value": 2,
        },
        {
          "id": 1,
          "label": "Spring",
          "value": 1,
        },
        {
          "id": 0,
          "label": "Summer",
          "value": 0,
        },
      ]
    `)
  })

  test('get options list of periods', () => {
    const periods = getOptionsValues(PARAMS.periods, EN_INDEX)
    expect(periods).toMatchInlineSnapshot(`
      [
        {
          "id": 1,
          "label": "Period 1, autumn",
          "value": 1,
        },
        {
          "id": 3,
          "label": "Period 3, spring",
          "value": 3,
        },
        {
          "id": 0,
          "label": "Summer",
          "value": 0,
        },
        {
          "id": 2,
          "label": "Period 2, autumn",
          "value": 2,
        },
        {
          "id": 4,
          "label": "Period 4, spring",
          "value": 4,
        },
      ]
    `)
  })
})
