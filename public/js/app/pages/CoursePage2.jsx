import { Component } from 'inferno'
import { inject, observer } from 'inferno-mobx'

import Alert from 'inferno-bootstrap/dist/Alert'
import Button from 'inferno-bootstrap/lib/Button'
import Col from 'inferno-bootstrap/dist/Col'
import Row from 'inferno-bootstrap/dist/Row'

import i18n from "../../../../i18n"
import { EMPTY, FORSKARUTB_URL } from "../util/constants"

//Components
import CourseKeyInformationOneCol from "../components/CourseKeyInformationOneCol.jsx"
import CourseTitle from "../components/CourseTitle.jsx"
import CourseSectionList from "../components/CourseSectionList.jsx"
import CourseFileLinks from "../components/CourseFileLinks.jsx"
//import DropdownCreater from "../components/DropdownCreater.jsx"

import Dropdown from 'inferno-bootstrap/dist/Dropdown'
import DropdownMenu from 'inferno-bootstrap/dist/DropdownMenu'
import DropdownItem from 'inferno-bootstrap/dist/DropdownItem'
import DropdownToggle from 'inferno-bootstrap/dist/DropdownToggle'


@inject(['routerStore']) @observer
class CoursePage2 extends Component {
  constructor (props) {
    super(props)
    this.state = {
        activeRoundIndex: this.props.routerStore.courseSemesters.length > 0 ? this.props.routerStore.courseSemesters[this.props.routerStore.defaultIndex][3] : 0,
        activeSemester: this.props.routerStore.defaultIndex,
        activeSyllabusIndex: this.props.routerStore.roundsSyllabusIndex[this.props.routerStore.defaultIndex] || 0,
        dropdownsIsOpen:{},
        activeDropdown: "roundDropdown"+this.props.routerStore.defaultIndex,
        dropdownOpen:false,
        timeMachineValue: "",
        keyInfoFade: false,
        syllabusInfoFade: false,
        forceAnimationKey: "test0"
    }

    this.handleDropdownSelect = this.handleDropdownSelect.bind(this)
    this.toggle = this.toggle.bind(this)
    this.openSyllabus = this.openSyllabus.bind(this)
    this.openEdit = this.openEdit.bind(this)
    this.handleSemesterButtonClick = this.handleSemesterButtonClick.bind(this)

    //Temp!!
    this.handleDateInput=this.handleDateInput.bind(this)
    this.timeMachine=this.timeMachine.bind(this)
   
  }
 
  handleSemesterButtonClick(){
    event.preventDefault()
    let prevState = this.state
    const selectedSemester = event.target.id.split('_')
    if(selectedSemester && selectedSemester[0].indexOf('semesterBtn') > -1){
      let syllabusChange = prevState.activeSyllabusIndex !== this.props.routerStore.roundsSyllabusIndex[Number(selectedSemester[1])]
      if(syllabusChange){
        this.setState({ syllabusInfoFade: false,
          forceAnimationKey:"test"+Math.random()
         })
        console.log("this state",this.state)}
      this.setState({ 
        activeSemester: Number(selectedSemester[1]),
        activeSyllabusIndex: this.props.routerStore.roundsSyllabusIndex[Number(selectedSemester[1])] || 0,
        activeRoundIndex: this.props.routerStore.courseSemesters[Number(selectedSemester[1])][3],
        activeDropdown: selectedSemester[0],
        syllabusInfoFade: syllabusChange,
        forceAnimationKey:"test"+Math.random()
      })
    }
  }

  componentDidMount(){
    console.log("componentDidMount")
  }
  componentDidUpdate(){
    console.log("componentDidUpdate")
    //if(this.state.syllabusInfoFade)
      //this.setState({ syllabusInfoFade: false })
  }

//Temp!!
  handleDateInput(event){
    this.setState({
      timeMachineValue: event.target.value
    })
  }

