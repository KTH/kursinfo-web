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
import { useSemesterRoundState } from '../hooks/useSemesterRoundState'
import { convertYearSemesterNumberIntoSemester } from '../../../../server/util/semesterUtils'

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
          preparatory={courseData.courseInfo.course_level_code}
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
        <Row id="columnContainer">
          {/** ************************************************************************************************************ */}
          {/*                                      RIGHT COLUMN - ROUND INFORMATION                                         */}
          {/** ************************************************************************************************************ */}
          <Col id="roundInformationContainer" md="4" xs="12" className="float-md-end">
            {/* ---COURSE  DROPDOWN MENU--- */}
            {hasActiveSemesters ? (
              <nav id="roundDropdownMenu" aria-label={translation.courseLabels.header_dropdown_menu_navigation}>
                <span id="roundDropdownMenuHeaderWrapper">
                  <h2 id="roundDropdownMenuHeader">{translation.courseLabels.header_dropdown_menue}</h2>
                  <InfoModal
                    title={translation.courseLabels.header_dropdown_menue}
                    infoText={translation.courseLabels.syllabus_info}
                    type="html"
                    closeLabel={translation.courseLabels.label_close}
                    ariaLabel={translation.courseLabels.header_dropdown_menu_aria_label}
                  />
                </span>
                <div id="roundDropdowns">
                  {hasActiveSemesters && (
                    <DropdownSemesters semesterList={activeSemesters} semesterRoundState={semesterRoundState} />
                  )}
                  {courseData.roundsBySemester[selectedSemester] &&
                  courseData.roundsBySemester[selectedSemester].length > 1 ? (
                    <DropdownRounds
                      roundsForSelectedSemester={courseData.roundsBySemester[selectedSemester]}
                      semesterRoundState={semesterRoundState}
                    />
                  ) : (
                    showRoundData && (
                      <p>
                        {`${
                          translation.courseInformation.course_short_semester[
                            firstRoundInActiveSemester.round_course_term[1]
                          ]
                        }
                                ${firstRoundInActiveSemester.round_course_term[0]}  
                                ${
                                  !isMissingInfoLabel(firstRoundInActiveSemester.round_short_name)
                                    ? firstRoundInActiveSemester.round_short_name
                                    : ''
                                }     
                                ${
                                  firstRoundInActiveSemester.round_funding_type === 'UPP' ||
                                  firstRoundInActiveSemester.round_funding_type === 'PER'
                                    ? translation.courseRoundInformation.round_type[
                                        firstRoundInActiveSemester.round_funding_type
                                      ]
                                    : translation.courseRoundInformation.round_category[
                                        firstRoundInActiveSemester.round_category
                                      ]
                                }
                              `}
                      </p>
                    )
                  )}

                  {/* ---ROUND CANCELLED OR FULL --- */}
                  {showRoundData && activeRound.round_state !== 'APPROVED' ? (
                    <Alert type="info" aria-live="polite">
                      {`${translation.courseLabels.lable_round_state[activeRound.round_state]}
                            `}
                    </Alert>
                  ) : (
                    ''
                  )}
                </div>
              </nav>
            ) : (
              hasActiveSemesters &&
              hasSyllabus && (
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
            {showRoundData ? (
              <RoundInformationOneCol
                memoStorageURI={browserConfig.memoStorageUri}
                semesterRoundState={semesterRoundState}
                courseRound={activeRound}
                courseData={courseInformationToRounds}
                courseCode={courseCode}
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
              <h3 className="t4">{translation.courseLabels.label_syllabus_pdf_header}</h3>
              {hasSyllabus && activeSyllabus.course_valid_from && activeSyllabus.course_valid_from.year ? (
                <>
                  <p>{translation.courseLabels.label_syllabus_pdf_info}</p>
                  <a
                    href={`${SYLLABUS_URL}${courseCode}-${convertYearSemesterNumberIntoSemester(activeSyllabus.course_valid_from)}.pdf?lang=${languageShortname}`}
                    id={convertYearSemesterNumberIntoSemester(activeSyllabus.course_valid_from) + '_active'}
                    target="_blank"
                    rel="noreferrer"
                    className="pdf-link pdf-link-fix pdf-link-last-line"
                  >
                    {`${translation.courseLabels.label_syllabus_link} ${syllabusName}`}
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
          <Col id="coreContent" md="8" xs="12" className="pe-3 float-md-start paragraphs">
            <div>
              <Row id="activeSyllabusContainer" key="activeSyllabusContainer">
                <Col sm="12">
                  {!hasSyllabus && (
                    <Alert color="info" aria-live="polite">
                      <h4>{translation.courseLabels.header_no_syllabus}</h4>
                      {translation.courseLabels.label_no_syllabus}
                    </Alert>
                  )}
                </Col>
              </Row>

              {/* --- COURSE INFORMATION CONTAINER---  */}
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
            </div>
          </Col>
        </Row>
      </main>
    </Row>
  )
}

export default CoursePage
