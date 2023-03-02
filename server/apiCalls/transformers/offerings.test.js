'use strict'

import {
  parsePeriodForNthWeek,
  filterOfferingsForMemos,
  filterOfferingsForAnalysis,
  semestersInParsedOfferings,
} from './offerings'

describe('Memos functions to parse and filter offerings', () => {
  test('parse and filter offering for memos', () => {
    const expectedCourse = {
      connected_programs: [{ code: 'CINTE2', study_year: '2020', spec_code: 'iNTeresting' }],
      course_code: 'SF1624',
      department_name: 'CBH/Fiber- och Polymerteknologi',
      first_yearsemester: '20202',
      first_period: '20202P1',
      offered_semesters: [{ end_date: '2021-01-10', semester: '20202', start_date: '2020-10-10' }],
      school_code: 'BIO',
    }
    const tooOldCourse = {
      connected_programs: [{ code: 'CINTE1', study_year: '2020', spec_code: 'k' }],
      course_code: 'SF1625',
      first_yearsemester: '20192',
      first_period: '20192P1',
      offered_semesters: [],
      school_code: 'CBH',
    }
    const wrongSchoolCourse = {
      connected_programs: [{ code: 'CINTE1', study_year: '2020', spec_code: 'D' }],
      course_code: 'SF1629',
      first_yearsemester: '20202',
      first_period: '20202P1',
      offered_semesters: [],
      school_code: 'ITM',
    }
    const courses = [expectedCourse, tooOldCourse, wrongSchoolCourse]
    const parsedOfferings = filterOfferingsForMemos(courses, ['20201', '20202'], ['1', '2'], 'CBH')
    expect(parsedOfferings.length).toBe(1)

    const [offering] = parsedOfferings
    expect(offering.firstSemester).toBe(expectedCourse.first_yearsemester)
    expect(offering.startDate).toBe(expectedCourse.offered_semesters[0].start_date)
    expect(offering.endDate).toBe(expectedCourse.offered_semesters[0].end_date)
    expect(offering.schoolMainCode).toBe('CBH')
    expect(offering.departmentName).toBe(expectedCourse.department_name)
    expect(offering.connectedPrograms).toBe('CINTE2-iNTeresting-2020')
    expect(offering.courseCode).toBe(expectedCourse.course_code)
    expect(offering.period).toBe('P1')

    const semestersInMemos = semestersInParsedOfferings(parsedOfferings)
    expect(semestersInMemos.length).toBe(1)
  })
})

