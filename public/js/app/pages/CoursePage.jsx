import { Component } from 'inferno'
import { inject, observer } from 'inferno-mobx'

import Alert from 'inferno-bootstrap/dist/Alert'
import Button from 'inferno-bootstrap/lib/Button'
import Col from 'inferno-bootstrap/dist/Col'
import Row from 'inferno-bootstrap/dist/Row'

import Dropdown from 'inferno-bootstrap/dist/Dropdown'
import DropdownMenu from 'inferno-bootstrap/dist/DropdownMenu'
import DropdownItem from 'inferno-bootstrap/dist/DropdownItem'
import DropdownToggle from 'inferno-bootstrap/dist/DropdownToggle'

import i18n from '../../../../i18n'
import { EMPTY, FORSKARUTB_URL, ADMIN_URL, SYLLABUS_URL } from '../util/constants'

// Components
import CourseKeyInformationOneCol from '../components/CourseKeyInformationOneCol.jsx'
import CourseTitle from '../components/CourseTitle.jsx'
import CourseSectionList from '../components/CourseSectionList.jsx'
import CourseFileLinks from '../components/CourseFileLinks.jsx'


@inject(['routerStore']) @observer
class CoursePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeRoundIndex:0,
      activeSemesterIndex: this.props.routerStore.defaultIndex,
      activeSemester: this.props.routerStore.courseSemesters.length > 0 ? this.props.routerStore.courseSemesters[this.props.routerStore.defaultIndex][2] : 0,
      activeSyllabusIndex: this.props.routerStore.roundsSyllabusIndex[this.props.routerStore.defaultIndex] || 0,
      dropdownsOpen: {
        roundsDropdown:false,
        semesterDropdown:false
      },
      timeMachineValue: '', // Temp
      keyInfoFade: false,
      syllabusInfoFade: false,
      showRoundData: this.props.routerStore.courseSemesters.length > 0 && this.props.routerStore.courseData.roundList[this.props.routerStore.courseSemesters[this.props.routerStore.defaultIndex][2]].length > 1 ? false : true,
      roundDisabled: true,
      roundSelected: false
    }

    this.handleDropdownSelect = this.handleDropdownSelect.bind(this)
    this.toggle = this.toggle.bind(this)
    this.openEdit = this.openEdit.bind(this)
    this.handleSemesterDropdownSelect = this.handleSemesterDropdownSelect.bind(this)

    // Temp!!
    this.handleDateInput = this.handleDateInput.bind(this)
    this.timeMachine = this.timeMachine.bind(this)

  }

  handleSemesterButtonClick (event) {
    event.preventDefault()
    let prevState = this.state
    const selectedSemester = event.target.id.split('_')
    if (selectedSemester && selectedSemester[0].indexOf('semesterBtn') > -1) {
      const newIndex = Number(selectedSemester[1])
      prevState.syllabusInfoFade = prevState.activeSyllabusIndex !== this.props.routerStore.roundsSyllabusIndex[newIndex]
      const showRoundData = this.props.routerStore.courseData.roundList[this.props.routerStore.courseSemesters[newIndex][2]].length > 1 ? false : true

      this.setState({
        activeSemesterIndex: newIndex,
        activeSemester: this.props.routerStore.courseSemesters[newIndex][2] || 0,
        activeSyllabusIndex: this.props.routerStore.roundsSyllabusIndex[newIndex] || 0,
        syllabusInfoFade: prevState.syllabusInfoFade,
        activeRoundIndex: 0,
        keyInfoFade:true,
        showRoundData: showRoundData
      })
    }
  }

  componentDidUpdate () {
    // Resets animation after they were triggered
    if (this.state.syllabusInfoFade) {
      let that = this
      setTimeout(() => { that.setState({ syllabusInfoFade: false, keyInfoFade:false}) }, 800)
    }
    else
      if (this.state.keyInfoFade) {
        let that = this
        setTimeout(() => { that.setState({keyInfoFade:false}) }, 500)
      }
  }

// Temp!!*******
  handleDateInput (event) {
    this.setState({
      timeMachineValue: event.target.value
    })
  }

  timeMachine (event) {
    event.preventDefault()
    const newIndex = this.props.routerStore.getCurrentSemesterToShow(this.state.timeMachineValue)
    this.setState({
      activeRoundIndex: this.props.routerStore.courseSemesters[newIndex][2] || 0,
      activeSyllabusIndex: this.props.routerStore.roundsSyllabusIndex[newIndex] || 0
    })
  }
