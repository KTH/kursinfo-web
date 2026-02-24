const { parseCourseDefaultInformation } = require('../parseCourseDefaultInformation')

describe('parseCourseDefaultInformation', () => {
  const ladokCourse = {
    kod: 'BBBBB',
    huvudomraden: [
      {
        name: 'Boll',
      },
      { name: 'plank' },
    ],
    utbildningstyp: {
      id: 'utbildningstypid',
      level: {
        code: 'utbildningstyplevelcode',
        name: 'utbildningstyplevelname',
      },
    },
    betygsskala: {
      formatted: 'betygsskalaformatted',
    },
    organisation: {
      code: 'organisationcode',
      name: 'bar/organisationname',
    },
    avvecklad: true,
    benamning: {
      name: 'benamningname',
    },
    omfattning: {
      formattedWithUnit: 'omfattningformattedwithunit',
    },
  }

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
      benamning: {
        name: 'benamningnameFromSyllabus',
      },
      omfattning: {
        formattedWithUnit: 'omfattningformattedwithunitFromSyllabus',
      },
    },
  }

  test('maps correctly', () => {
    expect(parseCourseDefaultInformation({ avvecklad: false }, ladokSyllabus, 'sv')).toStrictEqual({
      course_code: 'AI2810',
      course_title: 'benamningnameFromSyllabus',
      course_credits_label: 'omfattningformattedwithunitFromSyllabus',
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
      course_is_being_discontinued: false,
      course_decision_to_discontinue: '<i>Ingen information tillagd</i>',
      course_last_exam: '',
      course_prerequisites: '<i>Ingen information tillagd</i>',
      course_examiners: '<i>Ingen information tillagd</i>',
    })
  })

  test('ladokCourse is fallback if syllabus is undefined', () => {
    expect(parseCourseDefaultInformation(ladokCourse, undefined, 'sv')).toStrictEqual({
      course_code: 'BBBBB',
      course_title: 'benamningname',
      course_credits_label: 'omfattningformattedwithunit',
      course_department: 'bar/organisationname',
      course_department_code: 'organisationcode',
      course_department_link: '<a href="/bar/" target="blank">bar/organisationname</a>',
      course_education_type_id: 'utbildningstypid',
      course_level_code: 'utbildningstyplevelcode',
      course_level_code_label: 'utbildningstyplevelname',
      course_main_subject: 'Boll, plank',
      course_grade_scale: 'betygsskalaformatted',
      course_is_discontinued: true,
      course_is_being_discontinued: false,
      course_decision_to_discontinue: '<i>Ingen information tillagd</i>',
      course_last_exam: '',
      course_prerequisites: '<i>Ingen information tillagd</i>',
      course_examiners: '<i>Ingen information tillagd</i>',
    })
  })

  test('ladokCourse is fallback if syllabus.course is undefined', () => {
    expect(parseCourseDefaultInformation(ladokCourse, { course: undefined }, 'sv')).toStrictEqual({
      course_code: 'BBBBB',
      course_title: 'benamningname',
      course_credits_label: 'omfattningformattedwithunit',
      course_department: 'bar/organisationname',
      course_department_code: 'organisationcode',
      course_department_link: '<a href="/bar/" target="blank">bar/organisationname</a>',
      course_education_type_id: 'utbildningstypid',
      course_level_code: 'utbildningstyplevelcode',
      course_level_code_label: 'utbildningstyplevelname',
      course_main_subject: 'Boll, plank',
      course_grade_scale: 'betygsskalaformatted',
      course_is_discontinued: true,
      course_is_being_discontinued: false,
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

  test('underavveckling is fetched from syllabus', () => {
    const { course_is_being_discontinued, course_decision_to_discontinue, course_last_exam } =
      parseCourseDefaultInformation(
        { avvecklad: true },
        {
          course: {
            ...ladokSyllabus.course,
            underavveckling: true,
            sistaexaminationstermin: 20241,
            avvecklingsbeslut: 'Det ska bort!',
          },
        }
      )

    expect(course_is_being_discontinued).toBeTrue()
    expect(course_decision_to_discontinue).toStrictEqual('Det ska bort!')
    expect(course_last_exam).toStrictEqual([2024, 1])
  })

  test('syllabus data is not used as fallback for avvecklad', () => {
    expect(
      parseCourseDefaultInformation(
        {},
        { ...ladokSyllabus, course: { ...ladokSyllabus.course, avvecklad: true } },
        'sv'
      ).course_is_discontinued
    ).toBeFalse()
  })

  test('empty courseMainSubjects', () => {
    expect(
      parseCourseDefaultInformation({ avvecklad: false }, { course: { huvudomraden: [] } }, 'sv').course_main_subject
    ).toStrictEqual('Denna kurs tillhör inget huvudområde.')
  })

  test('undefined courseMainSubjects', () => {
    expect(parseCourseDefaultInformation({ avvecklad: false }, { course: {} }, 'sv').course_main_subject).toStrictEqual(
      'Denna kurs tillhör inget huvudområde.'
    )
  })

  test('lastExaminationTerm is set', () => {
    expect(
      parseCourseDefaultInformation({ avvecklad: false }, { course: { sistaexaminationstermin: '20251' } }, 'sv')
        .course_last_exam
    ).toStrictEqual([2025, 1])
  })
})
