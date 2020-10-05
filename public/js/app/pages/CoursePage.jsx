import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import {
  Row,
  Col,
  Alert,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Label,
  Breadcrumb,
  BreadcrumbItem
} from 'reactstrap'

import i18n from '../../../../i18n'
import { EMPTY, FORSKARUTB_URL, SYLLABUS_URL } from '../util/constants'
import { breadcrumbLinks, aboutCourseLink } from '../util/links'

// Components
import RoundInformationOneCol from '../components/RoundInformationOneCol.jsx'
import CourseTitle from '../components/CourseTitle.jsx'
import CourseSectionList from '../components/CourseSectionList.jsx'
import InfoModal from '../components/InfoModal.jsx'
import SideMenu from '../components/SideMenu.jsx'
import { courseMainSubjects } from '../../../../i18n/messages.en'

@inject(['routerStore'])
@observer
class CoursePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeRoundIndex: 0,
      activeSemesterIndex: this.props.routerStore.defaultIndex,
      activeSemester:
        this.props.routerStore.activeSemesters && this.props.routerStore.activeSemesters.length > 0
          ? this.props.routerStore.activeSemesters[this.props.routerStore.defaultIndex][2]
          : 0,
      activeSyllabusIndex: 0,
      dropdownsOpen: {
        roundsDropdown: false,
        semesterDropdown: false
      },
      roundInfoFade: false,
      syllabusInfoFade: false,
      showRoundData: false,
      roundDisabled: true,
      roundSelected: false,
      semesterSelectedIndex: 0,
      roundSelectedIndex: 0
    }

    this.handleDropdownSelect = this.handleDropdownSelect.bind(this)
    // this.toggle = this.toggle.bind(this)
    this.handleSemesterDropdownSelect = this.handleSemesterDropdownSelect.bind(this)
  }

  componentDidUpdate() {
    // Resets animation after they were triggered
    if (this.state.syllabusInfoFade) {
      let that = this
      setTimeout(() => {
        that.setState({ syllabusInfoFade: false, roundInfoFade: false })
      }, 800)
    } else {
      if (this.state.roundInfoFade) {
        let that = this
        setTimeout(() => {
          that.setState({ roundInfoFade: false })
        }, 500)
      }
    }
  }

  static fetchData(routerStore, params) {}

  // toggle (event, roundInfoFade = false, syllabusInfoFade = false) {
  //   console.log('toggle event', event)
  //   if (event) {
  //     const selectedInfo = event.target.id.indexOf('_') > 0 ? event.target.id.split('_')[0] : event.target.id
  //     let prevState = this.state
  //     prevState.dropdownsOpen[selectedInfo] = !prevState.dropdownsOpen[selectedInfo]
  //     this.setState({
  //       dropdownsOpen: prevState.dropdownsOpen,
  //       roundInfoFade
  //     })
  //   }
  // }

  handleSemesterDropdownSelect(event) {
    event.preventDefault()
    let prevState = this.state

    const eventTarget = event.target
    const selectedOption = eventTarget[eventTarget.selectedIndex]

    const selectInfo = selectedOption.id.split('_')
    let newIndex = Number(selectInfo[1])
    const activeSemester = this.props.routerStore.activeSemesters[newIndex]
      ? this.props.routerStore.activeSemesters[newIndex][2].toString()
      : ''
    prevState.syllabusInfoFade = prevState.activeSyllabusIndex !== this.props.routerStore.roundsSyllabusIndex[newIndex]
    const showRoundData =
      this.props.routerStore.courseData.roundList[activeSemester] &&
      this.props.routerStore.courseData.roundList[activeSemester].length === 1

    this.setState({
      activeSemesterIndex: newIndex >= 0 ? newIndex : this.props.routerStore.defaultIndex,
      activeSemester:
        activeSemester ||
        (this.props.routerStore.activeSemesters.length > 0
          ? this.props.routerStore.activeSemesters[this.props.routerStore.defaultIndex][2]
          : 0),
      activeSyllabusIndex: this.props.routerStore.roundsSyllabusIndex[newIndex] || 0,
      syllabusInfoFade: prevState.syllabusInfoFade,
      activeRoundIndex: 0,
      roundInfoFade: true,
      showRoundData: showRoundData,
      roundDisabled: newIndex === -1,
      roundSelected: newIndex === -1,
      semesterSelectedIndex: eventTarget.selectedIndex,
      roundSelectedIndex: 0
    })
    // this.toggle(event, true)
  }

  handleDropdownSelect(event) {
    event.preventDefault()

    const eventTarget = event.target
    const selectedOption = eventTarget[eventTarget.selectedIndex]

    const selectInfo = selectedOption.id.split('_')
    this.setState({
      activeRoundIndex: eventTarget.selectedIndex === 0 ? 0 : selectInfo[1],
      showRoundData: eventTarget.selectedIndex !== 0,
      roundSelected: eventTarget.selectedIndex !== 0,
      roundSelectedIndex: eventTarget.selectedIndex
    })
    // this.toggle(event, true)
  }

  breadcrumbs(translation, language, courseCode) {
    return (
      <nav lang={language} aria-label={translation.breadCrumbLabels.breadcrumbs}>
        <Breadcrumb>
          <BreadcrumbItem>
            <a href={breadcrumbLinks.university[language]}>{translation.breadCrumbLabels.university}</a>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <a href={breadcrumbLinks.student[language]}>{translation.breadCrumbLabels.student}</a>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <a href={breadcrumbLinks.directory[language]}>{translation.breadCrumbLabels.directory}</a>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <a href={aboutCourseLink(courseCode, language)}>
              {`${translation.breadCrumbLabels.aboutCourse} ${courseCode}`}
            </a>
          </BreadcrumbItem>
        </Breadcrumb>
      </nav>
    )
  }

  render() {
    const { routerStore } = this.props
    const courseData = routerStore['courseData'] || {
      courseInfo: { course_application_info: [] },
      syllabusSemesterList: []
    }
    if (!courseData.language) courseData.language = 0

    const language = courseData.language === 0 ? 'en' : 'sv'
    const translation = i18n.messages[courseData.language]
    const introText =
      routerStore.sellingText[language].length > 0
        ? routerStore.sellingText[language]
        : courseData.courseInfo.course_recruitment_text

    let courseImage = ''
    if (routerStore.imageFromAdmin.length > 4) {
      courseImage = routerStore.imageFromAdmin
    } else {
      const cms = courseData.courseInfo.course_main_subject || ''
      let mainSubjects = cms.split(',').map((s) => s.trim())
      if (mainSubjects && mainSubjects.length > 0 && language === 'en') {
        mainSubjects = mainSubjects.map((subject) => i18n.messages[0].courseMainSubjects[subject]) // get sv translations of en mainSubjects
      }
      courseImage = i18n.messages[1].courseImage[mainSubjects.sort()[0]] // extract picture according swidsh translation of mainSubject
      if (courseImage === undefined) {
        courseImage = translation.courseImage.default
      }
    }
    courseImage = `${routerStore.browserConfig.imageStorageUri}${courseImage}`

    if (!courseData.syllabusList) courseData.syllabusList = [{}]
    const courseInformationToRounds = {
      course_code: routerStore.courseCode,
      course_examiners: courseData.courseInfo.course_examiners,
      course_contact_name: courseData.courseInfo.course_contact_name,
      course_main_subject: courseData.courseInfo.course_main_subject,
      course_level_code: courseData.courseInfo.course_level_code,
      course_valid_from: courseData.syllabusList[this.state.activeSyllabusIndex].course_valid_from
    }

    return (
      <div key="kursinfo-container" className="col" id="kursinfo-main-page">
        <Row>{this.breadcrumbs(translation, language, routerStore.courseCode)}</Row>
        <Row id="pageContainer" key="pageContainer">
          <Col lg="3" className="side-menu">
            <SideMenu
              courseCode={routerStore.courseCode}
              labels={translation.courseLabels.sideMenu}
              language={language}
            />
          </Col>
          <main className="col-lg-9" id="middle" key="middle" aria-labelledby="page-course-title">
            {/** *************************************************************************************************************/}
            {/*                                                   INTRO                                                     */}
            {/** *************************************************************************************************************/}
            {/* ---COURSE TITEL--- */}
            <CourseTitle
              key="title"
              courseTitleData={courseData.courseTitleData}
              language={courseData.language}
              pageTitle={translation.courseLabels.sideMenu.page_before_course}
            />
            {/* ---TEXT FOR CANCELLED COURSE --- */}
            {routerStore.isCancelled || routerStore.isDeactivated ? (
              <div className="isCancelled">
                <Alert color="info" aria-live="polite">
                  <h3>{translation.course_state_alert[courseData.courseInfo.course_state].header} </h3>
                  <p>
                    {translation.course_state_alert[courseData.courseInfo.course_state].examination}
                    {translation.courseInformation.course_short_semester[courseData.courseInfo.course_last_exam[1]]}
                    {courseData.courseInfo.course_last_exam[0]}
                  </p>
                  <p>
                    {translation.course_state_alert[routerStore.courseData.courseInfo.course_state].decision}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: courseData.syllabusList[this.state.activeSyllabusIndex].course_decision_to_discontinue
                      }}
                    />
                  </p>
                </Alert>
              </div>
            ) : (
              ''
            )}

            {/* ---INTRO TEXT--- */}
            <section
              className="row"
              id="courseIntroText"
              key="courseIntroText"
              aria-label={translation.courseLabels.label_course_description}
            >
              <Col>
                <img className="float-md-left" src={courseImage} alt="" height="auto" width="300px" />
                <div className="paragraphs" dangerouslySetInnerHTML={{ __html: introText }}></div>
              </Col>
            </section>
            <Row id="columnContainer" key="columnContainer">
              <Col id="leftContainer" key="leftContainer">
                {/** *************************************************************************************************************/}
                {/*                                      RIGHT COLUMN - ROUND INFORMATION                                         */}
                {/** *************************************************************************************************************/}
                <Col id="roundInformationContainer" md="4" xs="12" className="float-md-right">
                  {/* ---COURSE  DROPDOWN MENU--- */}
                  {routerStore.activeSemesters && routerStore.activeSemesters.length > 0 ? (
                    <nav id="roundDropdownMenu" aria-label={translation.courseLabels.header_dropdown_menu_navigation}>
                      <h2 id="roundDropdownMenuHeader" style="margin-top:0px">
                        {translation.courseLabels.header_dropdown_menue}
                        <InfoModal
                          title={translation.courseLabels.header_dropdown_menue}
                          infoText={i18n.messages[courseData.language].courseLabels.syllabus_info}
                          type="html"
                          closeLabel={i18n.messages[courseData.language].courseLabels.label_close}
                        />
                      </h2>
                      <div className="row" id="roundDropdowns" key="roundDropdown">
                        {routerStore.activeSemesters.length > 0 && (
                          <DropdownSemesters
                            semesterList={routerStore.activeSemesters}
                            courseRoundList={courseData.roundList[this.state.activeSemester]}
                            callerInstance={this}
                            year={routerStore.activeSemesters[this.state.activeSemesterIndex][0]}
                            semester={routerStore.activeSemesters[this.state.activeSemesterIndex][1]}
                            language={courseData.language}
                            label={translation.courseLabels.label_semester_select}
                          />
                        )}
                        {courseData.roundList[this.state.activeSemester] &&
                        courseData.roundList[this.state.activeSemester].length > 1 ? (
                          <DropdownRounds
                            semesterList={routerStore.activeSemesters}
                            courseRoundList={courseData.roundList[this.state.activeSemester]}
                            callerInstance={this}
                            year={routerStore.activeSemesters[this.state.activeSemesterIndex][0]}
                            semester={routerStore.activeSemesters[this.state.activeSemesterIndex][1]}
                            language={courseData.language}
                            label={translation.courseLabels.label_round_select}
                          />
                        ) : this.state.showRoundData ? (
                          <p>
                            {`
                                ${
                                  translation.courseInformation.course_short_semester[
                                    courseData.roundList[this.state.activeSemester][0].round_course_term[1]
                                  ]
                                } 
                                ${courseData.roundList[this.state.activeSemester][0].round_course_term[0]}  
                                ${
                                  courseData.roundList[this.state.activeSemester][0].round_short_name !==
                                  EMPTY[language]
                                    ? courseData.roundList[this.state.activeSemester][0].round_short_name
                                    : ''
                                }     
                                ${
                                  translation.courseRoundInformation.round_category[
                                    courseData.roundList[this.state.activeSemester][0].round_category
                                  ]
                                }
                              `}
                          </p>
                        ) : (
                          ''
                        )}

                        {/* ---ROUND CANCELLED OR FULL --- */}
                        {routerStore.activeSemesters.length > 0 &&
                        this.state.showRoundData &&
                        courseData.roundList[this.state.activeSemester][this.state.activeRoundIndex].round_state !==
                          'APPROVED' ? (
                          <Alert color="info" aria-live="polite">
                            <h4>
                              {
                                translation.courseLabels.lable_round_state[
                                  courseData.roundList[this.state.activeSemester][this.state.activeRoundIndex]
                                    .round_state
                                ]
                              }{' '}
                            </h4>
                          </Alert>
                        ) : (
                          ''
                        )}
                      </div>
                    </nav>
                  ) : routerStore.activeSemesters &&
                    routerStore.activeSemesters.length === 0 &&
                    courseData.syllabusSemesterList &&
                    courseData.syllabusSemesterList.length > 0 ? (
                    <Alert color="info">
                      <h4>{translation.courseLabels.header_no_rounds}</h4>
                      {translation.courseLabels.lable_no_rounds}
                    </Alert>
                  ) : (
                    ''
                  )}
                  {courseData.courseInfo.course_application_info.length > 0 ? (
                    <Alert color="info">
                      <h4>{translation.courseInformation.course_application_info}</h4>
                      <p dangerouslySetInnerHTML={{ __html: courseData.courseInfo.course_application_info }}></p>
                    </Alert>
                  ) : (
                    ''
                  )}

                  {/* ---COURSE ROUND INFORMATION--- */}
                  {routerStore.activeSemesters && routerStore.activeSemesters.length > 0 ? (
                    <RoundInformationOneCol
                      courseRound={courseData.roundList[this.state.activeSemester][this.state.activeRoundIndex]}
                      courseData={courseInformationToRounds}
                      language={courseData.language}
                      courseHasRound={routerStore.activeSemesters.length > 0}
                      fade={this.state.roundInfoFade}
                      showRoundData={this.state.showRoundData}
                      canGetMemoFiles={routerStore.memoApiHasConnection}
                      memoStorageURI={routerStore.browserConfig.memoStorageUri}
                    />
                  ) : (
                    <div className="key-info">
                      {routerStore.activeSemesters && routerStore.activeSemesters.length > 0 ? (
                        <p>{translation.courseLabels.no_round_selected}</p>
                      ) : (
                        <i>{translation.courseLabels.lable_no_rounds}</i>
                      )}
                    </div>
                  )}
                </Col>

                {/** *************************************************************************************************************/}
                {/*                           LEFT COLUMN - SYLLABUS + OTHER COURSE INFORMATION                                 */}
                {/** *************************************************************************************************************/}
                <Col id="coreContent" md="8" xs="12" className="float-md-left paragraphs">
                  <div
                    key="fade-2"
                    className={` fade-container ${this.state.syllabusInfoFade === true ? ' fadeOutIn' : ''} `}
                  >
                    <Row id="activeSyllabusContainer" key="activeSyllabusContainer">
                      <Col sm="12">
                        {courseData.syllabusSemesterList.length === 0 ? (
                          <Alert color="info" aria-live="polite">
                            <h4>{translation.courseLabels.header_no_syllabus}</h4>
                            {translation.courseLabels.label_no_syllabus}
                          </Alert>
                        ) : (
                          ''
                        )}

                        <Row id="syllabusLink">
                          <Col sm="12">
                            {/* --- ACTIVE SYLLABUS LINK---  */}
                            <div
                              key="fade-2"
                              className={` fade-container ${this.state.syllabusInfoFade === true ? ' fadeOutIn' : ''}`}
                            >
                              {courseData.syllabusSemesterList.length > 0 ? (
                                <span>
                                  <b>{translation.courseLabels.label_course_syllabus}</b>
                                  <a
                                    href={`${SYLLABUS_URL}${routerStore.courseCode}-${courseData.syllabusList[
                                      this.state.activeSyllabusIndex
                                    ].course_valid_from.join('')}.pdf?lang=${language}`}
                                    id={
                                      courseData.syllabusList[this.state.activeSyllabusIndex].course_valid_from.join(
                                        ''
                                      ) + '_active'
                                    }
                                    target="_blank"
                                    className="pdf-link"
                                  >
                                    {translation.courseLabels.label_syllabus_link}
                                    <span className="small-text">
                                      {` 
                                        ( 
                                        ${
                                          translation.courseInformation.course_short_semester[
                                            courseData.syllabusList[this.state.activeSyllabusIndex].course_valid_from[1]
                                          ]
                                        }  ${
                                        courseData.syllabusList[this.state.activeSyllabusIndex].course_valid_from[0]
                                      } -
                                        ${
                                          courseData.syllabusList[this.state.activeSyllabusIndex].course_valid_to
                                            .length > 0
                                            ? translation.courseInformation.course_short_semester[
                                                courseData.syllabusList[this.state.activeSyllabusIndex]
                                                  .course_valid_to[1]
                                              ] +
                                              ' ' +
                                              courseData.syllabusList[this.state.activeSyllabusIndex].course_valid_to[0]
                                            : ''
                                        } 
                                        )
                                      `}
                                    </span>
                                  </a>
                                </span>
                              ) : (
                                ''
                              )}
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
                      partToShow="courseContentBlock"
                    />

                    {/* ---IF RESEARCH LEVEL: SHOW "Postgraduate course" LINK--  */}
                    {courseData.courseInfo.course_level_code === 'RESEARCH' ? (
                      <span>
                        <h3>{translation.courseLabels.header_postgraduate_course}</h3>
                        {translation.courseLabels.label_postgraduate_course}
                        <a href={`${FORSKARUTB_URL}${courseData.courseInfo.course_department_code}`}>
                          {courseData.courseInfo.course_department}
                        </a>
                      </span>
                    ) : (
                      ''
                    )}
                  </div>
                </Col>
              </Col>
            </Row>
          </main>
        </Row>
      </div>
    )
  }
}