//! !!********
  static fetchData (routerStore, params) {
    return routerStore.getCourseInformation('sf1624', 'sv')
      .then((data) => {
        // console.log("data",data)
        return courseData = data
      })
  }

  toggle (event, keyInfoFade = false, syllabusInfoFade = false) {
    if (event) { console.log(event.target.id)

      const selectedInfo = event.target.id.indexOf('_') > 0 ? event.target.id.split('_')[0] : event.target.id
      let prevState = this.state
      prevState.dropdownsOpen[selectedInfo] = !prevState.dropdownsOpen[selectedInfo]
      this.setState({
        dropdownsOpen: prevState.dropdownsOpen,
        keyInfoFade
      })
    }
  }

  handleSemesterDropdownSelect (event) {
    event.preventDefault()
    let prevState = this.state
    console.log(event.target.id, prevState)
    const selectInfo = event.target.id.split('_')
    var newIndex = Number(selectInfo[1])
    prevState.syllabusInfoFade = prevState.activeSyllabusIndex !== this.props.routerStore.roundsSyllabusIndex[newIndex]
    const showRoundData = this.props.routerStore.courseData.roundList[this.props.routerStore.courseSemesters[newIndex][2]].length > 1 ? false : true

    this.setState({
      activeSemesterIndex: newIndex,
      activeSemester: this.props.routerStore.courseSemesters[newIndex][2] || 0,
      activeSyllabusIndex: this.props.routerStore.roundsSyllabusIndex[newIndex],
      syllabusInfoFade: prevState.syllabusInfoFade,
      activeRoundIndex: 0,
      keyInfoFade:true,
      showRoundData: showRoundData,
      roundDisabled:false
    })
    this.toggle(event, true)
  }

  handleDropdownSelect (event) {
    event.preventDefault()
    const selectInfo = event.target.id.split('_')
    this.setState({
      activeRoundIndex: selectInfo[1],
      showRoundData: true,
      roundSelected: true
    })
    this.toggle(event, true)
  }

  openEdit () {
    event.preventDefault()
    const language = this.props.routerStore.courseData.language === 0 ? 'en' : 'sv'
    window.location = `${ADMIN_URL}${this.props.routerStore.courseData.courseInfo.course_code}?l=${language}`
  }

  render ({ routerStore}) {
    const courseData = routerStore['courseData']

    const language = routerStore.courseData.language === 0 ? 'en' : 'sv'
    const translation = i18n.messages[courseData.language]
    const introText = routerStore.sellingText && routerStore.sellingText[language].length > 0 ? routerStore.sellingText[language] : courseData.courseInfo.course_recruitment_text

    console.log('routerStore in CoursePage', routerStore)
    console.log('state in CoursePage', this.state)

    const courseInformationToRounds = {
      course_code: courseData.courseInfo.course_code,
      course_examiners: courseData.courseInfo.course_examiners,
      course_contact_name: courseData.courseInfo.course_contact_name,
      course_main_subject: courseData.courseInfo.course_main_subject,
      course_level_code: courseData.courseInfo.course_level_code,
      course_valid_from: courseData.syllabusList[this.state.activeSyllabusIndex].course_valid_from
    }

    return (
      <div key='kursinfo-container' className='col' id='kursinfo-main-page' >
         <Row id='pageContainer' key='pageContainer'>
         {/* <Col sm="1" xs="1" id="left" key="left"> </Col>*/}
          <Col sm='12' xs='12' lg='12' id='middle' key='middle'>

          {
            routerStore.canEdit ?
              <Button className='editButton' color='primery' onClick={this.openEdit} id={courseData.courseInfo.course_code}>
              <i class='fas fa-edit'></i> {translation.courseLabels.label_edit}
              </Button>
            : ''
          }
          {/** *************************************************************************************************************/}
          {/*                                                   INTRO                                                     */}
          {/** *************************************************************************************************************/}
            {/* ---COURSE TITEL--- */}
            <CourseTitle key='title'
              courseTitleData={courseData.courseTitleData}
              language={courseData.language}
              canEdit={routerStore.canEdit}
            />

            {/* ---TEXT FOR CANCELLED COURSE --- */}
            {routerStore.isCancelled ?
              <div className='col-12 isCancelled'>
                <Alert color='info' aria-live='polite'>
                    <h3>{translation.courseLabels.label_course_cancelled} </h3>
                    <p>{translation.courseLabels.label_last_exam}
                        {translation.courseInformation.course_short_semester[courseData.courseInfo.course_last_exam[1]]}
                        {courseData.courseInfo.course_last_exam[0]}
                    </p>
                  </Alert>
              </div>
            : ''}

            {/* ---INTRO TEXT--- */}
            <Row id='courseIntroText' key='courseIntroText'>
              <Col sm='12' xs='12'>
                <img src={routerStore.image} alt='' height='auto' width='300px' title='inspiration image' />
                <div
                  dangerouslySetInnerHTML={{ __html:introText}}>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      <Row id='columnContainer' key='columnContainer'>
        <Col id='leftContainer' key='leftContainer' >
          {/** *************************************************************************************************************/}
          {/*                                      RIGHT COLUMN - KEY INFORMATION                                         */}
          {/** *************************************************************************************************************/}
          <Col id='keyInformationContainer' sm='4' xs='12' className='float-md-right' >


            {/* ---COURSE  DROPDOWNS--- */}
            <div id='roundDropdownMenu' className=''>
               <h3 style='margin-top:0px'>{translation.courseLabels.header_round}</h3>
                  <div className='row' id='roundDropdowns' key='roundDropdown'>

                    {routerStore.courseSemesters.length > 0 ?

                       <DropdownCreater
                         semesterList={routerStore.courseSemesters}
                         courseRoundList={courseData.roundList[this.state.activeSemester]}
                         callerInstance={this}
                         year={routerStore.courseSemesters[this.state.activeSemesterIndex][0]}
                         semester={routerStore.courseSemesters[this.state.activeSemesterIndex][1]}
                         yearSemester={routerStore.courseSemesters[this.state.activeSemesterIndex][2]}
                         language={courseData.language}
                         parentIndex='0'
                         lable={translation.courseLabels.lable_round_dropdown}
                        /> :
                        <Alert color='info'>
                        {translation.courseLabels.lable_no_rounds}
                      </Alert>

                    }
                    {routerStore.courseSemesters.length > 0 && courseData.roundList[this.state.activeSemester][this.state.activeRoundIndex].round_state !== 'APPROVED' ?
                      <Alert color='info' aria-live='polite' >
                          <h4>{i18n.messages[courseData.language].courseLabels.lable_round_state[courseData.roundList[this.state.activeSemester][this.state.activeRoundIndex].round_state]} </h4>
                      </Alert>
                    : ''}

{routerStore.courseSemesters.length === 0 ?
                      <Alert color='info'>
                        {translation.courseLabels.lable_no_rounds}
                      </Alert> :
                      courseData.roundList[this.state.activeSemester] && courseData.roundList[this.state.activeSemester].length > 1 ?
                       <DropdownCreater2
                         semesterList={routerStore.courseSemesters}
                         courseRoundList={courseData.roundList[this.state.activeSemester]}
                         callerInstance={this}
                         year={routerStore.courseSemesters[this.state.activeSemesterIndex][0]}
                         semester={routerStore.courseSemesters[this.state.activeSemesterIndex][1]}
                         yearSemester={routerStore.courseSemesters[this.state.activeSemesterIndex][2]}
                         language={courseData.language}
                         parentIndex='0'
                         lable={translation.courseLabels.lable_round_dropdown}
                        />
                      : ''
                    }
                    {routerStore.courseSemesters.length > 0 && courseData.roundList[this.state.activeSemester][this.state.activeRoundIndex].round_state !== 'APPROVED' ?
                      <Alert color='info' aria-live='polite' >
                          <h4>{i18n.messages[courseData.language].courseLabels.lable_round_state[courseData.roundList[this.state.activeSemester][this.state.activeRoundIndex].round_state]} </h4>
                      </Alert>
                    : ''}
                  </div>
             </div>

            {/* ---COURSE ROUND KEY INFORMATION--- */}
            {routerStore.courseSemesters.length > 0 ?
            <CourseKeyInformationOneCol
              courseRound={courseData.roundList[this.state.activeSemester][this.state.activeRoundIndex]}
              courseData={courseInformationToRounds}
              language={courseData.language}
              courseHasRound={routerStore.courseSemesters.length > 0}
              fade={this.state.keyInfoFade}
              showRoundData={this.state.showRoundData === false && courseData.roundList[this.state.activeSemester].length > 1 ? false : true}
            /> : ''}
        </Col>

        {/** *************************************************************************************************************/}
        {/*                           LEFT COLUMN - SYLLABUS + OTHER COURSE INFORMATION                                 */}
        {/** *************************************************************************************************************/}
        <Col id='coreContent' sm='8' xs='12' className='float-md-left'>
          <div key='fade-2' className={` fade-container ${this.state.syllabusInfoFade === true ? ' fadeOutIn' : ''} `}>

          <Row id='semesterContainer' key='semesterContainer'>
            <Col sm='12' >
            <div sm='12' id='courseInfoHeader'>
              <h2>{translation.courseLabels.header_course_info} </h2>
            </div>

              {/* ---COURSE SEMESTER BUTTONS--- */}
              {routerStore.courseSemesters.length === 0 ?
                courseData.syllabusSemesterList.length === 0 ?
                  <Alert color='info' aria-live='polite'>
                    {translation.courseLabels.label_no_syllabus}
                  </Alert> :
                <Alert color='info' aria-live='polite'>
                  {translation.courseLabels.lable_no_rounds}
                </Alert> :
               ''
              }
            <Row id='syllabusLink'>
              <Col sm='12'>
                {/* --- ACTIVE SYLLABUS LINK---  */}
                <div key='fade-2' className={` fade-container ${this.state.syllabusInfoFade === true ? ' fadeOutIn' : ''}`}>
                  {courseData.syllabusSemesterList.length > 0 ?
                    <span>
                      <i class='fas fa-file-pdf'></i>
                      <a
                        href={`${SYLLABUS_URL}${courseData.courseInfo.course_code}_${courseData.syllabusList[this.state.activeSyllabusIndex].course_valid_from.join('')}.pdf?lang=${language}`}
                        id={courseData.syllabusList[this.state.activeSyllabusIndex].course_valid_from.join('') + '_active'}
                        target='_blank'
                      >
                          {translation.courseLabels.label_course_syllabus}
                      </a>
                      <span className='small-text' >
                      {` ( ${translation.courseLabels.label_course_syllabus_valid_from}
                          ${translation.courseInformation.course_short_semester[courseData.syllabusList[this.state.activeSyllabusIndex].course_valid_from[1]]}  ${courseData.syllabusList[this.state.activeSyllabusIndex].course_valid_from[0]} 
                          ${courseData.syllabusList[this.state.activeSyllabusIndex].course_valid_to.length > 0 ?
                              translation.courseLabels.label_course_syllabus_valid_to + translation.courseInformation.course_short_semester[courseData.syllabusList[this.state.activeSyllabusIndex].course_valid_to[1]] + ' ' + courseData.syllabusList[this.state.activeSyllabusIndex].course_valid_to[0] : ''} )
                      `}
                        </span>
                    </span>
                  : ''}
                </div>
              </Col>
            </Row>
            </Col>
            </Row>

         {/* --- COURSE INFORMATION CONTAINER---  */}
         <CourseSectionList
           courseInfo={courseData.courseInfo}
           syllabusList={courseData.syllabusList[this.state.activeSyllabusIndex]}
           showCourseLink={routerStore.showCourseWebbLink}
           partToShow='firstBlock'
        />


          </div>

           {/* --- COURSE INFORMATION CONTAINER---  */}
        <CourseSectionList
          courseInfo={courseData.courseInfo}
          syllabusList={courseData.syllabusList[this.state.activeSyllabusIndex]}
          showCourseLink={routerStore.showCourseWebbLink}
          partToShow='secondBlock'
        />

        {/* ---IF RESEARCH LEVEL: SHOW "Postgraduate course" LINK--  */}
        {courseData.courseInfo.course_level_code === 'RESEARCH' ?
              <span>
                <h3>{translation.courseLabels.header_postgraduate_course}</h3>
                {translation.courseLabels.label_postgraduate_course}
                <a target='_blank' href={`${FORSKARUTB_URL}${courseData.courseInfo.course_department_code}`}>
                   {courseData.courseInfo.course_department}
                </a>
              </span>
            : ''}
            </Col>
<Col id='historyContent' sm='8' xs='12' className='float-md-left'>
<h2>NY rubrik</h2>
             {/* ---STATISTICS LINK--- */}
          <h3> {translation.courseLabels.header_statistics}</h3>
            <p>
              <i class='fas fa-chart-line'></i>
              <a href='' target='_blank' >
                {translation.courseLabels.label_statistics}
              </a>
            </p>

            {/* --- ALL SYLLABUS LINKS--- */}
            <h3>{translation.courseLabels.header_syllabuses}</h3>
              {courseData.syllabusSemesterList.length > 0 ?
                courseData.syllabusSemesterList.map((semester, index) =>
                  <span key={index}>
                    <i class='fas fa-file-pdf'></i>
                    <a
                      href={`${SYLLABUS_URL}${routerStore.courseData.courseInfo.course_code}_${semester}.pdf?lang=${language}`}
                      key={index}
                      id={semester}
                      target='_blank'
                    >
                      {translation.courseLabels.label_course_syllabus_valid_from}&nbsp;
                      {translation.courseInformation.course_short_semester[semester.toString().substring(4, 5)]}                                                                                                                   {semester.toString().substring(0, 4)}
                      &nbsp;
                    </a> <br />
                  </span>
                )
              : EMPTY[courseData.language]}
      </Col>

     </Col>
     <br />
        {/* ---TEMP: test of dates ---

        <span style="padding:5px; border: 3px dotted pink;">
          <lable>Time machine for testing default information: </lable>
          <input type="date" onChange={this.handleDateInput} />
          <button onClick={this.timeMachine}>Travel in time!</button>
        </span>*/}
    </Row>


  {/* ---EDIT BUTTON --- */}
{/* <Col sm="1" xs="1" id="right" key="right">*/}

      {/*   </Col>*/}

      </div>
    )
  }
}




