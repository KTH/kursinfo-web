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
import Button from 'inferno-bootstrap/lib/Button'

import i18n from "../../../../i18n"
import { EMPTY, FORSKARUTB_URL } from "../util/constants"

//Components
import CourseRound from "../components/CourseRound.jsx"
import CourseTitle from "../components/CourseTitle.jsx"
import CourseSectionList from "../components/CourseSectionList.jsx"


@inject(['routerStore']) @observer
class CoursePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
        activeRoundIndex: this.props.routerStore.courseSemesters.length > 0 ? this.props.routerStore.courseSemesters[this.props.routerStore.defaultIndex][3] : 0,
        activeSyllabusIndex: this.props.routerStore.roundsSyllabusIndex[this.props.routerStore.defaultIndex] || 0,
        dropdownsIsOpen:{},
        activeDropdown: "roundDropdown"+this.props.routerStore.defaultIndex,
        dropdownOpen:false,
        timeMachineValue: ""
    }

    this.handleDropdownSelect = this.handleDropdownSelect.bind(this)
    this.toggle = this.toggle.bind(this)
    this.openSyllabus = this.openSyllabus.bind(this)
    this.openEdit = this.openEdit.bind(this)

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
    prevState.dropdownsIsOpen = this.clearDropdowns(prevState.dropdownsIsOpen, selectedInfo)
    prevState.dropdownsIsOpen[selectedInfo] =  ! prevState.dropdownsIsOpen[selectedInfo]
    console.log("PREV2", prevState)
      this.setState({
        prevState
      })
  }

  clearDropdowns(dropdownList, dontChangeKey){
    Object.keys(dropdownList).forEach(function(key) {
      if(key !== dontChangeKey)
        dropdownList[key] = false
    })
    return dropdownList
  }

  handleDropdownSelect(){
    event.preventDefault()
    let prevState = this.state
    const selectInfo = event.target.id.split('_')
    prevState.activeRoundIndex = selectInfo[1]
    prevState.activeSyllabusIndex = this.props.routerStore.roundsSyllabusIndex[selectInfo[2]]
    prevState.activeDropdown = selectInfo[0]
    this.setState({
      prevState
    })
  }

  openSyllabus(event){
    event.preventDefault()
    const language = this.props.routerStore.courseData.language === 0 ? "en" : "sv" 
    window.open(`/student/kurser/kurs/kursplan/${this.props.routerStore.courseData.courseInfo.course_code}_${event.target.id}.pdf?lang=${language}`)
  }

  openEdit(){
    event.preventDefault()
    const language = this.props.routerStore.courseData.language === 0 ? "en" : "sv" 
    //window.open(`/student/kurser/kurs/admin/${this.props.courseTitleData.course_code}?lang=${language}`)
    window.location =`/admin/kurser/kurs/${this.props.routerStore.courseData.courseInfo.course_code}?l=${language}`
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
      <Row>
        <Col sm="2" xs="1"></Col>
        <Col sm="8" xs="12">
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
        <Col sm="5" xs="12"  id="imageContainer">
            <img src={routerStore.image} alt="" height="auto" width="100%"/>
          </Col>
          <Col sm="7" xs="12">
            <div 
              dangerouslySetInnerHTML = {{ __html:introText}}>
            </div>
          </Col>
        </Row>

       <Row>
         <Col sm="12">
          <h2>{i18n.messages[courseData.language].courseInformationLabels.course_info_header} </h2>
         </Col>
       </Row>

        
        {/* ---COURSE ROUND DROPDOWN--- */}
        <div id="courseDropdownMenu" className="">
          <div className="row" id="semesterDropdownMenue" key="semesterDropdownMenue">
              { routerStore.courseSemesters.length === 0 ? 
                  <Alert color="info">{i18n.messages[courseData.language].courseInformationLabels.lable_no_rounds}</Alert> : 
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
          <Row id="courseRoundHeader" className="col">
            <h4>
                  {` ${i18n.messages[courseData.language].courseInformation.course_short_semester[courseData.courseRoundList[this.state.activeRoundIndex].round_course_term[1]]} 
                    ${courseData.courseRoundList[this.state.activeRoundIndex].round_course_term[0]}  
                    ${courseData.courseRoundList[this.state.activeRoundIndex].round_short_name},     
                    ${courseData.courseRoundList[this.state.activeRoundIndex].round_type}` 
                  } 
            </h4>
          </Row>   
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


        {/* --- COURSE INFORATION CONTAINER---  */}
        <CourseSectionList 
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
        <div className="col-12">
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
        </Col>
        <Col sm="2" xs="1">
        {
          routerStore.canEdit ? 
            <Button className="editButton" color="primery" onClick={this.openEdit} id={courseData.courseInfo.course_code}>
             <i className="icon-edit"></i> {i18n.messages[courseData.language].courseInformationLabels.label_edit}
            </Button> 
          : ""
        }
        </Col>
        </Row>
      </div>
    )
  }
}


//*******************************************************************************************************************//


const DropdownCreater = ({ courseRoundList , callerInstance, semester, year = "2018", yearSemester, language =0, parentIndex = 0}) => {
  let listIndex = []
  const dropdownID = "roundDropdown"+parentIndex
  return(
    <div className = "col-2">
      <Dropdown  group isOpen={callerInstance.state.dropdownsIsOpen[dropdownID]} toggle={callerInstance.toggle} key={"dropD"+parentIndex} >
                <DropdownToggle className={callerInstance.state.activeDropdown===dropdownID ? "is-active dropdown-clean": "dropdown-clean"} id={dropdownID} caret >
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
