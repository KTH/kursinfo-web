import { Component } from 'inferno'
import { renderString } from 'inferno-formlib/lib/widgets/common'
import Row from 'inferno-bootstrap/dist/Row'
import Col from 'inferno-bootstrap/dist/Col'
import Button from 'inferno-bootstrap/dist/Button'
import { EMPTY } from "../util/constants"
import i18n from "../../../../i18n"

class CourseRound extends Component {
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
    //console.log("this.props.courseRound", this.props.courseRound)
    const translate = i18n.messages[this.props.language].courseRoundInformation
    const round = this.props.courseRound
    const course = this.props.courseData
    return (
      <div id="RoundContainer" className=" col key-info">{this.props.courseHasRound}
        <Row>
          <Col sm="4" id="imageContainer">
            <img src="//www.kth.se/polopoly_fs/1.841226!/image/f9520503_335_200.jpg" alt="" height="" width=""/>
          </Col>
          <Col sm="7" id="roundKeyInformation">
            <Row id="firstRow">
                <Col sm="4">
                  <h4>{i18n.messages[this.props.language].courseInformation.course_level_code}</h4>
                  <p>{i18n.messages[this.props.language].courseInformation.course_level_code_label[course.course_level_code]}</p>
                </Col>
                <Col sm="4">
                  <h4>{i18n.messages[this.props.language].courseInformation.course_main_subject}</h4>
                  <p>{course.course_main_subject}</p>
                </Col>
                <Col sm="4">
                  <h4>{i18n.messages[this.props.language].courseInformation.course_grade_scale}</h4>
                  <p>{course.course_grade_scale}</p>
                </Col>
              </Row>
              {this.props.courseHasRound ?
              <Row id="secondRow">

              <Col sm="4">
                  <h4>{translate.round_start_date}</h4>
                  <p>{round ? round.round_start_date : EMPTY}</p>
              </Col>

              <Col sm="4">
                  <h4>{translate.round_course_place}</h4>
                  <p>{round ? round.round_course_place : EMPTY}</p>
              </Col>

              <Col sm="4">
              <h4>{translate.round_tutoring_form}</h4>
                <p>{round ? translate.round_tutoring_form_label[round.round_tutoring_form] : EMPTY}  {round ? translate.round_tutoring_time_label[round.round_tutoring_time]: EMPTY}</p>
              </Col>
              
            </Row> : ""}
            <Row id="thirdRow">
              <Col sm="4">
              {this.props.courseHasRound ?
                <span>
                  <h4>{translate.round_tutoring_language}</h4>
                  <p>{round ? round.round_tutoring_language : EMPTY}</p>
                </span>
              : ""}
              </Col>
              <Col sm="4">
              {this.props.courseHasRound ?
                <span>
                  <h4>{translate.round_application_code}</h4>
                  <p>{round ? round.round_application_code : EMPTY}</p>
                </span>
              : ""}
              </Col>
              <Col sm="4">
                <h4></h4> 
                {this.props.courseData.course_valid_from.length > 0 ?
                <span>
                <Button color="primery" onClick={this.openSyllabus} id={this.props.courseData.course_valid_from[0] + this.props.courseData.course_valid_from[1]}>
                <i class="icon-file-text"></i> {i18n.messages[this.props.language].courseInformationLabels.label_course_syllabus}
                </Button>
                <p className="small-text" >
                  {i18n.messages[this.props.language].courseInformationLabels.label_course_syllabus_valid_from }&nbsp; 
                  {this.props.courseData.course_valid_from[0]}
                </p>
                </span>
                : "" }
              </Col>
            </Row> 
          </Col>
       </Row>
     
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

export default CourseRound