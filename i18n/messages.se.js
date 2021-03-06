module.exports = {
  shortNames: ['sv', 'se'],
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
    error_course_not_found: 'Det finns ingen kurs med angiven kurskod ',
    error_generic:
      'Något gick fel vid hämtning av sidan. Försök igen senare. Kontakta IT-support om problemet kvarstår.',

    /**
     * Message keys
     */
    service_name: 'kurs ',

    lang_block_id: '1.272446',
    locale_text: 'Kursinformation på svenska',

    site_name: 'Om kursen',
    host_name: 'KTH',
    page_student: 'Student på KTH',

    button_mobile_menu_label: 'Öppna/stäng mobilmenyn',
    mobile_menu_aria_label: 'Mobilemeny',

    skip_to_main_content: 'Hoppa till huvudinnehållet',
    back_to_top_label: 'Till sidans topp'
  },
  breadCrumbLabels: {
    breadcrumbs: 'Brödsmulor',
    university: 'KTH',
    student: 'Student på KTH',
    directory: 'Kurs- och programkatalogen',
    aboutCourse: 'Om kursen',
    aboutCourseMemos: 'Om kurs-PM'
  },
  courseLabels: {
    label_course_description: 'Introducerande beskrivning av kursen',
    label_course_information: 'Kursinformation inklusive kursplan',
    label_course_syllabus_source: 'Rubriker med innehåll från kursplan',
    label_course_syllabus_denoted: 'är markerade med en asterisk',
    label_syllabus_link: 'Kursplan',
    label_syllabus_pdf_header: 'Kursplan som PDF',
    label_syllabus_pdf_info: 'Notera: all information från kursplanen visas i tillgängligt format på denna sida.',
    label_course_syllabus_valid_from: 'Gäller från och med',
    label_course_syllabus_valid_to: 'till slutet av ',
    header_no_syllabus: 'Kursplan och kursomgångar saknas',
    label_no_syllabus:
      'Kursplan saknas, kursinformationen som visas är övrig kursinformation. Även kursomgångar saknas för tidigare och kommande terminer, samt innevarande termin.',
    label_syllabus_missing: 'Kursplan saknas',
    syllabus_marker_aria_label: 'Informationen tillhör kursplan',
    label_programme_year: 'Åk  ',
    label_postgraduate_course: 'Forskarkurser på ',
    label_course_cancelled: 'Detta är en nedlagd kurs.',
    label_last_exam: 'Sista planerade examination: ',
    label_edit: 'Administrera Om kursen',
    label_course_memo: 'Kurs-pm',
    header_no_rounds: 'Kursomgångar saknas',
    lable_no_rounds: 'Kursomgångar saknas för tidigare och kommande terminer, samt för innevarande termin.',
    label_schedule: 'Schema',
    label_statistics: 'Kursutveckling',
    lable_canavas_example: 'Canvas exempelkurs',
    label_round_select: {
      placeholder: 'Välj kursomgång',
      label_dropdown: 'Kursomgång'
    },
    label_semester_select: {
      placeholder: 'Välj termin',
      label_dropdown: 'Termin'
    },

    lable_round_state: {
      CANCELLED: 'Kursomgång inställd',
      FULL: 'Kursomgång fullsatt'
    },
    header_dropdown_menu_navigation: 'Välj termin och kursomgång för innehållet på sidan',
    header_dropdown_menue: 'Gäller för',
    header_dropdown_menu_aria_label: 'Information om val av termin och kursomgång',
    header_course_info: 'Kursinformation',
    header_content: 'Innehåll och lärandemål',
    header_execution: 'Kurslitteratur och förberedelser',
    header_statistics: 'Kursutveckling',
    header_syllabuses: 'Kursplaner historik',
    header_examination: 'Examination och slutförande',
    header_contact: 'Kontakt',
    header_further: 'Ytterligare information',
    header_select_course: 'Kursval',
    header_postgraduate_course: 'Forskarkurs ',
    no_schedule: 'Schema saknas',
    no_memo_connection: 'Kurs-pm kan inte visas',
    header_no_round_selected: 'Välj termin och kursomgång',
    no_round_selected: 'Välj termin och kursomgång för att se information från rätt kursplan och kursomgång.',
    round_seats_default_info:
      'Kursomgången kan komma att ställas in om antalet antagna understiger minimiantalet platser. Vid fler sökande än platser kommer urval att ske.',
    round_seats_info: 'Urvalet sker baserat på:',
    syllabus_info:
      '<p>• En kurs undervisas i olika kursomgångar. För att se information om en specifik kursomgång behöver du välja termin och kursomgång. Information från kursplan kommer att uppdateras beroende på vald termin. Information från kursplan är markerad med *.</p><p>• Observera: bestämmelser i kursplaner är regler som är generellt tillämpbara och bindande för såväl anställda som studenter.</p><p>• Har du inte valt termin och kursomgång ser du kursinformation från nuvarande eller kommande kursplan. På sidan anges den period som information från kursplan gäller för.</p>',
    sideMenu: {
      aria_label: 'Undermeny',
      page_about_course: 'Om kursen ',
      page_before_course: 'Inför kursval',
      page_catalog: 'Kurs- och programkatalogen',
      page_development: 'Kursens utveckling',
      page_archive: 'Arkiv',
      page_memo: 'Förbereda och gå kurs'
    },
    label_close: 'Stäng'
  },
  courseInformation: {
    roundId: 'Kursomgångs nr',
    course_title: 'Benämning svenska',
    course_other_title: 'Benämning engelska',
    course_code: 'Kurskod',
    course_credits: 'Högskolepoäng',
    course_grade_scale: 'Betygsskala',
    course_goals: 'Lärandemål',
    course_content: 'Kursinnehåll',
    course_disposition: 'Kursupplägg',
    course_eligibility: 'Särskild behörighet',
    course_requirments_for_final_grade: 'Övriga krav för slutbetyg',
    course_literature: 'Kurslitteratur',
    course_literature_comment: 'Kommentar till kurslitteratur',
    course_examination_comments: 'Kommentar till examinationsmoment',
    course_examination: 'Examination',
    course_examination_disclaimer:
      '<p>När kurs inte längre ges har student möjlighet att examineras under ytterligare två läsår.</p>',
    course_valid_from: 'Giltig från',
    course_main_subject: 'Huvudområde',
    course_language: 'Undervisningsspråk',
    course_required_equipment: 'Utrustning',
    course_level_code: 'Utbildningsnivå',
    course_establishment: 'Fastställande',
    course_decision_to_discontinue: 'Avvecklingsbeslut',
    course_transitional_reg: 'Övergångsbestämmelser',
    course_additional_regulations: 'Övriga föreskrifter',
    course_ethical: 'Etiskt förhållningssätt',
    course_spossibility_to_completions: 'Möjlighet till komplettering',
    course_possibility_to_addition: 'Möjlighet till plussning',
    course_short_semester: {
      1: 'VT ',
      2: 'HT '
    },
    course_level_code_label: {
      PREPARATORY: 'Förberedande nivå',
      BASIC: 'Grundnivå',
      ADVANCED: 'Avancerad nivå',
      RESEARCH: 'Forskarnivå'
    },
    course_department: 'Ges av',
    course_contact_name: 'Kontaktperson',
    course_prerequisites: 'Rekommenderade förkunskaper',
    course_suggested_addon_studies: 'Påbyggnad',
    course_supplemental_information_url: 'Övrig information - länk',
    course_supplemental_information_url_text: 'Övrig information - länk text',
    course_supplemental_information: 'Övrig information',
    course_examiners: 'Examinator',
    course_recruitment_text: 'Kort beskrivning svenska',
    course_application_info: 'Information för forskarstuderande om när kursen ges',
    course_link: 'Kurswebb',
    course_link_text:
      '<p>Ytterligare information om kursen kan hittas på kurswebben via länken nedan. Information på kurswebben kommer framöver flyttas till denna sida. </p>'
  },
  courseRoundInformation: {
    header_round: 'Om kursomgång',
    round_information_aria_label: 'Information för kursomgång',
    round_header: 'Gäller för kursomgång',
    round_application_code: 'Anmälningskod',
    round_max_seats: 'Antal platser',
    round_no_seats_limit: 'Ingen platsbegränsning',
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
    round_time_slots: 'Planerade schemamoduler',
    round_application_link: 'Till anmälan',
    round_category: {
      PU: 'programstuderande',
      VU: 'fristående studerande',
      pu_and_vu: 'programstuderande och fristående studerande'
    }
  },
  courseImage: {
    Arkitektur: 'Picture_by_MainFieldOfStudy_01_Architecture.jpg',
    Bioteknik: 'Picture_by_MainFieldOfStudy_02_Biotechnology.jpg',
    'Datalogi och datateknik': 'Picture_by_MainFieldOfStudy_03_Computer_Science.jpg',
    Elektroteknik: 'Picture_by_MainFieldOfStudy_04_Electrical_Engineering.jpg',
    Fysik: 'Picture_by_MainFieldOfStudy_05_Physics.jpg',
    'Industriell ekonomi': 'Picture_by_MainFieldOfStudy_06_Industrial_Management.jpg',
    Informationsteknik: 'Picture_by_MainFieldOfStudy_07_Information_Technology.jpg',
    'Informations- och kommunikationsteknik': 'Picture_by_MainFieldOfStudy_08_Information_Communication.jpg',
    Kemiteknik: 'Picture_by_MainFieldOfStudy_09_Chemical_Science.jpg',
    'Kemi och kemiteknik': 'Picture_by_MainFieldOfStudy_10_Chemistry_Chemical.jpg',
    Matematik: 'Picture_by_MainFieldOfStudy_11_Mathematics.jpg',
    Miljöteknik: 'Picture_by_MainFieldOfStudy_12_Environmental_Engineering.jpg',
    'Molekylära livsvetenskaper': 'Picture_by_MainFieldOfStudy_13_Molecular_Life_Science.jpg',
    Maskinteknik: 'Picture_by_MainFieldOfStudy_14_Mechanical_Engineering.jpg',
    Materialvetenskap: 'Picture_by_MainFieldOfStudy_15_Materials_Science.jpg',
    'Medicinsk teknik': 'Picture_by_MainFieldOfStudy_16_Medical_Engineering.jpg',
    Materialteknik: 'Picture_by_MainFieldOfStudy_17_Materials_Engineering.jpg',
    Samhällsbyggnad: 'Picture_by_MainFieldOfStudy_18_Built_Environment.jpg',
    'Teknisk fysik': 'Picture_by_MainFieldOfStudy_19_Engineering_Physics.jpg',
    'Teknik och ekonomi': 'Picture_by_MainFieldOfStudy_20_Technology_Economics.jpg',
    'Teknik och hälsa': 'Picture_by_MainFieldOfStudy_21_Technology_Health.jpg',
    'Teknik och management': 'Picture_by_MainFieldOfStudy_22_Technology_Management.jpg',
    Teknik: 'Picture_by_MainFieldOfStudy_23_Technology.jpg',
    'Teknik och lärande': 'Picture_by_MainFieldOfStudy_25_Technology_Learning.jpg',
    default: 'Picture_by_MainFieldOfStudy_26_Default_picture.jpg'
  },
  course_state_alert: {
    DEACTIVATED: {
      header: 'Denna kurs är under avveckling.',
      examination: 'Sista planerade examination: ',
      decision: 'Avvecklingsbeslut: '
    },
    CANCELLED: {
      header: 'Denna kurs är avvecklad.',
      examination: 'Sista planerade examination: ',
      decision: 'Avvecklingsbeslut: '
    }
  }
}
