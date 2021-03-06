module.exports = {
  shortNames: ['en'],
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

    error_not_found: "Sorry, we can't find your requested page",
    error_course_not_found: 'There is no course with this course code ',
    error_generic:
      'Something went wrong when loading this page. Please try again later. Contact IT support if the problem remains.',

    /**
     * Message keys
     */
    service_name: 'course',

    lang_block_id: '1.77273',
    locale_text: 'Course information in English',
    site_name: 'About course',
    host_name: 'KTH',
    page_student: 'Student at KTH',

    button_mobile_menu_label: 'Open/close the mobile menu',
    mobile_menu_aria_label: 'Mobile menu',

    skip_to_main_content: 'Skip to main content',
    back_to_top_label: 'To page top'
  },
  breadCrumbLabels: {
    breadcrumbs: 'Breadcrumbs',
    university: 'KTH',
    student: 'Student at KTH',
    directory: 'Course and programme directory',
    aboutCourse: 'About course',
    aboutCourseMemos: 'About course memo'
  },
  courseLabels: {
    label_course_description: 'Introduction to course',
    label_course_information: 'Course information, including syllabus',
    label_course_syllabus_source: 'Headings with content from the Course syllabus',
    label_course_syllabus_denoted: 'are denoted with an asterisk',
    label_syllabus_link: 'Course syllabus',
    label_syllabus_pdf_header: 'Course syllabus as PDF',
    label_syllabus_pdf_info:
      'Please note: all information from the Course syllabus is available on this page in an accessible format.',
    label_course_syllabus_valid_from: 'Valid from',
    label_course_syllabus_valid_to: 'to end of ',
    header_no_syllabus: 'Course syllabus and course offering missing',
    label_no_syllabus:
      'Course syllabus missing, showing available course information. Course offering also missing for current semester as well as for previous and coming semesters',
    label_syllabus_missing: 'Course syllabus missing',
    syllabus_marker_aria_label: 'Retrieved from course syllabus',
    label_programme_year: 'year ',
    label_postgraduate_course: 'Postgraduate courses at ',
    label_course_cancelled: 'This course has been cancelled.',
    label_last_exam: 'Last planned examination: ',
    label_edit: 'Administrate About course',
    header_no_rounds: 'Course offering missing',
    lable_no_rounds: ' Course offering missing for current semester as well as for previous and coming semesters',
    label_course_memo: 'Course memo',
    label_schedule: 'Schedule',
    label_statistics: 'Course statistics',
    lable_canavas_example: 'Canvas example course',
    label_round_select: {
      placeholder: 'Choose course offering',
      label_dropdown: 'Course offering'
    },
    label_semester_select: {
      placeholder: 'Choose semester',
      label_dropdown: 'Semester'
    },
    lable_round_state: {
      CANCELLED: 'This offering is cancelled',
      FULL: 'This offering is full'
    },
    header_dropdown_menu_navigation: 'Choose semester and course offering for page content',
    header_dropdown_menue: 'Valid for',
    header_dropdown_menu_aria_label: 'Information about choosing semester and course offering',
    header_course_info: 'Course information',
    header_content: 'Content and learning outcomes',
    header_execution: 'Literature and preparations',
    header_examination: 'Examination and completion',
    header_contact: 'Contact',
    header_statistics: 'Course statistics',
    header_syllabuses: 'Course syllabuses archive',
    header_further: 'Further information',
    header_select_course: 'Application',
    header_postgraduate_course: 'Postgraduate course ',
    no_schedule: 'No schedule',
    no_memo_connection: 'Course memo cannot be displayed',
    header_no_round_selected: 'Choose semester and course offering',
    no_round_selected:
      'Choose semester and course offering to see information from the correct course syllabus and course offering.',
    round_seats_default_info:
      'Course offering may be cancelled if number of admitted are less than minimum of places. If there are more applicants than number of places selection will be made.',
    round_seats_info: 'The selection results are based on:',
    syllabus_info:
      '<p>• A course goes different course offerings. To see information about a specific course offering, choose semester and course offering. The course syllabus information will be updated depending on the chosen semester. Information from the course syllabus is marked with *.</p><p>• Please note: regulations in course syllabus are rules that are generally applicable and binding for both employees and students.</p><p>• If you have not chosen semester and course offering, you will see course information from the current or future course syllabus. The valid period of the course syllabus is stated on the page.</p>',
    sideMenu: {
      aria_label: 'Sub menu',
      page_about_course: 'About course',
      page_before_course: 'Before choosing course',
      page_catalog: 'Course and programme directory',
      page_development: 'Course development',
      page_archive: 'Archive',
      page_memo: 'Prepare and take course'
    },
    label_close: 'Close'
  },
  courseInformation: {
    course_title: 'Title english',
    course_other_title: 'Title swedish',
    course_code: 'Course code',
    course_credits: 'Credits',
    course_grade_scale: 'Grading scale',
    course_goals: 'Intended learning outcomes',
    course_content: 'Course contents',
    course_disposition: 'Course disposition',
    course_eligibility: 'Specific prerequisites',
    course_requirments_for_final_grade: 'Other requirements for final grade',
    course_literature: 'Literature',
    course_literature_comment: 'Literature comment',
    course_examination_comments: 'Examination comment',
    course_examination: 'Examination',
    course_examination_disclaimer:
      '<p>If the course is discontinued, students may request to be examined during the following two academic years.</p>',
    course_valid_from: 'Valid from',
    course_main_subject: 'Main field of study',
    course_language: 'Language of instruction',
    course_required_equipment: 'Equipment',
    course_level_code: 'Education cycle',
    course_establishment: 'Fastställande',
    course_decision_to_discontinue: 'Avvecklingsbeslut',
    course_transitional_reg: 'Transitional regulations',
    course_additional_regulations: 'Additional regulations',
    course_ethical: 'Ethical approach',
    course_spossibility_to_completions: 'Opportunity to complete the requirements via supplementary examination',
    course_possibility_to_addition: 'Opportunity to raise an approved grade via renewed examination',
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
    course_application_info: 'Information for research students about course offerings',
    course_link: 'Course web',
    course_link_text:
      '<p>Further information about the course can be found on the Course web at the link below. Information on the Course web will later be moved to this site. </p>'
  },
  courseRoundInformation: {
    header_round: 'About course offering',
    round_information_aria_label: 'Information about course offering',
    round_header: 'For course offering',
    round_application_code: 'Application code',
    round_max_seats: 'Number of places',
    round_no_seats_limit: 'Places are not limited',
    round_part_of_programme: 'Part of programme',
    round_responsibles: 'Course coordinator',
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
    round_time_slots: 'Planned modular schedule',
    round_application_link: 'Go to the registration',
    round_category: {
      PU: 'programme students',
      VU: 'single courses students',
      pu_and_vu: 'programme and single courses students'
    }
  },
  courseMainSubjects: {
    Architecture: 'Arkitektur',
    Biotechnology: 'Bioteknik',
    'Computer Science and Engineering': 'Datalogi och datateknik',
    'Electrical Engineering': 'Elektroteknik',
    Physics: 'Fysik',
    'Industrial Management': 'Industriell ekonomi',
    'Information Technology': 'Informationsteknik',
    'Information and Communication Technology': 'Informations- och kommunikationsteknik',
    'Chemical Science and Engineering': 'Kemiteknik',
    'Chemistry and Chemical Engineering': 'Kemi och kemiteknik',
    Mathematics: 'Matematik',
    'Environmental Engineering': 'Miljöteknik',
    'Molecular Life Science': 'Molekylära livsvetenskaper',
    'Mechanical Engineering': 'Maskinteknik',
    'Materials Science': 'Materialvetenskap',
    'Medical Engineering': 'Medicinsk teknik',
    'Materials Science and Engineering': 'Materialteknik',
    'Built Environment': 'Samhällsbyggnad',
    'Engineering Physics': 'Teknisk fysik',
    'Technology and Economics': 'Teknik och ekonomi',
    'Technology and Health': 'Teknik och hälsa',
    'Technology and Management': 'Teknik och management',
    Technology: 'Teknik',
    'Engineering and Management': 'Teknik och management',
    'Technology and Learning': 'Teknik och lärande',
    default: 'default'
  },
  courseImage: {
    Architecture: 'Picture_by_MainFieldOfStudy_01_Architecture.jpg',
    Biotechnology: 'Picture_by_MainFieldOfStudy_02_Biotechnology.jpg',
    'Computer Science and Engineering': 'Picture_by_MainFieldOfStudy_03_Computer_Science.jpg',
    'Electrical Engineering': 'Picture_by_MainFieldOfStudy_04_Electrical_Engineering.jpg',
    Physics: 'Picture_by_MainFieldOfStudy_05_Physics.jpg',
    'Industrial Management': 'Picture_by_MainFieldOfStudy_06_Industrial_Management.jpg',
    'Information Technology': 'Picture_by_MainFieldOfStudy_07_Information_Technology.jpg',
    'Information and Communication Technology': 'Picture_by_MainFieldOfStudy_08_Information_Communication.jpg',
    'Chemical Science and Engineering': 'Picture_by_MainFieldOfStudy_09_Chemical_Science.jpg',
    'Chemistry and Chemical Engineering': 'Picture_by_MainFieldOfStudy_10_Chemistry_Chemical.jpg',
    Mathematics: 'Picture_by_MainFieldOfStudy_11_Mathematics.jpg',
    'Environmental Engineering': 'Picture_by_MainFieldOfStudy_12_Environmental_Engineering.jpg',
    'Molecular Life Science': 'Picture_by_MainFieldOfStudy_13_Molecular_Life_Science.jpg',
    'Mechanical Engineering': 'Picture_by_MainFieldOfStudy_14_Mechanical_Engineering.jpg',
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
  },
  course_state_alert: {
    DEACTIVATED: {
      header: 'This course will be discontinued.',
      examination: 'Last planned examination: ',
      decision: 'Decision to discontinue this course: '
    },
    CANCELLED: {
      header: 'This course has been discontinued.',
      examination: 'Last planned examination: ',
      decision: 'Decision to discontinue this course: '
    }
  }
}
