import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { useCourseEmployees } from '../../hooks/useCourseEmployees'
import { usePlannedModules } from '../../hooks/usePlannedModules'
import { WebContextProvider } from '../../context/WebContext'
import CoursePage from '../CoursePage'

jest.mock('../../hooks/useCourseEmployees')
jest.mock('../../hooks/usePlannedModules')

useCourseEmployees.mockReturnValue({ courseRoundEmployees: { examiners: '', responsibles: '', teachers: '' } })
usePlannedModules.mockReturnValue({ plannedModules: 'somePlannedModules' })

describe('Component <CoursePage>', () => {
  const contextToTest = {
    browserConfig: {
      memoStorageUri: '',
    },
    lang: 'en',
    initiallySelectedSemester: 20222,
    initiallySelectedRoundIndex: undefined,
    activeSemesters: [
      { year: 2022, semesterNumber: 1, semester: '20221' },
      { year: 2022, semesterNumber: 2, semester: '20222' },
      { year: 2023, semesterNumber: 1, semester: '20231' },
    ],
    courseCode: 'MF1016',
    courseData: {
      courseInfo: {},
      courseTitleData: {
        course_code: 'MF1016',
        course_credits_label: '9.0 credits',
        course_title: 'Basic Electrical Engineering',
      },
      roundsBySemester: {
        20221: [
          {
            has_round_published_memo: true,
            round_application_code: '60747',
            round_application_link: '<i>No information inserted</i>',
            round_campus: 'KTH Campus',
            round_comment: '',
            round_course_place: 'KTH Campus',
            round_course_term: ['2022', '1'],
            round_end_date: '07/06/2022',
            round_funding_type: 'ORD',
            round_part_of_programme:
              '<p>\n        <a href="/student/kurser/program/CINEK/20202/arskurs2#inrPPUI">\n          Degree Programme in Industrial Engineering and Management, åk 2, PPUI, Mandatory\n      </a>\n    </p><p>\n        <a href="/student/kurser/program/CMAST/20202/arskurs2">\n          Degree Programme in Mechanical Engineering, åk 2, Mandatory\n      </a>\n    </p><p>\n        <a href="/student/kurser/program/CMAST/20202/arskurs2#inrINTF">\n          Degree Programme in Mechanical Engineering, åk 2, INTF, Mandatory\n      </a>\n    </p><p>\n        <a href="/student/kurser/program/CMAST/20202/arskurs2#inrINTS">\n          Degree Programme in Mechanical Engineering, åk 2, INTS, Mandatory\n      </a>\n    </p><p>\n        <a href="/student/kurser/program/CMAST/20202/arskurs2#inrINTT">\n          Degree Programme in Mechanical Engineering, åk 2, INTT, Mandatory\n      </a>\n    </p>',
            round_periods: 'P3 (4.5 hp), P4 (4.5 hp)',
            round_schedule: 'https://www-r.referens.sys.kth.se/social/course/MF1016/subgroup/vt-2022-509/calendar/',
            round_seats: '',
            round_selection_criteria: '',
            round_short_name: 'Round A',
            round_start_date: '18/01/2022',
            round_state: 'APPROVED',
            round_study_pace: 33,
            round_target_group: '<i>No information inserted</i>',
            round_time_slots: '<i>No information inserted</i>',
            round_tutoring_form: 'NML',
            round_tutoring_language: 'Swedish',
            round_tutoring_time: 'DAG',
            round_type: 'Programutbildning',
          },
          {
            has_round_published_memo: true,
            round_application_code: '60747',
            round_application_link: '<i>No information inserted</i>',
            round_campus: 'KTH Campus',
            round_comment: '',
            round_course_place: 'KTH Campus',
            round_course_term: ['2022', '1'],
            round_end_date: '07/06/2022',
            round_funding_type: 'LL',
            round_part_of_programme:
              '<p>\n        <a href="/student/kurser/program/CINEK/20202/arskurs2#inrPPUI">\n          Degree Programme in Industrial Engineering and Management, åk 2, PPUI, Mandatory\n      </a>\n    </p><p>\n        <a href="/student/kurser/program/CMAST/20202/arskurs2">\n          Degree Programme in Mechanical Engineering, åk 2, Mandatory\n      </a>\n    </p><p>\n        <a href="/student/kurser/program/CMAST/20202/arskurs2#inrINTF">\n          Degree Programme in Mechanical Engineering, åk 2, INTF, Mandatory\n      </a>\n    </p><p>\n        <a href="/student/kurser/program/CMAST/20202/arskurs2#inrINTS">\n          Degree Programme in Mechanical Engineering, åk 2, INTS, Mandatory\n      </a>\n    </p><p>\n        <a href="/student/kurser/program/CMAST/20202/arskurs2#inrINTT">\n          Degree Programme in Mechanical Engineering, åk 2, INTT, Mandatory\n      </a>\n    </p>',
            round_periods: 'P3 (4.5 hp), P4 (4.5 hp)',
            round_schedule: 'https://www-r.referens.sys.kth.se/social/course/MF1016/subgroup/vt-2022-509/calendar/',
            round_seats: '',
            round_selection_criteria: '',
            round_short_name: 'Round B',
            round_start_date: '18/01/2022',
            round_state: 'APPROVED',
            round_study_pace: 33,
            round_target_group: '<i>No information inserted</i>',
            round_time_slots: '<i>No information inserted</i>',
            round_tutoring_form: 'NML',
            round_tutoring_language: 'Swedish',
            round_tutoring_time: 'DAG',
            round_type: 'Programutbildning',
          },
        ],
        20222: [
          {
            has_round_published_memo: true,
            round_application_code: '60747',
            round_application_link: '<i>No information inserted</i>',
            round_campus: 'KTH Campus',
            round_comment: '',
            round_course_place: 'KTH Campus',
            round_course_term: ['2022', '2'],
            round_end_date: '16/01/2023',
            round_funding_type: 'LL',
            round_part_of_programme:
              '<p>\n        <a href="/student/kurser/program/CINEK/20202/arskurs2#inrPPUI">\n          Degree Programme in Industrial Engineering and Management, åk 2, PPUI, Mandatory\n      </a>\n    </p><p>\n        <a href="/student/kurser/program/CMAST/20202/arskurs2">\n          Degree Programme in Mechanical Engineering, åk 2, Mandatory\n      </a>\n    </p><p>\n        <a href="/student/kurser/program/CMAST/20202/arskurs2#inrINTF">\n          Degree Programme in Mechanical Engineering, åk 2, INTF, Mandatory\n      </a>\n    </p><p>\n        <a href="/student/kurser/program/CMAST/20202/arskurs2#inrINTS">\n          Degree Programme in Mechanical Engineering, åk 2, INTS, Mandatory\n      </a>\n    </p><p>\n        <a href="/student/kurser/program/CMAST/20202/arskurs2#inrINTT">\n          Degree Programme in Mechanical Engineering, åk 2, INTT, Mandatory\n      </a>\n    </p>',
            round_periods: 'P3 (4.5 hp), P4 (4.5 hp)',
            round_schedule: 'https://www-r.referens.sys.kth.se/social/course/MF1016/subgroup/vt-2022-509/calendar/',
            round_seats: '',
            round_selection_criteria: '',
            round_short_name: 'Start  29/08/2022',
            round_start_date: '29/08/2022',
            round_state: 'APPROVED',
            round_study_pace: 33,
            round_target_group: '<i>No information inserted</i>',
            round_time_slots: '<i>No information inserted</i>',
            round_tutoring_form: 'NML',
            round_tutoring_language: 'Swedish',
            round_tutoring_time: 'DAG',
            round_type: 'Programutbildning',
          },
        ],
        20231: [
          {
            has_round_published_memo: true,
            round_application_code: '60747',
            round_application_link: '<i>No information inserted</i>',
            round_campus: 'KTH Campus',
            round_comment: '',
            round_course_place: 'KTH Campus',
            round_course_term: ['2023', '1'],
            round_end_date: '05/06/2023',
            round_funding_type: 'LL',
            round_part_of_programme:
              '<p>\n        <a href="/student/kurser/program/CINEK/20202/arskurs2#inrPPUI">\n          Degree Programme in Industrial Engineering and Management, åk 2, PPUI, Mandatory\n      </a>\n    </p><p>\n        <a href="/student/kurser/program/CMAST/20202/arskurs2">\n          Degree Programme in Mechanical Engineering, åk 2, Mandatory\n      </a>\n    </p><p>\n        <a href="/student/kurser/program/CMAST/20202/arskurs2#inrINTF">\n          Degree Programme in Mechanical Engineering, åk 2, INTF, Mandatory\n      </a>\n    </p><p>\n        <a href="/student/kurser/program/CMAST/20202/arskurs2#inrINTS">\n          Degree Programme in Mechanical Engineering, åk 2, INTS, Mandatory\n      </a>\n    </p><p>\n        <a href="/student/kurser/program/CMAST/20202/arskurs2#inrINTT">\n          Degree Programme in Mechanical Engineering, åk 2, INTT, Mandatory\n      </a>\n    </p>',
            round_periods: 'P3 (4.5 hp), P4 (4.5 hp)',
            round_schedule: 'https://www-r.referens.sys.kth.se/social/course/MF1016/subgroup/vt-2022-509/calendar/',
            round_seats: '',
            round_selection_criteria: '<p></p>',
            round_short_name: 'Start  17/01/2023',
            round_start_date: '18/01/2023',
            round_state: 'APPROVED',
            round_study_pace: 33,
            round_target_group: '<i>No information inserted</i>',
            round_time_slots: '<i>No information inserted</i>',
            round_tutoring_form: 'NML',
            round_tutoring_language: 'Swedish',
            round_tutoring_time: 'DAG',
            round_type: 'Programutbildning',
          },
        ],
      },
      syllabusList: [
        {
          course_content: 'Course content in syllabus v2',
          course_valid_from: { year: 2022, semesterNumber: 2 },
        },
        {
          course_content: 'Course content in syllabus v1',
          course_valid_from: { year: 2015, semesterNumber: 1 },
          course_valid_to: { year: 2022, semesterNumber: 1 },
        },
      ],
    },
  }

  test('should render correct information when changing semester', async () => {
    const user = userEvent.setup()

    render(
      <WebContextProvider configIn={contextToTest}>
        <CoursePage />
      </WebContextProvider>
    )
    expect(screen.getByText('MF1016 Basic Electrical Engineering 9.0 credits')).toBeInTheDocument()

    const spring2022 = screen.getByLabelText('Spring 2022')
    const autumn2022 = screen.getByLabelText('Autumn 2022')
    const spring2023 = screen.getByLabelText('Spring 2023')

    expect(spring2022).not.toBeChecked()
    expect(autumn2022).toBeChecked()
    expect(spring2023).not.toBeChecked()

    screen.getByText('Course content in syllabus v2')
    expect(screen.getByRole('link', { name: /^Course syllabus/ })).toHaveTextContent(
      'Course syllabus MF1016 (Autumn 2022–)'
    )

    // only one round, expect to display round header and not the Course offering dropdown
    expect(screen.getByRole('heading', { name: /^Information for/ })).toHaveTextContent(/^Information for Autumn 2022/)
    expect(screen.queryByLabelText('Course offering')).not.toBeInTheDocument()

    // Change tab
    await user.click(spring2022)

    expect(spring2022).toBeChecked()
    expect(autumn2022).not.toBeChecked()
    expect(spring2023).not.toBeChecked()

    screen.getByText('Course content in syllabus v1')
    expect(screen.getByRole('link', { name: /^Course syllabus/ })).toHaveTextContent(
      'Course syllabus MF1016 (Spring 2015–Spring 2022)'
    )

    // multiple rounds, expect to display Course offering dropdown and not round header
    const roundDropdown = screen.getByLabelText('Course offering')
    expect(roundDropdown).toHaveValue('-1')
    expect(screen.queryByRole('heading', { name: /^Information for/ })).not.toBeInTheDocument()

    await user.selectOptions(roundDropdown, '0')
    expect(screen.getByRole('heading', { name: /^Information for/ })).toHaveTextContent(
      /^Information for Spring 2022 Round A programme students/
    )

    await user.selectOptions(roundDropdown, '1')
    expect(screen.getByRole('heading', { name: /^Information for/ })).toHaveTextContent(
      /^Information for Spring 2022 Round B single courses students/
    )
  })
})
