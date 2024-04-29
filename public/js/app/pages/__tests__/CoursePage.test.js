import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { faker } from '@faker-js/faker'
import axios from 'axios'
import { userEvent } from '@testing-library/user-event'
import { WebContextProvider } from '../../context/WebContext'
import CoursePage from '../CoursePage'

import i18n from '../../../../../i18n'

jest.mock('axios')
const context = {
  browserConfig: {},
  activeSyllabusIndex: 0,
  courseData: {
    syllabusList: [{ course_valid_from: [], course_valid_to: [] }],
    syllabusSemesterList: [],
    courseInfo: {
      course_recruitment_text: '',
      course_application_info: '',
      sellingText: { en: '', sv: '' },
      imageFromAdmin: '',
    },
  },
  activeSemesters: [],
  lang: 'en',
}
const [translate] = i18n.messages // en

describe('Component <CoursePage>', () => {
  test('renders course syllabus link correctly', () => {
    render(
      <WebContextProvider configIn={context}>
        <CoursePage />
      </WebContextProvider>
    )
    const noSyllabusText = screen.getByText(translate.courseLabels.label_syllabus_missing)
    expect(noSyllabusText).toBeInTheDocument()
  })

  test('renders course syllabus and check employees by changing semester', async () => {
    const examinerName = faker.person.fullName()
    const responsibleName = faker.person.fullName()
    const teacherName = faker.person.fullName()
    const courseContactName = faker.person.fullName()
    const courseContactEmail = faker.internet.email()
    const examiners = `<p class = "person">\n      <img class="profile-picture" src="" alt="Profile picture" width="31" height="31">\n      <a href="#" property="teach:teacher">\n          ${examinerName} \n      </a> \n    </p>  <p class = "person">\n      <img class="profile-picture" src="" alt="Profile picture" width="31" height="31">\n      <a href="#" property="teach:teacher">\n          ${examinerName} \n      </a> \n    </p`
    const responsibles = `<p class = "person">\n      <img class="profile-picture" src="" alt="Profile picture" width="31" height="31">\n      <a href="#" property="teach:teacher">\n          ${responsibleName} \n      </a> \n    </p>  <p class = "person">\n      <img class="profile-picture" src="" alt="Profile picture" width="31" height="31">\n      <a href="#" property="teach:teacher">\n          ${responsibleName} \n      </a> \n    </p>`
    const teachers = `<p class = "person">\n      <img class="profile-picture" src="" alt="Profile picture" width="31" height="31">\n      <a href="#" property="teach:teacher">\n          ${teacherName} \n      </a> \n    </p>`
    axios.post
      .mockResolvedValue({
        data: {
          examiners,
        },
      })
      .mockResolvedValue({
        data: {
          examiners,
          responsibles,
          teachers,
        },
      })
    const contextToTest = {
      browserConfig: {},
      activeSemester: '20231',
      activeRoundIndex: 0,
      activeSemesterIndex: 0,
      activeSemesters: [
        ['2022', '1', '20221', 0],
        ['2022', '2', '20222', 0],
        ['2023', '1', '20231', 0],
      ],
      courseCode: 'MF1016',
      courseData: {
        courseInfo: {
          course_application_info: '',
          course_code: 'MF1016',
          course_contact_name: `HT: ${courseContactName} (${courseContactEmail}) VT: ${courseContactName} (${courseContactEmail})`,
          course_department: 'ITM/Machine Design',
          course_department_code: 'MF',
          course_department_link: '<a href="/itm/" target="blank">ITM/Machine Design</a>',
          course_disposition: '<i>No information inserted</i>',
          course_education_type_id: null,
          course_examiners: `<p class = "person">      <img class="profile-picture" src="" alt="Profile picture" width="31" height="31">      <a href="#" property="teach:teacher">\n         ${examinerName} \n      </a> \n    </p>  <p class = "person">\n      <img class="profile-picture" src="" alt="Profile picture" width="31" height="31">\n      <a href="#" property="teach:teacher">\n          ${examinerName} \n      </a> \n    </p>`,
          course_grade_scale: 'A, B, C, D, E, FX, F',
          course_last_exam: [],
          course_level_code: 'BASIC',
          course_literature: '<p>Will be announced at the beginning of the course.</p>',
          course_main_subject: 'Technology',
          course_possibility_to_addition: '<i>No information inserted</i>',
          course_possibility_to_completions: '<i>No information inserted</i>',
          course_prerequisites: '<i>No information inserted</i>',
          course_recruitment_text:
            '<p>The overall goal is that the student should be able to use digital and microprocessor based technology in the design of a product. The student should also be able to dimension the drive and the size of a motor in an application.</p>',
          course_required_equipment: '<i>No information inserted</i>',
          course_state: 'ESTABLISHED',
          course_suggested_addon_studies: '<p>MF2030&#160;Mechatronics basic course and the track Mechatronics.</p>',
          course_supplemental_information: '<i>No information inserted</i>',
          course_supplemental_information_url: '<i>No information inserted</i>',
          course_supplemental_information_url_text: '<i>No information inserted</i>',
          sellingText: { en: '', sv: '' },
          imageFromAdmin: '',
        },
        courseTitleData: {
          course_code: 'MF1016',
          course_credits: 9,
          course_credits_text: 'hp',
          course_other_title: 'Elektroteknik',
          course_title: 'Basic Electrical Engineering',
        },
        language: 'en',
        roundList: {
          20221: [
            {
              has_round_published_memo: true,
              round_application_code: '60747',
              round_application_link: '<i>No information inserted</i>',
              round_campus: 'KTH Campus',
              round_category: 'PU',
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
              round_short_name: 'Start  18/01/2022',
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
              round_category: 'PU',
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
              round_category: 'PU',
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
            course_additional_regulations: '',
            course_content:
              '<p>Electrical circuits: DC, AC and transients. Analogy between electrical and mechanical quantities.</p><p>Electrical measurements and analog circuits: Measuring with multimeter and oscilloscope. Use of LabVIEW. The OP-amplifier model and how it is used in amplifier circuits and as a comarator. Use of filters to pass or block diferent frequency ranges.</p><p>Digital electronics and microcontrollers: Transistors in switched applications. Analysis and synthesis of combinatorical and sequence cirquits. The functionality of a microprocessor and a microcontroller. Use of microcontrollers in simple applications. Analog cirquits for signalcondition of sensorsignals before ADC (analog to digital conversion). Examples of sensors such as encoders and strain gauges.</p><p>Electrical motordrives: Single- and three- phase systems. Theory and properties of DC machines and PM synchronous machines. Principles for speedcontrol of electrical machines. Mechanical and thermal transients in electrical machines. Choice of machine size for time varying mechanical loads. Power electronics and drive units for machines. calculation of the required voltage and current for a motordrive.</p><p>Sustainable development: Electric and hybrid cars. Calculation of quantities such as e.g. energy, power, force, velocity, acceleration, current and voltage in different parts of a electric or hybrid car under different conditions such as acceleration or regenerative braking. Dimension of energystorages such as batteries and capacitors (ultracap).</p>',
            course_decision_to_discontinue: '<i>No information inserted</i>',
            course_disposition: '<i>No information inserted</i>',
            course_eligibility:
              '<p>SF1624 Algebra and Geometry, SF1625 Calculus in One Variable and SF1626 Calculus in Several Variable</p>',
            course_establishment: 'Course syllabus for MF1016 valid from Autumn 2019',
            course_ethical:
              '<ul><li>All members of a group are responsible for the groups work.</li><li>In any assessment, every student shall honestly disclose any help received and sources used.</li><li>In an oral assessment, every student shall be able to present and answer questions about the entire assignment and solution.</li></ul>',
            course_examination: `<ul class='ul-no-padding' ><li>INL1 - \n                        Assignments,\n                        3.0  credits,  \n                        grading scale: P, F              \n                        </li><li>LAB1 - \n                        Laboratory Work,\n                        3.0  credits,  \n                        grading scale: P, F              \n                        </li><li>TEN1 - \n                        Written examination,\n                        3.0  credits,  \n                        grading scale: A, B, C, D, E, FX, F              \n                        </li></ul>`,
            course_examination_comments:
              'Based on recommendation from KTH’s coordinator for disabilities, the examiner will decide how to adapt an examination for students with documented disability. <br><br>The examiner may apply another examination format when re-examining individual students.',
            course_goals:
              '<p>After the course the student will be able to<br />- Analyze the conditions in simple circuits such as DC, AC and transient events of the first order.<br />- Choose an electric motor to a mechanical load whose torque varies in time.<br />- Calculate the speed, torque, power, current and voltage in different parts of an electric motor drive (consisting of mechanical load, electric motor and power supply) at constant speed and also during acceleration and braking.<br />- With given&#160;cooling conditions&#160;estimate the temperature of an electric motor for some time after a known load is applied.<br />- Able to explain the problems and possibilities of electricity and / or hybrid operation compared to other technologies for the propulsion of cars viewed from a sustainability perspective.<br />- Describe and perform basic calculations on different powertrain concepts for electric and hybrid cars.<br />- Designing an energy storage in an electric or hybrid vehicle to achieve the desired performance such as range. With energy storage means in this context mainly batteries and / or ultra-capacitors.<br />- Use a microcontroller to solve simple tasks such as controlling the voltage to an electric motor.<br />- Describe a system using a state diagram and write a program to control such a system.</p><p>- apply the&#160; OP-amplifier model to dimension and analyze basic circuits.</p><p>- dimension and analyze simple filters.<br />- Design a digital design to solve a combinatorial problem.<br />- Estimate the deviations in the measurement results.<br />- Connect simple electrical circuits.<br />-&#160;Connect&#160;electric measuring instruments such as multimeter and oscilloscopes to simple electrical circuits. Performing measurements with these instruments.<br />- Experimentally determine the current-voltage-characteristics of a device or component.<br />- Solve simple problems and show the solution function by performing an experiment.<br />- Give a short oral presentation about the outcome of an experiment or a laboratory exercise.<br />- Translate the substance technical terms into English.<br />- Work constructively in a group of 2-3 persons with laboratory and experimenta.</p>',
            course_literature: '<i>No information inserted</i>',
            course_literature_comment: '<p>Will be announced at the beginning of the course.</p>',
            course_required_equipment: '<i>No information inserted</i>',
            course_requirments_for_final_grade: '',
            course_transitional_reg: '',
            course_valid_from: ['2019', '2'],
            course_valid_to: [],
          },
          {
            course_additional_regulations: '',
            course_content:
              '<p>Electrical circuits: DC, AC and transients. Analogy between electrical and mechanical quantities.</p><p>Electrical measurements and analog circuits: Measuring with multimeter and oscilloscope. Use of LabVIEW. The OP-amplifier model and how it is used in amplifier circuits and as a comarator. Use of filters to pass or block diferent frequency ranges.</p><p>Digital electronics and microcontrollers: Transistors in switched applications. Analysis and synthesis of combinatorical and sequence cirquits. The functionality of a microprocessor and a microcontroller. Use of microcontrollers in simple applications. Analog cirquits for signalcondition of sensorsignals before ADC (analog to digital conversion). Examples of sensors such as encoders and strain gauges.</p><p>Electrical motordrives: Single- and three- phase systems. Theory and properties of DC machines and PM synchronous machines. Principles for speedcontrol of electrical machines. Mechanical and thermal transients in electrical machines. Choice of machine size for time varying mechanical loads. Power electronics and drive units for machines. calculation of the required voltage and current for a motordrive.</p><p>Sustainable development: Electric and hybrid cars. Calculation of quantities such as e.g. energy, power, force, velocity, acceleration, current and voltage in different parts of a electric or hybrid car under different conditions such as acceleration or regenerative braking. Dimension of energystorages such as batteries and capacitors (ultracap).</p>',
            course_decision_to_discontinue: '<i>No information inserted</i>',
            course_disposition: '<i>No information inserted</i>',
            course_eligibility:
              '<p>SF1624 Algebra and Geometry, SF1625 Calculus in One Variable and SF1626 Calculus in Several Variable</p>',
            course_establishment: 'Course syllabus for MF1016 valid from Autumn 2019',
            course_ethical:
              '<ul><li>All members of a group are responsible for the groups work.</li><li>In any assessment, every student shall honestly disclose any help received and sources used.</li><li>In an oral assessment, every student shall be able to present and answer questions about the entire assignment and solution.</li></ul>',
            course_examination: `<ul class='ul-no-padding' ><li>INL1 - \n                        Assignments,\n                        3.0  credits,  \n                        grading scale: P, F              \n                        </li><li>LAB1 - \n                        Laboratory Work,\n                        3.0  credits,  \n                        grading scale: P, F              \n                        </li><li>TEN1 - \n                        Written examination,\n                        3.0  credits,  \n                        grading scale: A, B, C, D, E, FX, F              \n                        </li></ul>`,
            course_examination_comments:
              'Based on recommendation from KTH’s coordinator for disabilities, the examiner will decide how to adapt an examination for students with documented disability. <br><br>The examiner may apply another examination format when re-examining individual students.',
            course_goals:
              '<p>After the course the student will be able to<br />- Analyze the conditions in simple circuits such as DC, AC and transient events of the first order.<br />- Choose an electric motor to a mechanical load whose torque varies in time.<br />- Calculate the speed, torque, power, current and voltage in different parts of an electric motor drive (consisting of mechanical load, electric motor and power supply) at constant speed and also during acceleration and braking.<br />- With given&#160;cooling conditions&#160;estimate the temperature of an electric motor for some time after a known load is applied.<br />- Able to explain the problems and possibilities of electricity and / or hybrid operation compared to other technologies for the propulsion of cars viewed from a sustainability perspective.<br />- Describe and perform basic calculations on different powertrain concepts for electric and hybrid cars.<br />- Designing an energy storage in an electric or hybrid vehicle to achieve the desired performance such as range. With energy storage means in this context mainly batteries and / or ultra-capacitors.<br />- Use a microcontroller to solve simple tasks such as controlling the voltage to an electric motor.<br />- Describe a system using a state diagram and write a program to control such a system.</p><p>- apply the&#160; OP-amplifier model to dimension and analyze basic circuits.</p><p>- dimension and analyze simple filters.<br />- Design a digital design to solve a combinatorial problem.<br />- Estimate the deviations in the measurement results.<br />- Connect simple electrical circuits.<br />-&#160;Connect&#160;electric measuring instruments such as multimeter and oscilloscopes to simple electrical circuits. Performing measurements with these instruments.<br />- Experimentally determine the current-voltage-characteristics of a device or component.<br />- Solve simple problems and show the solution function by performing an experiment.<br />- Give a short oral presentation about the outcome of an experiment or a laboratory exercise.<br />- Translate the substance technical terms into English.<br />- Work constructively in a group of 2-3 persons with laboratory and experimenta.</p>',
            course_literature: '<i>No information inserted</i>',
            course_literature_comment: '<p>Will be announced at the beginning of the course.</p>',
            course_required_equipment: '<i>No information inserted</i>',
            course_requirments_for_final_grade: '',
            course_transitional_reg: '',
            course_valid_from: ['2015', '1'],
            course_valid_to: [2019, '1'],
          },
          {
            course_additional_regulations: '',
            course_content:
              '<p>Electrical circuits: DC, AC and transients. Analogy between electrical and mechanical quantities.</p><p>Electrical measurements and analog circuits: Measuring with multimeter and oscilloscope. Use of LabVIEW. The OP-amplifier model and how it is used in amplifier circuits and as a comarator. Use of filters to pass or block diferent frequency ranges.</p><p>Digital electronics and microcontrollers: Transistors in switched applications. Analysis and synthesis of combinatorical and sequence cirquits. The functionality of a microprocessor and a microcontroller. Use of microcontrollers in simple applications. Analog cirquits for signalcondition of sensorsignals before ADC (analog to digital conversion). Examples of sensors such as encoders and strain gauges.</p><p>Electrical motordrives: Single- and three- phase systems. Theory and properties of DC machines and PM synchronous machines. Principles for speedcontrol of electrical machines. Mechanical and thermal transients in electrical machines. Choice of machine size for time varying mechanical loads. Power electronics and drive units for machines. calculation of the required voltage and current for a motordrive.</p><p>Sustainable development: Electric and hybrid cars. Calculation of quantities such as e.g. energy, power, force, velocity, acceleration, current and voltage in different parts of a electric or hybrid car under different conditions such as acceleration or regenerative braking. Dimension of energystorages such as batteries and capacitors (ultracap).</p>',
            course_decision_to_discontinue: '<i>No information inserted</i>',
            course_disposition: '<i>No information inserted</i>',
            course_eligibility:
              '<p>SF1624 Algebra and Geometry, SF1625 Calculus in One Variable and SF1626 Calculus in Several Variable</p>',
            course_establishment: 'Course syllabus for MF1016 valid from Autumn 2019',
            course_ethical:
              '<ul><li>All members of a group are responsible for the groups work.</li><li>In any assessment, every student shall honestly disclose any help received and sources used.</li><li>In an oral assessment, every student shall be able to present and answer questions about the entire assignment and solution.</li></ul>',
            course_examination: `<ul class='ul-no-padding' ><li>INL1 - \n                        Assignments,\n                        3.0  credits,  \n                        grading scale: P, F              \n                        </li><li>LAB1 - \n                        Laboratory Work,\n                        3.0  credits,  \n                        grading scale: P, F              \n                        </li><li>TEN1 - \n                        Written examination,\n                        3.0  credits,  \n                        grading scale: A, B, C, D, E, FX, F              \n                        </li></ul>`,
            course_examination_comments:
              'Based on recommendation from KTH’s coordinator for disabilities, the examiner will decide how to adapt an examination for students with documented disability. <br><br>The examiner may apply another examination format when re-examining individual students.',
            course_goals:
              '<p>After the course the student will be able to<br />- Analyze the conditions in simple circuits such as DC, AC and transient events of the first order.<br />- Choose an electric motor to a mechanical load whose torque varies in time.<br />- Calculate the speed, torque, power, current and voltage in different parts of an electric motor drive (consisting of mechanical load, electric motor and power supply) at constant speed and also during acceleration and braking.<br />- With given&#160;cooling conditions&#160;estimate the temperature of an electric motor for some time after a known load is applied.<br />- Able to explain the problems and possibilities of electricity and / or hybrid operation compared to other technologies for the propulsion of cars viewed from a sustainability perspective.<br />- Describe and perform basic calculations on different powertrain concepts for electric and hybrid cars.<br />- Designing an energy storage in an electric or hybrid vehicle to achieve the desired performance such as range. With energy storage means in this context mainly batteries and / or ultra-capacitors.<br />- Use a microcontroller to solve simple tasks such as controlling the voltage to an electric motor.<br />- Describe a system using a state diagram and write a program to control such a system.</p><p>- apply the&#160; OP-amplifier model to dimension and analyze basic circuits.</p><p>- dimension and analyze simple filters.<br />- Design a digital design to solve a combinatorial problem.<br />- Estimate the deviations in the measurement results.<br />- Connect simple electrical circuits.<br />-&#160;Connect&#160;electric measuring instruments such as multimeter and oscilloscopes to simple electrical circuits. Performing measurements with these instruments.<br />- Experimentally determine the current-voltage-characteristics of a device or component.<br />- Solve simple problems and show the solution function by performing an experiment.<br />- Give a short oral presentation about the outcome of an experiment or a laboratory exercise.<br />- Translate the substance technical terms into English.<br />- Work constructively in a group of 2-3 persons with laboratory and experimenta.</p>',
            course_literature: '<i>No information inserted</i>',
            course_literature_comment: '<p>Will be announced at the beginning of the course.</p>',
            course_required_equipment: '<i>No information inserted</i>',
            course_requirments_for_final_grade: '',
            course_transitional_reg: '',
            course_valid_from: ['2012', '2'],
            course_valid_to: [2014, '2'],
          },
          {
            course_additional_regulations: '',
            course_content:
              '<p>Electrical circuits: DC, AC and transients. Analogy between electrical and mechanical quantities.</p><p>Electrical measurements and analog circuits: Measuring with multimeter and oscilloscope. Use of LabVIEW. The OP-amplifier model and how it is used in amplifier circuits and as a comarator. Use of filters to pass or block diferent frequency ranges.</p><p>Digital electronics and microcontrollers: Transistors in switched applications. Analysis and synthesis of combinatorical and sequence cirquits. The functionality of a microprocessor and a microcontroller. Use of microcontrollers in simple applications. Analog cirquits for signalcondition of sensorsignals before ADC (analog to digital conversion). Examples of sensors such as encoders and strain gauges.</p><p>Electrical motordrives: Single- and three- phase systems. Theory and properties of DC machines and PM synchronous machines. Principles for speedcontrol of electrical machines. Mechanical and thermal transients in electrical machines. Choice of machine size for time varying mechanical loads. Power electronics and drive units for machines. calculation of the required voltage and current for a motordrive.</p><p>Sustainable development: Electric and hybrid cars. Calculation of quantities such as e.g. energy, power, force, velocity, acceleration, current and voltage in different parts of a electric or hybrid car under different conditions such as acceleration or regenerative braking. Dimension of energystorages such as batteries and capacitors (ultracap).</p>',
            course_decision_to_discontinue: '<i>No information inserted</i>',
            course_disposition: '<i>No information inserted</i>',
            course_eligibility:
              '<p>SF1624 Algebra and Geometry, SF1625 Calculus in One Variable and SF1626 Calculus in Several Variable</p>',
            course_establishment: 'Course syllabus for MF1016 valid from Autumn 2019',
            course_ethical:
              '<ul><li>All members of a group are responsible for the groups work.</li><li>In any assessment, every student shall honestly disclose any help received and sources used.</li><li>In an oral assessment, every student shall be able to present and answer questions about the entire assignment and solution.</li></ul>',
            course_examination: `<ul class='ul-no-padding' ><li>INL1 - \n                        Assignments,\n                        3.0  credits,  \n                        grading scale: P, F              \n                        </li><li>LAB1 - \n                        Laboratory Work,\n                        3.0  credits,  \n                        grading scale: P, F              \n                        </li><li>TEN1 - \n                        Written examination,\n                        3.0  credits,  \n                        grading scale: A, B, C, D, E, FX, F              \n                        </li></ul>`,
            course_examination_comments:
              'Based on recommendation from KTH’s coordinator for disabilities, the examiner will decide how to adapt an examination for students with documented disability. <br><br>The examiner may apply another examination format when re-examining individual students.',
            course_goals:
              '<p>After the course the student will be able to<br />- Analyze the conditions in simple circuits such as DC, AC and transient events of the first order.<br />- Choose an electric motor to a mechanical load whose torque varies in time.<br />- Calculate the speed, torque, power, current and voltage in different parts of an electric motor drive (consisting of mechanical load, electric motor and power supply) at constant speed and also during acceleration and braking.<br />- With given&#160;cooling conditions&#160;estimate the temperature of an electric motor for some time after a known load is applied.<br />- Able to explain the problems and possibilities of electricity and / or hybrid operation compared to other technologies for the propulsion of cars viewed from a sustainability perspective.<br />- Describe and perform basic calculations on different powertrain concepts for electric and hybrid cars.<br />- Designing an energy storage in an electric or hybrid vehicle to achieve the desired performance such as range. With energy storage means in this context mainly batteries and / or ultra-capacitors.<br />- Use a microcontroller to solve simple tasks such as controlling the voltage to an electric motor.<br />- Describe a system using a state diagram and write a program to control such a system.</p><p>- apply the&#160; OP-amplifier model to dimension and analyze basic circuits.</p><p>- dimension and analyze simple filters.<br />- Design a digital design to solve a combinatorial problem.<br />- Estimate the deviations in the measurement results.<br />- Connect simple electrical circuits.<br />-&#160;Connect&#160;electric measuring instruments such as multimeter and oscilloscopes to simple electrical circuits. Performing measurements with these instruments.<br />- Experimentally determine the current-voltage-characteristics of a device or component.<br />- Solve simple problems and show the solution function by performing an experiment.<br />- Give a short oral presentation about the outcome of an experiment or a laboratory exercise.<br />- Translate the substance technical terms into English.<br />- Work constructively in a group of 2-3 persons with laboratory and experimenta.</p>',
            course_literature: '<i>No information inserted</i>',
            course_literature_comment: '<p>Will be announced at the beginning of the course.</p>',
            course_required_equipment: '<i>No information inserted</i>',
            course_requirments_for_final_grade: '',
            course_transitional_reg: '',
            course_valid_from: ['2012', '1'],
            course_valid_to: [2012, '1'],
          },
          {
            course_additional_regulations: '',
            course_content:
              '<p>Electrical circuits: DC, AC and transients. Analogy between electrical and mechanical quantities.</p><p>Electrical measurements and analog circuits: Measuring with multimeter and oscilloscope. Use of LabVIEW. The OP-amplifier model and how it is used in amplifier circuits and as a comarator. Use of filters to pass or block diferent frequency ranges.</p><p>Digital electronics and microcontrollers: Transistors in switched applications. Analysis and synthesis of combinatorical and sequence cirquits. The functionality of a microprocessor and a microcontroller. Use of microcontrollers in simple applications. Analog cirquits for signalcondition of sensorsignals before ADC (analog to digital conversion). Examples of sensors such as encoders and strain gauges.</p><p>Electrical motordrives: Single- and three- phase systems. Theory and properties of DC machines and PM synchronous machines. Principles for speedcontrol of electrical machines. Mechanical and thermal transients in electrical machines. Choice of machine size for time varying mechanical loads. Power electronics and drive units for machines. calculation of the required voltage and current for a motordrive.</p><p>Sustainable development: Electric and hybrid cars. Calculation of quantities such as e.g. energy, power, force, velocity, acceleration, current and voltage in different parts of a electric or hybrid car under different conditions such as acceleration or regenerative braking. Dimension of energystorages such as batteries and capacitors (ultracap).</p>',
            course_decision_to_discontinue: '<i>No information inserted</i>',
            course_disposition: '<i>No information inserted</i>',
            course_eligibility:
              '<p>SF1624 Algebra and Geometry, SF1625 Calculus in One Variable and SF1626 Calculus in Several Variable</p>',
            course_establishment: 'Course syllabus for MF1016 valid from Autumn 2019',
            course_ethical:
              '<ul><li>All members of a group are responsible for the groups work.</li><li>In any assessment, every student shall honestly disclose any help received and sources used.</li><li>In an oral assessment, every student shall be able to present and answer questions about the entire assignment and solution.</li></ul>',
            course_examination: `<ul class='ul-no-padding' ><li>INL1 - \n                        Assignments,\n                        3.0  credits,  \n                        grading scale: P, F              \n                        </li><li>LAB1 - \n                        Laboratory Work,\n                        3.0  credits,  \n                        grading scale: P, F              \n                        </li><li>TEN1 - \n                        Written examination,\n                        3.0  credits,  \n                        grading scale: A, B, C, D, E, FX, F              \n                        </li></ul>`,
            course_examination_comments:
              'Based on recommendation from KTH’s coordinator for disabilities, the examiner will decide how to adapt an examination for students with documented disability. <br><br>The examiner may apply another examination format when re-examining individual students.',
            course_goals:
              '<p>After the course the student will be able to<br />- Analyze the conditions in simple circuits such as DC, AC and transient events of the first order.<br />- Choose an electric motor to a mechanical load whose torque varies in time.<br />- Calculate the speed, torque, power, current and voltage in different parts of an electric motor drive (consisting of mechanical load, electric motor and power supply) at constant speed and also during acceleration and braking.<br />- With given&#160;cooling conditions&#160;estimate the temperature of an electric motor for some time after a known load is applied.<br />- Able to explain the problems and possibilities of electricity and / or hybrid operation compared to other technologies for the propulsion of cars viewed from a sustainability perspective.<br />- Describe and perform basic calculations on different powertrain concepts for electric and hybrid cars.<br />- Designing an energy storage in an electric or hybrid vehicle to achieve the desired performance such as range. With energy storage means in this context mainly batteries and / or ultra-capacitors.<br />- Use a microcontroller to solve simple tasks such as controlling the voltage to an electric motor.<br />- Describe a system using a state diagram and write a program to control such a system.</p><p>- apply the&#160; OP-amplifier model to dimension and analyze basic circuits.</p><p>- dimension and analyze simple filters.<br />- Design a digital design to solve a combinatorial problem.<br />- Estimate the deviations in the measurement results.<br />- Connect simple electrical circuits.<br />-&#160;Connect&#160;electric measuring instruments such as multimeter and oscilloscopes to simple electrical circuits. Performing measurements with these instruments.<br />- Experimentally determine the current-voltage-characteristics of a device or component.<br />- Solve simple problems and show the solution function by performing an experiment.<br />- Give a short oral presentation about the outcome of an experiment or a laboratory exercise.<br />- Translate the substance technical terms into English.<br />- Work constructively in a group of 2-3 persons with laboratory and experimenta.</p>',
            course_literature: '<i>No information inserted</i>',
            course_literature_comment: '<p>Will be announced at the beginning of the course.</p>',
            course_required_equipment: '<i>No information inserted</i>',
            course_requirments_for_final_grade: '',
            course_transitional_reg: '',
            course_valid_from: ['2010', '2'],
            course_valid_to: [2011, '2'],
          },
          {
            course_additional_regulations: '',
            course_content:
              '<p>Electrical circuits: DC, AC and transients. Analogy between electrical and mechanical quantities.</p><p>Electrical measurements and analog circuits: Measuring with multimeter and oscilloscope. Use of LabVIEW. The OP-amplifier model and how it is used in amplifier circuits and as a comarator. Use of filters to pass or block diferent frequency ranges.</p><p>Digital electronics and microcontrollers: Transistors in switched applications. Analysis and synthesis of combinatorical and sequence cirquits. The functionality of a microprocessor and a microcontroller. Use of microcontrollers in simple applications. Analog cirquits for signalcondition of sensorsignals before ADC (analog to digital conversion). Examples of sensors such as encoders and strain gauges.</p><p>Electrical motordrives: Single- and three- phase systems. Theory and properties of DC machines and PM synchronous machines. Principles for speedcontrol of electrical machines. Mechanical and thermal transients in electrical machines. Choice of machine size for time varying mechanical loads. Power electronics and drive units for machines. calculation of the required voltage and current for a motordrive.</p><p>Sustainable development: Electric and hybrid cars. Calculation of quantities such as e.g. energy, power, force, velocity, acceleration, current and voltage in different parts of a electric or hybrid car under different conditions such as acceleration or regenerative braking. Dimension of energystorages such as batteries and capacitors (ultracap).</p>',
            course_decision_to_discontinue: '<i>No information inserted</i>',
            course_disposition: '<i>No information inserted</i>',
            course_eligibility:
              '<p>SF1624 Algebra and Geometry, SF1625 Calculus in One Variable and SF1626 Calculus in Several Variable</p>',
            course_establishment: 'Course syllabus for MF1016 valid from Autumn 2019',
            course_ethical:
              '<ul><li>All members of a group are responsible for the groups work.</li><li>In any assessment, every student shall honestly disclose any help received and sources used.</li><li>In an oral assessment, every student shall be able to present and answer questions about the entire assignment and solution.</li></ul>',
            course_examination: `<ul class='ul-no-padding' ><li>INL1 - \n                        Assignments,\n                        3.0  credits,  \n                        grading scale: P, F              \n                        </li><li>LAB1 - \n                        Laboratory Work,\n                        3.0  credits,  \n                        grading scale: P, F              \n                        </li><li>TEN1 - \n                        Written examination,\n                        3.0  credits,  \n                        grading scale: A, B, C, D, E, FX, F              \n                        </li></ul>`,
            course_examination_comments:
              'Based on recommendation from KTH’s coordinator for disabilities, the examiner will decide how to adapt an examination for students with documented disability. <br><br>The examiner may apply another examination format when re-examining individual students.',
            course_goals:
              '<p>After the course the student will be able to<br />- Analyze the conditions in simple circuits such as DC, AC and transient events of the first order.<br />- Choose an electric motor to a mechanical load whose torque varies in time.<br />- Calculate the speed, torque, power, current and voltage in different parts of an electric motor drive (consisting of mechanical load, electric motor and power supply) at constant speed and also during acceleration and braking.<br />- With given&#160;cooling conditions&#160;estimate the temperature of an electric motor for some time after a known load is applied.<br />- Able to explain the problems and possibilities of electricity and / or hybrid operation compared to other technologies for the propulsion of cars viewed from a sustainability perspective.<br />- Describe and perform basic calculations on different powertrain concepts for electric and hybrid cars.<br />- Designing an energy storage in an electric or hybrid vehicle to achieve the desired performance such as range. With energy storage means in this context mainly batteries and / or ultra-capacitors.<br />- Use a microcontroller to solve simple tasks such as controlling the voltage to an electric motor.<br />- Describe a system using a state diagram and write a program to control such a system.</p><p>- apply the&#160; OP-amplifier model to dimension and analyze basic circuits.</p><p>- dimension and analyze simple filters.<br />- Design a digital design to solve a combinatorial problem.<br />- Estimate the deviations in the measurement results.<br />- Connect simple electrical circuits.<br />-&#160;Connect&#160;electric measuring instruments such as multimeter and oscilloscopes to simple electrical circuits. Performing measurements with these instruments.<br />- Experimentally determine the current-voltage-characteristics of a device or component.<br />- Solve simple problems and show the solution function by performing an experiment.<br />- Give a short oral presentation about the outcome of an experiment or a laboratory exercise.<br />- Translate the substance technical terms into English.<br />- Work constructively in a group of 2-3 persons with laboratory and experimenta.</p>',
            course_literature: '<i>No information inserted</i>',
            course_literature_comment: '<p>Will be announced at the beginning of the course.</p>',
            course_required_equipment: '<i>No information inserted</i>',
            course_requirments_for_final_grade: '',
            course_transitional_reg: '',
            course_valid_from: ['2009', '1'],
            course_valid_to: [2010, '1'],
          },
        ],
        syllabusSemesterList: [
          [20192, ''],
          [20151, 20191],
          [20122, 20142],
          [20121, 20121],
          [20102, 20112],
          [20091, 20101],
        ],
        defaultIndex: 2,
      },
      dropdownsOpen: {
        roundsDropdown: false,
        semesterDropdown: false,
      },
      activeSemestersIndexesWithValidSyllabusesIndexes: [0, 0, 0],
      activeSyllabusIndex: 0,
      roundDisabled: false,
      roundInfoFade: false,
      roundSelectedIndex: 0,
      semesterSelectedIndex: 0,
      showRoundData: true,
      syllabusInFade: false,
      lang: 'en',
      paths: {
        ug: {
          rest: {
            api: {
              method: 'post',
              uri: '/student/kurser/kurs/ug/rest',
            },
          },
        },
        api: {
          plannedSchemaModules: {
            uri: '/:courseCode/:semester/:applicationCode',
          },
        },
      },
      getCourseEmployees() {
        return {
          examiners,
          responsibles,
          teachers,
        }
      },
    }

    render(
      <WebContextProvider configIn={contextToTest}>
        <CoursePage />
      </WebContextProvider>
    )
    expect(screen.getByText('MF1016 Basic Electrical Engineering 9.0 credits')).toBeInTheDocument()
    expect(screen.getByText('Valid for')).toBeInTheDocument()
    expect(screen.getByText('Content and learning outcomes')).toBeInTheDocument()
    expect(screen.getByText('Course contents')).toBeInTheDocument()
    expect(screen.getByText('Semester')).toBeInTheDocument()
    expect(screen.getByText('Course syllabus as PDF')).toBeInTheDocument()
    expect(screen.getByText('About course offering')).toBeInTheDocument()
    expect(screen.getByText('Application')).toBeInTheDocument()
    expect(screen.getByText('Application code')).toBeInTheDocument()
    expect(screen.getByText('60747')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Contact', level: 2 })).toBeInTheDocument()

    expect(
      screen.getAllByText(
        `HT: ${courseContactName} (${courseContactEmail}) VT: ${courseContactName} (${courseContactEmail})`
      )[0]
    ).toBeInTheDocument()
    expect(screen.getAllByText('Examiner')[0]).toBeInTheDocument()
    expect(screen.getAllByText(examinerName)[0]).toBeInTheDocument()
    expect(screen.getAllByText('Course coordinator')[0]).toBeInTheDocument()
    expect(screen.getAllByText('No information inserted')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Teachers')[0]).toBeInTheDocument()
    expect(screen.getAllByText('No information inserted')[0]).toBeInTheDocument()
    await userEvent.click(screen.getByDisplayValue('Choose semester'))
    await userEvent.click(screen.getByText('Spring 2023'))
    expect(screen.getByText('Spring 2023')).toBeInTheDocument()
    expect(screen.getAllByText('Contact')[0]).toBeInTheDocument()
    expect(
      screen.getAllByText(
        `HT: ${courseContactName} (${courseContactEmail}) VT: ${courseContactName} (${courseContactEmail})`
      )[0]
    ).toBeInTheDocument()
    expect(screen.getAllByText('Examiner')[0]).toBeInTheDocument()
    expect(screen.getAllByText(examinerName)[0]).toBeInTheDocument()
    expect(screen.getAllByText('Course coordinator')[0]).toBeInTheDocument()
    expect(screen.getAllByText(responsibleName)[0]).toBeInTheDocument()
    expect(screen.getAllByText('Teachers')[0]).toBeInTheDocument()
    expect(screen.getAllByText(teacherName)[0]).toBeInTheDocument()
    axios.post.mockResolvedValue({
      data: {
        examiners,
        teachers,
      },
    })
    await userEvent.click(screen.getByText('Spring 2023'))
    await userEvent.click(screen.getByText('Spring 2022'))
    expect(screen.getByText('Spring 2022')).toBeInTheDocument()
    expect(screen.getAllByText('Contact')[0]).toBeInTheDocument()
    expect(
      screen.getAllByText(
        `HT: ${courseContactName} (${courseContactEmail}) VT: ${courseContactName} (${courseContactEmail})`
      )[0]
    ).toBeInTheDocument()
    expect(screen.getAllByText('Examiner')[0]).toBeInTheDocument()
    expect(screen.getAllByText(examinerName)[0]).toBeInTheDocument()
    expect(screen.getAllByText('Course coordinator')[0]).toBeInTheDocument()
    expect(screen.getAllByText('No information inserted')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Teachers')[0]).toBeInTheDocument()
    expect(screen.getAllByText(teacherName)[0]).toBeInTheDocument()
  })
})
