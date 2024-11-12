'use strict'

import { filterOfferingsForAnalysis } from './offerings'

describe('filterOfferingsForAnalysis', () => {
  const autumnPrevious = { semester: '20192' }
  const spring = { semester: '20201' }
  const autumn = { semester: '20202' }
  const springNext = { semester: '20211' }
  const autumnNext = { semester: '20212' }
  const school = 'CBH'

  const courseEndsInAutumn = {
    course_code: 'AB0001',
    first_yearsemester: '20202',
    offered_semesters: [autumn],
    school_code: school,
  }
  const courseEndsInAutumnStartInSpring = {
    course_code: 'AB0002',
    first_yearsemester: '20201',
    offered_semesters: [spring, autumn],
    school_code: school,
  }
  const courseEndsInAutumnOtherSchool = {
    course_code: 'AB0003',
    first_yearsemester: '20202',
    offered_semesters: [autumn],
    school_code: 'ITM',
  }
  const courseEndsInSpring = {
    course_code: 'AB0004',
    first_yearsemester: '20201',
    offered_semesters: [spring],
    school_code: school,
  }
  const courseEndsInSpringStartInAutumn = {
    course_code: 'AB0005',
    first_yearsemester: '20192',
    offered_semesters: [autumnPrevious, spring],
    school_code: school,
  }
  const courseEndsInAutumnNextYear = {
    course_code: 'AB0006',
    first_yearsemester: '20192',
    offered_semesters: [spring, autumn, springNext, autumnNext],
    school_code: school,
  }
  const courseEndsInSpringNextYearStartsInAutumn = {
    course_code: 'AB0007',
    first_yearsemester: '20201',
    offered_semesters: [autumn, springNext],
    school_code: school,
  }
  const coursesToFilter = [
    courseEndsInAutumnStartInSpring,
    courseEndsInAutumn,
    courseEndsInAutumnOtherSchool,
    courseEndsInAutumnNextYear,
    courseEndsInSpring,
    courseEndsInSpringStartInAutumn,
    courseEndsInSpringNextYearStartsInAutumn,
  ]
  it('should find offerings ending in autumn 2020 - all schools', () => {
    const parsedOfferings = filterOfferingsForAnalysis(coursesToFilter, '20202', 'allSchools', 'sv')
    expect(parsedOfferings.length).toBe(3)

    const expectedOffering1 = parsedOfferings.find(x => x.courseCode === 'AB0001')
    expect(expectedOffering1).toBeDefined()
    expect(expectedOffering1.firstSemester).toBe('20202')
    expect(expectedOffering1.lastSemester).toBe('20202')
    expect(expectedOffering1.lastSemesterLabel).toBe('HT')

    const expectedOffering2 = parsedOfferings.find(x => x.courseCode === 'AB0002')
    expect(expectedOffering2).toBeDefined()
    expect(expectedOffering2.firstSemester).toBe('20201')
    expect(expectedOffering2.lastSemester).toBe('20202')
    expect(expectedOffering2.lastSemesterLabel).toBe('HT')

    const expectedOffering3 = parsedOfferings.find(x => x.courseCode === 'AB0003')
    expect(expectedOffering3).toBeDefined()
    expect(expectedOffering3.firstSemester).toBe('20202')
    expect(expectedOffering3.lastSemester).toBe('20202')
    expect(expectedOffering3.lastSemesterLabel).toBe('HT')
  })
  it('should find offerings ending in autumn 2020 - CBH school', () => {
    const parsedOfferings = filterOfferingsForAnalysis(coursesToFilter, '20202', 'CBH', 'sv')
    expect(parsedOfferings.length).toBe(2)

    const expectedOffering1 = parsedOfferings.find(x => x.courseCode === 'AB0001')
    expect(expectedOffering1).toBeDefined()
    expect(expectedOffering1.firstSemester).toBe('20202')
    expect(expectedOffering1.lastSemester).toBe('20202')
    expect(expectedOffering1.lastSemesterLabel).toBe('HT')

    const expectedOffering2 = parsedOfferings.find(x => x.courseCode === 'AB0002')
    expect(expectedOffering2).toBeDefined()
    expect(expectedOffering2.firstSemester).toBe('20201')
    expect(expectedOffering2.lastSemester).toBe('20202')
    expect(expectedOffering2.lastSemesterLabel).toBe('HT')
  })
  it('should find offerings ending in spring 2020 - all schools', () => {
    const parsedOfferings = filterOfferingsForAnalysis(coursesToFilter, '20201', 'allSchools', 'sv')
    expect(parsedOfferings.length).toBe(2)

    const expectedOffering1 = parsedOfferings.find(x => x.courseCode === 'AB0004')
    expect(expectedOffering1).toBeDefined()
    expect(expectedOffering1.firstSemester).toBe('20201')
    expect(expectedOffering1.lastSemester).toBe('20201')
    expect(expectedOffering1.lastSemesterLabel).toBe('VT')

    const expectedOffering2 = parsedOfferings.find(x => x.courseCode === 'AB0005')
    expect(expectedOffering2).toBeDefined()
    expect(expectedOffering2.firstSemester).toBe('20192')
    expect(expectedOffering2.lastSemester).toBe('20201')
    expect(expectedOffering2.lastSemesterLabel).toBe('VT')
  })

  it('should map all relevant values', () => {
    const offeredSemester1 = { end_week: '41', end_date: '2020-10-10', semester: '20212', start_date: '2020-02-10' }
    const offeredSemester2 = { end_week: '46', end_date: '2020-11-10', semester: '20202', start_date: '2020-10-10' }
    const course = {
      connected_programs: [{ code: 'CINTE2', study_year: '2020', spec_code: 'iNTeresting' }],
      course_code: 'SF1624',
      department_name: 'CBH/Fiber- och Polymerteknologi',
      first_yearsemester: '20202',
      first_period: '20202P1',
      offered_semesters: [offeredSemester1, offeredSemester2],
      school_code: 'BIO',
    }
    const courses = [course]

    // Swedish
    const parsedOfferings = filterOfferingsForAnalysis(courses, '20202', 'allSchools', 'sv')
    expect(parsedOfferings.length).toBe(1)

    const [offering] = parsedOfferings
    expect(offering.firstSemester).toBe(course.first_yearsemester)
    expect(offering.startDate).toBe(course.offered_semesters[0].start_date)
    expect(offering.endDate).toBe(course.offered_semesters[1].end_date)
    expect(offering.schoolMainCode).toBe('CBH')
    expect(offering.departmentName).toBe(course.department_name)
    expect(offering.connectedPrograms).toBe('CINTE2-iNTeresting-2020')
    expect(offering.courseCode).toBe(course.course_code)
    expect(offering.lastSemester).toBe('20202')
    expect(offering.lastSemesterLabel).toBe('HT')

    // English
    const parsedOfferings_en = filterOfferingsForAnalysis(courses, '20202', 'allSchools', 'en')
    expect(parsedOfferings_en.length).toBe(1)
    const [offering_en] = parsedOfferings_en
    expect(offering_en.firstSemester).toBe(course.first_yearsemester)
    expect(offering_en.startDate).toBe(course.offered_semesters[0].start_date)
    expect(offering_en.endDate).toBe(course.offered_semesters[1].end_date)
    expect(offering_en.schoolMainCode).toBe('CBH')
    expect(offering_en.departmentName).toBe(course.department_name)
    expect(offering_en.connectedPrograms).toBe('CINTE2-iNTeresting-2020')
    expect(offering_en.courseCode).toBe(course.course_code)
    expect(offering_en.lastSemester).toBe('20202')
    expect(offering_en.lastSemesterLabel).toBe('Autumn')
  })
})
