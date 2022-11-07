/* eslint-disable react/no-danger */
import React, { useEffect } from 'react'

import { Row, Col, Alert, Breadcrumb, BreadcrumbItem } from 'reactstrap'

import i18n from '../../../../i18n'
import { INFORM_IF_IMPORTANT_INFO_IS_MISSING, FORSKARUTB_URL, SYLLABUS_URL } from '../util/constants'
import { breadcrumbLinks, aboutCourseLink } from '../util/links'

import RoundInformationOneCol from '../components/RoundInformationOneCol'
import CourseTitle from '../components/CourseTitle'
import CourseSectionList from '../components/CourseSectionList'
import DropdownRounds from '../components/DropdownRounds'
import DropdownSemesters from '../components/DropdownSemesters'
import InfoModal from '../components/InfoModal'
import SideMenu from '../components/SideMenu'
import { useWebContext } from '../context/WebContext'

const aboutCourseStr = (translate, courseCode = '') => `${translate.site_name} ${courseCode}`

const Breadcrumbs = ({ translation, language, courseCode }) => (
  <Breadcrumb lang={language} aria-label={translation.breadCrumbLabels.breadcrumbs} className="secondaryMenu">
    <BreadcrumbItem>
      <a href={`${breadcrumbLinks.university[language]}`}>{translation.breadCrumbLabels.university}</a>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <a href={`${breadcrumbLinks.student[language]}`}>{translation.breadCrumbLabels.student}</a>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <a href={`${breadcrumbLinks.directory[language]}`}>{translation.breadCrumbLabels.directory}</a>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <a
        href={`${aboutCourseLink(courseCode, language)}`}
      >{`${translation.breadCrumbLabels.aboutCourse} ${courseCode}`}</a>
    </BreadcrumbItem>
  </Breadcrumb>
)

function getCourseIntroduction(sellingText = {}, courseInfo = {}, language) {
  const { course_recruitment_text: courseDefaultIntro = '<p></p>' } = courseInfo
  return sellingText[language] && sellingText[language].length > 0 ? sellingText[language] : courseDefaultIntro
}

function ExperimentCoursePage() {
  const [context, setWebContext] = useWebContext()
  // const context = React.useMemo(() => webContext, [webContext])

  const {
    activeRoundIndex,
    activeSemester,
    activeSemesterIndex,
    activeSemesters,
    activeSyllabusIndex,
    browserConfig,
    courseCode,
    courseData = {
      courseInfo: { course_application_info: '' },
      syllabusSemesterList: [],
    },
    imageFromAdmin,
    isCancelled,
    isDeactivated,
    roundInfoFade,
    sellingText = {},
    showRoundData,
    syllabusInfoFade,
    useStartSemesterFromQuery,
  } = context
  // * * //
  const hasOnlyOneRound = activeSemester?.length > 0 && courseData.roundList[activeSemester].length === 1
  const hasToShowRoundsData = showRoundData || (useStartSemesterFromQuery && hasOnlyOneRound)

  const hasActiveSemesters = activeSemesters && activeSemesters.length > 0
  const { courseInfo, language = 'sv' } = courseData
  const translation = i18n.messages[language === 'en' ? 0 : 1]
  const introText = getCourseIntroduction(sellingText, courseInfo, language)

  let courseImage = ''
  if (imageFromAdmin.length > 4) {
    courseImage = imageFromAdmin
  } else {
    const cms = courseInfo.course_main_subject || ''
    let mainSubjects = cms.split(',').map(s => s.trim())
    if (mainSubjects && mainSubjects.length > 0 && language === 'en') {
      mainSubjects = mainSubjects.map(subject => i18n.messages[0].courseMainSubjects[subject])
    }
    courseImage = i18n.messages[1].courseImage[mainSubjects.sort()[0]]
    if (courseImage === undefined) {
      courseImage = translation.courseImage.default
    }
  }
  courseImage = `${browserConfig.imageStorageUri}${courseImage}`

  if (!courseData.syllabusList) courseData.syllabusList = [{}]
  const courseInformationToRounds = {
    course_code: courseCode,
    course_examiners: courseInfo.course_examiners,
    course_contact_name: courseInfo.course_contact_name,
    course_main_subject: courseInfo.course_main_subject,
    course_level_code: courseInfo.course_level_code,
    course_valid_from: courseData.syllabusList[activeSyllabusIndex || 0].course_valid_from,
  }

  const { course_decision_to_discontinue: decisionToDiscontinue = '' } =
    activeSyllabusIndex > -1 ? courseData.syllabusList[activeSyllabusIndex] : {}

  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      const siteNameElement = document.querySelector('.block.siteName a')
      if (siteNameElement) {
        siteNameElement.textContent = aboutCourseStr(translation.messages, courseCode)
        siteNameElement.href = aboutCourseLink(courseCode, language)
      }
    }
    return () => (isMounted = false)
  }, [])

  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      if (syllabusInfoFade) {
        setTimeout(() => {
          setWebContext({ ...context, roundInfoFade: false, syllabusInfoFade: false })
        }, 800)
      } else {
        setTimeout(() => {
          setWebContext({ ...context, roundInfoFade: false })
        }, 500)
      }
    }
    return () => (isMounted = false)
  }, [roundInfoFade, syllabusInfoFade])

  return (
    <div key="kursinfo-container" className="col" id="kursinfo-main-page">
      <Row>
        <Breadcrumbs translation={translation} language={language} courseCode={courseCode} />
      </Row>
      <Row id="pageContainer" key="pageContainer">
        <SideMenu courseCode={courseCode} labels={translation.courseLabels.sideMenu} language={language} />
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
          {(isCancelled || isDeactivated) && (
            <div className="isCancelled">
              <Alert color="info" aria-live="polite">
                <h3>{`${translation.course_state_alert[courseInfo.course_state].header}`}</h3>
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
              <img className="float-md-left" src={courseImage} alt="" height="auto" width="300px" />
              <div className="paragraphs" dangerouslySetInnerHTML={{ __html: introText }} />
            </Col>
          </section>
          <div>
            <h2>What is Lorem Ipsum?</h2>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
              industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release
              of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software
              like Aldus PageMaker including versions of Lorem Ipsum.
            </p>

            <h2>Why do we use it?</h2>
            <p>
              It is a long established fact that a reader will be distracted by the readable content of a page when
              looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of
              letters, as opposed to using 'Content here, content here', making it look like readable English. Many
              desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a
              search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved
              over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
            </p>

            <h2>Where does it come from?</h2>
            <p>
              Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical
              Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at
              Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a
              Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the
              undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum"
              (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of
              ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit
              amet..", comes from a line in section 1.10.32.
            </p>

            <p>
              The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections
              1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact
              original form, accompanied by English versions from the 1914 translation by H. Rackham.
            </p>
          </div>
        </main>
      </Row>
    </div>
  )
}

export default ExperimentCoursePage
