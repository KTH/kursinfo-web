import { Component } from 'inferno'
import Row from 'inferno-bootstrap/dist/Row'
import Col from 'inferno-bootstrap/dist/Col'
import Alert from 'inferno-bootstrap/dist/Alert'
import { EMPTY } from "../util/constants"
import i18n from "../../../../i18n"

import CourseFileLinks from "./CourseFileLinks.jsx"

class CourseKeyInformationOneCol extends Component {
 constructor (props) {
    super(props)
    //this.openSyllabus=this.openSyllabus.bind(this)
  }

  /*openSyllabus(event){
    event.preventDefault()
    const language = this.props.language === 0 ? "en" : "sv" 
    window.open(`/student/kurser/kurs/kursplan/${this.props.courseData.course_code}_${event.target.id}.pdf?lang=${language}`)
  }*/

  render () {
    //console.log("this.props.courseRound", this.props)
    const translate = i18n.messages[this.props.language].courseRoundInformation
    const round = this.props.courseRound
    const course = this.props.courseData
    return (
      <div id="CourseKeyInformationOneCol" className="key-info">
      
        <Row>
          <Col sm="12" id="roundKeyInformation"> 
            <div className={` fade-container ${this.props.fade === true ? " fadeOutIn" : ""}`} key="fadeDiv1">
            
            {/* ---COURSE ROUND HEADER--- */}
            {this.props.courseHasRound ?
              <div style="border-bottom:1px solid #fff;">
                <h4>
                  {`
                  ${i18n.messages[this.props.language].courseInformation.course_short_semester[round.round_course_term[1]]} 
                  ${round.round_course_term[0]}  
                    ${round.round_short_name !== EMPTY[this.props.language] ? round.round_short_name : ""}     
                    ${round.round_type}
                  `}
                </h4>
              </div>
              :""}


             {this.props.courseHasRound ?
                <span>
                  <h4>{translate.round_target_group}</h4>
                  <span dangerouslySetInnerHTML = {{ __html:round.round_target_group }}></span>

                  <h4>{translate.round_part_of_programme}</h4>
                  <span dangerouslySetInnerHTML = {{ __html:round.round_part_of_programme }}></span>

                  <h4>{translate.round_periods}</h4>
                  <span dangerouslySetInnerHTML = {{ __html:round.round_periods }}></span>
                  
                  <h4>{translate.round_start_date}</h4>
                  <p className="clear-margin-bottom"><i class="fas fa-hourglass-start"></i>{round ? round.round_start_date : EMPTY[this.props.language]}</p>
                  <p><i class="fas fa-hourglass-end"></i>{round ? round.round_end_date : EMPTY[this.props.language]}</p>

                  <h4>{translate.round_course_place}</h4>
                  <p>{round ? round.round_course_place : EMPTY[this.props.language]}</p>
                </span>
              : ""}
            
              <h4>{i18n.messages[this.props.language].courseInformation.course_level_code}</h4>
              <p>{i18n.messages[this.props.language].courseInformation.course_level_code_label[course.course_level_code]}</p>
              
              {this.props.courseHasRound ?
                <span>
                  <h4>{translate.round_tutoring_form}</h4>
                  <p>{round ? translate.round_tutoring_form_label[round.round_tutoring_form] : EMPTY[this.props.language]}  {round ? translate.round_tutoring_time_label[round.round_tutoring_time]: EMPTY[this.props.language]}</p>
                    
                  <h4>{translate.round_tutoring_language}</h4>
                  <p>{round ? round.round_tutoring_language : EMPTY[this.props.language]}</p>
                
                 
               
                  <h4>{translate.round_max_seats}</h4>
                  <p>{round ? round.round_max_seats : EMPTY[this.props.language]}</p>
               
                  

                  <h4>{translate.round_time_slots}</h4>
                  <p dangerouslySetInnerHTML = {{ __html:round.round_time_slots }}></p>
                </span>
              : ""}

              <CourseFileLinks
                index=""
                language={this.props.language}
                courseHasRound ={this.props.courseHasRound }
                syllabusValidFrom = ""
                courseCode= {course.course_code}
                scheduleUrl = {round > 0 ? round.round_schedule : EMPTY[this.props.language]}
              />
              
              
              {/* ---CANAVAS EXAMPLE LINK--- 
              <i class="fas fa-desktop"></i>
              <a href="https://www.youtube.com/watch?v=s0JA9MgoT4o" target="_blank" >
                {i18n.messages[this.props.language].courseInformationLabels.lable_canavas_example}
              </a>*/}
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
              <h3 className="right-column-header">{i18n.messages[this.props.language].courseInformationLabels.header_contact}</h3>

              {course.course_contact_name !== EMPTY[this.props.language] ?
                <span>
                  <h4>{i18n.messages[this.props.language].courseInformation.course_contact_name}</h4> 
                  <p>{course.course_contact_name}</p>
                </span>
              : "" }

              <h4>{i18n.messages[this.props.language].courseInformation.course_examiners}</h4>
              <span dangerouslySetInnerHTML = {{ __html:course.course_examiners }}></span>

              {this.props.courseHasRound ?
                <span>
                  <h4>{translate.round_responsibles}</h4>
                  <span dangerouslySetInnerHTML = {{ __html:round.round_responsibles }}></span>
                  

                  <h4>{translate.round_teacher}</h4>
                  <span dangerouslySetInnerHTML = {{ __html:round.round_teacher }}></span>
                </span>       
              :""}
          </Col>
       </Row>
        <Row>
          <Col>
            <h3 className="right-column-header">{i18n.messages[this.props.language].courseInformationLabels.header_select_course}</h3>
            <h4>{translate.round_application_code}</h4>
            <p>{round ? round.round_application_code : EMPTY[this.props.language]}</p>
          </Col>
       </Row>
      </div>
    )
  }
} 



export default CourseKeyInformationOneCol