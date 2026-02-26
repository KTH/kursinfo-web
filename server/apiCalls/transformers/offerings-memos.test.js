'use strict'

import { filterOfferingsForMemos, semestersInParsedOfferings } from './offerings'

describe('Memos functions to parse and filter offerings', () => {
  test('parse and filter offering for memos', () => {
    const expectedCourse = {
      delAvProgram: [{ kod: 'CINTE2', arskurs: '2020', inriktning: 'iNTeresting' }],
      kod: 'SF1624',
      organisation: { name: 'CBH/Fiber- och Polymerteknologi' },
      startperiod: { inDigits: '20202' },
      forstaUndervisningsdatum: { date: '2020-10-10', kthStudyPeriod: '1' },
      sistaUndervisningsdatum: { date: '2021-01-10' },
      schoolCode: 'CBH',
    }

    const tooOldCourse = {
      delAvProgram: [{ kod: 'CINTE1', arskurs: '2020', inriktning: 'k' }],
      kod: 'SF1625',
      startperiod: { inDigits: '20192' },
      forstaUndervisningsdatum: { date: '2019-08-01', kthStudyPeriod: '1' },
      sistaUndervisningsdatum: { date: '2019-10-10' },
      schoolCode: 'CBH',
    }

    const wrongSchoolCourse = {
      delAvProgram: [{ kod: 'CINTE1', arskurs: '2020', inriktning: 'D' }],
      kod: 'SF1629',
      organisation: { name: 'ITM/Production' },
      startperiod: { inDigits: '20202' },
      forstaUndervisningsdatum: { date: '2020-10-10', kthStudyPeriod: '1' },
      sistaUndervisningsdatum: { date: '2021-01-10' },
      schoolCode: 'ITM',
    }

    const courses = [expectedCourse, tooOldCourse, wrongSchoolCourse]
    const parsedOfferings = filterOfferingsForMemos(courses, ['20201', '20202'], ['1', '2'], 'CBH')

    expect(parsedOfferings.length).toBe(1)

    const [offering] = parsedOfferings
    expect(offering.firstSemester).toBe('20202')
    expect(offering.startDate).toBe('2020-10-10')
    expect(offering.endDate).toBe('2021-01-10')
    expect(offering.schoolMainCode).toBe('CBH')
    expect(offering.departmentName).toBe(expectedCourse.organisation.name)
    expect(offering.connectedPrograms).toBe('CINTE2-iNTeresting-2020')
    expect(offering.courseCode).toBe('SF1624')
    expect(offering.period).toBe('P1')

    const semestersInMemos = semestersInParsedOfferings(parsedOfferings)
    expect(semestersInMemos).toEqual(['20202'])
  })
})
