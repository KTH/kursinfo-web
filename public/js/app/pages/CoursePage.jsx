import { render, Component } from 'inferno'
import { inject, observer } from 'inferno-mobx'

/*import Dropdown from 'kth-style-inferno-bootstrap/dist/Dropdown'
import DropdownMenu from 'kth-style-inferno-bootstrap/dist/DropdownMenu'
import DropdownItem from 'kth-style-inferno-bootstrap/dist/DropdownItem'
import DropdownToggle from 'kth-style-inferno-bootstrap/dist/DropdownToggle'


import Dropdown from 'kth-style-iinferno-bootstrap/dist/Dropdown'
import DropdownMenu from 'kth-style-iinferno-bootstrap/dist/DropdownMenu'
import DropdownItem from 'kth-style-iinferno-bootstrap/dist/DropdownItem'
import DropdownToggle from 'kth-style-iinferno-bootstrap/dist/DropdownToggle'
*/
import Row from 'inferno-bootstrap/dist/Row'
import Col from 'inferno-bootstrap/dist/Col'
import Dropdown from 'inferno-bootstrap/dist/Dropdown'
import DropdownMenu from 'inferno-bootstrap/dist/DropdownMenu'
import DropdownItem from 'inferno-bootstrap/dist/DropdownItem'
import DropdownToggle from 'inferno-bootstrap/dist/DropdownToggle'
import Alert from 'inferno-bootstrap/dist/Alert'


import i18n from "../../../../i18n"
import { EMPTY, FORSKARUTB_URL } from "../util/constants"

//Components
import CourseRound from "../components/CourseRound.jsx"
import CourseTitle from "../components/CourseTitle.jsx"
import CourseCollapseList from "../components/CourseCollapseList.jsx"