const DropdownSemesters = ({
  semesterList,
  courseRoundList,
  callerInstance,
  semester,
  year,
  language = 0,
  label = ''
}) => {
  const dropdownID = 'semesterDropdown'
  if (semesterList && semesterList.length < 1) {
    return ''
  } else {
    return (
      <div class="col-12 semester-dropdowns">
        <form>
          <label className="form-control-label" htmlfor={dropdownID}>
            {label.label_dropdown}
          </label>
          <div className="form-select form-group">
            <div className="select-wrapper">
              <select
                className="form-control"
                id={dropdownID}
                aria-label={label.placeholder}
                onChange={callerInstance.handleSemesterDropdownSelect}
              >
                <option
                  id={dropdownID + '_' + '-1' + '_' + '0'}
                  selected={callerInstance.state.semesterSelectedIndex === 0}
                  value={label.placeholder}
                >
                  {label.placeholder}
                </option>
                {semesterList.map((semesterItem, index) => {
                  return (
                    <option
                      key={index}
                      id={dropdownID + '_' + index + '_' + '0'}
                      selected={callerInstance.state.semesterSelectedIndex - 1 === index}
                      value={`${i18n.messages[language].courseInformation.course_short_semester[semesterItem[1]]}${
                        semesterItem[0]
                      }`}
                    >
                      {i18n.messages[language].courseInformation.course_short_semester[semesterItem[1]]}
                      {semesterItem[0]}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>
        </form>
      </div>
      // <div className='col-12 semester-dropdowns'>
      //   <Label htmlFor={dropdownID}>{label.label_dropdown}</Label>
      //   <Dropdown group
      //     isOpen={callerInstance.state.dropdownsOpen[dropdownID]}
      //     toggle={callerInstance.toggle}
      //     key={'dropD' + dropdownID}
      //     id={dropdownID}
      //     className='select-round'
      //   >
      //     <DropdownToggle
      //       id={dropdownID} >
      //       {callerInstance.state.roundDisabled
      //         ? <span id={dropdownID + '_span'}>{label.placeholder}</span>
      //         : <span id={dropdownID + '_span'}>{i18n.messages[language].courseInformation.course_short_semester[semester]} {year}</span>
      //       }
      //       <span caret className='caretholder' id={dropdownID + '_spanCaret'}></span>
      //     </DropdownToggle>

      //     <DropdownMenu>
      //     {
      //       semesterList.map((semesterItem, index) => {
      //         return (
      //           <DropdownItem
      //             key={index}
      //             id={dropdownID + '_' + index + '_' + '0'}
      //             onClick={callerInstance.handleSemesterDropdownSelect}
      //           >
      //             {i18n.messages[language].courseInformation.course_short_semester[semesterItem[1]]}{semesterItem[0]}
      //           </DropdownItem>
      //         )
      //       })
      //     }
      //     </DropdownMenu>
      //   </Dropdown>
      // </div>
    )
  }
}

const DropdownRounds = ({ courseRoundList, callerInstance, semester, year, language = 0, label = '' }) => {
  const dropdownID = 'roundsDropdown'

  if (courseRoundList && courseRoundList.length < 2) {
    return ''
  } else {
    return (
      <div className="col-12 semester-dropdowns">
        <form>
          <label className="form-control-label" htmlfor={dropdownID}>
            {label.label_dropdown}
          </label>
          <div className="form-select form-group">
            <div className="select-wrapper">
              <select
                className="form-control"
                id={dropdownID}
                aria-label={''}
                onChange={callerInstance.handleDropdownSelect}
                disabled={callerInstance.state.roundDisabled}
              >
                <option
                  id={dropdownID + '_' + '-1' + '_' + '0'}
                  selected={callerInstance.state.roundSelectedIndex === 0}
                  value={label.placeholder}
                >
                  {label.placeholder}
                </option>
                {courseRoundList.map((courseRound, index) => {
                  const value = `${
                    courseRound.round_short_name !== EMPTY[language] ? courseRound.round_short_name : ''
                  }, ${i18n.messages[language].courseRoundInformation.round_category[courseRound.round_category]}`
                  return (
                    <option
                      key={index}
                      id={dropdownID + '_' + index + '_' + '0'}
                      selected={callerInstance.state.roundSelectedIndex - 1 === index}
                      value={value}
                    >
                      {value}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>
        </form>
      </div>
      // <div className='col-12 semester-dropdowns'>
      //   <Label htmlFor={dropdownID}>{label.label_dropdown}</Label>
      //   <Dropdown group
      //     isOpen={callerInstance.state.dropdownsOpen[dropdownID]}
      //     toggle={callerInstance.toggle}
      //     key={'dropD' + dropdownID}
      //     id={dropdownID}
      //     className='select-round'
      //   >
      //     <DropdownToggle
      //       id={dropdownID}
      //       disabled={callerInstance.state.roundDisabled}
      //     >
      //       {callerInstance.state.roundSelected
      //         ? <span id={dropdownID + '_span'}>
      //             {
      //               `${courseRoundList[callerInstance.state.activeRoundIndex].round_short_name !== EMPTY[language]
      //                 ? courseRoundList[callerInstance.state.activeRoundIndex].round_short_name
      //                 : ''},
      //                 ${i18n.messages[language].courseRoundInformation.round_category[courseRoundList[callerInstance.state.activeRoundIndex].round_category]}
      //               `
      //             }
      //         </span>
      //         : <span id={dropdownID + '_spanSelect'}>{label.placeholder} </span>
      //       }
      //       <span caret className='caretholder' id={dropdownID + '_spanCaret'}></span>
      //     </DropdownToggle>
      //     <DropdownMenu>
      //       {
      //         courseRoundList.map((courseRound, index) => {
      //           return (
      //             <DropdownItem key={index} id={dropdownID + '_' + index + '_' + '0'} onClick={callerInstance.handleDropdownSelect}>
      //               {
      //                 `${courseRound.round_short_name !== EMPTY[language] ? courseRound.round_short_name : ''},
      //                 ${i18n.messages[language].courseRoundInformation.round_category[courseRound.round_category]}`
      //               }
      //             </DropdownItem>
      //           )
      //         })
      //       }
      //     </DropdownMenu>
      //   </Dropdown>
      // </div>
    )
  }
}

export default CoursePage
