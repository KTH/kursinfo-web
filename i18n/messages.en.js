module.exports = {
  shortNames: [ 'en' ],
  longNameSe: 'Engelska',
  longNameEn: 'English',
  messages: {
    /**
     * General stuff
     */
    date_format_short: '%d-%b-%Y',

    /**
     * Error messages
     */

    error_not_found: 'Sorry, we can\'t find your requested page',
    error_course_not_found: 'Sorry, there is no course with course code ',
    error_generic: 'Something went wrong on the server, please try again later.',

    /**
     * Message keys
     */
    service_name: 'course',

    example_message_key: 'This is an english translation of a label',

    button_label_example: 'Click me to send data to server!',

    field_text_example: 'Data to be sent to API',

    field_label_get_example: 'My modelData(Response from api call GET): ',
    field_label_post_example: 'My modelData(Response from api call POST): ',

    lang_block_id: '1.77273',
    locale_text: 'Course information in English',
    site_name: 'Course information',
    host_name: 'KTH',
    page_student: 'STUDENT AT KTH',
    page_course_programme: 'COURSE AND PROGRAMME DIRECTORY'
  },
  courseLabels: {
    label_syllabus_link: 'Course syllabus ',
    label_course_syllabus: '* Retrieved from ',
    label_course_syllabus_valid_from: 'Valid from',
    label_course_syllabus_valid_to: 'to end of ',
    header_no_syllabus: 'Course syllabus and course round missing',
    label_no_syllabus: 'Course syllabus missing, showing available course information. Course rounds also missing for current semester as well as for previous and coming semesters',
    label_programme_year: 'year ',
    label_postgraduate_course: 'Postgraduate courses at ',
    label_course_cancelled: 'This course has been cancelled.',
    label_last_exam: 'Last planned examination: ',
    label_course_web_link: 'Course web',
    label_edit: 'Administrate',
    header_no_rounds: 'Course round missing',
    lable_no_rounds: ' Course rounds missing for current semester as well as for previous and coming semesters',
    label_course_pm: 'Course memo',
    label_schedule: 'Schedule',
    label_statistics: 'Course statistics',
    lable_canavas_example: 'Canvas example course',
    lable_round_select: 'Choose course round',
    lable_semester_select: 'Choose semester',
    lable_round_state: {
      CANCELLED: 'This round is cancelled',
      FULL: 'This round is full'
    },
    header_dropdown_menue: 'Show course information based on the chosen semester and course round',
    header_course_info: 'Course information',
    header_content: 'Content and outcome',
    header_execution: 'Literature and execution',
    header_examination: 'Examination and fulfillment',
    header_contact: 'Contact',
    header_statistics: 'Course statistics',
    header_syllabuses: 'Course Syllabuses archives',
    header_further: 'Further information',
    header_history: 'Course development and history',
    header_round: 'Rounds and implementation',
    header_select_course: 'Application',
    header_postgraduate_course: 'Postgraduate course ',
    empty_text: 'No information added',
    no_schedule: 'No schedule ',
    no_memo: 'No memo ',
    header_no_round_selected: 'No round selected',
    no_round_selected: 'Select the semester and course round above to get information from the correct course syllabus and course round.',
    round_seats_info: 'Course round may be cancelled if number of admitted are less than minimum of places. If there are more applicants than number of places selection will be made.',
    syllabus_info: '<h4>Course information</h4> <p>• Course information consists of all information from the course syllabus (kursplan) as well as other course information concerning course and course round</p><p>• If you have not chosen the semester and course round, you will see course information from the current or future course syllabus (which period the course syllabus applies to is given under the heading "Course information")</p><p>• A course goes different course rounds. To see information for a specific course round, choose the semester and course round in the upper right corner. If it is another course syllabus that applies to that semester, the corresponding information is also updated (on the left side of the page).</p><p>• Please note: regulations in course syllabus are rules that are generally applicable and binding for both employees and students</p>'
  },
  courseInformation: {
    course_title: 'Title english',
    course_other_title: 'Title swedish',
    course_code: 'Course code',
    course_credits: 'Credits',
    course_grade_scale: 'Grading scale *',
    course_goals: 'Intended learning outcomes *',
    course_content: 'Course main content *',
    course_disposition: 'Disposition *',
    course_eligibility: 'Eligibility *',
    course_requirments_for_final_grade: 'Requirements for final grade *',
    course_literature: 'Literature *',
    course_literature_comment: 'Literature comment',
    course_examination_comments: 'Examination comment *',
    course_examination: 'Examination *',
    course_valid_from: 'Valid from',
    course_main_subject: 'Main field of study *',
    course_language: 'Language of instruction *',
    course_required_equipment: 'Required equipment *',
    course_level_code: 'Education cycle *',
    course_short_semester: {
      1: 'Spring ',
      2: 'Autumn '
    },
    course_level_code_label: {
      PREPARATORY: 'Pre-university level',
      BASIC: 'First cycle',
      ADVANCED: 'Second cycle',
      RESEARCH: 'Third cycle'
    },
    course_department: 'Offered by',
    course_contact_name: 'Contact ',
    course_prerequisites: 'Recommended prerequisites',
    course_suggested_addon_studies: 'Add-on studies',
    course_supplemental_information_url: 'Supplementary information link',
    course_supplemental_information_url_text: 'Supplementary information link text',
    course_supplemental_information: 'Supplementary information ',
    course_examiners: 'Examiner',
    course_recruitment_text: 'Abstract',
    course_application_info: 'Information for research students about course offerings'
  },
  courseRoundInformation: {
    round_header: 'Round',
    round_application_code: 'Application code',
    round_max_seats: 'Number of places',
    round_part_of_programme: 'Part of programme',
    round_responsibles: 'Course responsible',
    round_end_date: 'End date',
    round_start_date: 'Duration',
    round_teacher: 'Teacher',
    round_target_group: 'Target group',
    round_short_name: 'Short name',
    round_periods: 'Periods',
    round_schedule: 'Schedule',
    round_course_term: 'Start semester',
    round_course_place: 'Course location',
    round_tutoring_form: 'Form of study',
    round_tutoring_form_label: {
      NML: 'Normal',
      DST: 'Distance',
      ITD: 'IT based distance'
    },
    round_tutoring_language: 'Language of instruction',
    round_campus: 'Campus',
    round_tutoring_time: 'Tutoring time',
    round_tutoring_time_label: {
      DAG: 'Daytime',
      KVA: 'Evenings',
      KVÄ: 'Evenings',
      VSL: 'Weekends'
    },
    round_type: 'Type of round',
    round_time_slots: 'Planned timeslots',
    round_application_link: 'Go to the registration'
  },
  courseImage: {
    Architecture: 'Picture_by_MainFieldOfStudy_01_Architecture.jpg',
    Biotechnology: 'Picture_by_MainFieldOfStudy_02_Biotechnology.jpg',
    'Computer Science and Engineering': 'Picture_by_MainFieldOfStudy_03_Computer_Science.jpg',
    'Electrical Engineering': 'Picture_by_MainFieldOfStudy_04_Electrical_Engineering.jpg',
    Physics: 'Picture_by_MainFieldOfStudy_05_Physics.jpg',
    ' Industrial Management': 'Picture_by_MainFieldOfStudy_06_Industrial_Management.jpg',
    'Information Technology': 'Picture_by_MainFieldOfStudy_07_Information_Technology.jpg',
    'Information and Communication Technology': 'Picture_by_MainFieldOfStudy_08_Information_Communication',
    'Chemical Science and Engineering': 'Picture_by_MainFieldOfStudy_09_Chemical_Science.jpg',
    'Chemistry and Chemical Engineering': 'Picture_by_MainFieldOfStudy_10_Chemistry_Chemical.jpg',
    Mathematics: 'Picture_by_MainFieldOfStudy_11_Mathematics.jpg',
    'Environmental Engineering': 'Picture_by_MainFieldOfStudy_12_Environmental_Engineering.jpg.jpg',
    'Molecular Life Science': 'Picture_by_MainFieldOfStudy_13_Molecular_Life_Science.jpg',
    ' Mechanical Engineering': 'Picture_by_MainFieldOfStudy_14_Mechanical_Engineering.jpg',
    'Materials Science': 'Picture_by_MainFieldOfStudy_15_Materials_Science.jpg',
    'Medical Engineering': 'Picture_by_MainFieldOfStudy_16_Medical_Engineering.jpg',
    'Materials Science and Engineering': 'Picture_by_MainFieldOfStudy_17_Materials_Engineering.jpg',
    'Built Environment': 'Picture_by_MainFieldOfStudy_18_Built_Environment.jpg',
    'Engineering Physics': 'Picture_by_MainFieldOfStudy_19_Engineering_Physics.jpg',
    'Technology and Economics': 'Picture_by_MainFieldOfStudy_20_Technology_Economics.jpg',
    'Technology and Health': 'Picture_by_MainFieldOfStudy_21_Technology_Health.jpg',
    'Technology and Management': 'Picture_by_MainFieldOfStudy_22_Technology_Management.jpg',
    Technology: 'Picture_by_MainFieldOfStudy_23_Technology.jpg',
    'Engineering and Management': 'Picture_by_MainFieldOfStudy_24_Engineering_Management.jpg',
    'Technology and Learning': 'Picture_by_MainFieldOfStudy_25_Technology_Learning.jpg',
    default: 'Picture_by_MainFieldOfStudy_26_Default_picture.jpg'
  }
}
