/* eslint-disable react/no-danger */
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import { Row, Col, Alert, Breadcrumb, BreadcrumbItem } from 'reactstrap'

import i18n from '../../../../i18n'
import { INFORM_IF_IMPORTANT_INFO_IS_MISSING, FORSKARUTB_URL, SYLLABUS_URL } from '../util/constants'
import { breadcrumbLinks, aboutCourseLink } from '../util/links'

import RoundInformationOneCol from '../components/RoundInformationOneCol'
import CourseTitle from '../components/CourseTitle'
import CourseSectionList from '../components/CourseSectionList'
import InfoModal from '../components/InfoModal'
import SideMenu from '../components/SideMenu'

const aboutCourseStr = (translate, courseCode = '') => `${translate.site_name} ${courseCode}`

const breadcrumbs = (translation, language, courseCode) => {
  return (
    <Breadcrumb lang={language} aria-label={translation.breadCrumbLabels.breadcrumbs} className="secondaryMenu">
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
  )
}

@inject(['routerStore'])
@observer
class CoursePage extends Component {
  constructor(props) {
    super(props)
    const { routerStore } = this.props

   
    const checkQuery = routerStore.startSemester !== '' && routerStore.activeSemesters.some(s => s[2] === routerStore.startSemester)//check if query include chosen start semester and check if query include some old semester which is not active
    
    this.checkQuery = checkQuery

    routerStore.activeSemesters = checkQuery
    ? this.reorder(routerStore.startSemester, "2", routerStore.activeSemesters) : routerStore.activeSemesters // reordering activeSemesters list after chosen startSemester on antagning.se 
    
    const startSemester = checkQuery
    ? routerStore.activeSemesters.filter(semester => semester[2] === routerStore.startSemester)
    : [] //start semester from query string

    const activeSemester = routerStore.activeSemesters && routerStore.activeSemesters.length > 0
    ? routerStore.activeSemesters[routerStore.defaultIndex][2]
    : 0 

    routerStore.activeSemester = checkQuery ? startSemester : activeSemester
    
    const roundCategory  = "VU"//single course students
    checkQuery
    ? routerStore.courseData.roundList[routerStore.activeSemester] = this.reorder(roundCategory, "round_category", routerStore.courseData.roundList[routerStore.startSemester])
    : routerStore.courseData.roundList[routerStore.activeSemester]// init roundList with reordered roundList after single course students

    routerStore.showRoundData = (routerStore.activeSemesters.length === 1 && routerStore.courseData.roundList[routerStore.activeSemester].length === 1) ||  (checkQuery && routerStore.courseData.roundList[routerStore.activeSemester].length === 1)? true : false
    routerStore.roundDisabled = checkQuery ? false : routerStore.activeSemesters.length > 1
     
    this.handleDropdownSelect = this.handleDropdownSelect.bind(this)
    this.handleSemesterDropdownSelect = this.handleSemesterDropdownSelect.bind(this)
    this.reorder = this.reorder.bind(this)
         
  }

  componentDidMount() {
    const { routerStore } = this.props
    const courseData = routerStore.courseData || {
      courseInfo: { course_application_info: [] },
      syllabusSemesterList: []
    }
    if (!courseData.language) courseData.language = 'sv'
    const { language } = courseData
    const translation = i18n.messages[language === 'en' ? 0 : 1]
    const siteNameElement = document.querySelector('.block.siteName a')
    if (siteNameElement) siteNameElement.textContent = aboutCourseStr(translation.messages, routerStore.courseCode)
  }

  componentDidUpdate() {
    const { routerStore } = this.props
    if (routerStore.syllabusInfoFade) {
      const that = this
      setTimeout(() => {
        that.props.routerStore.roundInfoFade = false
        that.props.routerStore.syllabusInfoFade = false
      }, 800)
    } else {
      const that = this
      setTimeout(() => {
        that.props.routerStore.roundInfoFade = false
      }, 500)
    }
  }

