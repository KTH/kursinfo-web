import { Component } from 'inferno'
import { inject, observer } from 'inferno-mobx'
import { globalRegistry } from 'component-registry'

import i18n from "../../../../i18n"
import CourseCollapse from './CourseCollapse.jsx'

import { EMPTY, COURSE_WEB_URL} from '../util/constants'

@inject(['routerStore']) @observer
class CourseCollapseList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      openMenue: 0,
      store:this.props.routerStore["courseData"],
      coursePlan: this.props.coursePlan[0]
    }
  }

  getIntro(translation){
    const syllabus = this.props.coursePlan
    const round = this.state.store.courseRoundList[this.props.roundIndex]
    const intro = [
      {header: translation.courseRoundInformation.round_target_group, text: round ? round.round_target_group : EMPTY },
      {header: translation.courseRoundInformation.round_part_of_programme, text:round ? round.round_part_of_programme : EMPTY },
      {header: translation.courseRoundInformation.round_time_slots, text: round ?round.round_time_slots : EMPTY },
      {header: translation.courseRoundInformation.round_periods, text: round ?round.round_periods : EMPTY },
      {header: translation.courseRoundInformation.round_end_date, text: round ?round.round_end_date : EMPTY },
      {header: translation.courseRoundInformation.round_max_seats, text: round ? round.round_max_seats : EMPTY },

      {header:translation.courseInformation.course_eligibility, text:syllabus.course_eligibility},
      {header:translation.courseInformation.course_content, text:syllabus.course_content},
      {header:translation.courseInformation.course_goals, text:syllabus.course_goals},
      {header:translation.courseInformation.course_disposition, text:syllabus.course_disposition}
    
    ]
    return intro
  }

  getPrepare(translation){
    const course = this.props.courseInfo
    const syllabus = this.props.coursePlan
    const round = this.state.store.courseRoundList[this.props.roundIndex]
    const prepare = [
      {header:translation.courseInformation.course_suggested_addon_studies, text:course.course_suggested_addon_studies},
      {header:translation.courseInformation.course_required_equipment, text:syllabus.course_required_equipment},
      {header:translation.courseInformation.course_literature, text:syllabus.course_literature},

      {header: translation.courseRoundInformation.round_teacher, text:round ? round.round_teacher : EMPTY },
      {header: translation.courseRoundInformation.round_responsibles, text:round ? round.round_responsibles : EMPTY },
      {header: translation.courseRoundInformation.round_schedule, text:round ? round.round_schedule : EMPTY}
      
    ]
    return prepare
  }

  getDuring(translation){
    const course = this.props.courseInfo
    const syllabus = this.props.coursePlan
    const during = [
      {header:"Kurs-PM", text:"Här visas kurs-PM??"},
      {header:"Canvas länk", text:"Länk till Canvas"}
    ]
    if(this.props.showCourseLink)
      during.push({header:"Kurswebb länk", text:`<a target='_blank' href='${COURSE_WEB_URL}${this.props.courseInfo.course_code}'> ${translation.courseInformationLabels.label_course_web_link}</a>`})
    return during
  }

  getFinalize(translation){
    const course = this.props.courseInfo
    const syllabus = this.props.coursePlan
    const prepare = [
      {header:translation.courseInformation.course_examination, text:syllabus.course_examination},
      {header:translation.courseInformation.course_examination_comments, text:syllabus.course_examination_comments},
      {header:translation.courseInformation.course_requirments_for_final_grade, text:syllabus.course_requirments_for_final_grade},
      {header:translation.courseInformation.course_examiners, text:course.course_examiners}
    ]
    return prepare
  }

  getOther(translation){
    const course = this.props.courseInfo
    const syllabus = this.props.coursePlan
    let prepare = []
    prepare.push({header:translation.courseInformation.course_department, text: course.course_department})
    if(course.course_contact_name !== EMPTY) prepare.push({header:translation.courseInformation.course_contact_name, text: course.course_contact_name}) 
    if(course.course_supplemental_information !== EMPTY) prepare.push({header:translation.courseInformation.course_supplemental_information, text:course.course_supplemental_information})
    if(course.course_supplemental_information_url !== EMPTY) prepare.push({header:translation.courseInformation.course_supplemental_information_url, text:course.course_supplemental_information_url})
    if(course.course_supplemental_information_url_text !== EMPTY) prepare.push({header:translation.courseInformation.course_supplemental_information_url_text, text:course.course_supplemental_information_url_text})
    
    return prepare
  }
  

  render({ routerStore }) {
    //console.log(this.routerStore)
    const translation = i18n.messages[this.state.store.language]
    return (
      <div className="row">
        <CourseCollapse courseData = {this.getIntro(translation)} header={translation.courseInformationLabels.label_course_intro} className="collapseHeader" isOpen={false} color="blue"/>
        <CourseCollapse courseData = {this.getPrepare(translation)} header={translation.courseInformationLabels.label_course_prepare} className="collapseHeader" isOpen={false} color="blue"/>
        <CourseCollapse courseData = {this.getDuring(translation)} header={translation.courseInformationLabels.label_course_during} className="collapseHeader" isOpen={false} color="blue"/>
        <CourseCollapse courseData = {this.getFinalize(translation)} header={translation.courseInformationLabels.label_course_finalize} className="collapseHeader" isOpen={false} color="blue"/>
        <CourseCollapse courseData = {this.getOther(translation)} header={translation.courseInformationLabels.label_course_other} className="collapseHeader" isOpen={false} color="blue"/>
      </div>  
    )
  }
}

export default CourseCollapseList