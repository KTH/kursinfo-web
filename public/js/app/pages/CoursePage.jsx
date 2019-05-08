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
import RoundInformationOneCol from '../components/RoundInformationOneCol.jsx'
import CourseTitle from '../components/CourseTitle.jsx'
import CourseSectionList from '../components/CourseSectionList.jsx'
import InfoModal from '../components/InfoModal.jsx'


@inject(['routerStore']) @observer
class CoursePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeRoundIndex: 0,
      activeSemesterIndex: this.props.routerStore.defaultIndex,
      activeSemester: this.props.routerStore.activeSemesters.length > 0 ? this.props.routerStore.activeSemesters[this.props.routerStore.defaultIndex][2] : 0,
      activeSyllabusIndex: 0,
      dropdownsOpen: {
        roundsDropdown: false,
        semesterDropdown: false
      },
      roundInfoFade: false,
      syllabusInfoFade: false,
      showRoundData: false,
      roundDisabled: true,
      roundSelected: false
    }

    this.handleDropdownSelect = this.handleDropdownSelect.bind(this)
    this.toggle = this.toggle.bind(this)
    this.openEdit = this.openEdit.bind(this)
    this.handleSemesterDropdownSelect = this.handleSemesterDropdownSelect.bind(this)
  }

  componentDidUpdate () {
    // Resets animation after they were triggered
    if (this.state.syllabusInfoFade) {
      let that = this
      setTimeout(() => { that.setState({syllabusInfoFade: false, roundInfoFade: false}) }, 800)
    } else {
      if (this.state.roundInfoFade) {
        let that = this
        setTimeout(() => { that.setState({roundInfoFade: false}) }, 500)
      }
    }
  }

  static fetchData (routerStore, params) {
  }

  toggle (event, roundInfoFade = false, syllabusInfoFade = false) {
    if (event) {
      const selectedInfo = event.target.id.indexOf('_') > 0 ? event.target.id.split('_')[0] : event.target.id
      let prevState = this.state
      prevState.dropdownsOpen[selectedInfo] = !prevState.dropdownsOpen[selectedInfo]
      this.setState({
        dropdownsOpen: prevState.dropdownsOpen,
        roundInfoFade
      })
    }
  }

  handleSemesterDropdownSelect (event) {
    event.preventDefault()
    let prevState = this.state
    const selectInfo = event.target.id.split('_')
    let newIndex = Number(selectInfo[1])
    const activeSemester = this.props.routerStore.activeSemesters[newIndex][2].toString()
    prevState.syllabusInfoFade = prevState.activeSyllabusIndex !== this.props.routerStore.roundsSyllabusIndex[newIndex]
    const showRoundData = this.props.routerStore.courseData.roundList[activeSemester].length === 1

    this.setState({
      activeSemesterIndex: newIndex,
      activeSemester: activeSemester || 0,
      activeSyllabusIndex: this.props.routerStore.roundsSyllabusIndex[newIndex],
      syllabusInfoFade: prevState.syllabusInfoFade,
      activeRoundIndex: 0,
      roundInfoFade: true,
      showRoundData: showRoundData,
      roundDisabled: false,
      roundSelected: false
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

  openEdit (event) {
    event.preventDefault()
    const language = this.props.routerStore.courseData.language === 0 ? 'en' : 'sv'
    window.location = `${ADMIN_URL}${this.props.routerStore.courseData.courseInfo.course_code}?l=${language}`
  }

  render ({ routerStore }) {
    const courseData = routerStore['courseData']

    const language = routerStore.courseData.language === 0 ? 'en' : 'sv'
    const translation = i18n.messages[courseData.language]
    const introText = routerStore.sellingText && routerStore.sellingText[language].length > 0 ? routerStore.sellingText[language] : courseData.courseInfo.course_recruitment_text
    let courseImage = translation.courseImage[courseData.courseInfo.course_main_subject.split(',')[0]]
    if (courseImage === undefined)
      courseImage = translation.courseImage.default
   // console.log('routerStore in CoursePage', routerStore)
    // console.log('state in CoursePage', this.state)

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
          <Col sm='12' xs='12' lg='12' id='middle' key='middle'>
          {
            routerStore.canEdit
              ? <Button className='editButton' color='primery' onClick={this.openEdit} id={courseData.courseInfo.course_code}>
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
            {routerStore.isCancelled
              ? <div className='col-12 isCancelled'>
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
                  dangerouslySetInnerHTML={{__html: introText}}>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row id='columnContainer' key='columnContainer'>
          <Col id='leftContainer' key='leftContainer' >
          {/** *************************************************************************************************************/}
          {/*                                      RIGHT COLUMN - ROUND INFORMATION                                         */}
          {/** *************************************************************************************************************/}
            <Col id='roundInformationContainer' md='4' xs='12' className='float-md-right' >

            {/* ---COURSE  DROPDOWN MENU--- */}
            {routerStore.activeSemesters.length > 0
              ? <div id='roundDropdownMenu' className=''>
                <h4 style='margin-top:0px'>{translation.courseLabels.header_dropdown_menue}:</h4>
                <div className='row' id='roundDropdowns' key='roundDropdown'>
                  {routerStore.activeSemesters.length > 0
                    ? <DropdownSemesters
                      semesterList={routerStore.activeSemesters}
                      courseRoundList={courseData.roundList[this.state.activeSemester]}
                      callerInstance={this}
                      year={routerStore.activeSemesters[this.state.activeSemesterIndex][0]}
                      semester={routerStore.activeSemesters[this.state.activeSemesterIndex][1]}
                      language={courseData.language}
                      lable={translation.courseLabels.lable_semester_select}
                    />
                    : ''
                  }

                  {courseData.roundList[this.state.activeSemester] && courseData.roundList[this.state.activeSemester].length > 1
                    ? <DropdownRounds
                      semesterList={routerStore.activeSemesters}
                      courseRoundList={courseData.roundList[this.state.activeSemester]}
                      callerInstance={this}
                      year={routerStore.activeSemesters[this.state.activeSemesterIndex][0]}
                      semester={routerStore.activeSemesters[this.state.activeSemesterIndex][1]}
                      language={courseData.language}
                      lable={translation.courseLabels.lable_round_select}
                    />
                    : this.state.showRoundData
                      ? <p>
                          {`
                            ${translation.courseInformation.course_short_semester[courseData.roundList[this.state.activeSemester][0].round_course_term[1]]} 
                            ${courseData.roundList[this.state.activeSemester][0].round_course_term[0]}  
                            ${courseData.roundList[this.state.activeSemester][0].round_short_name !== EMPTY[language] ? courseData.roundList[this.state.activeSemester][0].round_short_name : ''}     
                            ${courseData.roundList[this.state.activeSemester][0].round_type}
                          `}
                      </p>
                      : ''
                    }

                    {/* ---ROUND CANCELLED OR FULL --- */}
                    {routerStore.activeSemesters.length > 0 && courseData.roundList[this.state.activeSemester][this.state.activeRoundIndex].round_state !== 'APPROVED'
                      ? <Alert color='info' aria-live='polite' >
                        <h4>{translation.courseLabels.lable_round_state[courseData.roundList[this.state.activeSemester][this.state.activeRoundIndex].round_state]} </h4>
                      </Alert>
                      : ''
                    }
                </div>
              </div>
              : routerStore.activeSemesters.length === 0 && courseData.syllabusSemesterList.length > 0
                  ? <Alert color='info'>
                    <h4>{translation.courseLabels.header_no_rounds}</h4>
                    {translation.courseLabels.lable_no_rounds}
                  </Alert>
                  : ''
              }

              <h3 style='margin-top:20px'>{translation.courseLabels.header_round}</h3>

              {/* ---COURSE ROUND KEY INFORMATION--- */}
              {routerStore.activeSemesters.length > 0
                ? <RoundInformationOneCol
                  courseRound={courseData.roundList[this.state.activeSemester][this.state.activeRoundIndex]}
                  courseData={courseInformationToRounds}
                  language={courseData.language}
                  courseHasRound={routerStore.activeSemesters.length > 0}
                  fade={this.state.roundInfoFade}
                  showRoundData={this.state.showRoundData}
                  />
                : <div className='key-info'>
                    {routerStore.activeSemesters.length > 0
                      ? <p>{translation.courseLabels.no_round_selected}</p>
                      : <i>{translation.courseLabels.lable_no_rounds}</i>
                    }
                </div>
              }
            </Col>

            {/** *************************************************************************************************************/}
            {/*                           LEFT COLUMN - SYLLABUS + OTHER COURSE INFORMATION                                 */}
            {/** *************************************************************************************************************/}
            <Col id='coreContent' sm='8' xs='12' className='float-md-left'>
              <div key='fade-2' className={` fade-container ${this.state.syllabusInfoFade === true ? ' fadeOutIn' : ''} `}>

                <Row id='activeSyllabusContainer' key='activeSyllabusContainer'>
                  <Col sm='12' >
                    <div sm='12' id='courseInfoHeader'>
                      <h2>{translation.courseLabels.header_course_info}
                        <div style='display: inline-block; padding-left: 15px;'>
                          <InfoModal infoText={i18n.messages[courseData.language].courseLabels.syllabus_info} type='html' />
                        </div>
                      </h2>
                    </div>
                    {courseData.syllabusSemesterList.length === 0
                      ? <Alert color='info' aria-live='polite'>
                        <h4>{translation.courseLabels.header_no_syllabus}</h4>
                        {translation.courseLabels.label_no_syllabus}
                      </Alert>
                      : ''
                    }

                    <Row id='syllabusLink'>
                      <Col sm='12'>
                        {/* --- ACTIVE SYLLABUS LINK---  */}
                        <div key='fade-2' className={` fade-container ${this.state.syllabusInfoFade === true ? ' fadeOutIn' : ''}`}>
                          {courseData.syllabusSemesterList.length > 0
                            ? <span>
                              <b>{translation.courseLabels.label_course_syllabus}</b>
                              <a
                                href={`${SYLLABUS_URL}${courseData.courseInfo.course_code}_${courseData.syllabusList[this.state.activeSyllabusIndex].course_valid_from.join('')}.pdf?lang=${language}`}
                                id={courseData.syllabusList[this.state.activeSyllabusIndex].course_valid_from.join('') + '_active'}
                                target='_blank'
                              >
                              {translation.courseLabels.label_syllabus_link}
                                <span className='small-text' >
                                  {` 
                                    ( 
                                    ${translation.courseInformation.course_short_semester[courseData.syllabusList[this.state.activeSyllabusIndex].course_valid_from[1]]}  ${courseData.syllabusList[this.state.activeSyllabusIndex].course_valid_from[0]} -
                                    ${courseData.syllabusList[this.state.activeSyllabusIndex].course_valid_to.length > 0
                                    ? translation.courseInformation.course_short_semester[courseData.syllabusList[this.state.activeSyllabusIndex].course_valid_to[1]] + ' ' + courseData.syllabusList[this.state.activeSyllabusIndex].course_valid_to[0]
                                    : ''} 
                                    )
                                  `}
                                </span>
                              </a>
                              <i class='fas fa-file-pdf'></i>
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
                  partToShow='courseContentBlock'
                />

                {/* ---IF RESEARCH LEVEL: SHOW "Postgraduate course" LINK--  */}
                {courseData.courseInfo.course_level_code === 'RESEARCH'
                  ? <span>
                    <h3>{translation.courseLabels.header_postgraduate_course}</h3>
                    {translation.courseLabels.label_postgraduate_course}
                    <a target='_blank' href={`${FORSKARUTB_URL}${courseData.courseInfo.course_department_code}`}>
                      {courseData.courseInfo.course_department}
                    </a>
                  </span>
                  : ''}
              </div>
            </Col>

            <Col id='historyContent' sm='8' xs='12' className='float-md-left'>
              <h2>{translation.courseLabels.header_history}</h2>

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
                  {courseData.syllabusSemesterList.length > 0
                    ? courseData.syllabusSemesterList.map((semester, index) => {
                      return (
                        <span key={index}>
                          <i class='fas fa-file-pdf'></i>
                          <a
                            href={`${SYLLABUS_URL}${routerStore.courseData.courseInfo.course_code}_${semester[0]}.pdf?lang=${language}`}
                            key={index}
                            id={semester}
                            target='_blank'
                          >
                            {translation.courseLabels.label_syllabus_link}
                            ( {translation.courseInformation.course_short_semester[semester[0].toString().substring(4, 5)]}
                            {semester[0].toString().substring(0, 4)} -  &nbsp;
                            {translation.courseInformation.course_short_semester[semester[1].toString().substring(4, 5)]}
                            {semester[1].toString().substring(0, 4)})
                          </a> <br />
                        </span>
                      )
                    })
                  : EMPTY[courseData.language]}
            </Col>
          </Col>
        </Row>
      </div>
    )
  }
}

const DropdownSemesters = ({semesterList, courseRoundList, callerInstance, semester, year, language = 0, lable = ''}) => {
  const dropdownID = 'semesterDropdown'
  if (semesterList && semesterList.length < 1) {
    return ''
  }
  else {
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
            {callerInstance.state.roundDisabled
              ? <span id={dropdownID + '_span'}>{lable}</span>
              : <span id={dropdownID + '_span'}>{i18n.messages[language].courseInformation.course_short_semester[semester]} {year}</span>
            }
            <span caret className='caretholder' id={dropdownID + '_spanCaret'}></span>
          </DropdownToggle>

          <DropdownMenu>
          {
            semesterList.map((semesterItem, index) => {
              return (
                <DropdownItem
                  key={index}
                  id={dropdownID + '_' + index + '_' + '0'}
                  onClick={callerInstance.handleSemesterDropdownSelect}
                >
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
}

const DropdownRounds = ({courseRoundList, callerInstance, semester, year, language = 0, lable = ''}) => {
  const dropdownID = 'roundsDropdown'

  if (courseRoundList && courseRoundList.length < 2) {
    return ''
  }
  else {
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
            {callerInstance.state.roundSelected
              ? <span id={dropdownID + '_span'}>
                  {
                    `${courseRoundList[callerInstance.state.activeRoundIndex].round_short_name !== EMPTY[language]
                      ? courseRoundList[callerInstance.state.activeRoundIndex].round_short_name
                      : ''}, 
                    ${courseRoundList[callerInstance.state.activeRoundIndex].round_type}`
                  }
              </span>
              : <span id={dropdownID + '_spanSelect'}>{lable} </span>
            }
            <span caret className='caretholder' id={dropdownID + '_spanCaret'}></span>
          </DropdownToggle>
          <DropdownMenu>
            {
              courseRoundList.map((courseRound, index) => {
                return (
                  <DropdownItem key={index} id={dropdownID + '_' + index + '_' + '0'} onClick={callerInstance.handleDropdownSelect}>
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
}

export default CoursePage
