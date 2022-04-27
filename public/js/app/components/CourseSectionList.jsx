import React from 'react'

import i18n from '../../../../i18n'
import { INFORM_IF_IMPORTANT_INFO_IS_MISSING } from '../util/constants'
import { useWebContext } from '../context/WebContext'

import CourseSection from './CourseSections'
import SyllabusInformation from './SyllabusInformation'

const LABEL_MISSING_INFO = { en: INFORM_IF_IMPORTANT_INFO_IS_MISSING[0], sv: INFORM_IF_IMPORTANT_INFO_IS_MISSING[1] }

function CourseSectionList(props) {
  const [webContext] = useWebContext()
  const context = React.useMemo(() => webContext, [webContext])
  const { courseData = {} } = context
  const { language = 'sv' } = courseData
  const translation = i18n.messages[language === 'en' ? 0 : 1]
  const { courseInfo: course = {}, partToShow, syllabusList: syllabus = {}, syllabusName, syllabusSemesterList } = props

  function getContent() {
    const content = [
      { header: translation.courseInformation.course_content, text: syllabus.course_content, syllabusMarker: true },
      { header: translation.courseInformation.course_goals, text: syllabus.course_goals, syllabusMarker: true },
    ]
    if (course.course_disposition !== LABEL_MISSING_INFO[language]) {
      content.push({ header: translation.courseInformation.course_disposition, text: course.course_disposition })
    } else {
      content.push({ header: translation.courseInformation.course_disposition, text: syllabus.course_disposition })
    }

    return content
  }

  function getExecution() {
    let literatureText = LABEL_MISSING_INFO[language]
    const courseHasLiterature = course.course_literature && course.course_literature !== LABEL_MISSING_INFO[language]
    const syllabusHasLiterature =
      syllabus.course_literature && syllabus.course_literature !== LABEL_MISSING_INFO[language]
    const syllabusHasLiteratureComment =
      syllabus.course_literature_comment && syllabus.course_literature_comment !== LABEL_MISSING_INFO[language]

    if (courseHasLiterature) {
      literatureText = course.course_literature
    } else if (syllabusHasLiterature) {
      const literatureComment = syllabusHasLiteratureComment ? `<br />${syllabus.course_literature_comment}` : ''
      literatureText = `${syllabus.course_literature}${literatureComment}`
    } else if (syllabusHasLiteratureComment) {
      literatureText = `${syllabus.course_literature_comment}`
    }

    const courseRequiredEquipment =
      course.course_required_equipment !== LABEL_MISSING_INFO[language]
        ? course.course_required_equipment
        : syllabus.course_required_equipment

    const during = [
      {
        header: translation.courseInformation.course_eligibility,
        text: syllabus.course_eligibility,
        syllabusMarker: true,
      },
      { header: translation.courseInformation.course_prerequisites, text: course.course_prerequisites },
      { header: translation.courseInformation.course_required_equipment, text: courseRequiredEquipment },
      { header: translation.courseInformation.course_literature, text: literatureText },
    ]

    return during
  }

  function getExamination() {
    const examination = [
      { header: '', text: translation.courseInformation.course_examination_disclaimer },
      {
        header: translation.courseInformation.course_grade_scale,
        text: course.course_grade_scale,
        syllabusMarker: true,
      },
      {
        header: translation.courseInformation.course_examination,
        text: syllabus.course_examination,
        syllabusMarker: true,
      },
      { header: '', text: syllabus.course_examination_comments, syllabusMarker: true },
    ]

    if (syllabus.course_requirments_for_final_grade && syllabus.course_requirments_for_final_grade.length > 0) {
      examination.push({
        header: translation.courseInformation.course_requirments_for_final_grade,
        text: syllabus.course_requirments_for_final_grade,
        syllabusMarker: true,
      })
    }
    examination.push({
      header: translation.courseInformation.course_spossibility_to_completions,
      text: course.course_spossibility_to_completions,
    })
    examination.push({
      header: translation.courseInformation.course_possibility_to_addition,
      text: course.course_possibility_to_addition,
    })
    examination.push({ header: translation.courseInformation.course_examiners, text: course.course_examiners })
    examination.push({
      header: translation.courseInformation.course_ethical,
      text: syllabus.course_ethical,
      syllabusMarker: true,
    })
    return examination
  }

  function getOther() {
    const prepare = [
      { header: translation.courseInformation.course_department, text: course.course_department_link },
      {
        header: translation.courseInformation.course_main_subject,
        text: course.course_main_subject,
        syllabusMarker: true,
      },
      {
        header: translation.courseInformation.course_level_code,
        text: translation.courseInformation.course_level_code_label[course.course_level_code],
        syllabusMarker: true,
      },
      {
        header: translation.courseInformation.course_suggested_addon_studies,
        text: course.course_suggested_addon_studies,
      },
    ]
    if (course.course_contact_name !== LABEL_MISSING_INFO[language])
      prepare.push({ header: translation.courseInformation.course_contact_name, text: course.course_contact_name })
    if (syllabus.course_transitional_reg !== '')
      prepare.push({
        header: translation.courseInformation.course_transitional_reg,
        text: syllabus.course_transitional_reg,
        syllabusMarker: true,
      })
    if (course.course_supplemental_information !== LABEL_MISSING_INFO[language])
      prepare.push({
        header: translation.courseInformation.course_supplemental_information,
        text: course.course_supplemental_information,
      })
    if (course.course_supplemental_information_url !== LABEL_MISSING_INFO[language])
      prepare.push({
        header: translation.courseInformation.course_supplemental_information_url,
        text: course.course_supplemental_information_url,
      })
    if (course.course_supplemental_information_url_text !== LABEL_MISSING_INFO[language])
      prepare.push({
        header: translation.courseInformation.course_supplemental_information_url_text,
        text: course.course_supplemental_information_url_text,
      })
    if (course.course_web_link !== LABEL_MISSING_INFO[language]) {
      prepare.unshift({
        header: translation.courseInformation.course_link,
        text: `${translation.courseInformation.course_link_text} <a href='${course.course_web_link}'> ${translation.courseInformation.course_link} ${course.course_code}</a>`,
      })
    } else {
      prepare.unshift({ header: translation.courseInformation.course_link, text: course.course_web_link })
    }
    if (syllabus.course_additional_regulations !== '')
      prepare.push({
        header: translation.courseInformation.course_additional_regulations,
        text: syllabus.course_additional_regulations,
        syllabusMarker: true,
      })

    return prepare
  }

  return (
    <section
      className="row"
      id={partToShow}
      aria-label={`${translation.courseLabels.label_course_information} ${syllabusName}`}
    >
      <SyllabusInformation
        context={context}
        syllabus={syllabus}
        syllabusSemesterList={syllabusSemesterList}
        translation={translation}
      />
      <CourseSection
        sectionHeader={translation.courseLabels.header_content}
        headerType="3"
        className="first-header"
        courseData={getContent()}
        sectionId="Content"
        syllabusMarkerAriaLabel={translation.courseLabels.syllabus_marker_aria_label}
      />
      <CourseSection
        sectionHeader={translation.courseLabels.header_execution}
        headerType="3"
        courseData={getExecution()}
        sectionId="Execution"
        syllabusMarkerAriaLabel={translation.courseLabels.syllabus_marker_aria_label}
      />
      <CourseSection
        sectionHeader={translation.courseLabels.header_examination}
        headerType="3"
        courseData={getExamination()}
        sectionId="Examination"
        syllabusMarkerAriaLabel={translation.courseLabels.syllabus_marker_aria_label}
      />
      <CourseSection
        sectionHeader={translation.courseLabels.header_further}
        headerType="3"
        courseData={getOther()}
        sectionId="Other"
        syllabusMarkerAriaLabel={translation.courseLabels.syllabus_marker_aria_label}
      />
    </section>
  )
}

export default CourseSectionList
