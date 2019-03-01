import { Component } from 'inferno'
import Row from 'inferno-bootstrap/dist/Row'
import Col from 'inferno-bootstrap/dist/Col'
import i18n from "../../../../i18n"
import { EMPTY } from "../util/constants"

class CourseFileLinks extends Component {
 constructor (props) {
    super(props)
    //this.openSyllabus=this.openSyllabus.bind(this)
  }

  /*openSyllabus(event){
    event.preventDefault()
    const language = this.props.language === 0 ? "en" : "sv" 
    window.open(`/student/kurser/kurs/kursplan/${this.props.courseCode}_${event.target.id}.pdf?lang=${language}`)
  }*/

  render () {
    //console.log("this.props.courseRound", this.props)
    const translate = i18n.messages[this.props.language].courseRoundInformation
    const round = this.props.courseRound
    return (
      <Row id="courseLinks">
        <Col sm="12" xs="12">
        {/* ---LINK TO SYLLABUS IF COURSE HAS ONE-- */}
          {this.props.syllabusValidFrom.length > 0 ?
          <span>
            <i class="fas fa-file-pdf"></i> 
            <a href="javascript" onClick={this.openSyllabus} id={this.props.syllabusValidFrom[0] + this.props.syllabusValidFrom[1]}>
                {i18n.messages[this.props.language].courseLabels.label_course_syllabus}
            </a>
          <span className="small-text" >
          &nbsp;( {i18n.messages[this.props.language].courseLabels.label_course_syllabus_valid_from }&nbsp; 
            {i18n.messages[this.props.language].courseInformation.course_short_semester[this.props.syllabusValidFrom[1]]}  {this.props.syllabusValidFrom[0]} )
          </span>
          </span>
          : "" }
       </Col>
       {/* ---LINK TO ROUND PM/MEMO ?IF ROUND HAS ONE-- */}
        <Col sm="12" xs="12">
          <i class="fas fa-file-pdf"></i>
          {i18n.messages[this.props.language].courseLabels.no_memo} 
         {/*<a href="pm-url" id={"pm_"}>
            {i18n.messages[this.props.language].courseLabels.label_course_pm} 
          </a> ( 20xx-xx-xx )*/} 
          </Col>
         {/* ---LINK TO ROUND SCHEDULE-- */}
        <Col sm="12" xs="12">
        <i className="icon-schedule"></i> 
        {this.props.scheduleUrl !== EMPTY[this.props.language] ?
          <a target="_blank" href={this.props.scheduleUrl} >
          {i18n.messages[this.props.language].courseLabels.label_schedule}
          </a>
          :
          <span>{i18n.messages[this.props.language].courseLabels.no_schedule}</span>
        }
          </Col>
      </Row>
    )
  }
} 


export default CourseFileLinks