const DropdownCreater = ({ semesterList, courseRoundList, callerInstance, semester, year, yearSemester, language = 0, parentIndex = 0, lable = ''}) => {
  let listIndex = []
  const dropdownID = 'semesterDropdown'

  if (semesterList && semesterList.length < 1)
    return ''
  else
  return (
    <div className='col-12 semester-dropdowns'>
      <Dropdown group
        isOpen={callerInstance.state.dropdownsOpen[dropdownID]}
        toggle={callerInstance.toggle}
        key={'dropD' + dropdownID}
        id={dropdownID}
        className='select-round'
          >
         <DropdownToggle
           id={dropdownID} >
            {callerInstance.state.roundDisabled ?
             <span>{i18n.messages[language].courseLabels.header_semester_menue}</span>
              :
             <span>{i18n.messages[language].courseInformation.course_short_semester[semester]} {year}</span>
            }
             <span caret className='caretholder'></span>

          </DropdownToggle>
          <DropdownMenu>
          {
            semesterList.map((semesterItem, index) => {
              return (
                <DropdownItem key={index} id={dropdownID + '_' + index + '_' + parentIndex} onClick={callerInstance.handleSemesterDropdownSelect}>
                    {i18n.messages[language].courseInformation.course_short_semester[semesterItem[1]]}{semesterItem[0]}
                </DropdownItem>
              )
            })
          }
          </DropdownMenu>
        </Dropdown>
      </div>
  )
}