@inject(['routerStore']) @observer
class CoursePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
        activeRoundIndex: this.props.routerStore.courseSemesters.length > 0 ? this.props.routerStore.courseSemesters[this.props.routerStore.defaultIndex][3] : 0,
        activeSyllabusIndex: this.props.routerStore.roundsSyllabusIndex[this.props.routerStore.defaultIndex] || 0,
        dropdownsIsOpen:{
          dropDown1: false,
          dropdown2: false
        },
        timeMachineValue: ""
    }

    this.handleDropdownSelect = this.handleDropdownSelect.bind(this)
    this.toggle = this.toggle.bind(this)
    this.openSyllabus = this.openSyllabus.bind(this)

    //Temp!!
    this.handleDateInput=this.handleDateInput.bind(this)
    this.timeMachine=this.timeMachine.bind(this)
  }

  handleDateInput(event){
    this.setState({
      timeMachineValue: event.target.value
    })
  }

  timeMachine(event){
    event.preventDefault()
    const newIndex= this.props.routerStore.getCurrentSemesterToShow(this.state.timeMachineValue)
    console.log("newIndex",newIndex)
    this.setState({
      activeRoundIndex: this.props.routerStore.courseSemesters[newIndex][3],
      activeSyllabusIndex: this.props.routerStore.roundsSyllabusIndex[newIndex] || 0
    })
  }

  static fetchData (routerStore, params) {
    return routerStore.getCourseInformation("sf1624","sv")
      .then((data) => {
        //console.log("data",data)
        return courseData = data
      })
  }

  toggle() {
    let prevState = this.state
    const selectedInfo = event.target.id.indexOf('_') > 0 ? event.target.id.split('_')[0] : event.target.id
    prevState.dropdownsIsOpen[selectedInfo] = !prevState.dropdownsIsOpen[selectedInfo]
    this.setState({
      prevState
    })
  }

  handleDropdownSelect(){
    event.preventDefault()
    const selectInfo = event.target.id.split('_')
    this.setState({
      activeRoundIndex: selectInfo[1],
      activeSyllabusIndex: this.props.routerStore.roundsSyllabusIndex[selectInfo[2]]
    })
  }

  openSyllabus(event){
    event.preventDefault()
    const language = this.props.routerStore.courseData.language === 0 ? "en" : "sv" 
    window.open(`/student/kurser/kurs/kursplan/${this.props.routerStore.courseData.courseInfo.course_code}_${event.target.id}.pdf?lang=${language}`)
  }

  render ({ routerStore}){
    const courseData = routerStore["courseData"]
    const language = this.props.routerStore.courseData.language === 0 ? "en" : "sv" 
    const introText = routerStore.sellingText && routerStore.sellingText[language].length > 0 ? routerStore.sellingText[language] : courseData.courseInfo.course_recruitment_text
    console.log("routerStore in CoursePage", routerStore)
    const courseInformationToRounds = {
      course_code: courseData.courseInfo.course_code,
      course_grade_scale: courseData.courseInfo.course_grade_scale,
      course_level_code: courseData.courseInfo.course_level_code,
      course_main_subject: courseData.courseInfo.course_main_subject,
      course_valid_from: courseData.coursePlan[this.state.activeSyllabusIndex].course_valid_from
    }
    
    return (
      <div  key="kursinfo-container" className="kursinfo-main-page col" >

        {/* ---COURSE TITEL--- */}
        <CourseTitle key = "title"
            courseTitleData = {courseData.courseTitleData}
            language = {courseData.language}
            canEdit = {routerStore.canEdit}
        />

         {/* ---TEXT FOR CANCELLED COURSE --- */}
        {routerStore.isCancelled ?
          <div className="col-12 isCancelled">
            <Alert color="info" aria-live="polite">
                <h3>{i18n.messages[courseData.language].courseInformationLabels.label_course_cancelled} </h3>
                <p>{i18n.messages[courseData.language].courseInformationLabels.label_last_exam}  
                    {i18n.messages[courseData.language].courseInformation.course_short_semester[courseData.courseInfo.course_last_exam[1]]} {courseData.courseInfo.course_last_exam[0]}
                </p>
              </Alert>
          </div>
         :""}

        {/* ---INTRO TEXT--- */}
        <Row id="courseIntroText">
          <Col sm="7">
            <div 
              className = "col-12" 
              dangerouslySetInnerHTML = {{ __html:introText}}>
            </div>
          </Col>
          <Col sm="4" id="imageContainer">
            <img src={routerStore.image} alt="" height="auto" width="100%"/>
          </Col>
        </Row>

        
        {/* ---COURSE ROUND DROPDOWN--- */}
        <div id="courseDropdownMenu" className="col">
          {routerStore.courseSemesters.length === 0 ? "" :
            <div>
                <h4>Välj en kursomgång ( totalt {courseData.courseRoundList.length} st för denna kurs ):</h4>
            </div>
          }
          <div className="row" id="semesterDropdownMenue" key="semesterDropdownMenue">
              { routerStore.courseSemesters.length === 0 ? <h4>Denna kursen har inga kursomgångar/kurstillfällen</h4> : 
                routerStore.courseSemesters.map((semester, index)=>{
                  return <DropdownCreater 
                            courseRoundList = {courseData.courseRoundList} 
                            callerInstance = {this} 
                            year = {semester[0]} 
                            semester={semester[1]} 
                            yearSemester={semester[2]} 
                            language ={courseData.language}
                            parentIndex = {index}
                        />
                })
              }
          </div>
        </div>  

        

        {/* ---COURSE ROUND HEADER--- */}
        { routerStore.courseSemesters.length === 0 ? "" :  
          <div id="courseRoundHeader" className="col-12">
            <h2> Kursinformation för kurstillfället
                  {` ${i18n.messages[courseData.language].courseInformation.course_short_semester[courseData.courseRoundList[this.state.activeRoundIndex].round_course_term[1]]} 
                    ${courseData.courseRoundList[this.state.activeRoundIndex].round_course_term[0]}  
                    ${courseData.courseRoundList[this.state.activeRoundIndex].round_short_name},     
                    ${courseData.courseRoundList[this.state.activeRoundIndex].round_type}` 
                  } 
            </h2>
          </div>   
        }

        {/* ---COURSE ROUND KEY INFORMATION--- */}
        <CourseRound
          courseRound= {courseData.courseRoundList[this.state.activeRoundIndex]}
          index={this.state.activeRoundIndex}
          courseData = {courseInformationToRounds}
          language={courseData.language}
          imageUrl = {routerStore.image}
          courseHasRound ={routerStore.courseSemesters.length > 0 }
        />

        {/* ---IF RESEARCH LEVEL: SHOW "Postgraduate course" LINK--  */}
        {courseData.courseInfo.course_level_code === "RESEARCH" ?
          <span>
            <h3>Forskarkurs</h3>
            <a target="_blank" href={`${FORSKARUTB_URL}/${courseData.courseInfo.course_department_code}`}> 
            {i18n.messages[courseData.language].courseInformationLabels.label_postgraduate_course} {courseData.coursePlan[this.state.activeSyllabusIndex].course_department}
            </a> 
          </span>
          : ""}
        <br/>


        {/* ---COLLAPSE CONTAINER---  */}
        <CourseCollapseList 
            roundIndex={this.state.activeRoundIndex} 
            courseInfo = {courseData.courseInfo} 
            coursePlan = {courseData.coursePlan[this.state.activeSyllabusIndex]} 
            className="ExampleCollapseContainer" 
            isOpen={true} 
            color="blue"
            showCourseLink = {routerStore.showCourseWebbLink} 
          />
        <br/>
        {/* ---TEMP: OLDER SYLLABUSES LINKS--- */}
        <div className="col">
            {courseData.syllabusSemesterList.length > 0 ?
              courseData.syllabusSemesterList.map((semester, index) => 
              <span key={index}>
              <a href="#" key={index} id={semester}  onClick={this.openSyllabus}>
                { i18n.messages[this.props.routerStore.courseData.language].courseInformationLabels.label_course_syllabus_valid_from }&nbsp; 
                {i18n.messages[this.props.routerStore.courseData.language].courseInformation.course_short_semester[semester.toString().substring(4,5)]}  {semester.toString().substring(0,4)} 
                &nbsp;  </a> <br/> </span>)
             : ""
            }
        </div>
        <br/>
        {/* ---TEMP: test of dates --- */}
        <div style="padding:5px; border: 3px dotted pink;">
          <lable>Time machine for testing default information: </lable>
          <input type="date" onChange={this.handleDateInput} />
          <button onClick={this.timeMachine}>Travel in time!</button>
        </div>
      </div>
    )
  }
}


