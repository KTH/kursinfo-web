/* eslint-disable react/no-danger */
import React, { useEffect } from 'react'

import { Row, Col } from 'reactstrap'

import { FORSKARUTB_URL } from '../util/constants'
import { aboutCourseLink } from '../util/links'

import Alert from '../components-shared/Alert'

import { RoundInformation } from '../components/RoundInformation'
import { RoundApplicationButton } from '../components/RoundApplicationButton'
import CourseTitle from '../components/CourseTitle'
import CourseSectionList from '../components/CourseSectionList'
import DropdownRounds from '../components/DropdownRounds'
import { SingleRoundLabel } from '../components/SingleRoundLabel'
import SideMenu from '../components/SideMenu'
import { SyllabusContainer } from '../components/SyllabusContainer'
import { Tabs, Tab } from '../components/Tabs/Tabs'
import { useWebContext } from '../context/WebContext'
import BankIdAlert from '../components/BankIdAlert'
import { useLanguage } from '../hooks/useLanguage'
import { useSemesterRoundState } from '../hooks/useSemesterRoundState'

const aboutCourseStr = (translate, courseCode = '') => `${translate.site_name} ${courseCode}`

function CoursePage() {
  const context = useWebContext()

  const {
    initiallySelectedRoundIndex,
    initiallySelectedSemester,
    activeSemesters,
    browserConfig,
    courseCode,
    courseData = {
      courseInfo: { course_application_info: '' },
      syllabusList: [],
    },
    isCancelledOrDeactivated,
  } = context
  // * * //

  const semesterRoundState = useSemesterRoundState({
    initiallySelectedRoundIndex,
    initiallySelectedSemester,
    roundsBySemester: courseData.roundsBySemester,
    syllabusList: courseData.syllabusList,
    activeSemesters,
  })
  const {
    selectedSemester,
    firstRoundInActiveSemester,
    activeRound,
    showRoundData,
    hasActiveSemesters,
    activeSyllabus,
    hasSyllabus,
  } = semesterRoundState

  const { courseInfo, emptySyllabusData } = courseData
  const { translation, languageShortname } = useLanguage()

  const { sellingText, imageFromAdmin } = courseInfo

  let courseImage = ''
  if (imageFromAdmin.length > 4) {
    courseImage = imageFromAdmin
  } else {
    const cms = courseInfo.course_main_subject || ''
    const mainSubjects = cms.split(',').map(s => s.trim())
    courseImage = translation.courseImage[mainSubjects.sort()[0]]
    if (courseImage === undefined) {
      courseImage = translation.courseImage.default
    }
  }
  courseImage = `${browserConfig.imageStorageUri}${courseImage}`

  const decisionToDiscontinue = hasSyllabus ? activeSyllabus.course_decision_to_discontinue : ''
  const course_valid_from = hasSyllabus ? activeSyllabus.course_valid_from : ''

  const courseInformationToRounds = {
    course_code: courseCode,
    course_examiners: courseInfo.course_examiners,
    course_contact_name: courseInfo.course_contact_name,
    course_main_subject: courseInfo.course_main_subject,
    course_level_code: courseInfo.course_level_code,
    course_valid_from,
  }

  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      const siteNameElement = document.querySelector('.block.siteName a')
      if (siteNameElement) {
        siteNameElement.textContent = aboutCourseStr(translation.messages, courseCode)
        siteNameElement.href = aboutCourseLink(courseCode, languageShortname)
      }
    }
    return () => (isMounted = false)
  })

  const createValidToString = () => {
    if (!activeSyllabus.course_valid_to) return ''
    return `${translation.courseInformation.course_short_semester[activeSyllabus.course_valid_to.semesterNumber]}${activeSyllabus.course_valid_to.year}`
  }

  const createValidFromString = () =>
    `${
      translation.courseInformation.course_short_semester[activeSyllabus.course_valid_from.semesterNumber]
    }${activeSyllabus.course_valid_from.year}`

  const createSyllabusName = () => {
    if (!hasSyllabus) return ''
    return `${courseCode}${` (${createValidFromString()}\u2013${createValidToString()})`}`
  }

  const syllabusName = createSyllabusName()

  const showRoundDropdown =
    courseData.roundsBySemester &&
    courseData.roundsBySemester[selectedSemester] &&
    courseData.roundsBySemester[selectedSemester].length > 1

  return (
    <Row id="kursinfo-main-page">
      <SideMenu courseCode={courseCode} labels={translation.courseLabels.sideMenu} />
      <main className="col" id="mainContent">
        {/** ************************************************************************************************************ */}
        {/*                                                   INTRO                                                     */}
        {/** ************************************************************************************************************ */}
        {/* ---COURSE TITEL--- */}
        <CourseTitle
          key="title"
          courseTitleData={courseData.courseTitleData}
          language={languageShortname}
          pageTitle={translation.courseLabels.sideMenu.page_before_course}
        />
        {/* ---TEXT FOR CANCELLED COURSE --- */}
        {isCancelledOrDeactivated && (
          <div className="isCancelled">
            <Alert
              color="info"
              aria-live="polite"
              header={translation.course_state_alert[courseInfo.course_state].header}
            >
              <p>
                {translation.course_state_alert[courseInfo.course_state].examination}
                {translation.courseInformation.course_short_semester[courseInfo.course_last_exam[1]]}
                {courseInfo.course_last_exam[0]}
              </p>
              <p />
              <p>{translation.course_state_alert[courseInfo.course_state].decision}</p>
              <p />
              <span dangerouslySetInnerHTML={{ __html: decisionToDiscontinue }} />
            </Alert>
          </div>
        )}

        {/* ---INTRO TEXT--- */}
        <section
          className="row"
          id="courseIntroText"
          key="courseIntroText"
          aria-label={translation.courseLabels.label_course_description}
        >
          <Col>
            <img className="float-md-start" src={courseImage} alt="" height="auto" width="300px" />
            <div className="paragraphs" dangerouslySetInnerHTML={{ __html: sellingText }} />
          </Col>
        </section>
        {showRoundData && (
          <BankIdAlert
            tutoringForm={activeRound.round_tutoring_form}
            fundingType={activeRound.round_funding_type}
            roundSpecified={hasActiveSemesters && showRoundData}
          />
        )}

        {/* TODO(karl): Visning av tabbarna om hasActiveSemesters=false */}
        <Tabs
          selectedTabKey={semesterRoundState.selectedSemester}
          onSelectedTabChange={tabKey => semesterRoundState.setSelectedSemester(tabKey)}
        >
          {activeSemesters.map((semesterItem, index) => (
            <Tab
              key={index}
              tabKey={semesterItem.semester}
              title={`${translation.courseInformation.course_short_semester[semesterItem.semesterNumber]}${semesterItem.year}`}
            >
              {semesterItem.semester}
              {showRoundDropdown ? (
                <DropdownRounds
                  roundsForSelectedSemester={courseData.roundsBySemester[selectedSemester]}
                  semesterRoundState={semesterRoundState}
                />
              ) : (
                showRoundData && <SingleRoundLabel round={firstRoundInActiveSemester} />
              )}

              {/* TODO(karl): denna ska visas bredvid DropdownRounds */}
              <RoundApplicationButton courseRound={activeRound} showRoundData={showRoundData} />

              {showRoundData && (
                <RoundInformation
                  courseCode={courseCode}
                  courseData={courseInformationToRounds}
                  courseRound={activeRound}
                  semesterRoundState={semesterRoundState}
                />
              )}

              {/* TODO(karl): Några delar som blivit kvar i uppstädning. Ska de bort eller in på nåt nytt ställe? Om de ska bort, kolla om messages ska rensas med
              
              Fanns tidigare i RoundinformationOneCol:
              <div className="info-box yellow">
                <h3>{translation.courseLabels.header_no_round_selected}</h3>
                <p>{translation.courseLabels.no_round_selected}</p>
              </div>
              nästan samma utanför:
                <div className="info-box">
                {hasActiveSemesters ? (
                  <p>{translation.courseLabels.no_round_selected}</p>
                ) : (
                  <i>{translation.courseLabels.lable_no_rounds}</i>
                )}
              </div>

              Infomodal för rubriken till höger tidigare...
              <InfoModal
                  title={translation.courseLabels.header_dropdown_menue}
                  infoText={translation.courseLabels.syllabus_info}
                  type="html"
                  closeLabel={translation.courseLabels.label_close}
                  ariaLabel={translation.courseLabels.header_dropdown_menu_aria_label}
                />

                Inte beslutad
                 {showRoundData && activeRound.round_state !== 'APPROVED' ? (
                    <Alert type="info" aria-live="polite">
                      {`${translation.courseLabels.lable_round_state[activeRound.round_state]}
                            `}
                    </Alert>
                  ) : (
                    ''
                  )}
              

                  I grå ruta till höger: 
                  header_dropdown_menu_navigation - Välj termin och kursomgång för innehållet på sidan

                Alert som troligen inte visades tidigare:
                  <Alert type="info" header={translation.courseLabels.header_no_rounds}>
                  {translation.courseLabels.lable_no_rounds}
                </Alert>


                application info? Hur testar jag denna och var ska den in nu?
                  {courseInfo.course_application_info.length > 0 && (
              <Alert type="info" header={translation.courseInformation.course_application_info}>
                <span dangerouslySetInnerHTML={{ __html: courseInfo.course_application_info }} />
              </Alert>
            )}

              */}

              {/* TODO(karl): Vad är SyllabusContainer i förhållande till activeSyllabusContainer nedanför? */}

              <SyllabusContainer
                courseCode={courseCode}
                syllabusName={syllabusName}
                semesterRoundState={semesterRoundState}
              />

              <div id="activeSyllabusContainer" key="activeSyllabusContainer">
                {!hasSyllabus && (
                  <Alert color="info" aria-live="polite">
                    <h4>{translation.courseLabels.header_no_syllabus}</h4>
                    {translation.courseLabels.label_no_syllabus}
                  </Alert>
                )}
              </div>

              <CourseSectionList
                courseInfo={courseInfo}
                // if there is no syllabus, we still want to display empty syllabus data
                syllabus={hasSyllabus ? activeSyllabus : emptySyllabusData}
                partToShow="courseContentBlock"
                syllabusName={syllabusName}
              />

              {/* ---IF RESEARCH LEVEL: SHOW "Postgraduate course" LINK--  */}
              {courseInfo.course_level_code === 'RESEARCH' && (
                <span>
                  <h3>{translation.courseLabels.header_postgraduate_course}</h3>
                  {translation.courseLabels.label_postgraduate_course}
                  <a href={`${FORSKARUTB_URL}${courseInfo.course_department_code}`}>{courseInfo.course_department}</a>
                </span>
              )}
            </Tab>
          ))}
        </Tabs>
      </main>
    </Row>
  )
}

export default CoursePage
