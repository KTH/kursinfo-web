import { Component } from 'inferno'
import { inject, observer } from 'inferno-mobx'

import Alert from 'inferno-bootstrap/dist/Alert'
import Button from 'inferno-bootstrap/lib/Button'
import Col from 'inferno-bootstrap/dist/Col'
import Row from 'inferno-bootstrap/dist/Row'

import i18n from "../../../../i18n"
import { EMPTY, FORSKARUTB_URL, ADMIN_URL, SYLLABUS_URL } from "../util/constants"

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
        syllabusInfoFade: false
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
      const newIndex = Number(selectedSemester[1])
      prevState.syllabusInfoFade  = prevState.activeSyllabusIndex !== this.props.routerStore.roundsSyllabusIndex[newIndex]

      this.setState({ 
        activeSemester: newIndex,
        activeSyllabusIndex: this.props.routerStore.roundsSyllabusIndex[newIndex] || 0,
        activeRoundIndex: this.props.routerStore.courseSemesters[newIndex][3],
        activeDropdown: selectedSemester[0],
        syllabusInfoFade: prevState.syllabusInfoFade,
        keyInfoFade:true
      })
    }
  }

  componentDidUpdate(){
    //Reset animation after triggered
    if(this.state.syllabusInfoFade){
      let that = this
      setTimeout(()=> { that.setState({ syllabusInfoFade: false,  keyInfoFade:false}) }, 800)
    }
    else 
      if(this.state.keyInfoFade){
        let that = this
        setTimeout(()=> { that.setState({keyInfoFade:false}) }, 500)
      }
  }

