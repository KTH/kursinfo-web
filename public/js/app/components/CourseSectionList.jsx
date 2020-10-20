import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import i18n from '../../../../i18n'
import CourseSection from './CourseSections'
import SyllabusInformation from './SyllabusInformation'

const EMPTY = { en: 'No information inserted', sv: 'Ingen information tillagd' }

@inject(['routerStore'])
@observer
class CourseSectionList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      // eslint-disable-next-line react/destructuring-assignment
      store: this.props.routerStore.courseData || {}
    }
  }

  getContent(translation) {
    const { courseInfo: course = {} } = this.props
    const { syllabusList: syllabus = {} } = this.props
    const { store } = this.state
    const { language = 'sv' } = store

    const content = [
      { header: translation.courseInformation.course_content, text: syllabus.course_content, syllabusMarker: true },
      { header: translation.courseInformation.course_goals, text: syllabus.course_goals, syllabusMarker: true }
    ]
    if (course.course_disposition !== EMPTY[language]) {
      content.push({ header: translation.courseInformation.course_disposition, text: course.course_disposition })
    } else {
      content.push({ header: translation.courseInformation.course_disposition, text: syllabus.course_disposition })
    }

    return content
  }

  getExecution(translation) {
    const { courseInfo: course = {} } = this.props
    const { syllabusList: syllabus = {} } = this.props
    const { store } = this.state
    const { language = 'sv' } = store

    let literatureText = EMPTY[language]
    const courseHasLiterature = course.course_literature && course.course_literature !== EMPTY[language]
    const syllabusHasLiterature = syllabus.course_literature && syllabus.course_literature !== EMPTY[language]
    const syllabusHasLiteratureComment =
      syllabus.course_literature_comment && syllabus.course_literature_comment !== EMPTY[language]

    if (courseHasLiterature) {
      literatureText = course.course_literature
    } else if (syllabusHasLiterature) {
      const literatureComment = syllabusHasLiteratureComment ? `<br />${syllabus.course_literature_comment}` : ''
      literatureText = `${syllabus.course_literature}${literatureComment}`
    }

    const courseRequiredEquipment =
      course.course_required_equipment !== EMPTY[language]
        ? course.course_required_equipment
        : syllabus.course_required_equipment

    const during = [
      {
        header: translation.courseInformation.course_eligibility,
        text: syllabus.course_eligibility,
        syllabusMarker: true
      },
      { header: translation.courseInformation.course_prerequisites, text: course.course_prerequisites },
      { header: translation.courseInformation.course_required_equipment, text: courseRequiredEquipment },
      { header: translation.courseInformation.course_literature, text: literatureText }
    ]

    return during
  }

  getExamination(translation) {
    const { courseInfo: course = {}, syllabusList: syllabus = {} } = this.props
    const examination = [
      { header: '', text: translation.courseInformation.course_examination_disclaimer },
      {
        header: translation.courseInformation.course_grade_scale,
        text: course.course_grade_scale,
        syllabusMarker: true
      },
      {
        header: translation.courseInformation.course_examination,
        text: syllabus.course_examination,
        syllabusMarker: true
      },
      { header: '', text: syllabus.course_examination_comments, syllabusMarker: true }
    ]

    if (syllabus.course_requirments_for_final_grade && syllabus.course_requirments_for_final_grade.length > 0) {
      examination.push({
        header: translation.courseInformation.course_requirments_for_final_grade,
        text: syllabus.course_requirments_for_final_grade,
        syllabusMarker: true
      })
    }
    examination.push({
      header: translation.courseInformation.course_spossibility_to_completions,
      text: course.course_spossibility_to_completions
    })
    examination.push({
      header: translation.courseInformation.course_possibility_to_addition,
      text: course.course_possibility_to_addition
    })
    examination.push({ header: translation.courseInformation.course_examiners, text: course.course_examiners })
    examination.push({
      header: translation.courseInformation.course_ethical,
      text: syllabus.course_ethical,
      syllabusMarker: true
    })
    return examination
  }

  getOther(translation) {
    const { courseInfo: course = {}, syllabusList: syllabus = {} } = this.props
    const { store } = this.state
    const { language = 'sv' } = store
    const prepare = [
      { header: translation.courseInformation.course_department, text: course.course_department_link },
      {
        header: translation.courseInformation.course_main_subject,
        text: course.course_main_subject,
        syllabusMarker: true
      },
      {
        header: translation.courseInformation.course_level_code,
        text: translation.courseInformation.course_level_code_label[course.course_level_code],
        syllabusMarker: true
      },
      {
        header: translation.courseInformation.course_suggested_addon_studies,
        text: course.course_suggested_addon_studies
      }
    ]
    if (course.course_contact_name !== EMPTY[language])
      prepare.push({ header: translation.courseInformation.course_contact_name, text: course.course_contact_name })
    if (syllabus.course_transitional_reg !== '')
      prepare.push({
        header: translation.courseInformation.course_transitional_reg,
        text: syllabus.course_transitional_reg,
        syllabusMarker: true
      })
    if (course.course_supplemental_information !== EMPTY[language])
      prepare.push({
        header: translation.courseInformation.course_supplemental_information,
        text: course.course_supplemental_information
      })
    if (course.course_supplemental_information_url !== EMPTY[language])
      prepare.push({
        header: translation.courseInformation.course_supplemental_information_url,
        text: course.course_supplemental_information_url
      })
    if (course.course_supplemental_information_url_text !== EMPTY[language])
      prepare.push({
        header: translation.courseInformation.course_supplemental_information_url_text,
        text: course.course_supplemental_information_url_text
      })
    if (course.course_web_link !== EMPTY[language]) {
      prepare.unshift({
        header: translation.courseInformation.course_link,
        text: `${translation.courseInformation.course_link_text} <a href='${course.course_web_link}'> ${translation.courseInformation.course_link} ${course.course_code}</a>`
      })
    } else {
      prepare.unshift({ header: translation.courseInformation.course_link, text: course.course_web_link })
    }
    if (syllabus.course_additional_regulations !== '')
      prepare.push({
        header: translation.courseInformation.course_additional_regulations,
        text: syllabus.course_additional_regulations,
        syllabusMarker: true
      })

    return prepare
  }

  render() {
    const { store } = this.state
    const { language = 'sv' } = store
    const translation = i18n.messages[language === 'en' ? 0 : 1]
    const { partToShow, syllabusList, syllabusSemesterList } = this.props
    return (
      <section
        className="row"
        id={partToShow}
        aria-label={`${translation.courseLabels.label_course_information} ${this.props.syllabusName}`}
      >
        <SyllabusInformation
          routerStore={this.props.routerStore}
          syllabusList={syllabusList}
          syllabusSemesterList={syllabusSemesterList}
          translation={translation}
        />
        <CourseSection
          sectionHeader={translation.courseLabels.header_content}
          headerType="3"
          className="first-header"
          courseData={this.getContent(translation)}
          sectionId="Content"
          syllabusMarkerAriaLabel={translation.courseLabels.syllabus_marker_aria_label}
        />
        <CourseSection
          sectionHeader={translation.courseLabels.header_execution}
          headerType="3"
          courseData={this.getExecution(translation)}
          sectionId="Execution"
          syllabusMarkerAriaLabel={translation.courseLabels.syllabus_marker_aria_label}
        />
        <CourseSection
          sectionHeader={translation.courseLabels.header_examination}
          headerType="3"
          courseData={this.getExamination(translation)}
          sectionId="Examination"
          syllabusMarkerAriaLabel={translation.courseLabels.syllabus_marker_aria_label}
        />
        <CourseSection
          sectionHeader={translation.courseLabels.header_further}
          headerType="3"
          courseData={this.getOther(translation)}
          sectionId="Other"
          syllabusMarkerAriaLabel={translation.courseLabels.syllabus_marker_aria_label}
        />
      </section>
    )
  }
}

export default CourseSectionList
