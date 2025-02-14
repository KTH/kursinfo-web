'use strict'

import { filterOfferingsForMemos, semestersInParsedOfferings } from './offerings'

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