describe('Analysis functions to parse and filter offerings', () => {
  test('return an autumn number for an end week', () => {
    expect(parsePeriodForNthWeek(43)).toBe(2)
    expect(parsePeriodForNthWeek('43')).toBe(2)
    expect(parsePeriodForNthWeek(2)).toBe(2)
    expect(parsePeriodForNthWeek('2')).toBe(2)
    expect(parsePeriodForNthWeek(35)).toBe(2)
    expect(parsePeriodForNthWeek('35')).toBe(2)
  })
  test('return a summer number for an end week', () => {
    expect(parsePeriodForNthWeek(24)).toBe(0)
    expect(parsePeriodForNthWeek('24')).toBe(0)
    expect(parsePeriodForNthWeek(28)).toBe(0)
    expect(parsePeriodForNthWeek('27')).toBe(0)
    expect(parsePeriodForNthWeek(34)).toBe(0)
    expect(parsePeriodForNthWeek('34')).toBe(0)
  })
  test('return a spring number for an end week', () => {
    expect(parsePeriodForNthWeek(3)).toBe(1)
    expect(parsePeriodForNthWeek('3')).toBe(1)
    expect(parsePeriodForNthWeek(20)).toBe(1)
    expect(parsePeriodForNthWeek('18')).toBe(1)
    expect(parsePeriodForNthWeek(23)).toBe(1)
    expect(parsePeriodForNthWeek('23')).toBe(1)
  })
  test('find matching course offering. Course finishes in autumn, user has chosen summer, autumn and spring semesters.', () => {
    const notexpectedSemester = { end_week: '41', end_date: '2020-10-10', semester: '20212', start_date: '2020-02-10' }
    const expectedSemester = { end_week: '46', end_date: '2020-11-10', semester: '20202', start_date: '2020-10-10' }
    const expectedCourse = {
      connected_programs: [{ code: 'CINTE2', study_year: '2020', spec_code: 'iNTeresting' }],
      course_code: 'SF1624',
      department_name: 'CBH/Fiber- och Polymerteknologi',
      first_yearsemester: '20202',
      first_period: '20202P1',
      offered_semesters: [notexpectedSemester, expectedSemester],
      school_code: 'BIO',
    }
    const tooOldCourse = {
      connected_programs: [{ code: 'CINTE1', study_year: '2020', spec_code: 'k' }],
      course_code: 'SF1625',
      first_yearsemester: '20192',
      first_period: '20192P1',
      offered_semesters: [],
      school_code: 'CBH',
    }
    const wrongSchoolCourse = {
      connected_programs: [{ code: 'CINTE1', study_year: '2020', spec_code: 'D' }],
      course_code: 'SF1629',
      first_yearsemester: '20202',
      first_period: '20202P1',
      offered_semesters: [],
      school_code: 'ITM',
    }
    const courses = [expectedCourse, tooOldCourse, wrongSchoolCourse]
    // Swedish
    const parsedOfferings = filterOfferingsForAnalysis(courses, ['20201', '20202'], ['1', '2', '0'], 'CBH', 'sv')
    expect(parsedOfferings.length).toBe(1)

    const [offering] = parsedOfferings
    expect(offering.firstSemester).toBe(expectedCourse.first_yearsemester)
    expect(offering.startDate).toBe(expectedCourse.offered_semesters[0].start_date)
    expect(offering.endDate).toBe(expectedCourse.offered_semesters[1].end_date)
    expect(offering.schoolMainCode).toBe('CBH')
    expect(offering.departmentName).toBe(expectedCourse.department_name)
    expect(offering.connectedPrograms).toBe('CINTE2-iNTeresting-2020')
    expect(offering.courseCode).toBe(expectedCourse.course_code)
    expect(offering.lastSemester).toBe('20202')
    expect(offering.lastSemesterLabel).toBe('HT')

    // English
    const parsedOfferings_en = filterOfferingsForAnalysis(courses, ['20201', '20202'], ['1', '2', '0'], 'CBH', 'en')
    expect(parsedOfferings_en.length).toBe(1)

    const [offering_en] = parsedOfferings_en
    expect(offering_en.firstSemester).toBe(expectedCourse.first_yearsemester)
    expect(offering_en.startDate).toBe(expectedCourse.offered_semesters[0].start_date)
    expect(offering_en.endDate).toBe(expectedCourse.offered_semesters[1].end_date)
    expect(offering_en.schoolMainCode).toBe('CBH')
    expect(offering_en.departmentName).toBe(expectedCourse.department_name)
    expect(offering_en.connectedPrograms).toBe('CINTE2-iNTeresting-2020')
    expect(offering_en.courseCode).toBe(expectedCourse.course_code)
    expect(offering_en.lastSemester).toBe('20202')
    expect(offering_en.lastSemesterLabel).toBe('Autumn')
  })
  test('find no matching offering. Course finishes in autumn, user chosen summer semester.', () => {
    const notexpectedSemester = { end_week: '40', end_date: '2021-10-10', semester: '20212', start_date: '2020-10-10' }
    const notexpectedSemesterLast = {
      end_week: '1',
      end_date: '2021-01-10',
      semester: '20202',
      start_date: '2020-10-10',
    }
    const expectedCourse = {
      connected_programs: [{ code: 'CINTE2', study_year: '2020', spec_code: 'iNTeresting' }],
      course_code: 'SF1624',
      department_name: 'CBH/Fiber- och Polymerteknologi',
      first_yearsemester: '20202',
      first_period: '20202P1',
      offered_semesters: [notexpectedSemester, notexpectedSemesterLast],
      school_code: 'BIO',
    }
    const tooOldCourse = {
      connected_programs: [{ code: 'CINTE1', study_year: '2020', spec_code: 'k' }],
      course_code: 'SF1625',
      first_yearsemester: '20192',
      first_period: '20192P1',
      offered_semesters: [],
      school_code: 'CBH',
    }
    const wrongSchoolCourse = {
      connected_programs: [{ code: 'CINTE1', study_year: '2020', spec_code: 'D' }],
      course_code: 'SF1629',
      first_yearsemester: '20202',
      first_period: '20202P1',
      offered_semesters: [],
      school_code: 'ITM',
    }
    const courses = [expectedCourse, tooOldCourse, wrongSchoolCourse]
    const parsedOfferings = filterOfferingsForAnalysis(courses, ['20201', '20202'], ['0'], 'CBH', 'sv')
    expect(parsedOfferings.length).toBe(0)
  })

  test('find no matching offering. Course finishes in autumn, user chosen spring semester.', () => {
    const notexpectedSemester = { end_week: '40', end_date: '2021-10-10', semester: '20212', start_date: '2020-10-10' }
    const notexpectedSemesterLast = {
      end_week: '1',
      end_date: '2021-01-10',
      semester: '20202',
      start_date: '2020-10-10',
    }
    const expectedCourse = {
      connected_programs: [{ code: 'CINTE2', study_year: '2020', spec_code: 'iNTeresting' }],
      course_code: 'SF1624',
      department_name: 'CBH/Fiber- och Polymerteknologi',
      first_yearsemester: '20202',
      first_period: '20202P1',
      offered_semesters: [notexpectedSemester, notexpectedSemesterLast],
      school_code: 'BIO',
    }
    const tooOldCourse = {
      connected_programs: [{ code: 'CINTE1', study_year: '2020', spec_code: 'k' }],
      course_code: 'SF1625',
      first_yearsemester: '20192',
      first_period: '20192P1',
      offered_semesters: [],
      school_code: 'CBH',
    }
    const wrongSchoolCourse = {
      connected_programs: [{ code: 'CINTE1', study_year: '2020', spec_code: 'D' }],
      course_code: 'SF1629',
      first_yearsemester: '20202',
      first_period: '20202P1',
      offered_semesters: [],
      school_code: 'ITM',
    }
    const courses = [expectedCourse, tooOldCourse, wrongSchoolCourse]
    const parsedOfferings = filterOfferingsForAnalysis(courses, ['20201', '20202'], ['1'], 'CBH', 'sv')
    expect(parsedOfferings.length).toBe(0)
  })

  test('find no mathing summer course offering because of wrong year. Course finishes in summer 2022, user chosen summer semester in 2020.', () => {
    const semester = { end_week: '28', end_date: '2022-07-15', semester: '20221', start_date: '2022-03-10' }
    const course = {
      connected_programs: [{ code: 'CINTE2', study_year: '2022', spec_code: 'iNTeresting' }],
      course_code: 'SF1624',
      department_name: 'CBH/Fiber- och Polymerteknologi',
      first_yearsemester: '20221',
      first_period: '20221P5',
      offered_semesters: [semester],
      school_code: 'EES',
    }
    const courses = [course]
    const parsedOfferings = filterOfferingsForAnalysis(courses, ['20201', '20202'], ['0'], 'EECS', 'sv')
    expect(parsedOfferings.length).toBe(0)
  })

  test('find matching summer course offering. Course finishes in summer 2022, user chosen summer semester 2022.', () => {
    const semester = { end_week: '28', end_date: '2022-07-15', semester: '20221', start_date: '2022-03-10' }
    const expectedCourse = {
      connected_programs: [{ code: 'CINTE2', study_year: '2022', spec_code: 'iNTeresting' }],
      course_code: 'SF1624',
      department_name: 'CBH/Fiber- och Polymerteknologi',
      first_yearsemester: '20221',
      first_period: '20221P5',
      offered_semesters: [semester],
      school_code: 'EES',
    }
    const courses = [expectedCourse]
    // Swedish
    const parsedOfferings = filterOfferingsForAnalysis(courses, ['20221', '20222'], ['0'], 'EECS', 'sv')
    expect(parsedOfferings.length).toBe(1)

    const [offering] = parsedOfferings
    expect(offering.firstSemester).toBe(expectedCourse.first_yearsemester)
    expect(offering.startDate).toBe(expectedCourse.offered_semesters[0].start_date)
    expect(offering.endDate).toBe(expectedCourse.offered_semesters[0].end_date)
    expect(offering.schoolMainCode).toBe('EECS')
    expect(offering.departmentName).toBe(expectedCourse.department_name)
    expect(offering.connectedPrograms).toBe('CINTE2-iNTeresting-2022')
    expect(offering.courseCode).toBe(expectedCourse.course_code)
    expect(offering.lastSemester).toBe('20221')
    expect(offering.lastSemesterLabel).toBe('Sommar')

    // English
    const parsedOfferings_en = filterOfferingsForAnalysis(courses, ['20221', '20222'], ['0'], 'EECS', 'en')
    expect(parsedOfferings_en.length).toBe(1)

    const [offering_en] = parsedOfferings_en
    expect(offering_en.firstSemester).toBe(expectedCourse.first_yearsemester)
    expect(offering_en.startDate).toBe(expectedCourse.offered_semesters[0].start_date)
    expect(offering_en.endDate).toBe(expectedCourse.offered_semesters[0].end_date)
    expect(offering_en.schoolMainCode).toBe('EECS')
    expect(offering_en.departmentName).toBe(expectedCourse.department_name)
    expect(offering_en.connectedPrograms).toBe('CINTE2-iNTeresting-2022')
    expect(offering_en.courseCode).toBe(expectedCourse.course_code)
    expect(offering_en.lastSemester).toBe('20221')
    expect(offering_en.lastSemesterLabel).toBe('Summer')
  })
})