const DropdownCreater2 = ({courseRoundList, callerInstance, semester, year, yearSemester, language = 0, parentIndex = 0, lable = ''}) => {
  let listIndex = []
  const dropdownID = 'roundsDropdown'

  if (courseRoundList && courseRoundList.length < 2)
    return ''
  else
  return (
    <div className='col-12 semester-dropdowns'>
      <Dropdown group
        isOpen={callerInstance.state.dropdownsOpen[dropdownID]}
        toggle={callerInstance.toggle}
        key={'dropD' + dropdownID}
        id={dropdownID}
        className='select-round'

          >
         <DropdownToggle
           id={dropdownID}
           disabled={callerInstance.state.roundDisabled}
           >
           {callerInstance.state.roundSelected ?

            <span>
              {
                `${courseRoundList[callerInstance.state.activeRoundIndex].round_short_name !== EMPTY[language] ? courseRoundList[callerInstance.state.activeRoundIndex].round_short_name : ''},     
                ${courseRoundList[callerInstance.state.activeRoundIndex].round_type}`
              }
              </span>
           :
             <span>{lable} </span>
            }
             <span caret className='caretholder'></span>
          </DropdownToggle>
          <DropdownMenu>
          {
            courseRoundList.map((courseRound, index) => {
              return (
                <DropdownItem key={index} id={dropdownID + '_' + index + '_' + parentIndex} onClick={callerInstance.handleDropdownSelect}>
                  {
                    `${courseRound.round_short_name !== EMPTY[language] ? courseRound.round_short_name : ''},     
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


export default CoursePage