  handleSemesterDropdownSelect(event) {
    event.preventDefault()
    const { routerStore } = this.props

    const eventTarget = event.target
    const selectedOption = eventTarget[eventTarget.selectedIndex]

    const selectInfo = selectedOption.id.split('_')
    const newIndex = Number(selectInfo[1])
    const activeSemester = routerStore.activeSemesters[newIndex]
      ? routerStore.activeSemesters[newIndex][2].toString()
      : ''
    routerStore.syllabusInfoFade = routerStore.activeSyllabusIndex !== routerStore.roundsSyllabusIndex[newIndex]
    const showRoundData =
      routerStore.courseData.roundList[activeSemester] && routerStore.courseData.roundList[activeSemester].length === 1

    routerStore.activeRoundIndex = 0
    routerStore.activeSemesterIndex = newIndex >= 0 ? newIndex : routerStore.defaultIndex
    routerStore.activeSemester =
      activeSemester ||
      (routerStore.activeSemesters.length > 0 ? routerStore.activeSemesters[routerStore.defaultIndex][2] : 0)
    routerStore.activeSyllabusIndex = routerStore.roundsSyllabusIndex[newIndex] || 0
    routerStore.roundInfoFade = true
    routerStore.showRoundData = showRoundData
    routerStore.roundDisabled = newIndex === -1
    routerStore.roundSelected = newIndex === -1
    routerStore.semesterSelectedIndex = eventTarget.selectedIndex
    routerStore.roundSelectedIndex = 0

    if (routerStore.showRoundData) {
      routerStore.getCourseEmployees()
    }
  }

  handleDropdownSelect(event) {
    event.preventDefault()

    const eventTarget = event.target
    const selectedOption = eventTarget[eventTarget.selectedIndex]
    const { routerStore } = this.props

    const selectInfo = selectedOption.id.split('_')
    routerStore.activeRoundIndex = eventTarget.selectedIndex === 0 ? 0 : selectInfo[1]
    routerStore.showRoundData = eventTarget.selectedIndex !== 0
    routerStore.roundSelected = eventTarget.selectedIndex !== 0
    routerStore.roundSelectedIndex = eventTarget.selectedIndex

    if (routerStore.showRoundData) {
      routerStore.getCourseEmployees()
    }
  }
  reorder(option, key, arr) {
    let newArray = arr.slice()      
    newArray.sort(o => o[key] !== option ? 1 : -1) // put in first
    return newArray
  }

