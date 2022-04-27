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

function reorder(option, key, arr) {
  const newArray = arr.slice()
  newArray.sort(o => (o[key] !== option ? 1 : -1)) // put in first
  return newArray
}

function reorderRoundListAfterSingleCourseStudents(activeSemester, initContext) {
  const singleCourseStrudentsRoundCategory = 'VU' // single course students
  const changedContext = { ...initContext }
  changedContext.courseData.roundList[activeSemester] = reorder(
    singleCourseStrudentsRoundCategory,
    'round_category',
    initContext.courseData.roundList[activeSemester]
  )
}

function CoursePage() {
  const [webContext, setWebContext] = useWebContext()
  const context = React.useMemo(() => webContext, [webContext])

  const { activeSemesters: initActiveSemesters, useStartSemesterFromQuery } = context

  context.activeSemester =
    initActiveSemesters && initActiveSemesters.length > 0 ? initActiveSemesters[context.defaultIndex][2] : null // it's needed if no start semester is provided

  const { activeSemester } = context
  // * * //
  if (useStartSemesterFromQuery) {
    // init roundList with reordered roundList after single course students
    const contextWithReorderedRoundList = reorderRoundListAfterSingleCourseStudents(activeSemester, context)
    setWebContext(contextWithReorderedRoundList)
  }
  // * * //
  const hasOnlyOneRound = activeSemester?.length > 0 && context.courseData.roundList[activeSemester].length === 1
  const toShowRoundData = useStartSemesterFromQuery ? hasOnlyOneRound : false
  setWebContext({ ...context, showRoundData: toShowRoundData })

  if (toShowRoundData) {
    context.getCourseEmployees()
  }

  // * * //

  const {
    courseData = {
      courseInfo: { course_application_info: [] },
      syllabusSemesterList: [],
    },
  } = context

  const { language = 'sv' } = courseData
  const translation = i18n.messages[language === 'en' ? 0 : 1]
  const introText =
    context.sellingText[language].length > 0
      ? context.sellingText[language]
      : courseData.courseInfo.course_recruitment_text

  let courseImage = ''
  if (context.imageFromAdmin.length > 4) {
    courseImage = context.imageFromAdmin
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
  courseImage = `${context.browserConfig.imageStorageUri}${courseImage}`

  if (!courseData.syllabusList) courseData.syllabusList = [{}]
  const courseInformationToRounds = {
    course_code: context.courseCode,
    course_examiners: courseData.courseInfo.course_examiners,
    course_contact_name: courseData.courseInfo.course_contact_name,
    course_main_subject: courseData.courseInfo.course_main_subject,
    course_level_code: courseData.courseInfo.course_level_code,
    course_valid_from: courseData.syllabusList[context.activeSyllabusIndex || 0].course_valid_from,
  }

  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      const siteNameElement = document.querySelector('.block.siteName a')
      if (siteNameElement) siteNameElement.textContent = aboutCourseStr(translation.messages, context.courseCode)
    }
    return () => (isMounted = false)
  }, [])

  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      if (context.syllabusInfoFade) {
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
  }, [context])

  return (
    <div key="kursinfo-container" className="col" id="kursinfo-main-page">
      <Row>
        <Breadcrumbs translation={translation} language={language} courseCode={context.courseCode} />
      </Row>
      <Row id="pageContainer" key="pageContainer">
        <SideMenu courseCode={context.courseCode} labels={translation.courseLabels.sideMenu} language={language} />
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
          {(context.isCancelled || context.isDeactivated) && (
            <div className="isCancelled">
              <Alert color="info" aria-live="polite">
                <h3>{`${translation.course_state_alert[courseData.courseInfo.course_state].header}`}</h3>
                <p>
                  {translation.course_state_alert[courseData.courseInfo.course_state].examination}
                  {translation.courseInformation.course_short_semester[courseData.courseInfo.course_last_exam[1]]}
                  {courseData.courseInfo.course_last_exam[0]}
                </p>
                <p>
                  {translation.course_state_alert[context.courseData.courseInfo.course_state].decision}
                  <span
                    dangerouslySetInnerHTML={{
                      __html: courseData.syllabusList[context.activeSyllabusIndex].course_decision_to_discontinue,
                    }}
                  />
                </p>
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
                {context.activeSemesters && context.activeSemesters.length > 0 ? (
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
                      {context.activeSemesters.length > 0 && (
                        <DropdownSemesters
                          semesterList={context.activeSemesters}
                          courseRoundList={courseData.roundList[context.activeSemester]}
                          year={context.activeSemesters[context.activeSemesterIndex][0]}
                          semester={context.activeSemesters[context.activeSemesterIndex][1]}
                          language={language}
                          label={translation.courseLabels.label_semester_select}
                          translation={translation}
                          useStartSemesterFromQuery={context.useStartSemesterFromQuery}
                        />
                      )}
                      {courseData.roundList[context.activeSemester] &&
                      courseData.roundList[context.activeSemester].length > 1 ? (
                        <DropdownRounds
                          semesterList={context.activeSemesters}
                          courseRoundList={courseData.roundList[context.activeSemester]}
                          year={context.activeSemesters[context.activeSemesterIndex][0]}
                          semester={context.activeSemesters[context.activeSemesterIndex][1]}
                          language={language}
                          label={translation.courseLabels.label_round_select}
                          translation={translation}
                        />
                      ) : context.showRoundData ? (
                        <p>
                          {`
                                ${
                                  translation.courseInformation.course_short_semester[
                                    courseData.roundList[context.activeSemester][0].round_course_term[1]
                                  ]
                                }
                                ${courseData.roundList[context.activeSemester][0].round_course_term[0]}  
                                ${
                                  courseData.roundList[context.activeSemester][0].round_short_name !==
                                  INFORM_IF_IMPORTANT_INFO_IS_MISSING[language]
                                    ? courseData.roundList[context.activeSemester][0].round_short_name
                                    : ''
                                }     
                                ${
                                  courseData.roundList[context.activeSemester][0].round_funding_type === 'UPP' ||
                                  courseData.roundList[context.activeSemester][0].round_funding_type === 'PER'
                                    ? translation.courseRoundInformation.round_type[
                                        courseData.roundList[context.activeSemester][0].round_funding_type
                                      ]
                                    : translation.courseRoundInformation.round_category[
                                        courseData.roundList[context.activeSemester][0].round_category
                                      ]
                                }
                              `}
                        </p>
                      ) : (
                        ''
                      )}

                      {/* ---ROUND CANCELLED OR FULL --- */}
                      {context.activeSemesters.length > 0 &&
                      context.showRoundData &&
                      courseData.roundList[context.activeSemester][context.activeRoundIndex].round_state !==
                        'APPROVED' ? (
                        <Alert color="info" aria-live="polite">
                          <h4>
                            {`${
                              translation.courseLabels.lable_round_state[
                                courseData.roundList[context.activeSemester][context.activeRoundIndex].round_state
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
                ) : context.activeSemesters &&
                  context.activeSemesters.length === 0 &&
                  courseData.syllabusSemesterList &&
                  courseData.syllabusSemesterList.length > 0 ? (
                  <Alert color="info">
                    <h4>{translation.courseLabels.header_no_rounds}</h4>
                    {translation.courseLabels.lable_no_rounds}
                  </Alert>
                ) : (
                  ''
                )}
                {courseData.courseInfo.course_application_info.length > 0 && (
                  <Alert color="info">
                    <h4>{translation.courseInformation.course_application_info}</h4>
                    <p dangerouslySetInnerHTML={{ __html: courseData.courseInfo.course_application_info }} />
                  </Alert>
                )}

                {/* ---COURSE ROUND INFORMATION--- */}
                {context.activeSemesters && context.activeSemesters.length > 0 ? (
                  <RoundInformationOneCol
                    courseRound={courseData.roundList[context.activeSemester][context.activeRoundIndex]}
                    courseData={courseInformationToRounds}
                    language={language}
                    courseHasRound={context.activeSemesters.length > 0}
                    fade={context.roundInfoFade}
                    showRoundData={context.showRoundData}
                    memoStorageURI={context.browserConfig.memoStorageUri}
                  />
                ) : (
                  <div className="key-info">
                    {context.activeSemesters && context.activeSemesters.length > 0 ? (
                      <p>{translation.courseLabels.no_round_selected}</p>
                    ) : (
                      <i>{translation.courseLabels.lable_no_rounds}</i>
                    )}
                  </div>
                )}
                <aside id="syllabusContainer" aria-label={translation.courseLabels.label_syllabus_pdf_header}>
                  <h3 className="t4">{translation.courseLabels.label_syllabus_pdf_header}</h3>
                  {courseData.syllabusList[context.activeSyllabusIndex] &&
                  courseData.syllabusList[context.activeSyllabusIndex].course_valid_from &&
                  courseData.syllabusList[context.activeSyllabusIndex].course_valid_from[0] ? (
                    <>
                      <p>{translation.courseLabels.label_syllabus_pdf_info}</p>
                      <a
                        href={`${SYLLABUS_URL}${context.courseCode}-${courseData.syllabusList[
                          context.activeSyllabusIndex
                        ].course_valid_from.join('')}.pdf?lang=${language}`}
                        id={courseData.syllabusList[context.activeSyllabusIndex].course_valid_from.join('') + '_active'}
                        target="_blank"
                        rel="noreferrer"
                        className="pdf-link pdf-link-fix pdf-link-last-line"
                      >
                        {`${translation.courseLabels.label_syllabus_link} ${context.courseCode}${` (${
                          translation.courseInformation.course_short_semester[
                            courseData.syllabusList[context.activeSyllabusIndex].course_valid_from[1]
                          ]
                        }${courseData.syllabusList[context.activeSyllabusIndex].course_valid_from[0]}–${
                          courseData.syllabusList[context.activeSyllabusIndex].course_valid_to.length > 0
                            ? translation.courseInformation.course_short_semester[
                                courseData.syllabusList[context.activeSyllabusIndex].course_valid_to[1]
                              ] +
                              '' +
                              courseData.syllabusList[context.activeSyllabusIndex].course_valid_to[0]
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
                  className={` fade-container ${context.syllabusInfoFade === true ? ' fadeOutIn' : ''} `}
                >
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
                    syllabusList={courseData.syllabusList[context.activeSyllabusIndex]}
                    syllabusSemesterList={courseData.syllabusSemesterList}
                    showCourseLink={context.showCourseWebbLink}
                    partToShow="courseContentBlock"
                    syllabusName={
                      courseData.syllabusSemesterList.length > 0
                        ? `${context.courseCode}${` (${
                            translation.courseInformation.course_short_semester[
                              courseData.syllabusList[context.activeSyllabusIndex].course_valid_from[1]
                            ]
                          }${
                            courseData.syllabusList[context.activeSyllabusIndex] &&
                            courseData.syllabusList[context.activeSyllabusIndex].course_valid_from
                              ? courseData.syllabusList[context.activeSyllabusIndex].course_valid_from[0]
                              : ''
                          }–${
                            courseData.syllabusList[context.activeSyllabusIndex].course_valid_to.length > 0
                              ? translation.courseInformation.course_short_semester[
                                  courseData.syllabusList[context.activeSyllabusIndex].course_valid_to[1]
                                ] +
                                '' +
                                courseData.syllabusList[context.activeSyllabusIndex].course_valid_to[0]
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