  timeMachine(event){
    event.preventDefault()
    const newIndex= this.props.routerStore.getCurrentSemesterToShow(this.state.timeMachineValue)
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

  toggle(event, keyInfoFade=false, syllabusInfoFade=false) { 
    if(event){
      const selectedInfo = event.target.id.indexOf('_') > 0 ? event.target.id.split('_')[0] : event.target.id
      let prevState = this.state
      prevState.dropdownsIsOpen = this.clearDropdowns(prevState.dropdownsIsOpen, selectedInfo)
      prevState.dropdownsIsOpen[selectedInfo] =  ! prevState.dropdownsIsOpen[selectedInfo]
      prevState.keyInfoFade = keyInfoFade
      console.log("toggle", prevState.fade, keyInfoFade, syllabusInfoFade)
      this.setState({
        prevState
      })
    }
  }

  clearDropdowns(dropdownList, dontChangeKey){
    Object.keys(dropdownList).forEach(function(key) {
      if(key !== dontChangeKey)
        dropdownList[key] = false
    })
    return dropdownList
  }

  handleDropdownSelect(event){
    event.preventDefault()
    const selectInfo = event.target.id.split('_')
    this.setState({
      activeRoundIndex: selectInfo[1]
    })
    this.toggle(event, true)
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
    console.log("state in CoursePage", this.state)
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
          
          <Col sm="1" xs="1"> </Col>
          {/***************************************************************************************************************/}
          {/*                                                   INTRO                                                     */}
          {/***************************************************************************************************************/}
          <Col sm="10" xs="12">

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
              <Col sm="12" xs="12">
                <img src={routerStore.image} alt="" height="auto" width="300px"/>
                <div 
                  dangerouslySetInnerHTML = {{ __html:introText}}>
                </div>
              </Col>
            </Row>
          {/***************************************************************************************************************/}
          {/*                                         DROPDOWN MENUE                                                      */}
          {/***************************************************************************************************************/}
          <Row>
            <Col sm="12">
              <h2>{i18n.messages[courseData.language].courseInformationLabels.header_course_info} </h2>
              
              {/* ---COURSE ROUND DROPDOWN--- */}
              {routerStore.courseSemesters.length === 0 ? "" :
                <div id="courseDropdownMenu" className="">
                  <h3>Välj en termin:</h3>
                  <div className="row" id="semesterDropdownMenue" key="semesterDropdownMenue">
                    {
                      routerStore.courseSemesters.map((semester, index)=>{
                        return  <Button  style="margin-right:20px;margin-left:15px;" 
                                  key={"semesterBtn"+index} 
                                  id={"semesterBtn"+index+"_"+index}
                                  className={"semesterBtn"+this.state.activeSemester==="semesterBtn"+index ? "is-active dropdown-clean": "dropdown-clean"} 
                                  onClick={this.handleSemesterButtonClick}
                                >
                                  {i18n.messages[courseData.language].courseInformation.course_short_semester[semester[1]]} {semester[0]}
                                </Button>
                        })
                      }
                    </div>
                </div>
              }
          </Col>
        </Row> 
      
      <Row> 
        <Col >
          {/***************************************************************************************************************/}
          {/*                                      RIGHT COLUMN - KEY INFORMATION                                         */}
          {/***************************************************************************************************************/}
          <Col id="keyInformationContainer" sm="4" xs="12" className="float-md-right" >
            <h2 style="margin-top:0px">Kurstillfälle och genomförande</h2>

            {/* ---COURSE ROUND DROPDOWN--- */}
            <div id="roundDropdownMenu" className="">
                  <div className="row" id="semesterDropdownMenue" key="semesterDropdownMenue">
                    {routerStore.courseSemesters.length === 0 ? 
                      <Alert color="info">
                        {i18n.messages[courseData.language].courseInformationLabels.lable_no_rounds}
                      </Alert> : 
                      routerStore.courseSemesters.length > 1 ? 
                       <DropdownCreater2
                            courseRoundList = {courseData.courseRoundList} 
                            callerInstance = {this} 
                            year = {routerStore.courseSemesters[this.state.activeSemester][0]} 
                            semester={ routerStore.courseSemesters[this.state.activeSemester][1]} 
                            yearSemester={routerStore.courseSemesters[this.state.activeSemester][2]} 
                            language ={courseData.language}
                            parentIndex = "0"
                        />
                      :""
                    }
                  </div>
             </div>

            {/* ---COURSE ROUND KEY INFORMATION--- */}
            <CourseKeyInformationOneCol
              courseRound= {courseData.courseRoundList[this.state.activeRoundIndex]}
              index={this.state.activeRoundIndex}
              courseData = {courseInformationToRounds}
              language={courseData.language}
              imageUrl = {routerStore.image}
              courseHasRound ={routerStore.courseSemesters.length > 0 }
              fade ={this.state.keyInfoFade}
            />

            {/* ---IF RESEARCH LEVEL: SHOW "Postgraduate course" LINK--  */}
            {courseData.courseInfo.course_level_code === "RESEARCH" ?
              <span>
                <h3>Forskarkurs</h3>
                <a target="_blank" href={`${FORSKARUTB_URL}/${courseData.courseInfo.course_department_code}`}> 
                  {i18n.messages[courseData.language].courseInformationLabels.label_postgraduate_course} {courseData.courseInfo.course_department}
                </a> 
              </span>
            : ""}
          
          
        </Col>

        {/***************************************************************************************************************/}
        {/*                           LEFT COLUMN - SYLLABUS + OTHER COURSE INFORMATION                                 */}
        {/***************************************************************************************************************/}
        <Col id="coreContent"  sm="8" xs="12" className="float-md-left">
        <div key={this.state.forceAnimationKey} className={` fade-container ${this.state.syllabusInfoFade === true ? " fadeOutIn" : ""}`}>


        {/* --- ACTIVE SYLLABUS LINK---  */}
        {courseData.coursePlan.length > 0 ?
          <span>
            <i class="fas fa-file-pdf"></i> 
            <a href="javascript" onClick={this.openSyllabus} id={courseData.coursePlan[this.state.activeSyllabusIndex].course_valid_from[0] + courseData.coursePlan[this.state.activeSyllabusIndex].course_valid_from[1]}>
                {i18n.messages[courseData.language].courseInformationLabels.label_course_syllabus}
            </a>
            <span className="small-text" >
              &nbsp;( {i18n.messages[courseData.language].courseInformationLabels.label_course_syllabus_valid_from }&nbsp; 
              {i18n.messages[courseData.language].courseInformation.course_short_semester[courseData.coursePlan[this.state.activeSyllabusIndex].course_valid_from[1]]}  {courseData.coursePlan[this.state.activeSyllabusIndex].course_valid_from[0]} )
            </span>
          </span>
        : "" }

        {/* --- COURSE INFORMATION CONTAINER---  */}
        <CourseSectionList 
          roundIndex={this.state.activeRoundIndex} 
          courseInfo = {courseData.courseInfo} 
          coursePlan = {courseData.coursePlan[this.state.activeSyllabusIndex]} 
          showCourseLink = {routerStore.showCourseWebbLink} 
          partToShow = "second"
        />
      
          {/* ---STATISTICS LINK--- */}
          <h3>Kursens utveckling</h3>
            <p>
              
              <a href="https://www.skrattnet.se/roliga-texter/avslojande-statistik" target="_blank" >
                {i18n.messages[courseData.language].courseInformationLabels.label_statistics}
              </a>
            </p>

            {/* --- ALL SYLLABUS LINKS--- */}
            <h3>{i18n.messages[courseData.language].courseInformationLabels.label_course_syllabuses}</h3>
              {courseData.syllabusSemesterList.length > 0 ?
                courseData.syllabusSemesterList.map((semester, index) => 
                <span key={index}>
                 <i class="fas fa-file-pdf"></i><a href="#" key={index} id={semester}  onClick={this.openSyllabus}>
                    {i18n.messages[courseData.language].courseInformationLabels.label_course_syllabus_valid_from }&nbsp; 
                    {i18n.messages[courseData.language].courseInformation.course_short_semester[semester.toString().substring(4,5)]}  {semester.toString().substring(0,4)} 
                    &nbsp;  
                  </a> <br/> 
                </span>)
              : "" }
            </div>
      </Col>
        
     </Col>
     <br/>
        {/* ---TEMP: test of dates --- 

        <span style="padding:5px; border: 3px dotted pink;">
          <lable>Time machine for testing default information: </lable>
          <input type="date" onChange={this.handleDateInput} />
          <button onClick={this.timeMachine}>Travel in time!</button>
        </span>*/}
    </Row>
  </Col>

  {/* ---EDIT BUTTON --- */}
  <Col sm="1" xs="1">
        {
          routerStore.canEdit ? 
            <Button className="editButton" color="primery" onClick={this.openEdit} id={courseData.courseInfo.course_code}>
             <i class="fas fa-edit"></i> {i18n.messages[courseData.language].courseInformationLabels.label_edit}
            </Button> 
          : ""
        }
        </Col>
        </Row>
      </div>
    )
  }
}

