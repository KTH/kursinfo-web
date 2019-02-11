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
import DropdownCreater from "../components/DropdownCreater.jsx"


@inject(['routerStore']) @observer
class CoursePage2 extends Component {
  constructor (props) {
    super(props)
    this.state = {
        activeRoundIndex: this.props.routerStore.courseSemesters.length > 0 ? this.props.routerStore.courseSemesters[this.props.routerStore.defaultIndex][3] : 0,
        activeSyllabusIndex: this.props.routerStore.roundsSyllabusIndex[this.props.routerStore.defaultIndex] || 0,
        dropdownsIsOpen:{},
        activeDropdown: "roundDropdown"+this.props.routerStore.defaultIndex,
        dropdownOpen:false,
        timeMachineValue: "",
        load: true
    }

    this.handleDropdownSelect = this.handleDropdownSelect.bind(this)
    this.toggle = this.toggle.bind(this)
    this.openSyllabus = this.openSyllabus.bind(this)
    this.openEdit = this.openEdit.bind(this)

    //Temp!!
    this.handleDateInput=this.handleDateInput.bind(this)
    this.timeMachine=this.timeMachine.bind(this)
   
  }
 /* componentWillMount(){
    console.log("componentWillMount!!!!!!!!!!!")
  }
  componentWillUpdate(){
    console.log("UPPPPPPPPPDATE!!!!!!!!!!!")
  }
componentDidMount(){
  console.log("componentDidMount!!!!!!!!!!!")
}*/


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

