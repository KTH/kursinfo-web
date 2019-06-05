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
      store:this.props.routerStore['courseData'],
      syllabusList: this.props.syllabusList[0]
    }
  }

  getContent (translation) {
    const syllabus = this.props.syllabusList

    const content = [
      {header: translation.courseInformation.course_content, text: syllabus.course_content},
      {header: translation.courseInformation.course_goals, text: syllabus.course_goals}
    ]
    if (syllabus.course_disposition.length > 0)
      content.push({header: translation.courseInformation.course_disposition, text: syllabus.course_disposition})
    return content
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
      {header: translation.courseInformation.course_prerequisites, text: course.course_prerequisites}
    ]
    if (syllabus.course_required_equipment.length > 0)
      during.push({header: translation.courseInformation.course_required_equipment, text: syllabus.course_required_equipment})
    during.push({header: translation.courseInformation.course_literature, text: literatureText})

    return during
  }

  getExamination (translation) {
    const course = this.props.courseInfo
    const syllabus = this.props.syllabusList
    const examination = [
      {header: translation.courseInformation.course_grade_scale, text: course.course_grade_scale},
      {header: translation.courseInformation.course_examination, text: syllabus.course_examination},
      {header: '', text: syllabus.course_examination_comments}
    ]

    if (syllabus.course_requirments_for_final_grade.length > 0)
      examination.push({header: translation.courseInformation.course_requirments_for_final_grade, text: syllabus.course_requirments_for_final_grade})
    examination.push({header: translation.courseInformation.course_examiners, text: course.course_examiners})
    return examination
  }

  getOther (translation) {
    const course = this.props.courseInfo

    let prepare = [
      { header: translation.courseInformation.course_department, text: course.course_department_link },
      { header: translation.courseInformation.course_main_subject, text: course.course_main_subject },
      { header: translation.courseInformation.course_level_code, text: translation.courseInformation.course_level_code_label[course.course_level_code] },
      { header: translation.courseInformation.course_suggested_addon_studies, text: course.course_suggested_addon_studies }
    ]
    if (course.course_contact_name !== EMPTY[this.state.store.language]) prepare.push({header: translation.courseInformation.course_contact_name, text: course.course_contact_name})
    if (course.course_supplemental_information !== EMPTY[this.state.store.language]) prepare.push({header: translation.courseInformation.course_supplemental_information, text:course.course_supplemental_information})
    if (course.course_supplemental_information_url !== EMPTY[this.state.store.language]) prepare.push({header: translation.courseInformation.course_supplemental_information_url, text:course.course_supplemental_information_url})
    if (course.course_supplemental_information_url_text !== EMPTY[this.state.store.language]) prepare.push({header: translation.courseInformation.course_supplemental_information_url_text, text:course.course_supplemental_information_url_text})
    if (course.course_web_link !== EMPTY[this.state.store.language])
      prepare.unshift({header: translation.courseInformation.course_link, text: `${translation.courseInformation.course_link_text} <a target='_blank' href='${course.course_web_link}'> ${translation.courseInformation.course_link} ${this.props.courseInfo.course_code}</a>`})
    else
      prepare.unshift({header: translation.courseInformation.course_link, text: course.course_web_link})

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