//Temp!!*******
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
//!!!********
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
    window.open(`${SYLLABUS_URL}${this.props.routerStore.courseData.courseInfo.course_code}_${event.target.id}.pdf?lang=${language}`)
  }

  openEdit(){
    event.preventDefault()
    const language = this.props.routerStore.courseData.language === 0 ? "en" : "sv" 
    window.location =`${ADMIN_URL}${this.props.routerStore.courseData.courseInfo.course_code}?l=${language}`
  }

  render ({ routerStore}){
    const courseData = routerStore["courseData"]
    const language = this.props.routerStore.courseData.language === 0 ? "en" : "sv" 
    const translation = i18n.messages[courseData.language]
    const introText = routerStore.sellingText && routerStore.sellingText[language].length > 0 ? routerStore.sellingText[language] : courseData.courseInfo.course_recruitment_text
   
    console.log("routerStore in CoursePage", routerStore)
    console.log("state in CoursePage", this.state)

    const courseInformationToRounds = {
      course_code: courseData.courseInfo.course_code,
      course_examiners: courseData.courseInfo.course_examiners,
      course_contact_name: courseData.courseInfo.course_contact_name,
      course_main_subject: courseData.courseInfo.course_main_subject,
      course_level_code: courseData.courseInfo.course_level_code,
      course_valid_from: courseData.coursePlan[this.state.activeSyllabusIndex].course_valid_from,
    }
    
    return (
      <div  key="kursinfo-container" className="col" id="kursinfo-main-page" > 
        <Row>
          
          <Col sm="1" xs="1"> </Col>
          {/***************************************************************************************************************/}
          {/*                                                   INTRO                                                     */}
          {/***************************************************************************************************************/}
          <Col sm="12" xs="12" lg="10">

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
                    <h3>{translation.courseInformationLabels.label_course_cancelled} </h3>
                    <p>{translation.courseInformationLabels.label_last_exam}  
                        {translation.courseInformation.course_short_semester[courseData.courseInfo.course_last_exam[1]]} {courseData.courseInfo.course_last_exam[0]}
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
              <h2>{translation.courseInformationLabels.header_course_info} </h2>
              
              {/* ---COURSE SEMESTER BUTTONS--- */}
              {routerStore.courseSemesters.length === 0 ? "" :
                <div id="courseDropdownMenu" className="">
                  <h3>{translation.courseInformationLabels.header_semester_menue}</h3>
                  <div className="row" id="semesterDropdownMenue" key="semesterDropdownMenue">
                    {
                      routerStore.courseSemesters.map((semester, index)=>{
                      
                        return  <Button  style="margin-right:20px;margin-left:15px;" 
                                  key={"semesterBtn"+index} 
                                  id={"semesterBtn"+index+"_"+index}
                                  className={"semesterBtn"+this.state.activeSemester==="semesterBtn"+index ? "is-active dropdown-clean": "dropdown-clean"} 
                                  onClick={this.handleSemesterButtonClick}
                                >
                                  {translation.courseInformation.course_short_semester[semester[1]]} {semester[0]}
                                </Button>
                        })
                      }
                    </div>
                </div>
              }
            <Row id="syllabusLink">
              <Col  sm="12">
                {/* --- ACTIVE SYLLABUS LINK---  */}
                <div key="fade-2" className={` fade-container ${this.state.syllabusInfoFade === true ? " fadeOutIn" : ""}`}>
                  {courseData.syllabusSemesterList.length > 0 ?
                    <span>
                      <i class="fas fa-file-pdf"></i> 
                      <a 
                        href={`${SYLLABUS_URL}${routerStore.courseData.courseInfo.course_code}_${courseData.coursePlan[this.state.activeSyllabusIndex].course_valid_from.join('')}.pdf?lang=${language}`}  
                        id={courseData.coursePlan[this.state.activeSyllabusIndex].course_valid_from.join('')}
                        target="_blank"
                      >
                          {translation.courseInformationLabels.label_course_syllabus}
                      </a>
                      {/*<span className="small-text" >
                        &nbsp;( {translation.courseInformationLabels.label_course_syllabus_valid_from }&nbsp; 
                        {translation.courseInformation.course_short_semester[courseData.coursePlan[this.state.activeSyllabusIndex].course_valid_from[1]]}  {courseData.coursePlan[this.state.activeSyllabusIndex].course_valid_from[0]} )
                        </span>*/}
                      <span className="small-text" >
                      {` ( ${translation.courseInformationLabels.label_course_syllabus_valid_from }
                        ${translation.courseInformation.course_short_semester[courseData.coursePlan[this.state.activeSyllabusIndex].course_valid_from[1]]}  ${courseData.coursePlan[this.state.activeSyllabusIndex].course_valid_from[0]} 
                        
                        ${ courseData.coursePlan[this.state.activeSyllabusIndex].course_valid_to.length > 0 ? translation.courseInformationLabels.label_course_syllabus_valid_to + translation.courseInformation.course_short_semester[courseData.coursePlan[this.state.activeSyllabusIndex].course_valid_to[1]] +" "+courseData.coursePlan[this.state.activeSyllabusIndex].course_valid_to[0]: ""} )
                      `}   
                        </span>
                    </span>
                  : "" }
                </div>
              </Col>
            </Row>
          </Col>
        </Row> 
      <Row> 
        <Col >
          {/***************************************************************************************************************/}
          {/*                                      RIGHT COLUMN - KEY INFORMATION                                         */}
          {/***************************************************************************************************************/}
          <Col id="keyInformationContainer" sm="4" xs="12" className="float-md-right" >
            <h2 style="margin-top:0px">{translation.courseInformationLabels.header_round}</h2>

            {/* ---COURSE ROUND DROPDOWN--- */}
            <div id="semesterDropdownMenue" className="">
                  <div className="row" id="semesterDropdownMenue" key="semesterDropdownMenue">

                    {routerStore.courseSemesters.length === 0 ? 
                      <Alert color="info">
                        {translation.courseInformationLabels.lable_no_rounds}
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
                            lable = {translation.courseInformationLabels.lable_round_dropdown}
                        />
                      :""
                    }
                    {routerStore.courseSemesters.length > 0 && courseData.courseRoundList[this.state.activeRoundIndex].round_state !== "APPROVED" ? 
                      <Alert color="info" aria-live="polite" >
                          <h4>{i18n.messages[courseData.language].courseInformationLabels.lable_round_state[courseData.courseRoundList[this.state.activeRoundIndex].round_state]} </h4>
                      </Alert>
                    :""}
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
        </Col>

        {/***************************************************************************************************************/}
        {/*                           LEFT COLUMN - SYLLABUS + OTHER COURSE INFORMATION                                 */}
        {/***************************************************************************************************************/}
        <Col id="coreContent"  sm="8" xs="12" className="float-md-left">
          <div key="fade-2" className={` fade-container ${this.state.syllabusInfoFade === true ? " fadeOutIn" : ""}`}>


        {/* --- ACTIVE SYLLABUS LINK---  */}
        {/*courseData.syllabusSemesterList.length > 0 ?
          <span>
            <i class="fas fa-file-pdf"></i> 
            <a href="javascript" onClick={this.openSyllabus} id={courseData.coursePlan[this.state.activeSyllabusIndex].course_valid_from[0] + courseData.coursePlan[this.state.activeSyllabusIndex].course_valid_from[1]}>
                {translation.courseInformationLabels.label_course_syllabus}
            </a>
            <span className="small-text" >
              &nbsp;( {translation.courseInformationLabels.label_course_syllabus_valid_from }&nbsp; 
              {translation.courseInformation.course_short_semester[courseData.coursePlan[this.state.activeSyllabusIndex].course_valid_from[1]]}  {courseData.coursePlan[this.state.activeSyllabusIndex].course_valid_from[0]} )
            </span>
          </span>
              : "" */}

         {/* --- COURSE INFORMATION CONTAINER---  */}
         <CourseSectionList 
          roundIndex={this.state.activeRoundIndex} 
          courseInfo = {courseData.courseInfo} 
          coursePlan = {courseData.coursePlan[this.state.activeSyllabusIndex]} 
          showCourseLink = {routerStore.showCourseWebbLink} 
          partToShow = "firstBlock"
        />

       
      
          {/* ---STATISTICS LINK--- */}
          <h2> {translation.courseInformationLabels.header_statistics}</h2>
            <p>
              
            <i class="fas fa-chart-line"></i> <a href="https://www.skrattnet.se/roliga-texter/avslojande-statistik" target="_blank" >
                {translation.courseInformationLabels.label_statistics}
              </a>
            </p>

            {/* --- ALL SYLLABUS LINKS--- */}
            <h2>{translation.courseInformationLabels.header_syllabuses}</h2>
              {courseData.syllabusSemesterList.length > 0 ?
                courseData.syllabusSemesterList.map((semester, index) => 
                <span key={index}>
                 <i class="fas fa-file-pdf"></i><a href="#" key={index} id={semester}  onClick={this.openSyllabus}>
                    {translation.courseInformationLabels.label_course_syllabus_valid_from }&nbsp; 
                    {translation.courseInformation.course_short_semester[semester.toString().substring(4,5)]}  {semester.toString().substring(0,4)} 
                    &nbsp;  
                  </a> <br/> 
                </span>)
              : "" }
          </div>

           {/* --- COURSE INFORMATION CONTAINER---  */}
        <CourseSectionList 
          roundIndex={this.state.activeRoundIndex} 
          courseInfo = {courseData.courseInfo} 
          coursePlan = {courseData.coursePlan[this.state.activeSyllabusIndex]} 
          showCourseLink = {routerStore.showCourseWebbLink} 
          partToShow = "secondBlock"
        />

        {/* ---IF RESEARCH LEVEL: SHOW "Postgraduate course" LINK--  */}
        {courseData.courseInfo.course_level_code === "RESEARCH" ?
              <span>
                <h3>Forskarkurs</h3>
                <a target="_blank" href={`${FORSKARUTB_URL}${courseData.courseInfo.course_department_code}`}> 
                  {translation.courseInformationLabels.label_postgraduate_course} {courseData.courseInfo.course_department}
                </a> 
              </span>
            : ""}
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
             <i class="fas fa-edit"></i> {translation.courseInformationLabels.label_edit}
            </Button> 
          : ""
        }
        </Col>
        </Row>
      </div>
    )
  }
}

const DropdownCreater2 = ({ courseRoundList , callerInstance, semester, year = "2018", yearSemester, language =0, parentIndex = 0, lable=""}) => {
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
               {lable} {i18n.messages[language].courseInformation.course_short_semester[semester]} {year}
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
                    `${courseRound.round_short_name !== EMPTY[language] ? courseRound.round_short_name : "" },     
                     ${courseRound.round_type}`
                  }       
                </DropdownItem>
              ) 
            })
          }
          </DropdownMenu>
        </Dropdown>
      </div>
  )
}

export default CoursePage2
