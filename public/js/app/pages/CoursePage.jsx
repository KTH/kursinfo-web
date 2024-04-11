/* eslint-disable react/no-danger */
import React, { useEffect } from 'react'

import { Row, Col } from 'reactstrap'

import { FORSKARUTB_URL, SYLLABUS_URL } from '../util/constants'
import { aboutCourseLink } from '../util/links'

import Alert from '../components-shared/Alert'

import RoundInformationOneCol from '../components/RoundInformationOneCol'
import CourseTitle from '../components/CourseTitle'
import CourseSectionList from '../components/CourseSectionList'
import DropdownRounds from '../components/DropdownRounds'
import DropdownSemesters from '../components/DropdownSemesters'
import InfoModal from '../components/InfoModal'
import SideMenu from '../components/SideMenu'
import { useWebContext } from '../context/WebContext'
import BankIdAlert from '../components/BankIdAlert'
import { useLanguage } from '../hooks/useLanguage'
import { useMissingInfo } from '../hooks/useMissingInfo'

const aboutCourseStr = (translate, courseCode = '') => `${translate.site_name} ${courseCode}`

function CoursePage() {
  const [context, setWebContext] = useWebContext()

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
    isCancelled,
    isDeactivated,
    roundInfoFade,
    showRoundData,
    syllabusInfoFade,
    useStartSemesterFromQuery,
  } = context
  // * * //
  const hasOnlyOneRound = activeSemester?.length > 0 && courseData.roundList[activeSemester].length === 1
  const hasToShowRoundsData = showRoundData || (useStartSemesterFromQuery && hasOnlyOneRound)

  const hasActiveSemesters = activeSemesters && activeSemesters.length > 0
  const { courseInfo } = courseData
  const { translation, languageShortname } = useLanguage()

  const { isMissingInfoLabel } = useMissingInfo()

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
        siteNameElement.href = aboutCourseLink(courseCode, languageShortname)
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
        {(isCancelled || isDeactivated) && (
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
            <img src={courseImage} alt="" height="auto" width="300px" />
            <div className="paragraphs" dangerouslySetInnerHTML={{ __html: sellingText }} />
          </Col>
        </section>

        {courseData.roundList && activeSemesters.length > 0 && hasToShowRoundsData && (
          <BankIdAlert
            tutoringForm={courseData.roundList[activeSemester][activeRoundIndex].round_tutoring_form}
            fundingType={courseData.roundList[activeSemester][activeRoundIndex].round_funding_type}
            roundSpecified={activeSemesters.length > 0 && hasToShowRoundsData}
          />
        )}
        <Row id="columnContainer">
          {/** ************************************************************************************************************ */}
          {/*                                      RIGHT COLUMN - ROUND INFORMATION                                         */}
          {/** ************************************************************************************************************ */}
          <Col id="roundInformationContainer" md="4" xs="12">
            {/* ---COURSE  DROPDOWN MENU--- */}
            {hasActiveSemesters ? (
              <nav id="roundDropdownMenu" aria-label={translation.courseLabels.header_dropdown_menu_navigation}>
                <span id="roundDropdownMenuHeaderWrapper">
                  <h2 id="roundDropdownMenuHeader">{translation.courseLabels.header_dropdown_menue}</h2>
                  <InfoModal
                    parentTag="h2"
                    title={translation.courseLabels.header_dropdown_menue}
                    infoText={translation.courseLabels.syllabus_info}
                    type="html"
                    closeLabel={translation.courseLabels.label_close}
                    ariaLabel={translation.courseLabels.header_dropdown_menu_aria_label}
                  />
                </span>
                <div id="roundDropdowns" key="roundDropdown">
                  {hasActiveSemesters && (
                    <DropdownSemesters
                      semesterList={activeSemesters}
                      courseRoundList={courseData.roundList[activeSemester]}
                      year={activeSemesters[activeSemesterIndex][0]}
                      semester={activeSemesters[activeSemesterIndex][1]}
                      language={languageShortname}
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
                      label={translation.courseLabels.label_round_select}
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
                                  !isMissingInfoLabel(courseData.roundList[activeSemester][0].round_short_name)
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
                    <Alert type="info" aria-live="polite">
                      {
                        translation.courseLabels.lable_round_state[
                          courseData.roundList[activeSemester][activeRoundIndex].round_state
                        ]
                      }
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
                <Alert type="info" header={translation.courseLabels.header_no_rounds}>
                  {translation.courseLabels.lable_no_rounds}
                </Alert>
              )
            )}
            {courseInfo.course_application_info.length > 0 && (
              <Alert type="info" header={translation.courseInformation.course_application_info}>
                <span dangerouslySetInnerHTML={{ __html: courseInfo.course_application_info }} />
              </Alert>
            )}

            {/* ---COURSE ROUND INFORMATION--- */}
            {hasActiveSemesters ? (
              <RoundInformationOneCol
                courseRound={courseData.roundList[activeSemester][activeRoundIndex]}
                courseData={courseInformationToRounds}
                language={languageShortname}
                courseHasRound={activeSemesters.length > 0}
                fade={context.roundInfoFade}
                showRoundData={hasToShowRoundsData}
                memoStorageURI={browserConfig.memoStorageUri}
              />
            ) : (
              <div className="info-box">
                {hasActiveSemesters ? (
                  <p>{translation.courseLabels.no_round_selected}</p>
                ) : (
                  <i>{translation.courseLabels.lable_no_rounds}</i>
                )}
              </div>
            )}
            <aside
              id="syllabusContainer"
              className="info-box"
              aria-label={translation.courseLabels.label_syllabus_pdf_header}
            >
              <h3>{translation.courseLabels.label_syllabus_pdf_header}</h3>
              {courseData.syllabusList[activeSyllabusIndex] &&
              courseData.syllabusList[activeSyllabusIndex].course_valid_from &&
              courseData.syllabusList[activeSyllabusIndex].course_valid_from[0] ? (
                <>
                  <p>{translation.courseLabels.label_syllabus_pdf_info}</p>
                  <a
                    href={`${SYLLABUS_URL}${courseCode}-${courseData.syllabusList[
                      activeSyllabusIndex
                    ].course_valid_from.join('')}.pdf?lang=${languageShortname}`}
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
          <Col id="coreContent" md="8" xs="12">
            <div key="fade-2" className={` fade-container ${syllabusInfoFade === true ? ' fadeOutIn' : ''} `}>
              <div id="activeSyllabusContainer" key="activeSyllabusContainer">
                {courseData.syllabusSemesterList.length === 0 && (
                  <Alert type="info" aria-live="polite" header={translation.courseLabels.header_no_syllabus}>
                    {translation.courseLabels.label_no_syllabus}
                  </Alert>
                )}
              </div>

              {/* --- COURSE INFORMATION CONTAINER---  */}
              <CourseSectionList
                courseInfo={courseInfo}
                syllabusList={courseData.syllabusList[activeSyllabusIndex]}
                syllabusSemesterList={courseData.syllabusSemesterList}
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
              {courseInfo.course_level_code === 'RESEARCH' && (
                <span>
                  <h3>{translation.courseLabels.header_postgraduate_course}</h3>
                  {translation.courseLabels.label_postgraduate_course}
                  <a href={`${FORSKARUTB_URL}${courseInfo.course_department_code}`}>{courseInfo.course_department}</a>
                </span>
              )}
            </div>
          </Col>
        </Row>
      </main>
    </Row>
  )
}

export default CoursePage