  toggle(event) { 
    if(event){
      const selectedInfo = event.target.id.indexOf('_') > 0 ? event.target.id.split('_')[0] : event.target.id
      let prevState = this.state
      prevState.dropdownsIsOpen = this.clearDropdowns(prevState.dropdownsIsOpen, selectedInfo)
      prevState.dropdownsIsOpen[selectedInfo] =  ! prevState.dropdownsIsOpen[selectedInfo]
      prevState.load = true
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
    let prevState = this.state
    const selectInfo = event.target.id.split('_')
    prevState.activeRoundIndex = selectInfo[1]
    prevState.activeSyllabusIndex = this.props.routerStore.roundsSyllabusIndex[selectInfo[2]]
    prevState.activeDropdown = selectInfo[0]
    prevState.load = true
    this.setState({
      prevState
    })
    this.toggle(event)
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
          <Col sm="1" xs="1"></Col>
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

              { courseData.courseRoundList.length === 0 ?  "" :
                <Alert color="grey" style="display:none;">
                  Det finns totalt {courseData.courseRoundList.length} st kurstillfällen för den här kursen.
                  <br/><br/>
                  Just nu visas information för kurstillfälle 
                  <b>{` 
                    ${i18n.messages[courseData.language].courseInformation.course_short_semester[courseData.courseRoundList[this.state.activeRoundIndex].round_course_term[1]]} 
                    ${courseData.courseRoundList[this.state.activeRoundIndex].round_course_term[0]}  
                    ${courseData.courseRoundList[this.state.activeRoundIndex].round_short_name !== EMPTY ? courseData.courseRoundList[this.state.activeRoundIndex].round_short_name : ""},     
                    ${courseData.courseRoundList[this.state.activeRoundIndex].round_type}
                  `} </b>
                  med kursplan {i18n.messages[courseData.language].courseInformationLabels.label_course_syllabus_valid_from.toLowerCase() }
                  <b>
                    &nbsp; {i18n.messages[courseData.language].courseInformation.course_short_semester[courseData.coursePlan[this.state.activeSyllabusIndex].course_valid_from[1]]} &nbsp;{courseData.coursePlan[this.state.activeSyllabusIndex].course_valid_from[0]} 
                  </b> <br/>
                </Alert> 
              }
              
              
              {/* ---COURSE ROUND DROPDOWN--- */}
              <div id="courseDropdownMenu" className="">
                <h3>Välj ett kurstillfälle:</h3>
                  <div className="row" id="semesterDropdownMenue" key="semesterDropdownMenue">
                    {routerStore.courseSemesters.length === 0 ? 
                      <Alert color="info">
                        {i18n.messages[courseData.language].courseInformationLabels.lable_no_rounds}
                      </Alert> : 
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
            
            {/* ---COURSE ROUND HEADER--- */}
            { routerStore.courseSemesters.length === 0 ? "" :  
              <Row id="courseRoundHeader" className="col">
                <h4>
                  {` 
                     
                    
                    ${courseData.courseRoundList[this.state.activeRoundIndex].round_short_name !== EMPTY ? courseData.courseRoundList[this.state.activeRoundIndex].round_short_name : ""}     
                    ${courseData.courseRoundList[this.state.activeRoundIndex].round_type}
                  `} 
                </h4>
              </Row>   
            }
          </div> 
        </Col>
      </Row> 
      {/***************************************************************************************************************/}
      {/*                                                KEY INFORMATION                                              */}
      {/***************************************************************************************************************/}
      <Row> 
        <Col >
          <Col id="keyInformationContainer" sm="4" xs="12" className="float-md-right" >

         
            {/* ---COURSE ROUND KEY INFORMATION--- */}
            <CourseKeyInformationOneCol
              courseRound= {courseData.courseRoundList[this.state.activeRoundIndex]}
              index={this.state.activeRoundIndex}
              courseData = {courseInformationToRounds}
              language={courseData.language}
              imageUrl = {routerStore.image}
              courseHasRound ={routerStore.courseSemesters.length > 0 }
              load ={this.state.load}
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
          
          <div className="key-info">
            {/* ---STATISTICS LINK--- */}
            <p>
              <i class="fas fa-chart-line"></i>
              <a href="https://www.skrattnet.se/roliga-texter/avslojande-statistik" target="_blank" >
                {i18n.messages[this.props.routerStore.courseData.language].courseInformationLabels.label_statistics}
              </a>
            </p>

            {/* ---CANAVAS EXAMPLE LINK--- */}
            <p>
            <i class="fas fa-desktop"></i>
              <a href="https://www.youtube.com/watch?v=s0JA9MgoT4o" target="_blank" >
                {i18n.messages[this.props.routerStore.courseData.language].courseInformationLabels.lable_canavas_example}
              </a>
            </p>

            {/* --- ALL SYLLABUS LINKS--- */}
            <h4>{i18n.messages[this.props.routerStore.courseData.language].courseInformationLabels.label_course_syllabuses}</h4>
              {courseData.syllabusSemesterList.length > 0 ?
                courseData.syllabusSemesterList.map((semester, index) => 
                <span key={index}>
                 <i class="fas fa-file-pdf"></i><a href="#" key={index} id={semester}  onClick={this.openSyllabus}>
                    { i18n.messages[this.props.routerStore.courseData.language].courseInformationLabels.label_course_syllabus_valid_from }&nbsp; 
                    {i18n.messages[this.props.routerStore.courseData.language].courseInformation.course_short_semester[semester.toString().substring(4,5)]}  {semester.toString().substring(0,4)} 
                    &nbsp;  
                  </a> <br/> 
                </span>)
              : "" }
           
          </div>
        </Col>

        {/***************************************************************************************************************/}
        {/*                                 SYLLABUS + OTHER COURSE INFORMATION                                         */}
        {/***************************************************************************************************************/}
        <Col id="coreContent" sm="8" xs="12" >

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

       
        <br/>
        {/* ---TEMP: test of dates --- */}
        <div style="padding:5px; border: 3px dotted pink;">
          <lable>Time machine for testing default information: </lable>
          <input type="date" onChange={this.handleDateInput} />
          <button onClick={this.timeMachine}>Travel in time!</button>
        </div>
      </Col>
     </Col>
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


export default CoursePage2
