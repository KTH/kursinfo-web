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
    error_course_not_found: 'Det finns ingen kurs med angiven kurskod ',
    error_generic: 'Något gick fel vid hämtning av sidan. Försök igen senare. Kontakta IT-support om problemet kvarstår.',

    /**
     * Message keys
     */
    service_name: 'kurs ',

    lang_block_id: '1.272446',
    locale_text: 'Kursinformation på svenska',

    site_name: 'Kursinformation',
    host_name: 'KTH',
    page_student: 'STUDENT PÅ KTH',
    page_course_programme: 'KURS- OCH PROGRAMKATALOGEN'

  },
  courseLabels: {
    label_syllabus_link: 'Kursplan ',
    label_course_syllabus: '* Hämtad från ',
    label_course_syllabus_valid_from: 'Gäller från och med',
    label_course_syllabus_valid_to: 'till slutet av ',
    header_no_syllabus: 'Kursplan och kursomgångar saknas',
    label_no_syllabus: 'Kursplan saknas, kursinformationen som visas är övrig kursinformation. Även kursomgångar saknas för tidigare och kommande terminer, samt innevarande termin.',
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
    header_dropdown_menue: 'Gäller för',
    header_course_info: 'Kursinformation',
    header_content: 'Innehåll och lärandemål',
    header_execution: 'Kurslitteratur och förberedelser',
    header_statistics: 'Kursutveckling',
    header_syllabuses: 'Kursplaner historik',
    header_examination: 'Examination och slutförande',
    header_contact: 'Kontakt',
    header_further: 'Ytterligare information',
    header_round: 'Om kursomgång',
    header_select_course: 'Kursval',
    header_postgraduate_course: 'Forskarkurs ',
    empty_text: 'Ingen information inlagd',
    no_schedule: 'Schema saknas',
    no_memo: 'Inget kurs-PM inlagt ',
    no_memo_connection: 'Kurs-pm kan inte visas',
    alert_no_memo_connection: 'För närvarande kan inte kurs-PM som PDF visas för kursens aktuella kursomgångar. Försök igen senare. Kontakta IT-support om problemet kvarstår.',
    header_no_round_selected: 'Ingen kursomgång är vald',
    no_round_selected: 'Välj termin och kursomgång ovan för att få information från rätt kursplan och kursomgång.',
    round_seats_info: 'Kursomgången kan komma att ställas in om antalet antagna understiger minimiantalet platser. Vid fler sökande än platser kommer urval att ske.',
    syllabus_info: '<h4>Kursinformation</h4> <p>• Kursinformation består av all information från kursplan samt övrig kursinformation som gäller kurs och kursomgång</p><p>• Har du inte valt termin och kursomgång så ser du kursinformation från nuvarande eller kommande kursplan (vilken period kursplanen gäller för finns angivet under rubriken ”Kursinformation”)</p><p>• En kurs går olika kursomgångar. För att se information för en specifik kursomgång så väljer du termin och kursomgång i rutan uppe till höger. Om det är annan kursplan som gäller den terminen så uppdateras även den informationen (till vänster på sidan)</p><p>•Observera: bestämmelser i kursplaner är regler som är generellt tillämpbara och bindande för såväl anställda som studenter</p>',
    sideMenu: {
      page_about_course: 'Om kursen ',
      page_before_course: 'Inför kursval',
      page_catalog: 'Kurs- och programkatalogen',
      page_history: 'Kursens utveckling och historik',
      page_memo: 'Förbereda och gå kurs'
    }
  },
  courseInformation: {
    roundId: 'Kursomgångs nr',
    course_title: 'Benämning svenska',
    course_other_title: 'Benämning engelska',
    course_code: 'Kurskod',
    course_credits: 'Högskolepoäng',
    course_grade_scale: 'Betygsskala *',
    course_goals: 'Lärandemål *',
    course_content: 'Kursinnehåll *',
    course_disposition: 'Kursupplägg',
    course_eligibility: 'Särskild behörighet *',
    course_requirments_for_final_grade: 'Övriga krav för slutbetyg *',
    course_literature: 'Kurslitteratur',
    course_literature_comment: 'Kommentar till kurslitteratur',
    course_examination_comments: 'Kommentar till examinationsmoment *',
    course_examination: 'Examination *',
    course_examination_disclaimer: '<p>När kurs inte längre ges har student möjlighet att examineras under ytterligare två läsår.</p>',
    course_valid_from: 'Giltig från',
    course_main_subject: 'Huvudområde *',
    course_language: 'Undervisningsspråk *',
    course_required_equipment: 'Utrustning',
    course_level_code: 'Utbildningsnivå *',
    course_establishment: 'Fastställande *',
    course_decision_to_discontinue: 'Avvecklingsbeslut *',
    course_transitional_reg: 'Övergångsbestämmelser *',
    course_additional_regulations: 'Övriga föreskrifter *',
    course_ethical: 'Etiskt förhållningssätt *',
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
    course_link_text: '<p>Ytterligare information om kursen kan hittas på kurswebben via länken nedan. Information på kurswebben kommer framöver flyttas till denna sida. </p>'
  },
  courseRoundInformation: {
    round_header: 'Kursomgång',
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
    'Teknik och management': 'Picture_by_MainFieldOfStudy_22_Technology_Management.jpg',
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
