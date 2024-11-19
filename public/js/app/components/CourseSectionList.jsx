import React from 'react'

import { useLanguage } from '../hooks/useLanguage'
import { useMissingInfo } from '../hooks/useMissingInfo'
import CourseSection from './CourseSection'
import { SyllabusInformation } from './SyllabusInformation'

function CourseSectionList({ courseInfo = {}, partToShow, syllabus = {}, syllabusName }) {
  const { translation } = useLanguage()
  const { isMissingInfoLabel, missingInfoLabel } = useMissingInfo()

  function getContent() {
    const content = [
      { header: translation.courseInformation.course_content, text: syllabus.course_content, syllabusMarker: true },
      { header: translation.courseInformation.course_goals, text: syllabus.course_goals, syllabusMarker: true },
    ]
    if (!isMissingInfoLabel(courseInfo.course_disposition)) {
      content.unshift({ header: translation.courseInformation.course_disposition, text: courseInfo.course_disposition })
    }

    return content
  }

  function isContractEducation() {
    return [101992, 101993].includes(courseInfo.course_education_type_id)
  }

  function getEligibility() {
    if (isContractEducation()) return [{}]

    return [
      {
        header: translation.courseInformation.course_eligibility,
        text: syllabus.course_eligibility,
        syllabusMarker: true,
      },
    ]
  }

  function getExecution() {
    let literatureText = missingInfoLabel
    const courseHasLiterature = courseInfo.course_literature && !isMissingInfoLabel(courseInfo.course_literature)
    const syllabusHasLiterature = syllabus.course_literature && !isMissingInfoLabel(syllabus.course_literature)
    const syllabusHasLiteratureComment =
      syllabus.course_literature_comment && !isMissingInfoLabel(syllabus.course_literature_comment)

    if (courseHasLiterature) {
      literatureText = courseInfo.course_literature
    } else if (syllabusHasLiterature) {
      const literatureComment = syllabusHasLiteratureComment ? `<br />${syllabus.course_literature_comment}` : ''
      literatureText = `${syllabus.course_literature}${literatureComment}`
    } else if (syllabusHasLiteratureComment) {
      literatureText = `${syllabus.course_literature_comment}`
    }

    const courseRequiredEquipment = !isMissingInfoLabel(courseInfo.course_required_equipment)
      ? courseInfo.course_required_equipment
      : syllabus.course_required_equipment

    const eligibility = getEligibility()

    const during = [
      ...eligibility,
      {
        header: translation.courseInformation.course_prerequisites,
        text: courseInfo.course_recommended_prerequisites,
        infoModal: {
          description: translation.courseInformation.course_prerequisites_description,
          closeLabel: translation.courseLabels.label_close,
          ariaLabel: translation.courseInformation.course_prerequisites_menu_aria_label,
        },
      },
      { header: translation.courseInformation.course_required_equipment, text: courseRequiredEquipment },
      { header: translation.courseInformation.course_literature, text: literatureText },
    ]

    return during
  }

  function addParagraphToExamComments(comments = '') {
    // exam comments missing <p>, have to compensate

    if (comments.startsWith('<p>') || !comments) return comments
    const splittedComments = comments.split('<p>')
    const [firstComment] = splittedComments
    splittedComments[0] = `<p>${firstComment}</p>`
    return splittedComments.join('<p>')
  }

  function getExamination() {
    const examination = [
      { header: '', text: translation.courseInformation.course_examination_disclaimer },
      {
        header: translation.courseInformation.course_grade_scale,
        text: courseInfo.course_grade_scale,
        syllabusMarker: true,
      },
      {
        header: translation.courseInformation.course_examination,
        text: syllabus.course_examination,
        syllabusMarker: true,
      },
      { header: '', text: addParagraphToExamComments(syllabus.course_examination_comments), syllabusMarker: true },
    ]

    if (syllabus.course_requirments_for_final_grade && syllabus.course_requirments_for_final_grade.length > 0) {
      examination.push({
        header: translation.courseInformation.course_requirments_for_final_grade,
        text: syllabus.course_requirments_for_final_grade,
        syllabusMarker: true,
      })
    }
    examination.push({
      header: translation.courseInformation.course_possibility_to_completions,
      text: courseInfo.course_possibility_to_completions,
    })
    examination.push({
      header: translation.courseInformation.course_possibility_to_addition,
      text: courseInfo.course_possibility_to_addition,
    })
    examination.push({ header: translation.courseInformation.course_examiners, text: courseInfo.course_examiners })
    examination.push({
      header: translation.courseInformation.course_ethical,
      text: syllabus.course_ethical,
      syllabusMarker: true,
    })
    return examination
  }

  function getOther() {
    const prepare = [
      {
        header: translation.courseInformation.course_room_canvas,
        text: translation.courseInformation.course_room_canvas_info,
      },
      {
        header: translation.courseInformation.course_department,
        text: courseInfo.course_department_link ?? courseInfo.course_department,
      },
      {
        header: translation.courseInformation.course_main_subject,
        text: courseInfo.course_main_subject,
        syllabusMarker: true,
      },
      {
        header: translation.courseInformation.course_level_code,
        text: translation.courseInformation.course_level_code_label[courseInfo.course_level_code],
        syllabusMarker: true,
      },
    ]
    if (syllabus.course_transitional_reg !== '')
      prepare.push({
        header: translation.courseInformation.course_transitional_reg,
        text: syllabus.course_transitional_reg,
        syllabusMarker: true,
      })
    if (!isMissingInfoLabel(courseInfo.course_supplemental_information))
      prepare.push({
        header: translation.courseInformation.course_supplemental_information,
        text: courseInfo.course_supplemental_information,
      })
    if (!isMissingInfoLabel(courseInfo.course_supplemental_information_url))
      prepare.push({
        header: translation.courseInformation.course_supplemental_information_url,
        text: courseInfo.course_supplemental_information_url,
      })
    if (!isMissingInfoLabel(courseInfo.course_supplemental_information_url_text))
      prepare.push({
        header: translation.courseInformation.course_supplemental_information_url_text,
        text: courseInfo.course_supplemental_information_url_text,
      })

    if (!isContractEducation() && syllabus.course_additional_regulations !== '')
      prepare.push({
        header: translation.courseInformation.course_additional_regulations,
        text: syllabus.course_additional_regulations,
        syllabusMarker: true,
      })

    return prepare
  }

  return (
    <section
      className="course-section-list"
      id={partToShow}
      aria-label={`${translation.courseLabels.label_course_information} ${syllabusName}`}
    >
      <SyllabusInformation syllabusName={syllabusName} />
      <CourseSection
        sectionHeader={translation.courseLabels.header_content}
        headerType="3"
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
