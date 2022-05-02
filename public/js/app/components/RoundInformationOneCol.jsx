/* eslint-disable react/no-danger */
import React from 'react'
import { Col, Button } from 'reactstrap'
import { useWebContext } from '../context/WebContext'

import i18n from '../../../../i18n'
import { INFORM_IF_IMPORTANT_INFO_IS_MISSING } from '../util/constants'

import CourseFileLinks from './CourseFileLinks'
import InfoModal from './InfoModal'

const LABEL_MISSING_INFO = { en: INFORM_IF_IMPORTANT_INFO_IS_MISSING[0], sv: INFORM_IF_IMPORTANT_INFO_IS_MISSING[1] }

function RoundInformationOneCol({
  fade,
  courseHasRound,
  memoStorageURI,
  showRoundData: externalShowRoundData,
  language = 'sv',
  courseRound: round = { round_course_term: [] },
  courseData: course,
}) {
  const [context] = useWebContext()

  const courseRoundEmployees = externalShowRoundData ? context.getCourseEmployees() : {}

  const userLangIndex = language === 'en' ? 0 : 1
  const { courseRoundInformation: translate, courseLabels: labels } = i18n.messages[userLangIndex]
  const roundHeader = translate.round_header
  const selectedRoundHeader = `
    ${i18n.messages[userLangIndex].courseInformation.course_short_semester[round.round_course_term[1]]} 
    ${round.round_course_term[0]}  
    ${round.round_short_name !== LABEL_MISSING_INFO[language] ? round.round_short_name : ''} 
    ${
      round.round_funding_type === 'UPP' || round.round_funding_type === 'PER'
        ? translate.round_type[round.round_funding_type]
        : translate.round_category[round.round_category]
    }
  `

  function openApplicationLink(ev) {
    ev.preventDefault()
    window.open(round.round_application_link)
  }

  return (
    <span>
      {courseHasRound && externalShowRoundData ? (
        <h2 id="courseRoundInformationHeader" style={{ marginTop: '20px' }}>
          {translate.header_round}
        </h2>
      ) : null}
      <section
        id="roundInformationOneCol"
        className="key-info"
        style={{
          backgroundColor: courseHasRound && externalShowRoundData ? 'rgb(246, 246, 246)' : 'rgb(252, 248, 227)',
        }}
        aria-label={
          courseHasRound && externalShowRoundData
            ? `${translate.round_information_aria_label} ${selectedRoundHeader}`
            : null
        }
      >
        <div
          className="row"
          id="roundFirstPart"
          aria-labelledby={courseHasRound && externalShowRoundData ? 'courseRoundInformationHeader' : null}
        >
          {/** ************************************************************************************************************ */}
          {/*                                  Round information  - first part                                         */}
          {/** ************************************************************************************************************ */}
          <Col sm="12" id="roundKeyInformation">
            <div className={` fade-container ${fade === true ? ' fadeOutIn' : ''}`} key="fadeDiv1">
              {/* ---COURSE ROUND HEADER--- */}
              {courseHasRound && externalShowRoundData && (
                <div style={{ borderBottom: '1px solid #fff' }}>
                  <h3 className="t4" id="roundHeader">
                    {roundHeader}
                  </h3>
                  <p id="selectedRoundHeader">{selectedRoundHeader}</p>
                </div>
              )}

              {/* ---COURSE ROUND INFORMATION--- */}
              {courseHasRound && externalShowRoundData ? (
                <span>
                  <h3 className="t4">{translate.round_target_group}</h3>
                  <span dangerouslySetInnerHTML={{ __html: round.round_target_group }} />

                  <h3 className="t4">{translate.round_part_of_programme}</h3>
                  <span dangerouslySetInnerHTML={{ __html: round.round_part_of_programme }} />

                  <h3 className="t4">{translate.round_periods}</h3>
                  <span dangerouslySetInnerHTML={{ __html: round.round_periods }} />

                  <h3 className="t4">{translate.round_start_date}</h3>
                  <p className="clear-margin-bottom">{round ? round.round_start_date : LABEL_MISSING_INFO[language]}</p>
                  <p>{round ? round.round_end_date : LABEL_MISSING_INFO[language]}</p>
                  <h3 className="t4">{translate.round_pace_of_study}</h3>
                  <p>{round ? ` ${round.round_study_pace}%` : LABEL_MISSING_INFO[language]}</p>
                </span>
              ) : (
                //* ---SELECT A ROUND BOX --- *//
                <span className="text-center2">
                  <h3 className="t4" id="roundHeader">
                    {labels.header_no_round_selected}
                  </h3>
                  <p>{labels.no_round_selected}</p>
                </span>
              )}

              {/** ************************************************************************************************************ */}
              {/*                                            Round  information                                               */}
              {/** ************************************************************************************************************ */}
              {courseHasRound && externalShowRoundData && (
                <span>
                  <h3 className="t4">{translate.round_tutoring_form}</h3>
                  <p>
                    {`${
                      round
                        ? translate.round_tutoring_form_label[round.round_tutoring_form]
                        : LABEL_MISSING_INFO[language]
                    } ${
                      round
                        ? translate.round_tutoring_time_label[round.round_tutoring_time]
                        : LABEL_MISSING_INFO[language]
                    }`}
                  </p>

                  <h3 className="t4">{translate.round_tutoring_language}</h3>
                  <p>{round ? round.round_tutoring_language : LABEL_MISSING_INFO[language]}</p>
                  <h3 className="t4">{translate.round_course_place}</h3>
                  <p>{round ? round.round_course_place : LABEL_MISSING_INFO[language]}</p>
                  <h3 className="t4">
                    {translate.round_max_seats}
                    {round && round.round_seats && (
                      <InfoModal
                        closeLabel={labels.label_close}
                        infoText={`<p>${labels.round_seats_default_info} ${
                          round.round_selection_criteria !== '<p></p>' && round.round_selection_criteria !== ''
                            ? `${labels.round_seats_info}</p>${round.round_selection_criteria}`
                            : '</p>'
                        }`}
                        title={translate.round_max_seats}
                        type="html"
                      />
                    )}
                  </h3>
                  {round && <p> {round.round_seats || translate.round_no_seats_limit} </p>}

                  <h3 className="t4">{translate.round_time_slots}</h3>
                  <p dangerouslySetInnerHTML={{ __html: round.round_time_slots }} />
                  <p dangerouslySetInnerHTML={{ __html: round.round_comment }} />
                  <CourseFileLinks
                    language={language}
                    courseHasRound={courseHasRound}
                    courseCode={course.course_code}
                    scheduleUrl={round ? round.round_schedule : LABEL_MISSING_INFO[language]}
                    courseRound={round}
                    memoStorageURI={memoStorageURI}
                  />
                </span>
              )}
            </div>
          </Col>
        </div>
        <div
          className="row"
          id="roundApply"
          aria-labelledby={courseHasRound && externalShowRoundData ? 'applicationInformationHeader' : null}
        >
          <Col>
            {/** ************************************************************************************************************ */}
            {/*                                     Round - application information                                         */}
            {/** ************************************************************************************************************ */}
            {courseHasRound && externalShowRoundData && (
              <span>
                <h2 id="applicationInformationHeader" className="right-column-header">
                  {labels.header_select_course}
                </h2>

                <h3 className="t4">{roundHeader}</h3>
                <p>{selectedRoundHeader}</p>

                <h3 className="t4">{translate.round_application_code}</h3>
                <p>{round ? round.round_application_code : LABEL_MISSING_INFO[language]}</p>
                {round && round.round_application_link !== LABEL_MISSING_INFO[language] && (
                  <Button
                    name={translate.round_application_link}
                    color="primary"
                    className="next"
                    onClick={openApplicationLink}
                  >
                    {translate.round_application_link}
                  </Button>
                )}
              </span>
            )}
          </Col>
        </div>
        <div
          className="row"
          id="roundContact"
          aria-labelledby={courseHasRound && externalShowRoundData ? 'contactInformationHeader' : null}
        >
          <Col>
            {/** ************************************************************************************************************ */}
            {/*                                     Round - contact information                                             */}
            {/** ************************************************************************************************************ */}
            {courseHasRound && externalShowRoundData && (
              <span>
                <h2 id="contactInformationHeader" className="right-column-header">
                  {labels.header_contact}
                </h2>

                <h3 className="t4">{roundHeader}</h3>
                <p>{selectedRoundHeader}</p>

                {course.course_contact_name !== LABEL_MISSING_INFO[language] && (
                  <span>
                    <h3 className="t4">{i18n.messages[userLangIndex].courseInformation.course_contact_name}</h3>
                    <p>{course.course_contact_name}</p>
                  </span>
                )}

                <h3 className="t4">{i18n.messages[userLangIndex].courseInformation.course_examiners}</h3>
                <span
                  dangerouslySetInnerHTML={{ __html: courseRoundEmployees.examiners || LABEL_MISSING_INFO[language] }}
                />

                <h3 className="t4">{translate.round_responsibles}</h3>
                <span
                  dangerouslySetInnerHTML={{
                    __html: courseRoundEmployees.responsibles || LABEL_MISSING_INFO[language],
                  }}
                />

                <h3 className="t4">{translate.round_teacher}</h3>
                <span
                  dangerouslySetInnerHTML={{ __html: courseRoundEmployees.teachers || LABEL_MISSING_INFO[language] }}
                />
              </span>
            )}
          </Col>
        </div>
      </section>
    </span>
  )
}

export default RoundInformationOneCol