  render() {
    const { routerStore } = this.props
    const courseData = routerStore.courseData || {
      courseInfo: { course_application_info: [] },
      syllabusSemesterList: []
    }
    if (!courseData.language) courseData.language = 'sv'

    const { language } = courseData
    const translation = i18n.messages[language === 'en' ? 0 : 1]
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
        mainSubjects = mainSubjects.map((subject) => i18n.messages[0].courseMainSubjects[subject])
      }
      courseImage = i18n.messages[1].courseImage[mainSubjects.sort()[0]]
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
      course_valid_from: courseData.syllabusList[routerStore.activeSyllabusIndex || 0].course_valid_from
    }
    
    return (
      <div key="kursinfo-container" className="col" id="kursinfo-main-page">
        <Row>{breadcrumbs(translation, language, routerStore.courseCode)}</Row>
        <Row id="pageContainer" key="pageContainer">
          <SideMenu
            courseCode={routerStore.courseCode}
            labels={translation.courseLabels.sideMenu}
            language={language}
          />
          <main className="col" id="mainContent">
            {/** ************************************************************************************************************ */}
            {/*                                                   INTRO                                                     */}
            {/** ************************************************************************************************************ */}
            {/* ---COURSE TITEL--- */}
            <CourseTitle
              key="title"
              courseTitleData={courseData.courseTitleData}
              language={language}
              pageTitle={translation.courseLabels.sideMenu.page_before_course}
            />
            {/* ---TEXT FOR CANCELLED COURSE --- */}
            {routerStore.isCancelled || routerStore.isDeactivated ? (
              <div className="isCancelled">
                <Alert color="info" aria-live="polite">
                  <h3>{`${translation.course_state_alert[courseData.courseInfo.course_state].header}`}</h3>
                  <p>
                    {translation.course_state_alert[courseData.courseInfo.course_state].examination}
                    {translation.courseInformation.course_short_semester[courseData.courseInfo.course_last_exam[1]]}
                    {courseData.courseInfo.course_last_exam[0]}
                  </p>
                  <p>
                    {translation.course_state_alert[routerStore.courseData.courseInfo.course_state].decision}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: courseData.syllabusList[routerStore.activeSyllabusIndex].course_decision_to_discontinue
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
                <div className="paragraphs" dangerouslySetInnerHTML={{ __html: introText }} />
              </Col>
            </section>
            <Row id="columnContainer" key="columnContainer">
              <Col id="leftContainer" key="leftContainer">
                {/** ************************************************************************************************************ */}
                {/*                                      RIGHT COLUMN - ROUND INFORMATION                                         */}
                {/** ************************************************************************************************************ */}
                <Col id="roundInformationContainer" md="4" xs="12" className="float-md-right">
                  {/* ---COURSE  DROPDOWN MENU--- */}
                  {routerStore.activeSemesters && routerStore.activeSemesters.length > 0 ? (
                    <nav id="roundDropdownMenu" aria-label={translation.courseLabels.header_dropdown_menu_navigation}>
                      <span id="roundDropdownMenuHeaderWrapper">
                        <h2 id="roundDropdownMenuHeader" style={{ marginTop: 0 }}>
                          {translation.courseLabels.header_dropdown_menue}
                        </h2>
                        <InfoModal
                          title={translation.courseLabels.header_dropdown_menue}
                          infoText={translation.courseLabels.syllabus_info}
                          type="html"
                          closeLabel={translation.courseLabels.label_close}
                          ariaLabel={translation.courseLabels.header_dropdown_menu_aria_label}
                        />
                      </span>
                      <div className="row" id="roundDropdowns" key="roundDropdown">
                        {routerStore.activeSemesters.length > 0 && (
                          <DropdownSemesters
                            semesterList={routerStore.activeSemesters}
                            courseRoundList={courseData.roundList[routerStore.activeSemester]}
                            callerInstance={this}
                            year={routerStore.activeSemesters[routerStore.activeSemesterIndex][0]}
                            semester={routerStore.activeSemesters[routerStore.activeSemesterIndex][1]}
                            language={language}
                            label={translation.courseLabels.label_semester_select}
                            translation={translation}
                            checkQuery={this.checkQuery}
                          />
                        )}
                        {courseData.roundList[routerStore.activeSemester] &&
                        courseData.roundList[routerStore.activeSemester].length > 1 ? (
                          <DropdownRounds
                            semesterList={routerStore.activeSemesters}
                            courseRoundList={courseData.roundList[routerStore.activeSemester]}
                            callerInstance={this}
                            year={routerStore.activeSemesters[routerStore.activeSemesterIndex][0]}
                            semester={routerStore.activeSemesters[routerStore.activeSemesterIndex][1]}
                            language={language}
                            label={translation.courseLabels.label_round_select}
                            translation={translation}
                          />
                        ) : routerStore.showRoundData ? (
                          <p>
                            {`
                                ${
                                  translation.courseInformation.course_short_semester[
                                    courseData.roundList[routerStore.activeSemester][0].round_course_term[1]
                                  ]
                                } 
                                ${courseData.roundList[routerStore.activeSemester][0].round_course_term[0]}  
                                ${
                                  courseData.roundList[routerStore.activeSemester][0].round_short_name !==
                                  INFORM_IF_IMPORTANT_INFO_IS_MISSING[language]
                                    ? courseData.roundList[routerStore.activeSemester][0].round_short_name
                                    : ''
                                }     
                                ${
                                  translation.courseRoundInformation.round_category[
                                    courseData.roundList[routerStore.activeSemester][0].round_category
                                  ]
                                }
                              `}
                          </p>
                        ) : (
                          ''
                        )}

                        {/* ---ROUND CANCELLED OR FULL --- */}
                        {routerStore.activeSemesters.length > 0 &&
                        routerStore.showRoundData &&
                        courseData.roundList[routerStore.activeSemester][routerStore.activeRoundIndex].round_state !==
                          'APPROVED' ? (
                          <Alert color="info" aria-live="polite">
                            <h4>{`${
                              translation.courseLabels.lable_round_state[
                                courseData.roundList[routerStore.activeSemester][routerStore.activeRoundIndex]
                                  .round_state
                              ]
                            }
                            `}</h4>
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
                      <p dangerouslySetInnerHTML={{ __html: courseData.courseInfo.course_application_info }} />
                    </Alert>
                  ) : (
                    ''
                  )}

                  {/* ---COURSE ROUND INFORMATION--- */}
                  {routerStore.activeSemesters && routerStore.activeSemesters.length > 0 ? (
                    <RoundInformationOneCol
                      courseRound={courseData.roundList[routerStore.activeSemester][routerStore.activeRoundIndex]}
                      courseData={courseInformationToRounds}
                      language={language}
                      courseHasRound={routerStore.activeSemesters.length > 0}
                      fade={routerStore.roundInfoFade}
                      showRoundData={routerStore.showRoundData}
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
                  <aside id="syllabusContainer" aria-label={translation.courseLabels.label_syllabus_pdf_header}>
                    <h3 className="t4">{translation.courseLabels.label_syllabus_pdf_header}</h3>
                    {courseData.syllabusList[routerStore.activeSyllabusIndex] &&
                    courseData.syllabusList[routerStore.activeSyllabusIndex].course_valid_from &&
                    courseData.syllabusList[routerStore.activeSyllabusIndex].course_valid_from[0] ? (
                      <>
                        <p>{translation.courseLabels.label_syllabus_pdf_info}</p>
                        <a
                          href={`${SYLLABUS_URL}${routerStore.courseCode}-${courseData.syllabusList[
                            routerStore.activeSyllabusIndex
                          ].course_valid_from.join('')}.pdf?lang=${language}`}
                          id={
                            courseData.syllabusList[routerStore.activeSyllabusIndex].course_valid_from.join('') +
                            '_active'
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="pdf-link pdf-link-fix pdf-link-last-line"
                        >
                          {`${translation.courseLabels.label_syllabus_link} ${routerStore.courseCode}${` (${
                            translation.courseInformation.course_short_semester[
                              courseData.syllabusList[routerStore.activeSyllabusIndex].course_valid_from[1]
                            ]
                          }${courseData.syllabusList[routerStore.activeSyllabusIndex].course_valid_from[0]}–${
                            courseData.syllabusList[routerStore.activeSyllabusIndex].course_valid_to.length > 0
                              ? translation.courseInformation.course_short_semester[
                                  courseData.syllabusList[routerStore.activeSyllabusIndex].course_valid_to[1]
                                ] +
                                '' +
                                courseData.syllabusList[routerStore.activeSyllabusIndex].course_valid_to[0]
                              : ''
                          })`}`}
                        </a>
                      </>
                    ) : (
                      <>{translation.courseLabels.label_syllabus_missing}</>
                    )}
                  </aside>
                </Col>

                {/** ************************************************************************************************************ */}
                {/*                           LEFT COLUMN - SYLLABUS + OTHER COURSE INFORMATION                                 */}
                {/** ************************************************************************************************************ */}
                <Col id="coreContent" md="8" xs="12" className="float-md-left paragraphs">
                  <div
                    key="fade-2"
                    className={` fade-container ${routerStore.syllabusInfoFade === true ? ' fadeOutIn' : ''} `}
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
                      </Col>
                    </Row>

                    {/* --- COURSE INFORMATION CONTAINER---  */}
                    <CourseSectionList
                      courseInfo={courseData.courseInfo}
                      syllabusList={courseData.syllabusList[routerStore.activeSyllabusIndex]}
                      syllabusSemesterList={courseData.syllabusSemesterList}
                      showCourseLink={routerStore.showCourseWebbLink}
                      partToShow="courseContentBlock"
                      syllabusName={
                        courseData.syllabusSemesterList.length > 0
                          ? `${routerStore.courseCode}${` (${
                              translation.courseInformation.course_short_semester[
                                courseData.syllabusList[routerStore.activeSyllabusIndex].course_valid_from[1]
                              ]
                            }${
                              courseData.syllabusList[routerStore.activeSyllabusIndex] &&
                              courseData.syllabusList[routerStore.activeSyllabusIndex].course_valid_from
                                ? courseData.syllabusList[routerStore.activeSyllabusIndex].course_valid_from[0]
                                : ''
                            }–${
                              courseData.syllabusList[routerStore.activeSyllabusIndex].course_valid_to.length > 0
                                ? translation.courseInformation.course_short_semester[
                                    courseData.syllabusList[routerStore.activeSyllabusIndex].course_valid_to[1]
                                  ] +
                                  '' +
                                  courseData.syllabusList[routerStore.activeSyllabusIndex].course_valid_to[0]
                                : ''
                            })`}`
                          : ''
                      }
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

const DropdownSemesters = ({ semesterList, callerInstance, label = '', translation, checkQuery}) => {
  const dropdownID = 'semesterDropdown'
  const startSemester = callerInstance.props.routerStore.startSemester
  const activeSemester = callerInstance.props.routerStore.activeSemester
  const activeRoundList = callerInstance.props.routerStore.courseData.roundList[activeSemester] 

  if (semesterList && semesterList.length < 1) {
    return ''
  }
  return (
    <div className="col-12 semester-dropdowns">
      <form>
        <label className="form-control-label" htmlFor={dropdownID}>
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
               {(semesterList.length > 1 && startSemester === '') || (startSemester === '' ? false : !checkQuery) 
               ? (
                <option
                id={dropdownID + '_-1_0'}
                defaultValue={callerInstance.props.routerStore.semesterSelectedIndex === 0}
                value={label.placeholder}
              >
                {label.placeholder}
              </option>
              ) : ''}
              {semesterList.map((semesterItem, index) => {
                return (
                  <option
                    key={`${translation.courseInformation.course_short_semester[semesterItem[1]]}${semesterItem[0]}`}
                    id={dropdownID + '_' + index + '_0'}
                    defaultValue={callerInstance.props.routerStore.semesterSelectedIndex - 1 === index}
                    value={`${translation.courseInformation.course_short_semester[semesterItem[1]]}${semesterItem[0]}`}
                  >
                    {translation.courseInformation.course_short_semester[semesterItem[1]]}
                    {semesterItem[0]}
                  </option>
                )
              })}
            </select>
          </div>
        </div>
      </form>
    </div>
  )
}

const DropdownRounds = ({ courseRoundList, callerInstance, language = 0, label = '', translation }) => {
  const dropdownID = 'roundsDropdown'
  
  if (courseRoundList && courseRoundList.length < 2) {
    return ''
  }
  return (
    <div className="col-12 semester-dropdowns">
      <form>
        <label className="form-control-label" htmlFor={dropdownID}>
          {label.label_dropdown}
        </label>
        <div className="form-select form-group">
          <div className="select-wrapper">
            <select
              className="form-control"
              id={dropdownID}
              aria-label=""
              onChange={callerInstance.handleDropdownSelect}
              disabled={callerInstance.props.routerStore.roundDisabled}
            >
              (
                <option
                id={dropdownID + '_-1_0'}
                defaultValue={callerInstance.props.routerStore.roundSelectedIndex === 0}
                value={label.placeholder}
              >
                {label.placeholder}
              </option>
              )
              {courseRoundList.map((courseRound, index) => {
                const value = `${
                  courseRound.round_short_name !== INFORM_IF_IMPORTANT_INFO_IS_MISSING[language]
                    ? courseRound.round_short_name
                    : ''
                }, ${translation.courseRoundInformation.round_category[courseRound.round_category]}`
                return (
                  <option
                    key={value}
                    id={dropdownID + '_' + index + '_0'}
                    defaultValue={callerInstance.props.routerStore.roundSelectedIndex - 1 === index}
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
  )
}

export default CoursePage
