import { Component } from 'inferno'
//import Button from 'inferno-bootstrap/dist/Button'
import Button from 'inferno-bootstrap/lib/Button'
import i18n from "../../../../i18n"

class CourseTitle extends Component {
  constructor(props){
    super(props)
    this.openEdit = this.openEdit.bind(this)
  }

  openEdit(){
    event.preventDefault()
    const language = this.props.language === 0 ? "en" : "sv" 
    //window.open(`/student/kurser/kurs/admin/${this.props.courseTitleData.course_code}?lang=${language}`)
    window.open(`/admin/kurser/kurs/${this.props.courseTitleData.course_code}?lang=${language}`)
  }

  render () {
    const title = this.props.courseTitleData
    return (
      <div id="course-title" className="col">
        <h1><span property="aiiso:code">{title.course_code}</span>
        <span property="teach:courseTitle"> {title.course_title},</span>
        <span content={title.course_credits} datatype="xsd:decimal" property="teach:ects"> {title.course_credits} {this.props.language === 0 ? " credits" : " hp"} </span>
        </h1>
        {
          this.props.canEdit ?  <Button className="editButton" color="primery" onClick={this.openEdit} id={title.course_code}><i className="icon-edit"></i> Edit course </Button> : ""
        }
        <h2 className="secondTitle">
          <span property="teach:courseTitle">{title.course_other_title}</span>
        </h2>
      </div> 
    )
  }
}

export default CourseTitle