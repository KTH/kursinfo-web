import React, { useEffect } from 'react'

import { Col, Row } from 'reactstrap'

import { useWebContext } from '../context/WebContext'
import { useLanguage } from '../hooks/useLanguage'
import { useSemesterRoundState } from '../hooks/useSemesterRoundState'
import { aboutCourseLink } from '../util/links'

import Alert from '../components-shared/Alert'
import CourseTitle from '../components/CourseTitle'
import { MainCourseInformation } from '../components/MainCourseInformation'
import { RoundInformation } from '../components/RoundInformation'
import { RoundSelector } from '../components/RoundSelector'
import SideMenu from '../components/SideMenu'

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
      courseInfo: {},
      syllabusList: [],
    },
  } = context

  const semesterRoundState = useSemesterRoundState({
    initiallySelectedRoundIndex,
    initiallySelectedSemester,
    roundsBySemester: courseData.roundsBySemester,
    syllabusList: courseData.syllabusList,
    activeSemesters,
  })
  const { activeRound, showRoundData } = semesterRoundState

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

  return (
    <Row id="kursinfo-main-page">
      <SideMenu courseCode={courseCode} labels={translation.courseLabels.sideMenu} />
      <main className="col" id="mainContent">
        <CourseTitle
          key="title"
          courseTitleData={courseData.courseTitleData}
          language={languageShortname}
          pageTitle={translation.courseLabels.sideMenu.page_before_course}
        />

        {(courseInfo.course_is_discontinued || courseInfo.course_is_being_discontinued) && (
          <div className="isCancelled">
            <Alert
              color="info"
              aria-live="polite"
              header={
                courseInfo.course_is_discontinued
                  ? translation.course_state_alert.discontinued
                  : translation.course_state_alert.is_being_discontinued
              }
            >
              {courseInfo.course_last_exam && (
                <p>
                  {translation.course_state_alert.last_examination}
                  {translation.courseInformation.course_short_semester[courseInfo.course_last_exam[1]]}
                  {courseInfo.course_last_exam[0]}
                </p>
              )}
              <p />
              <p>{translation.course_state_alert.discontinuation_decision}</p>
              <p />
              <span
                dangerouslySetInnerHTML={{
                  __html: courseInfo.course_decision_to_discontinue,
                }}
              />
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

        <RoundSelector activeSemesters={activeSemesters} semesterRoundState={semesterRoundState} />

        {showRoundData && (
          <RoundInformation courseCode={courseCode} courseRound={activeRound} semesterRoundState={semesterRoundState} />
        )}

        <MainCourseInformation
          courseCode={courseCode}
          courseData={courseData}
          semesterRoundState={semesterRoundState}
        />
      </main>
    </Row>
  )
}

export default CoursePage
