import { Component } from 'inferno'
import { renderString } from 'inferno-formlib/lib/widgets/common'
import Row from 'inferno-bootstrap/dist/Row'
import Col from 'inferno-bootstrap/dist/Col'
import Button from 'inferno-bootstrap/dist/Button'
import Alert from 'inferno-bootstrap/dist/Alert'
import { EMPTY } from "../util/constants"
import i18n from "../../../../i18n"

class CourseFileLinks extends Component {
 constructor (props) {
    super(props)
    this.openSyllabus=this.openSyllabus.bind(this)
  }

  openSyllabus(event){
    event.preventDefault()
    const language = this.props.language === 0 ? "en" : "sv" 
    window.open(`/student/kurser/kurs/kursplan/${this.props.courseCode}_${event.target.id}.pdf?lang=${language}`)
  }

  render () {
    console.log("this.props.courseRound", this.props)
    const translate = i18n.messages[this.props.language].courseRoundInformation
    const round = this.props.courseRound
    return (
      <Row id="courseLinks">
        <Col sm="12" xs="12">
          {this.props.syllabusValidFrom.length > 0 ?
          <span>
            <i class="fas fa-file-pdf"></i> 
            <a href="javascript" onClick={this.openSyllabus} id={this.props.syllabusValidFrom[0] + this.props.syllabusValidFrom[1]}>
                {i18n.messages[this.props.language].courseInformationLabels.label_course_syllabus}
            </a>
          
          <span className="small-text" >
          &nbsp;( {i18n.messages[this.props.language].courseInformationLabels.label_course_syllabus_valid_from }&nbsp; 
            {i18n.messages[this.props.language].courseInformation.course_short_semester[this.props.syllabusValidFrom[1]]}  {this.props.syllabusValidFrom[0]} )
          </span>
          </span>
          : "" }
       </Col>
        <Col sm="12" xs="12">
          <i class="fas fa-file-pdf"></i>
          <a href="javascript" onClick={this.openSyllabus} id={this.props.syllabusValidFrom[0] + this.props.syllabusValidFrom[1]}>
            {i18n.messages[this.props.language].courseInformationLabels.label_course_pm} 
          </a> ( 20xx-xx-xx )
          </Col>
        <Col sm="12" xs="12">
        <i className="icon-schedule"></i> <a target="_blank" href={this.props.scheduleUrl} >
          {i18n.messages[this.props.language].courseInformationLabels.label_schedule}
          </a>
          </Col>
      </Row>
    )
  }
} 


export default CourseFileLinks