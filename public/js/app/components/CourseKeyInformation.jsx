import { Component } from 'inferno'
import { renderString } from 'inferno-formlib/lib/widgets/common'
import Row from 'inferno-bootstrap/dist/Row'
import Col from 'inferno-bootstrap/dist/Col'
import Button from 'inferno-bootstrap/dist/Button'
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
      <div id="RoundContainer" className=" col key-info">{this.props.courseHasRound}
        <Row>
          <Col sm="12" id="roundKeyInformation">
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
                  <h4>{translate.round_start_date}</h4>
                  <p>{round ? round.round_start_date : EMPTY} - {round ? round.round_end_date : EMPTY}</p>
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
                  <h4>{translate.round_periods}</h4>
                  <p>{round ? round.round_periods : EMPTY}</p>
                </Col>
              
            </Row> : ""}
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



const InformationSet = ({label = "Rubrik", text}) => {
  return(
    <div>
      <h2>{label}</h2>
      <p dangerouslySetInnerHTML={{ __html:text}}/>
    </div>

  )
}

export default CourseKeyInformation