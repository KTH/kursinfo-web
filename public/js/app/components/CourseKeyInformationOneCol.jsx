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
    this.openSyllabus=this.openSyllabus.bind(this)
  }

  openSyllabus(event){
    event.preventDefault()
    const language = this.props.language === 0 ? "en" : "sv" 
    window.open(`/student/kurser/kurs/kursplan/${this.props.courseData.course_code}_${event.target.id}.pdf?lang=${language}`)
  }

  render () {
    //console.log("this.props.courseRound", this.props)
    const translate = i18n.messages[this.props.language].courseRoundInformation
    const round = this.props.courseRound
    const course = this.props.courseData
    return (
      <div id="CourseKeyInformationOneCol" className="key-info">
        <Row>
          <Col sm="12" id="roundKeyInformation"> 
          {this.props.courseHasRound ?
          <div style="text-align: center; border-bottom:1px solid #fff;"><i className="fas fa-info-circle"></i><h3>Valt kurstillfälle: <br/>{
          `${i18n.messages[this.props.language].courseInformation.course_short_semester[round.round_course_term[1]]} 
                      ${round.round_course_term[0]}  
                      ${round.round_short_name !== EMPTY ? round.round_short_name : ""}
                      `}
            
            </h3></div>
             :""}
             {this.props.courseHasRound ?
                    <span>
                      <h4>{translate.round_target_group}</h4>
                      <span dangerouslySetInnerHTML = {{ __html:round.round_target_group }}></span>

                      <h4>{translate.round_part_of_programme}</h4>
                      <span dangerouslySetInnerHTML = {{ __html:round.round_part_of_programme }}></span>
                    </span>
                  : ""}
            
                  <h4>{i18n.messages[this.props.language].courseInformation.course_level_code}</h4>
                  <p>{i18n.messages[this.props.language].courseInformation.course_level_code_label[course.course_level_code]}</p>
              
                {this.props.courseHasRound ?
                    <span>
                      <h4>{translate.round_tutoring_form}</h4>
                      <p>{round ? translate.round_tutoring_form_label[round.round_tutoring_form] : EMPTY}  {round ? translate.round_tutoring_time_label[round.round_tutoring_time]: EMPTY}</p>
                  
                    </span>
                  : ""}
                
                 {this.props.courseHasRound ?
                <span>
                  <h4>{translate.round_tutoring_language}</h4>
                  <p>{round ? round.round_tutoring_language : EMPTY}</p>
                </span>
                : ""}
              
              
                {this.props.courseHasRound ?
                <span>
                  <h4>{translate.round_periods}</h4>
                  <p>{round ? round.round_periods : EMPTY}</p>
                </span>
                : ""}
             
             
            {this.props.courseHasRound ?
             
             <span>
                  <h4>{translate.round_course_place}</h4>
                  <p>{round ? round.round_course_place : EMPTY}</p>
               
                  
                  <h4>{translate.round_max_seats}</h4>
                  <p>{round ? round.round_max_seats : EMPTY}</p>
                
                  
                  <h4>{translate.round_application_code}</h4>
                  <p>{round ? round.round_application_code : EMPTY}</p>
               
                  
                <h4>{translate.round_start_date}</h4>
                  <p><i class="fas fa-hourglass-start"></i>{round ? round.round_start_date : EMPTY}</p>
                  <p><i class="fas fa-hourglass-end"></i>{round ? round.round_end_date : EMPTY}</p>

                  <h4>{translate.round_teacher}</h4>
                  <span dangerouslySetInnerHTML = {{ __html:round.round_teacher }}></span>
                   
                    <h4>{translate.round_responsibles}</h4>
                    <span dangerouslySetInnerHTML = {{ __html:round.round_responsibles }}></span>
                  </span>
                  : ""}

                  <CourseFileLinks
                    index=""
                    language={this.props.language}
                    courseHasRound ={this.props.courseHasRound }
                    syllabusValidFrom = ""
                    courseCode= {course.course_code}
                    scheduleUrl = {round > 0 ? round.round_schedule : "https://thoughtcatalog.com/january-nelson/2018/06/funny-stories/"}
                />
          </Col>
       </Row>
       {this.props.courseHasRound && round.round_state !== "APPROVED" ? 
         <Alert color="info" aria-live="polite" >
            <h4 style="margin-left: 80px;">{i18n.messages[this.props.language].courseInformationLabels.lable_round_state[round.round_state]} </h4>
         </Alert>
         :""}
      </div>
    )
  }
} 



export default CourseKeyInformationOneCol