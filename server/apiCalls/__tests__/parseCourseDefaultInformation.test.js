const { parseCourseDefaultInformation } = require('../parseCourseDefaultInformation')

describe('parseCourseDefaultInformation', () => {
  const ladokSyllabus = {
    course: {
      kod: 'AI2810',
      betygsskala: {
        id: '131657',
        code: 'AF',
        name: 'Sjugradig betygsskala',
        nameOther: 'Seven point grading scale',
        formatted: 'A, B, C, D, E, FX, F',
      },
      utbildningstyp: {
        id: '24',
        level: {
          code: '2',
          name: 'Avancerad nivå',
        },
      },
      huvudomraden: [
        {
          id: '16263',
          code: 'SZABD',
          name: 'Samhällsbyggnad',
          nameOther: 'The Built Environment',
        },
      ],
      organisation: {
        code: 'AID',
        name: 'ABE/Ledning och organisering i byggande och förvaltning',
      },
      underavveckling: false,
      sistaexaminationstermin: undefined,
      avvecklingsbeslut: undefined,
    },
  }

  test('maps correctly', () => {
    expect(parseCourseDefaultInformation({ avvecklad: false }, ladokSyllabus, 'sv')).toStrictEqual({
      course_code: 'AI2810',
      course_department: 'ABE/Ledning och organisering i byggande och förvaltning',
      course_department_code: 'AID',
      course_department_link:
        '<a href="/abe/" target="blank">ABE/Ledning och organisering i byggande och förvaltning</a>',
      course_education_type_id: '24',
      course_level_code: '2',
      course_level_code_label: 'Avancerad nivå',
      course_main_subject: 'Samhällsbyggnad',
      course_grade_scale: 'A, B, C, D, E, FX, F',
      course_is_discontinued: false,
      course_is_being_discontinued: undefined,
      course_decision_to_discontinue: '<i>Ingen information tillagd</i>',
      course_last_exam: '',
      course_prerequisites: '<i>Ingen information tillagd</i>',
      course_examiners: '<i>Ingen information tillagd</i>',
    })
  })

  test('course_is_discontinued = false for avvecklad = false', () => {
    expect(parseCourseDefaultInformation({ avvecklad: false }, ladokSyllabus, 'sv').course_is_discontinued).toBeFalse()
  })

  test('course_is_discontinued = true for avvecklad = true', () => {
    expect(parseCourseDefaultInformation({ avvecklad: true }, ladokSyllabus, 'sv').course_is_discontinued).toBeTrue()
  })

  test('course_is_discontinued = false for avvecklad = undefined', () => {
    expect(parseCourseDefaultInformation({}, ladokSyllabus, 'sv').course_is_discontinued).toBeFalse()
  })

  test('syllabus data is not used as fallback', () => {
    expect(
      parseCourseDefaultInformation(
        {},
        { ...ladokSyllabus, course: { ...ladokSyllabus.course, avvecklad: true } },
        'sv'
      ).course_is_discontinued
    ).toBeFalse()
  })
})
