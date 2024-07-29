import React, { useEffect } from 'react'

import { Col, Row } from 'reactstrap'

import { useWebContext } from '../context/WebContext'
import { useLanguage } from '../hooks/useLanguage'
import { useSemesterRoundState } from '../hooks/useSemesterRoundState'
import { aboutCourseLink } from '../util/links'

import Alert from '../components-shared/Alert'
import CourseTitle from '../components/CourseTitle'
import DropdownRounds from '../components/DropdownRounds'
import InfoModal from '../components/InfoModal'
import { MainCourseInformation } from '../components/MainCourseInformation'
import { RoundApplicationButton } from '../components/RoundApplicationButton'
import { RoundInformation } from '../components/RoundInformation'
import SideMenu from '../components/SideMenu'
import { Tab, Tabs } from '../components/Tabs/Tabs'

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

  const semesterRoundState = useSemesterRoundState({
    initiallySelectedRoundIndex,
    initiallySelectedSemester,
    roundsBySemester: courseData.roundsBySemester,
    syllabusList: courseData.syllabusList,
    activeSemesters,
  })
  const { selectedSemester, activeRound, showRoundData, hasActiveSemesters, activeSyllabus, hasSyllabus } =
    semesterRoundState

  const { courseInfo } = courseData
  const { translation, languageShortname } = useLanguage()

  const { sellingText, imageFromAdmin = '' } = courseInfo

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

  const hasSelectedSemesterMultipleRounds =
    courseData.roundsBySemester &&
    courseData.roundsBySemester[selectedSemester] &&
    courseData.roundsBySemester[selectedSemester].length > 1

  return (
    <Row id="kursinfo-main-page">
      <SideMenu courseCode={courseCode} labels={translation.courseLabels.sideMenu} />
      <main className="col" id="mainContent">
        <CourseTitle
          key="title"
          courseTitleData={courseData.courseTitleData}
          courseLevelCode={courseData.courseInfo.course_level_code}
          language={languageShortname}
          pageTitle={translation.courseLabels.sideMenu.page_before_course}
        />

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
        {!hasActiveSemesters ? (
          <>
            <h2>
              {translation.courseLabels.header_dropdown_menue}
              <InfoModal
                title={translation.courseLabels.header_dropdown_menue}
                infoText={translation.courseLabels.syllabus_info}
                type="html"
                closeLabel={translation.courseLabels.label_close}
                ariaLabel={translation.courseLabels.header_dropdown_menu_aria_label}
              />
            </h2>
            <p>
              <i>{translation.courseLabels.lable_no_rounds}</i>
            </p>
            <MainCourseInformation
              courseCode={courseCode}
              courseData={courseData}
              semesterRoundState={semesterRoundState}
            />
          </>
        ) : (
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
                {hasSelectedSemesterMultipleRounds && (
                  <div>
                    <h2>
                      {translation.courseLabels.header_dropdown_menue}
                      <InfoModal
                        title={translation.courseLabels.header_dropdown_menue}
                        infoText={translation.courseLabels.syllabus_info}
                        type="html"
                        closeLabel={translation.courseLabels.label_close}
                        ariaLabel={translation.courseLabels.header_dropdown_menu_aria_label}
                      />
                    </h2>
                    <p>{translation.courseLabels.header_dropdown_menu_navigation} </p>
                  </div>
                )}

                <div className="roundDropdownAndApplicationButton">
                  <div>
                    {hasSelectedSemesterMultipleRounds && (
                      <DropdownRounds
                        roundsForSelectedSemester={courseData.roundsBySemester[selectedSemester]}
                        semesterRoundState={semesterRoundState}
                      />
                    )}
                  </div>

                  <RoundApplicationButton courseRound={activeRound} showRoundData={showRoundData} />
                </div>

                {showRoundData && (
                  <RoundInformation
                    courseCode={courseCode}
                    courseData={courseInformationToRounds}
                    courseRound={activeRound}
                    semesterRoundState={semesterRoundState}
                  />
                )}

                <MainCourseInformation
                  courseCode={courseCode}
                  courseData={courseData}
                  semesterRoundState={semesterRoundState}
                />
              </Tab>
            ))}
          </Tabs>
        )}
      </main>
    </Row>
  )
}

export default CoursePage
