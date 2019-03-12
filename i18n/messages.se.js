module.exports = {
  shortNames: [ 'sv', 'se' ],
  longNameSe: 'Svenska',
  longNameEn: 'Swedish',
  messages: {
    /**
     * General stuff
     */
    date_format_short: '%Y-%m-%d',

    /**
     * Error messages
     */

    error_not_found: 'Tyvärr kunde vi inte hitta sidan du efterfrågade',
    error_course_not_found: 'Tyvärr så finns det ingen kurs med kurskod ',
    error_generic: 'Något gick fel på servern, var god försök igen senare',

    /**
     * Message keys
     */
    service_name: 'kurs ',

    example_message_key: 'Här är en svensk översättning på en label',

    button_label_example: 'Klicka här för att skicka data till servern!',

    field_text_example: 'Data att skicka till API',

    field_label_get_example: 'Min datamodell(Svar från api anrop GET): ',
    field_label_post_example: 'Min datamodell(Svar från api anrop POST): ',

    lang_block_id: '1.272446',
    locale_text: 'Kursinformation på svenska',

    site_name: 'Kursinformation',
    host_name: 'KTH',
    page_student:'STUDENT PÅ KTH',
    page_course_programme: 'KURS- OCH PROGRAMKATALOGEN'
    
  },
  courseLabels: {
    label_course_syllabus: 'Kursplan',
    label_course_syllabus_valid_from:  'Gäller från och med',
    label_course_syllabus_valid_to:  'till slutet av ',
    label_no_syllabus: 'Kursen saknar kursplan',
    label_programme_year: 'Åk  ',
    label_postgraduate_course: 'Forskarkurser på ',
    label_course_cancelled: 'Detta är en nedlagd kurs.',
    label_last_exam: 'Sista planerade examination: ',
    label_course_web_link: 'Kurswebb',
    label_edit:'Redigera',
    label_course_pm: "Kurs - PM",
    lable_no_rounds: 'Kursen har inga kurstillfällen',
    label_schedule: 'Schema',
    label_statistics: 'Kursutveckling',
    lable_canavas_example: 'Canvas exempelkurs',
    lable_round_dropdown: 'Välj kurstillfälle för',

    lable_round_state:{
      CANCELLED: 'Kurstillfälle inställt',
      FULL: 'Kurstillfälle fullsatt'
    },
    header_semester_menue: 'Välj en termin',
    header_course_info: 'Kursinformation',
    header_content: 'Kursens huvudsakliga innehåll',
    header_execution: 'Kurslitteratur och förberedelser',
    header_statistics: 'Kursutveckling',
    header_syllabuses: 'Kursplaner',
    header_examination: 'Examination och slutförande',
    header_contact: 'Kontakt',
    header_further: 'Ytterligare information',
    header_round: 'Kurstillfälle och genomförande',
    header_select_course: 'Kursval',
    header_postgraduate_course: 'Forskarkurs ',
    empty_text: "Ingen information inlagd"  ,
    no_schedule: "Schema saknas",
    no_memo: "Kurs-PM saknas ",
    header_no_round_selected: 'Inget kurstillfälle är valt',
    no_round_selected: 'Välj kurstillfälle ovan för att se information om kurstillfälle',
    round_seats_info:'Kurstillfället kan komma att ställas in om antalet antagna understiger minimiantalet platser. Vid fler sökande än platser kommer urval att ske.'
  },
  courseInformation:{
    roundId:'Kursomgångs nr',
    course_title:'Benämning svenska',
    course_other_title:'Benämning engelska',
    course_code:'Kurskod',
    course_credits:'Högskolepoäng',
    course_grade_scale:'Betygsskala',
    course_goals:'Lärandemål',
    course_content:'Kursens huvudsakliga innehåll',
    course_disposition:'Kursupplägg',
    course_eligibility:'Behörighet',
    course_requirments_for_final_grade:'Krav för slutbetyg',
    course_literature:'Kurslitteratur',
    course_literature_comment:'Kommentar till kurslitteratur',
    course_examination_comments:'Kommentar till examinationsmoment',
    course_examination:'Examination',
    course_valid_from:'Giltig från',
    course_main_subject:'Huvudområden',
    course_language:'Undervisningsspråk',
    course_required_equipment:'Utrustningskrav',
    course_level_code:'Utbildningsnivå',
    course_short_semester:{
      1:'VT ',
      2:'HT '
    },
    course_level_code_label: {
      PREPARATORY: 'Förberedande nivå',
      BASIC: 'Grundnivå',
      ADVANCED: 'Avancerad nivå',
      RESEARCH: 'Forskarnivå'
    },
    course_department:'Ges av',
    course_contact_name:'Kontaktperson',
    course_suggested_addon_studies:'Rekommenderade förkunskaper',
    course_supplemental_information_url:'Övrig information - länk',
    course_supplemental_information_url_text:'Övrig information - länk text',
    course_supplemental_information:'Övrig information',
    course_examiners:'Examinator',
    course_recruitment_text:'Kort beskrivning svenska'

  },
  courseRoundInformation: {
    round_application_code: 'Anmälningskod',
    round_max_seats: 'Antal platser',
    round_part_of_programme: 'Del av program',
    round_responsibles: 'Kursansvarig',
    round_end_date: 'Kursen slutar',
    round_start_date: 'Varaktighet',
    round_teacher: 'Lärare',
    round_target_group: 'Målgrupp',
    round_short_name: 'Namn - kort ',
    round_periods: 'Perioder',
    round_schedule: 'Schema',
    round_course_term: 'Start termin',
    round_course_place: 'Studielokalisering',
    round_tutoring_form: 'Undervisningsform',
    round_tutoring_form_label: {
      NML: 'Normal',
      DST: 'Distans',
      ITD: 'IT-baserad distans'
    },
    round_tutoring_language: 'Undervisningsspråk',
    round_campus: 'Skola',
    round_tutoring_time: 'Undervisningstid',
    round_tutoring_time_label: {
      DAG: 'Dagtid',
      KVA: 'Kvällstid',
      KVÄ: 'Kvällstid',
      VSL: 'Veckoslut'
    },
    round_application_link: 'Anmälningslänk',
    round_type: 'Typ av kurstillfälle',
    round_time_slots: 'Planerade moduler'
  }

}
