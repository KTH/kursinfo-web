import { Component } from 'inferno'
import Row from 'inferno-bootstrap/dist/Row'
import Col from 'inferno-bootstrap/dist/Col'
import Alert from 'inferno-bootstrap/dist/Alert'
import { EMPTY } from "../util/constants"
import i18n from "../../../../i18n"

class CourseKeyInformation extends Component {
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
      <div id="RoundContainer" className="key-info">{this.props.courseHasRound}
        <Row>
          <Col sm="12" id="roundKeyInformation">
          <div className={` fade-container ${this.props.fade === true ? " fadeOutIn" : ""}`} key="fadeDiv1">
            <Row id="firstRow">
                <Col sm="3">
                  <h4>{i18n.messages[this.props.language].courseInformation.course_level_code}</h4>
                  <p>{i18n.messages[this.props.language].courseInformation.course_level_code_label[course.course_level_code]}</p>
                </Col>
                <Col sm="3">
                {this.props.courseHasRound ?
                    <span>
                      <h4>{translate.round_tutoring_form}</h4>
                      <p>{round ? translate.round_tutoring_form_label[round.round_tutoring_form] : EMPTY}  {round ? translate.round_tutoring_time_label[round.round_tutoring_time]: EMPTY}</p>
                  
                    </span>
                  : ""}
                </Col>
                
              <Col sm="3">
                {this.props.courseHasRound ?
                <span>
                  <h4>{translate.round_tutoring_language}</h4>
                  <p>{round ? round.round_tutoring_language : EMPTY}</p>
                </span>
                : ""}
              </Col> 

              <Col sm="3">
                {this.props.courseHasRound ?
                <span>
                  <h4>{translate.round_periods}</h4>
                  <p>{round ? round.round_periods : EMPTY}</p>
                </span>
                : ""}
              </Col>
            </Row>
            {this.props.courseHasRound ?
              <Row id="secondRow">
                
                <Col sm="3">
                  <h4>{translate.round_course_place}</h4>
                  <p>{round ? round.round_course_place : EMPTY}</p>
                </Col>
                <Col sm="3">
                  <h4>{translate.round_max_seats}</h4>
                  <p>{round ? round.round_max_seats : EMPTY}</p>
                </Col>
                <Col sm="3">
                  <h4>{translate.round_application_code}</h4>
                  <p>{round ? round.round_application_code : EMPTY}</p>
                </Col>
                <Col sm="3">
                <h4>{translate.round_start_date}</h4>
                  <p><i class="fas fa-hourglass-start"></i>{round ? round.round_start_date : EMPTY}</p>
                  <p><i class="fas fa-hourglass-end"></i>{round ? round.round_end_date : EMPTY}</p>
              </Col>
              
            </Row> : ""}
            </div>
          </Col>
       </Row>
       {this.props.courseHasRound && round.round_state !== "APPROVED" ? 
         <Alert color="info" aria-live="polite" >
            <h4 style="margin-left: 80px;">{i18n.messages[this.props.language].courseLabels.lable_round_state[round.round_state]} </h4>
         </Alert>
         :""}
      </div>
    )
  }
} 



export default CourseKeyInformation