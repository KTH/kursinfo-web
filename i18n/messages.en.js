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
    back_to_top_label: 'To page top',

    language_link_lang_sv: 'Svenska',
    menu_panel_search: 'Search',
    menu_panel_close: 'Close',
    menu_panel_menu: 'Menu',
  },
  showMoreContent: {
    show: 'Show more',
    hide: 'Hide',
  },
  bankIdAlertText: `Please note that <a href="https://www.kth.se/en/studies/freestanding-courses/applying-to-a-course-if-you-are-not-in-sweden-1.1275545" class="external-link" target="_blank" rel="noopener noreferrer">Students not located in Sweden may have problems attending a course at KTH.</a> <br/> You could meet obstacles if you're required to pay fees or if you do not have a Swedish Mobile BankID. `,
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
    syllabus_marker_aria_label: 'Retrieved from course syllabus',
    label_programme_year: 'year ',
    label_postgraduate_course: 'Postgraduate courses at ',
    label_course_cancelled: 'This course has been cancelled.',
    label_last_exam: 'Last planned examination: ',
    label_edit: 'Administer About course',
    lable_no_rounds: 'Course offerings are missing for current or upcoming semesters.',
    label_course_memo: 'Course memo',
    label_link_course_memo: 'Link to course memo',
    label_schedule: 'Schedule',
    label_link_schedule: 'Link to schedule',
    label_statistics: 'Course statistics',
    lable_canavas_example: 'Canvas example course',
    label_round_select: {
      placeholder: 'Choose course offering',
      label_dropdown: 'Course offering',
    },
    label_semester_select: {
      placeholder: 'Choose semester',
      label_dropdown: 'Semester',
    },
    lable_round_state: {
      CANCELLED: 'This offering is cancelled',
      FULL: 'This offering is full',
    },
    header_dropdown_menu_navigation:
      'Choose semester and course offering to see current information and more about the course, such as course syllabus, study period, and application information.',
    header_dropdown_menu: 'Information per course offering',
    header_dropdown_menu_aria_label: 'Information about choosing semester and course offering',
    header_course_info: 'Course information',
    header_content: 'Content and learning outcomes',
    header_execution: 'Literature and preparations',
    header_examination: 'Examination and completion',
    header_contact: 'Contact',
    header_statistics: 'Course statistics',
    header_syllabuses: 'Course syllabuses archive',
    header_further: 'Further information',
    header_postgraduate_course: 'Postgraduate course ',
    no_schedule: 'No schedule',
    no_schedule_published: 'Schedule is not published',
    no_memo_published: 'Course memo is not published',
    no_memo_connection: 'Course memo cannot be displayed',
    round_seats_default_info:
      'Course offering may be cancelled if number of admitted are less than minimum of places. If there are more applicants than number of places selection will be made.',
    round_seats_info: 'The selection results are based on:',
    syllabus_info:
      '<p>• A course goes different course offerings. To see information about a specific course offering, choose semester and course offering. The course syllabus information will be updated depending on the chosen semester. Information from the course syllabus is marked with *.</p><p>• Please note: regulations in course syllabus are rules that are generally applicable and binding for both employees and students.</p><p>• If you have not chosen semester and course offering, you will see course information from the current or future course syllabus. The valid period of the course syllabus is stated on the page.</p>',
    sideMenu: {
      aria_label: 'Sub menu',
      page_about_course: 'About course',
      page_before_course: 'Before course selection',
      page_catalog: 'Course and programme directory',
      page_development: 'Course development',
      page_archive: 'Archive',
      page_memo: 'Prepare and take course',
    },
    label_close: 'Close',
    study_period_info:
      '<p>You can find information about how <a href="https://intra.kth.se/en/utbildning/tentamen-och-schema/lasarsindelning/lasarsindelning-1.1201135" class="external-link" target="_blank" rel="noopener noreferrer">The academic year is divided into study periods</a> on the intranet.</p>',
    study_year_info:
      '<p>Select the year in which the course offering ends. Please note that if you in the next step “Semester” choose autumn, you will also see courses that end in January the coming year. This is because the autumn semester ends in week 2.</p><p>You can find information about how <a href="https://intra.kth.se/en/utbildning/tentamen-och-schema/lasarsindelning/lasarsindelning-1.1201135" class="external-link" target="_blank" rel="noopener noreferrer">The academic year is divided into study periods</a> on the intranet.</p>',
  },
  courseInformation: {
    course_additional_regulations: 'Additional regulations',
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
    course_decision_to_discontinue: 'Avvecklingsbeslut',
    course_transitional_reg: 'Transitional regulations',
    course_ethical: 'Ethical approach',
    course_possibility_to_completions: 'Opportunity to complete the requirements via supplementary examination',
    course_possibility_to_addition: 'Opportunity to raise an approved grade via renewed examination',
    course_short_semester: {
      1: 'Spring ',
      2: 'Autumn ',
    },
    course_level_code_label: {
      PREPARATORY: 'Pre-university level',
      BASIC: 'First cycle',
      ADVANCED: 'Second cycle',
      RESEARCH: 'Third cycle',
    },
    course_department: 'Offered by',
    course_contact_name: 'Contact ',
    course_prerequisites: 'Recommended prerequisites',
    course_prerequisites_description:
      'Describes the knowledge and skills (in addition to the eligibility requirements) that you need to be able to take the course.',
    course_prerequisites_menu_aria_label: 'Information about recommended prerequisites',
    course_suggested_addon_studies: 'Add-on studies',
    course_supplemental_information_url: 'Supplementary information link',
    course_supplemental_information_url_text: 'Supplementary information link text',
    course_supplemental_information: 'Supplementary information ',
    course_examiners: 'Examiner',
    course_recruitment_text: 'Abstract',
    course_room_canvas: 'Course room in Canvas',
    course_room_canvas_info:
      'Registered students find further information about the implementation of the course in the course room in Canvas. A link to the course room can be found under the tab Studies in the Personal menu at the start of the course.',
    course_application_info: 'Information for research students about course offerings',
  },
  courseRoundInformation: {
    round_header: 'Information for',
    round_application_code: 'Application code',
    round_max_seats: 'Number of places',
    round_no_seats_limit: 'Places are not limited',
    round_part_of_programme: 'Part of programme',
    round_responsibles: 'Course coordinator',
    round_end_date: 'End date',
    round_start_date: 'Duration',
    round_pace_of_study: 'Pace of study',
    round_teacher: 'Teachers',
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
      ITD: 'IT based distance',
    },
    round_tutoring_language: 'Language of instruction',
    round_campus: 'Campus',
    round_tutoring_time: 'Tutoring time',
    round_tutoring_time_label: {
      DAG: 'Daytime',
      KVA: 'Evenings',
      KVÄ: 'Evenings',
      VSL: 'Weekends',
    },
    round_time_slots: 'Planned modular schedule',
    round_application_link: 'Go to the registration',
    round_category: {
      PU: 'programme students',
      VU: 'single courses students',
      pu_and_vu: 'programme and single courses students',
    },
    round_type: {
      ORD: 'programme students',
      UPP: 'contract education',
      PER: 'course for KTH staff',
      SAP: 'Study Abroad Programme',
    },
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
    default: 'default',
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
    default: 'Picture_by_MainFieldOfStudy_26_Default_picture.jpg',
  },
  course_state_alert: {
    DEACTIVATED: {
      header: 'This course will be discontinued.',
      examination: 'Last planned examination: ',
      decision: 'Decision to discontinue this course: ',
    },
    CANCELLED: {
      header: 'This course has been discontinued.',
      examination: 'Last planned examination: ',
      decision: 'Decision to discontinue this course: ',
    },
  },
  statisticsLabels: {
    allSchools: 'All schools',
    chartsLabels: {
      headerMemo: 'Percentage of courses that have published course memos',
      headerAnalysis: 'Percentage of courses (ending the chosen semester) that have a published course analysis',
      headerYearAgo: 'Compare with the result for the selected study period from the previous year',
      numberOfUniqAnalyses: 'During the semester (s)',
      numberOfUniqWebAndPdfMemos: 'Under study period(s)',
      numberOfMemosPublishedBeforeStart: 'Before course start',
      numberOfMemosPublishedBeforeDeadline: 'One week before course start',
    },
    courseAnalysis: 'Course analysis',
    courseMemo: 'Course memo',
    btnShowResults: 'Show statistics',
    errorUnknown: { text: 'An unknown error occurred - failed to retrieve course data.' },
    formLabels: {
      and: 'and',
      formHeader: 'View statistics',
      formSubHeaders: {
        documentType: 'Area',
        periods: 'Study period',
        school: 'School',
        seasons: 'Semester',
        year: 'Year',
      },
      formShortIntro: {
        documentType: 'Select the area you would like to see statistics for  ',
        periods: 'Choose one or more option(s)',
        school: 'Select school',
        seasons: 'Choose one or more option(s)',
        year: 'Select year',
      },
      missingParameters: { text: extra => `You have to select a ${extra} to view statistics.` },
    },
    pageHeader: 'The statistics page for course information',
    period: 'Period',
    searchLoading: 'Loading data, please wait...',
    seasonAutumn: 'Autumn',
    seasonSpring: 'Spring',
    seasonSummer: 'Summer',
    exportLabels: {
      excel: 'Download table as Excel file',
      csv: 'Download table as CSV file',
    },
    sortableTable: {
      search_placeholder: 'Search',
      search_label: 'Search in the table',
      semester: {
        0: 'Summer',
        1: 'Spring',
        2: 'Autumn',
      },
      courseAnalysis: {
        header: 'Table of courses and course analyses',
        details:
          'Here it is possible to see a table with data for all course offerings for the selected school and semester. It is possible to sort the information in the table columns. It is also possible to download the table as an Excel or CSV file to do your own filtering and sorting of the data.',
        sourceOfData: 'See table with data for course analysis',
      },
      courseMemo: {
        header: 'Table of courses and course memos',
        details:
          'Here it is possible to see a table with data for all course offerings for the selected school and study period. It is possible to sort the information in the table columns. It is also possible to download the table as an Excel or CSV file to do your own filtering and sorting of the data.',
        sourceOfData: 'See table with data for course memos',
      },
      rowsPerPageText: 'Number of rows per page:',
      rangeSeparatorText: 'of',
      noDataMessage: 'No statistics data found!',
      moreColumnsNote:
        'Please note that there are ten columns in the table. Scroll horizontally in the table to see them all.',
      statisticsDataColumns: {
        year: 'Year',
        school: 'School',
        institution: 'Department',
        courseCode: 'Course code',
        linkedProgram: 'Connected program(s)',
        applicationCode: 'Instance code',
        period: 'Study period',
        courseStart: 'Course start',
        publishDate: 'Publishing date',
        linkToCoursePM: 'Link to course memo',
        term: 'Semester',
        courseEndDate: 'Offering end date',
        linkToCourseAnalysis: 'Link to course analysis',
      },
    },
    summaryLabels: {
      sourceOfData: 'Read about the API:s and the source of data',
      subHeaders: {
        courseMemo: 'Compilation of the number of published course memos',
        courseAnalysis: 'Compilation of the number of published course analyses',
      },
      memosNumbersTable: {
        school: 'School',
        totalCourses: 'Number of courses',
        totalPublishedMemos: 'Total number of published course memos',
        totalPublWebMemos: 'Memos as website',
        totalPublPdfMemos: 'Memos as PDF',
        totalMemosPublishedBeforeCourseStart: 'Memos published latest at course start',
        totalMemosPublishedBeforeDeadline: 'Memos published one week before course start',
      },
      analysesNumbersTable: {
        school: 'School',
        totalCourses: 'Number of courses ending the chosen semesters',
        totalUniqPublishedAnalyses:
          'Number of published course analyses for course offerings ending the chosen semester',
      },
    },
    earlierYearThan2019: { text: 'There is no data earlier than 2019' },
  },
  breadCrumbs: {
    student: 'Student web',
    studies: 'Studies',
    directory: 'Course and programme directory',
  },
}
