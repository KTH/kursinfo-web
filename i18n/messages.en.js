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
    page_student:'STUDENT AT KTH',
    page_course_programme: 'COURSE AND PROGRAMME DIRECTORY'
  },
  courseLabels: {
    label_course_syllabus: 'Course Syllabus',
    label_course_syllabus_valid_from: 'Valid from',
    label_course_syllabus_valid_to:  'to end of ',
    label_no_syllabus: 'This course has no syllabus',
    label_programme_year: 'year ',
    label_postgraduate_course: 'Postgraduate courses at ',
    label_course_cancelled: 'This course has been cancelled.',
    label_last_exam: 'Last planned examination: ',
    label_course_web_link: 'Course web',
    label_edit:'Edit',
    lable_no_rounds: ' No rounds for this course',
    label_course_pm: "Course memo",
    label_schedule: 'Schedule',
    label_statistics: 'Course statistics',
    lable_canavas_example: 'Canvas example course',
    lable_round_dropdown: 'Select round for ',
    lable_round_state:{
      CANCELLED: 'This round is cancelled',
      FULL: 'This round is full'
    },
    header_semester_menue: 'Select semester',
    header_course_info: 'Course information',
    header_content: 'Content and outcome',
    header_execution: 'Literature and execution',
    header_examination: 'Examination and fulfillment',
    header_contact: 'Contact',
    header_statistics: 'Course statistics',
    header_syllabuses: 'Course Syllabuses',
    header_further: 'Further information',
    header_round: 'Rounds and implementation',
    header_select_course: 'Application',
    header_postgraduate_course: 'Postgraduate course ',
    empty_text: "No information added",
    no_schedule: "No schedule ",
    no_memo: "No memo ",
    header_no_round_selected: 'No round selected',
    no_round_selected: 'Please select a round abow to see round information',
    round_seats_info:'The Course date may be cancelled if number of admitted are less than minimum of places. If there are more applicants than number of places selection will be made.'
  },
  courseInformation: {
    course_title:'Title english',
    course_other_title:'Title swedish',
    course_code:'Course code',
    course_credits:'Credits',
    course_grade_scale:'Grading scale',
    course_goals:'Intended learning outcomes',
    course_content:'Course main content',
    course_disposition:'Disposition',
    course_eligibility:'Eligibility',
    course_requirments_for_final_grade:'Requirements for final grade',
    course_literature:'Literature',
    course_literature_comment: 'Literature comment',
    course_examination_comments:'Examination comment',
    course_examination:'Examination',
    course_valid_from:'Valid from',
    course_main_subject:'Main field of study',
    course_language:'Language of instruction',
    course_required_equipment:'Required equipment',
    course_level_code:'Education cycle',
    course_short_semester:{
      1:'Spring ',
      2:'Autumn '
    },
    course_level_code_label: {
      PREPARATORY: 'Pre-university level',
      BASIC: 'First cycle',
      ADVANCED: 'Second cycle',
      RESEARCH: 'Third cycle'
    },
    course_department:'Offered by',
    course_contact_name:'Contact ',
    course_suggested_addon_studies:'Recommended prerequisites',
    course_supplemental_information_url:'Supplementary information link',
    course_supplemental_information_url_text:'Supplementary information link text',
    course_supplemental_information:'Supplementary information ',
    course_examiners:'Examiner',
    course_recruitment_text:'Abstract'
  },
  courseRoundInformation:{
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
    round_course_place: 'Course place',
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
    round_application_link: 'Application link'
  }
}