//*******************************************************************************************************************//


const DropdownCreater = ({ courseRoundList , callerInstance, semester, year = "2018", yearSemester, language =0, parentIndex = 0}) => {
  let listIndex = []
  const dropdownID = "dropdown"+parentIndex
  return(
    <div className = "col-2">
      <Dropdown isOpen={callerInstance.state.dropdownsIsOpen[dropdownID]} toggle={callerInstance.toggle} key={"dropD"+parentIndex}>
                <DropdownToggle id={dropdownID} caret>
                  {i18n.messages[language].courseInformation.course_short_semester[semester]} {year}
                </DropdownToggle>
                <DropdownMenu>
                {
                  courseRoundList.filter( (courseRound, index) =>{
                    if(courseRound.round_course_term.join('') === yearSemester){
                      listIndex.push(index)
                      return courseRound
                    }
                  }).map( (courseRound, index) =>{
                  return (
                      <DropdownItem key ={index} id={dropdownID+"_"+listIndex[index]+"_"+parentIndex} onClick = {callerInstance.handleDropdownSelect}> 
                        {
                          `${courseRound.round_type} för ${courseRound.round_short_name}` 
                        } 
                      </DropdownItem>
                  )
                })}
            </DropdownMenu>
          </Dropdown>
      </div>
  )
}

export default CoursePage
