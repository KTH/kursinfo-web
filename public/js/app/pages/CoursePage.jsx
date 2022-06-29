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

function CoursePage() {
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
      courseInfo: { course_application_info: [] },
      syllabusSemesterList: [],
    },
    imageFromAdmin,
    isCancelled,
    isDeactivated,
    roundInfoFade,
    sellingText,
    showRoundData,
    syllabusInfoFade,
    useStartSemesterFromQuery,
  } = context
  // * * //
  const hasOnlyOneRound = activeSemester?.length > 0 && courseData.roundList[activeSemester].length === 1
  const hasToShowRoundsData = showRoundData || (useStartSemesterFromQuery && hasOnlyOneRound)

  const hasActiveSemesters = activeSemesters && activeSemesters.length > 0

  const { language = 'sv' } = courseData
  const translation = i18n.messages[language === 'en' ? 0 : 1]
  const introText =
    sellingText[language].length > 0 ? sellingText[language] : courseData.courseInfo.course_recruitment_text

  let courseImage = ''
  if (imageFromAdmin.length > 4) {
    courseImage = imageFromAdmin
  } else {
    const cms = courseData.courseInfo.course_main_subject || ''
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
    course_examiners: courseData.courseInfo.course_examiners,
    course_contact_name: courseData.courseInfo.course_contact_name,
    course_main_subject: courseData.courseInfo.course_main_subject,
    course_level_code: courseData.courseInfo.course_level_code,
    course_valid_from: courseData.syllabusList[activeSyllabusIndex || 0].course_valid_from,
  }

  const decisionToDiscontinue = courseData.syllabusList[activeSyllabusIndex].course_decision_to_discontinue

  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      const siteNameElement = document.querySelector('.block.siteName a')
      if (siteNameElement) siteNameElement.textContent = aboutCourseStr(translation.messages, courseCode)
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
                <h3>{`${translation.course_state_alert[courseData.courseInfo.course_state].header}`}</h3>
                <p>
                  {translation.course_state_alert[courseData.courseInfo.course_state].examination}
                  {translation.courseInformation.course_short_semester[courseData.courseInfo.course_last_exam[1]]}
                  {courseData.courseInfo.course_last_exam[0]}
                </p>
                <p />
                <span>{translation.course_state_alert[courseData.courseInfo.course_state].decision}</span>
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
          <Row id="columnContainer" key="columnContainer">
            <Col id="leftContainer" key="leftContainer">
              {/** ************************************************************************************************************ */}
              {/*                                      RIGHT COLUMN - ROUND INFORMATION                                         */}
              {/** ************************************************************************************************************ */}
              <Col id="roundInformationContainer" md="4" xs="12" className="float-md-right">
                {/* ---COURSE  DROPDOWN MENU--- */}
                {hasActiveSemesters ? (
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
                      {hasActiveSemesters && (
                        <DropdownSemesters
                          semesterList={activeSemesters}
                          courseRoundList={courseData.roundList[activeSemester]}
                          year={activeSemesters[activeSemesterIndex][0]}
                          semester={activeSemesters[activeSemesterIndex][1]}
                          language={language}
                          label={translation.courseLabels.label_semester_select}
                          translation={translation}
                          useStartSemesterFromQuery={useStartSemesterFromQuery}
                        />
                      )}
                      {courseData.roundList[activeSemester] && courseData.roundList[activeSemester].length > 1 ? (
                        <DropdownRounds
                          semesterList={activeSemesters}
                          courseRoundList={courseData.roundList[activeSemester]}
                          year={activeSemesters[activeSemesterIndex][0]}
                          semester={activeSemesters[activeSemesterIndex][1]}
                          language={language}
                          label={translation.courseLabels.label_round_select}
                          translation={translation}
                        />
                      ) : (
                        hasToShowRoundsData && (
                          <p>
                            {`${
                              translation.courseInformation.course_short_semester[
                                courseData.roundList[activeSemester][0].round_course_term[1]
                              ]
                            }
                                ${courseData.roundList[activeSemester][0].round_course_term[0]}  
                                ${
                                  courseData.roundList[activeSemester][0].round_short_name !==
                                  INFORM_IF_IMPORTANT_INFO_IS_MISSING[language]
                                    ? courseData.roundList[activeSemester][0].round_short_name
                                    : ''
                                }     
                                ${
                                  courseData.roundList[activeSemester][0].round_funding_type === 'UPP' ||
                                  courseData.roundList[activeSemester][0].round_funding_type === 'PER'
                                    ? translation.courseRoundInformation.round_type[
                                        courseData.roundList[activeSemester][0].round_funding_type
                                      ]
                                    : translation.courseRoundInformation.round_category[
                                        courseData.roundList[activeSemester][0].round_category
                                      ]
                                }
                              `}
                          </p>
                        )
                      )}

                      {/* ---ROUND CANCELLED OR FULL --- */}
                      {hasActiveSemesters &&
                      hasToShowRoundsData &&
                      courseData.roundList[activeSemester][activeRoundIndex].round_state !== 'APPROVED' ? (
                        <Alert color="info" aria-live="polite">
                          <h4>
                            {`${
                              translation.courseLabels.lable_round_state[
                                courseData.roundList[activeSemester][activeRoundIndex].round_state
                              ]
                            }
                            `}
                          </h4>
                        </Alert>
                      ) : (
                        ''
                      )}
                    </div>
                  </nav>
                ) : (
                  hasActiveSemesters &&
                  courseData.syllabusSemesterList &&
                  courseData.syllabusSemesterList.length > 0 && (
                    <Alert color="info">
                      <h4>{translation.courseLabels.header_no_rounds}</h4>
                      {translation.courseLabels.lable_no_rounds}
                    </Alert>
                  )
                )}
                {courseData.courseInfo.course_application_info.length > 0 && (
                  <Alert color="info">
                    <h4>{translation.courseInformation.course_application_info}</h4>
                    <p dangerouslySetInnerHTML={{ __html: courseData.courseInfo.course_application_info }} />
                  </Alert>
                )}

                {/* ---COURSE ROUND INFORMATION--- */}
                {hasActiveSemesters ? (
                  <RoundInformationOneCol
                    courseRound={courseData.roundList[activeSemester][activeRoundIndex]}
                    courseData={courseInformationToRounds}
                    language={language}
                    courseHasRound={activeSemesters.length > 0}
                    fade={context.roundInfoFade}
                    showRoundData={hasToShowRoundsData}
                    memoStorageURI={browserConfig.memoStorageUri}
                  />
                ) : (
                  <div className="key-info">
                    {hasActiveSemesters ? (
                      <p>{translation.courseLabels.no_round_selected}</p>
                    ) : (
                      <i>{translation.courseLabels.lable_no_rounds}</i>
                    )}
                  </div>
                )}
                <aside id="syllabusContainer" aria-label={translation.courseLabels.label_syllabus_pdf_header}>
                  <h3 className="t4">{translation.courseLabels.label_syllabus_pdf_header}</h3>
                  {courseData.syllabusList[activeSyllabusIndex] &&
                  courseData.syllabusList[activeSyllabusIndex].course_valid_from &&
                  courseData.syllabusList[activeSyllabusIndex].course_valid_from[0] ? (
                    <>
                      <p>{translation.courseLabels.label_syllabus_pdf_info}</p>
                      <a
                        href={`${SYLLABUS_URL}${courseCode}-${courseData.syllabusList[
                          activeSyllabusIndex
                        ].course_valid_from.join('')}.pdf?lang=${language}`}
                        id={courseData.syllabusList[activeSyllabusIndex].course_valid_from.join('') + '_active'}
                        target="_blank"
                        rel="noreferrer"
                        className="pdf-link pdf-link-fix pdf-link-last-line"
                      >
                        {`${translation.courseLabels.label_syllabus_link} ${courseCode}${` (${
                          translation.courseInformation.course_short_semester[
                            courseData.syllabusList[activeSyllabusIndex].course_valid_from[1]
                          ]
                        }${courseData.syllabusList[activeSyllabusIndex].course_valid_from[0]}–${
                          courseData.syllabusList[activeSyllabusIndex].course_valid_to.length > 0
                            ? translation.courseInformation.course_short_semester[
                                courseData.syllabusList[activeSyllabusIndex].course_valid_to[1]
                              ] +
                              '' +
                              courseData.syllabusList[activeSyllabusIndex].course_valid_to[0]
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
                <div key="fade-2" className={` fade-container ${syllabusInfoFade === true ? ' fadeOutIn' : ''} `}>
                  <Row id="activeSyllabusContainer" key="activeSyllabusContainer">
                    <Col sm="12">
                      {courseData.syllabusSemesterList.length === 0 && (
                        <Alert color="info" aria-live="polite">
                          <h4>{translation.courseLabels.header_no_syllabus}</h4>
                          {translation.courseLabels.label_no_syllabus}
                        </Alert>
                      )}
                    </Col>
                  </Row>

                  {/* --- COURSE INFORMATION CONTAINER---  */}
                  <CourseSectionList
                    courseInfo={courseData.courseInfo}
                    syllabusList={courseData.syllabusList[activeSyllabusIndex]}
                    syllabusSemesterList={courseData.syllabusSemesterList}
                    showCourseLink={context.showCourseWebbLink}
                    partToShow="courseContentBlock"
                    syllabusName={
                      courseData.syllabusSemesterList.length > 0
                        ? `${courseCode}${` (${
                            translation.courseInformation.course_short_semester[
                              courseData.syllabusList[activeSyllabusIndex].course_valid_from[1]
                            ]
                          }${
                            courseData.syllabusList[activeSyllabusIndex] &&
                            courseData.syllabusList[activeSyllabusIndex].course_valid_from
                              ? courseData.syllabusList[activeSyllabusIndex].course_valid_from[0]
                              : ''
                          }–${
                            courseData.syllabusList[activeSyllabusIndex].course_valid_to.length > 0
                              ? translation.courseInformation.course_short_semester[
                                  courseData.syllabusList[activeSyllabusIndex].course_valid_to[1]
                                ] +
                                '' +
                                courseData.syllabusList[activeSyllabusIndex].course_valid_to[0]
                              : ''
                          })`}`
                        : ''
                    }
                  />

                  {/* ---IF RESEARCH LEVEL: SHOW "Postgraduate course" LINK--  */}
                  {courseData.courseInfo.course_level_code === 'RESEARCH' && (
                    <span>
                      <h3>{translation.courseLabels.header_postgraduate_course}</h3>
                      {translation.courseLabels.label_postgraduate_course}
                      <a href={`${FORSKARUTB_URL}${courseData.courseInfo.course_department_code}`}>
                        {courseData.courseInfo.course_department}
                      </a>
                    </span>
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

export default CoursePage
