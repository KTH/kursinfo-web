'use strict'

import {
  filterOfferingsForMemos,
  filterOfferingsForAnalysis,
  findCourseStartEndDates,
  sortOfferedSemesters,
} from './offerings'

const startSemester = {
  teachers: [],
  types: [],
  semester: '20231',
  start_date: '2023-06-12',
  end_date: '2023-08-27',
  start_week: '24',
  end_week: '34',
  matched_search_query: true,
  max_group_count: '1',
}
const lastSemester = {
  teachers: [],
  types: [],
  semester: '20232',
  start_date: '2023-08-28',
  end_date: '2023-10-29',
  start_week: '35',
  end_week: '43',
  matched_search_query: false,
  max_group_count: '1',
}

const course = {
  offered_semesters: [startSemester, lastSemester].reverse(), // make it wrong order
  campus: 'KTH Campus',
  course_code: 'LT1015',
  course_name: 'Planering, bedömning och betygssättning',
  course_name_en: 'Planning, Assessment and Grading',
  department_name: 'ITM/Lärande',
  department_code: 'MO',
  school_code: 'ITM',
  first_semester: 'VT23',
  first_yearsemester: '20231',
  offering_id: '1',
  state: 'Godkänt',
  first_period: '20231P5',
  language: 'Svenska',
  educational_level: 'grund',
  educational_level_en: 'BASIC',
  connected_programs: [
    {
      elective_condition: 'O',
      code: 'LÄRGR',
      study_year: 2,
      connection_state: 'APPROVED',
    },
  ],
  course_round_applications: [
    {
      course_round_application_code: '45006',
      course_round_category_code: 'PU',
      course_round_type: 'ORD',
      course_round_ladok_state: 'Påbörjad',
      course_round_ladok_state_en: 'Started',
      ladok_uid: 'de69ebaf-7226-11ec-a534-0f06b63e4534',
    },
  ],
}

const expectedCourseStartDatum = '2023-06-12'
const expectedCourseEndDatum = '2023-10-29'

describe('Sort offered semesters and check if it parses the correct start and end date, course stretched over several semesters', () => {
  test('sort offered semesters by the course oferrings end dates', () => {
    const offeredSemesters = course.offered_semesters

    const [firstSemester, secondSemester] = sortOfferedSemesters(offeredSemesters)
    expect(firstSemester.start_date).toBe(expectedCourseStartDatum)
    expect(firstSemester.end_date).toBe('2023-08-27')

    expect(secondSemester.semester).toBe('20232')
    expect(secondSemester.end_date).toBe(expectedCourseEndDatum)
  })

  test('sort reversed offered semesters by the course oferrings end dates', () => {
    const offeredSemesters = course.offered_semesters.reverse()

    const [firstSemester, secondSemester] = sortOfferedSemesters(offeredSemesters)
    expect(firstSemester.start_date).toBe(expectedCourseStartDatum)
    expect(firstSemester.end_date).toBe('2023-08-27')

    expect(secondSemester.semester).toBe('20232')
    expect(secondSemester.end_date).toBe(expectedCourseEndDatum)
  })

  test('compare sorting results so it is independent of semesters order', () => {
    const offeredSemestersReversed = course.offered_semesters.reverse()
    const offeredSemesters = course.offered_semesters

    const result1 = sortOfferedSemesters(offeredSemestersReversed)
    const result2 = sortOfferedSemesters(offeredSemesters)

    expect(result1).toEqual(result2)
  })
})

describe('Find if it parses the correct start and end date, course stretched over several semesters', () => {
  test('get start and end dates, week, last semester', () => {
    const offeredSemesters = course.offered_semesters

    const { endDate, endWeek, lastSemester: lastCSemester, startDate } = findCourseStartEndDates(offeredSemesters)
    expect(startDate).toBe(expectedCourseStartDatum)
    expect(endWeek).toBe('43')

    expect(lastCSemester).toBe('20232')
    expect(endDate).toBe(expectedCourseEndDatum)
  })

  test('compare dates results so it is independent of semesters order', () => {
    const offeredSemestersReversed = course.offered_semesters.reverse()
    const offeredSemesters = course.offered_semesters

    const result1 = findCourseStartEndDates(offeredSemestersReversed)
    const result2 = findCourseStartEndDates(offeredSemesters)

    expect(result1).toEqual(result2)
  })
})

