import { Component } from 'inferno'
import { inject, observer } from 'inferno-mobx'
import { globalRegistry } from 'component-registry'

import i18n from '../../../../i18n'
import CourseSection from './CourseSections.jsx'

import { EMPTY, COURSE_WEB_URL} from '../util/constants'

@inject(['routerStore']) @observer
class CourseSectionList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      openMenue: 0,
      store:this.props.routerStore['courseData'],
      syllabusList: this.props.syllabusList[0]
    }
  }

  getContent (translation) {
    const syllabus = this.props.syllabusList

    const prepare = [
      {header:translation.courseInformation.course_content, text:syllabus.course_content},
      {header:translation.courseInformation.course_goals, text:syllabus.course_goals},
      {header:translation.courseInformation.course_disposition, text:syllabus.course_disposition}
    ]
    return prepare
  }

  getExecution (translation) {
    const course = this.props.courseInfo
    const syllabus = this.props.syllabusList

    let literatureText = syllabus.course_literature
    if (syllabus.course_literature_comment !== EMPTY[this.state.store.language]) {
      literatureText = literatureText !== EMPTY[this.state.store.language]
                      ? literatureText + '<br/>' + syllabus.course_literature_comment
                      : syllabus.course_literature_comment
    }

    const during = [
      {header: translation.courseInformation.course_eligibility, text: syllabus.course_eligibility},
      {header: translation.courseInformation.course_prerequisites, text: course.course_prerequisites},
      {header: translation.courseInformation.course_required_equipment, text: syllabus.course_required_equipment},
      {header: translation.courseInformation.course_literature, text: literatureText}
    ]

    if (this.props.showCourseLink)
      during.push({header: 'Kurswebb länk', text:`<a target='_blank' href='${COURSE_WEB_URL}${this.props.courseInfo.course_code}'> ${translation.courseLabels.label_course_web_link}</a>`})

    return during
  }

  getExamination (translation) {
    const course = this.props.courseInfo
    const syllabus = this.props.syllabusList
    const prepare = [
      {header: translation.courseInformation.course_grade_scale, text: course.course_grade_scale},
      {header: translation.courseInformation.course_examination, text: syllabus.course_examination},
      {header: translation.courseInformation.course_examination_comments, text: syllabus.course_examination_comments},
      {header: translation.courseInformation.course_requirments_for_final_grade, text: syllabus.course_requirments_for_final_grade},
      {header: translation.courseInformation.course_examiners, text: course.course_examiners}
    ]
    return prepare
  }

  getOther (translation) {
    const course = this.props.courseInfo
    let prepare = [
      {header: translation.courseInformation.course_department, text: course.course_department_link },
      {header: translation.courseInformation.course_main_subject, text: course.course_main_subject },
      {header: translation.courseInformation.course_level_code, text: translation.courseInformation.course_level_code_label[course.course_level_code]},
      {header: translation.courseInformation.course_suggested_addon_studies, text:course.course_suggested_addon_studies}

    ]
    if (course.course_contact_name !== EMPTY[this.state.store.language]) prepare.push({header:translation.courseInformation.course_contact_name, text: course.course_contact_name})
    if (course.course_supplemental_information !== EMPTY[this.state.store.language]) prepare.push({header:translation.courseInformation.course_supplemental_information, text:course.course_supplemental_information})
    if (course.course_supplemental_information_url !== EMPTY[this.state.store.language]) prepare.push({header:translation.courseInformation.course_supplemental_information_url, text:course.course_supplemental_information_url})
    if (course.course_supplemental_information_url_text !== EMPTY[this.state.store.language]) prepare.push({header:translation.courseInformation.course_supplemental_information_url_text, text:course.course_supplemental_information_url_text})

    return prepare
  }


  render ({ routerStore }) {
    // console.log(this.routerStore)
    const translation = i18n.messages[this.state.store.language]
    return (
      <div className='row' id={this.props.partToShow}>
          <CourseSection sectionHeader={translation.courseLabels.header_content} headerType='3' class='first-header' courseData={this.getContent(translation)} sectionId='Content' />
          <CourseSection sectionHeader={translation.courseLabels.header_execution} headerType='3' courseData={this.getExecution(translation)} sectionId='Execution' />
          <CourseSection sectionHeader={translation.courseLabels.header_examination} headerType='3' courseData={this.getExamination(translation)} sectionId='Examination' />
          <CourseSection sectionHeader={translation.courseLabels.header_further} headerType='3' courseData={this.getOther(translation)} sectionId='Other' />
    </div>
    )
  }
}

export default CourseSectionList