const DropdownCreater2 = ({ courseRoundList , callerInstance, semester, year = "2018", yearSemester, language =0, parentIndex = 0}) => {
  let listIndex = []
  const dropdownID = "roundDropdown"+parentIndex

  courseRoundList.filter( (courseRound, index) =>{
    if(courseRound.round_course_term.join('') === yearSemester){
        listIndex.push(index)
        return courseRound
    }
  })
  if(listIndex.length < 2)
    return ""
  else
  return(
    <div className = "col-12 round-dropdowns">
      <Dropdown  group 
          isOpen={callerInstance.state.dropdownsIsOpen[dropdownID]} 
          toggle={callerInstance.toggle} 
          key={"dropD"+parentIndex} 
          onMouseOver={callerInstance.dropdownHover}  
          onMouseLeave={callerInstance.dropdownLeave}  
          id={dropdownID}
          className="select-round"
          >
         <DropdownToggle 
            className={callerInstance.state.activeDropdown===dropdownID ? "is-active dropdown-clean": "dropdown-clean"} 
            id={dropdownID} caret >
               Kurstillfällen för {i18n.messages[language].courseInformation.course_short_semester[semester]} {year}
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
                    `${courseRound.round_short_name !== EMPTY ? courseRound.round_short_name : "" },     
                     ${courseRound.round_type}`
                  }       
                </DropdownItem>
              ) })
          }
          </DropdownMenu>
        </Dropdown>
      </div>
  )
}

export default CoursePage2