describe('Course Analysis check if it parses the correct start and end date, course stretched over several semesters', () => {
  test('chosen summer season but course finished in autumn, filter out it', () => {
    const result = filterOfferingsForAnalysis([course], ['20231', '20232'], ['0'], 'allSchools', 'sv')
    expect(result.length).toBe(0)
    expect(result).toMatchInlineSnapshot(`[]`)
  })

  test('chosen spring season but course finished in autumn, filter out it', () => {
    const result = filterOfferingsForAnalysis([course], ['20231'], ['1'], 'allSchools', 'sv')
    expect(result.length).toBe(0)
    expect(result).toMatchInlineSnapshot(`[]`)
  })

  test('chosen autumn season and course finished in autumn, parse it, in swedish', () => {
    const result = filterOfferingsForAnalysis([course], ['20232'], ['2'], 'allSchools', 'sv')
    expect(result.length).toBe(1)
    const [expected] = result
    expect(expected.startDate).toBe(startSemester.start_date)
    expect(expected.startDate).toBe(expectedCourseStartDatum)

    expect(expected.endDate).toBe(lastSemester.end_date)
    expect(expected.endDate).toBe(expectedCourseEndDatum)

    expect(expected.firstSemester).toBe(course.first_yearsemester)
    expect(expected.lastSemester).toBe(lastSemester.semester)
    expect(expected.lastSemesterLabel).toBe('HT')

    expect(result).toMatchInlineSnapshot(`
      [
        {
          "connectedPrograms": "LÄRGR-2",
          "courseCode": "LT1015",
          "departmentName": "ITM/Lärande",
          "endDate": "2023-10-29",
          "firstSemester": "20231",
          "lastSemester": "20232",
          "lastSemesterLabel": "HT",
          "offeringId": "1",
          "schoolMainCode": "ITM",
          "startDate": "2023-06-12",
        },
      ]
    `)
  })

  test('chosen autumn season and course finished in autumn, parse it, in english', () => {
    const result = filterOfferingsForAnalysis([course], ['20231', '20232'], ['2'], 'allSchools', 'en')
    const [expected] = result
    expect(expected.startDate).toBe(startSemester.start_date)
    expect(expected.endDate).toBe(lastSemester.end_date)
    expect(expected.lastSemesterLabel).toBe('Autumn')
  })

  test('compare offerings results so it is independent of semesters order', () => {
    const offeredSemestersReversed = course.offered_semesters.reverse()
    const offeredSemesters = course.offered_semesters
    const course1 = filterOfferingsForAnalysis(
      [{ ...course, offered_semesters: offeredSemestersReversed }],
      ['20231', '20232'],
      ['2'],
      'allSchools',
      'en'
    )

    const course2 = filterOfferingsForAnalysis(
      [{ ...course, offered_semesters: offeredSemesters }],
      ['20231', '20232'],
      ['2'],
      'allSchools',
      'en'
    )

    expect(course1).toEqual(course2)
  })
})

describe('Course memos check if it parse the correct start and end date, course stretched over several semesters', () => {
  test('chosen autumn season but course starts in summer, filter out it', () => {
    const result = filterOfferingsForMemos([course], ['20232'], ['2'], 'allSchools', 'sv')
    expect(result.length).toBe(0)
    expect(result).toMatchInlineSnapshot(`[]`)
  })

  test('chosen spring season but course starts in summer, filter out it', () => {
    const result = filterOfferingsForMemos([course], ['20231'], ['1'], 'allSchools', 'sv')
    expect(result.length).toBe(0)
    expect(result).toMatchInlineSnapshot(`[]`)
  })

  test('chosen summer season P0 (early summer) and course starts in late summer P5, filter out it', () => {
    const result = filterOfferingsForMemos([course], ['20231'], ['0'], 'allSchools', 'sv')
    expect(result.length).toBe(0)
    expect(result).toMatchInlineSnapshot(`[]`)
  })

  test('chosen summer season P5 (late summer) and course starts in summer P5, parse it, in swedish', () => {
    const result = filterOfferingsForMemos([course], ['20231', '20232'], ['5'], 'allSchools', 'sv')
    expect(result.length).toBe(1)
    const [expected] = result
    expect(expected.startDate).toBe(startSemester.start_date)
    expect(expected.startDate).toBe(expectedCourseStartDatum)

    expect(expected.endDate).toBe(lastSemester.end_date)
    expect(expected.endDate).toBe(expectedCourseEndDatum)

    expect(expected.firstSemester).toBe(course.first_yearsemester)
    expect(expected.period).toBe('P5')

    expect(result).toMatchInlineSnapshot(`
      [
        {
          "connectedPrograms": "LÄRGR-2",
          "courseCode": "LT1015",
          "departmentName": "ITM/Lärande",
          "endDate": "2023-10-29",
          "firstSemester": "20231",
          "offeringId": "1",
          "period": "P5",
          "schoolMainCode": "ITM",
          "startDate": "2023-06-12",
        },
      ]
    `)
  })

  test('chosen summer season P5 (late summer) and course starts in summer P5, parse it, in english', () => {
    const result = filterOfferingsForMemos([course], ['20231', '20232'], ['5'], 'allSchools', 'en')
    const [expected] = result
    expect(expected.startDate).toBe(startSemester.start_date)
    expect(expected.endDate).toBe(lastSemester.end_date)
    expect(expected.period).toBe('P5')
  })

  test('compare offerings results so it is independent of semesters order', () => {
    const offeredSemestersReversed = course.offered_semesters.reverse()
    const offeredSemesters = course.offered_semesters
    const course1 = filterOfferingsForMemos(
      [{ ...course, offered_semesters: offeredSemestersReversed }],
      ['20231', '20232'],
      ['5'],
      'allSchools',
      'en'
    )

    const course2 = filterOfferingsForMemos(
      [{ ...course, offered_semesters: offeredSemesters }],
      ['20231', '20232'],
      ['5'],
      'allSchools',
      'en'
    )

    expect(course1).toEqual(course2)
  })
})
