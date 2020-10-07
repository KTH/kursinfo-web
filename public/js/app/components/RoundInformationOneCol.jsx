/* eslint-disable react/no-danger */
import React, { Component } from 'react'
import { Col, Button } from 'reactstrap'

import { EMPTY } from '../util/constants'
import i18n from '../../../../i18n'

import CourseFileLinks from './CourseFileLinks'
import InfoModal from './InfoModal'

class RoundInformationOneCol extends Component {
  constructor(props) {
    super(props)
    this.openApplicationLink = this.openApplicationLink.bind(this)
  }

  openApplicationLink(event) {
    event.preventDefault()
    const { courseRound } = this.props
    window.open(courseRound.round_application_link)
  }

  render() {
    const {
      fade,
      courseHasRound,
      memoStorageURI,
      canGetMemoFiles,
      showRoundData,
      language = 1,
      courseRound,
      courseData
    } = this.props
    const round = courseRound || { round_course_term: [] }
    const course = courseData
    const translate = i18n.messages[language === 'en' ? 0 : 1].courseRoundInformation
    const roundHeader = translate.round_header
    const selectedRoundHeader = `
      ${i18n.messages[language === 'en' ? 0 : 1].courseInformation.course_short_semester[round.round_course_term[1]]} 
      ${round.round_course_term[0]}  
      ${round.round_short_name !== EMPTY[language] ? round.round_short_name : ''}     
      ${translate.round_category[round.round_category]}
    `

    return (
      <span>
        {courseHasRound && showRoundData ? (
          <h2 id="courseRoundInformationHeader" style={{ marginTop: '20px' }}>
            {translate.header_round}
          </h2>
        ) : null}
        <section
          id="roundInformationOneCol"
          className="key-info"
          style={{ backgroundColor: courseHasRound && showRoundData ? 'rgb(246, 246, 246)' : 'rgb(252, 248, 227)' }}
          aria-labelledby="roundHeader selectedRoundHeader"
        >
          <section
            className="row"
            id="roundFirstPart"
            aria-labelledby={courseHasRound && showRoundData ? 'courseRoundInformationHeader' : null}
          >
            {/** ************************************************************************************************************ */}
            {/*                                  Round information  - first part                                         */}
            {/** ************************************************************************************************************ */}
            <Col sm="12" id="roundKeyInformation">
              <div className={` fade-container ${fade === true ? ' fadeOutIn' : ''}`} key="fadeDiv1">
                {/* ---COURSE ROUND HEADER--- */}
                {courseHasRound && showRoundData ? (
                  <div style={{ borderBottom: '1px solid #fff' }}>
                    <h3 className="t4" id="roundHeader">
                      {roundHeader}
                    </h3>
                    <p id="selectedRoundHeader">{selectedRoundHeader}</p>
                  </div>
                ) : (
                  ''
                )}

                {/* ---COURSE ROUND INFORMATION--- */}
                {courseHasRound && showRoundData ? (
                  <span>
                    <h3 className="t4">{translate.round_target_group}</h3>
                    <span dangerouslySetInnerHTML={{ __html: round.round_target_group }} />

                    <h3 className="t4">{translate.round_part_of_programme}</h3>
                    <span dangerouslySetInnerHTML={{ __html: round.round_part_of_programme }} />

                    <h3 className="t4">{translate.round_periods}</h3>
                    <span dangerouslySetInnerHTML={{ __html: round.round_periods }} />

                    <h3 className="t4">{translate.round_start_date}</h3>
                    <p className="clear-margin-bottom">
                      <i className="fas fa-hourglass-start" />
                      {round ? round.round_start_date : EMPTY[language]}
                    </p>
                    <p>
                      <i className="fas fa-hourglass-end" />
                      {round ? round.round_end_date : EMPTY[language]}
                    </p>

                    <h3 className="t4">{translate.round_course_place}</h3>
                    <p>{round ? round.round_course_place : EMPTY[language]}</p>
                  </span>
                ) : (
                  //* ---SELECT A ROUND BOX --- *//
                  <span className="text-center2">
                    <h3 className="t4" id="roundHeader">
                      {i18n.messages[language === 'en' ? 0 : 1].courseLabels.header_no_round_selected}
                    </h3>
                    <p>{i18n.messages[language === 'en' ? 0 : 1].courseLabels.no_round_selected}</p>
                  </span>
                )}

                {/** ************************************************************************************************************ */}
                {/*                                            Round  information                                               */}
                {/** ************************************************************************************************************ */}
                {courseHasRound && showRoundData ? (
                  <span>
                    <h3 className="t4">{translate.round_tutoring_form}</h3>
                    <p>
                      {`${round ? translate.round_tutoring_form_label[round.round_tutoring_form] : EMPTY[language]} ${
                        round ? translate.round_tutoring_time_label[round.round_tutoring_time] : EMPTY[language]
                      }`}
                    </p>

                    <h3 className="t4">{translate.round_tutoring_language}</h3>
                    <p>{round ? round.round_tutoring_language : EMPTY[language]}</p>

                    <h3 className="t4">
                      {translate.round_max_seats}
                      {round /* && round.round_seats !== EMPTY[language] */ ? (
                        <InfoModal
                          title={translate.round_max_seats}
                          infoText={i18n.messages[language === 'en' ? 0 : 1].courseLabels.round_seats_info}
                          closeLabel={i18n.messages[language === 'en' ? 0 : 1].courseLabels.label_close}
                        />
                      ) : (
                        ''
                      )}
                    </h3>
                    <p>{round ? round.round_seats : EMPTY[language]}</p>

                    <h3 className="t4">{translate.round_time_slots}</h3>
                    <p dangerouslySetInnerHTML={{ __html: round.round_time_slots }} />
                    <p dangerouslySetInnerHTML={{ __html: round.round_comment }} />
                    <CourseFileLinks
                      language={language}
                      courseHasRound={courseHasRound}
                      courseCode={course.course_code}
                      scheduleUrl={round ? round.round_schedule : EMPTY[language]}
                      courseRound={round}
                      canGetMemoFiles={canGetMemoFiles}
                      memoStorageURI={memoStorageURI}
                    />
                  </span>
                ) : (
                  ''
                )}
              </div>
            </Col>
          </section>
          <section
            className="row"
            id="roundApply"
            aria-labelledby={courseHasRound && showRoundData ? 'applicationInformationHeader' : null}
          >
            <Col>
              {/** ************************************************************************************************************ */}
              {/*                                     Round - application information                                         */}
              {/** ************************************************************************************************************ */}
              {courseHasRound && showRoundData ? (
                <span>
                  <h2 id="applicationInformationHeader" className="right-column-header">
                    {i18n.messages[language === 'en' ? 0 : 1].courseLabels.header_select_course}
                  </h2>

                  <h3 className="t4">{roundHeader}</h3>
                  <p>{selectedRoundHeader}</p>

                  <h3 className="t4">{translate.round_application_code}</h3>
                  <p>
                    <b>{round ? round.round_application_code : EMPTY[language]}</b>
                  </p>
                  {round && round.round_application_link !== EMPTY[language] ? (
                    <Button name={translate.round_application_link} color="primary" onClick={this.openApplicationLink}>
                      {translate.round_application_link}
                      <div className="icon-back-arrow" />
                    </Button>
                  ) : (
                    ''
                  )}
                </span>
              ) : (
                ''
              )}
            </Col>
          </section>
          <section
            className="row"
            id="roundContact"
            aria-labelledby={courseHasRound && showRoundData ? 'contactInformationHeader' : null}
          >
            <Col>
              {/** ************************************************************************************************************ */}
              {/*                                     Round - contact information                                             */}
              {/** ************************************************************************************************************ */}
              {courseHasRound && showRoundData ? (
                <span>
                  <h2 id="contactInformationHeader" className="right-column-header">
                    {i18n.messages[language === 'en' ? 0 : 1].courseLabels.header_contact}
                  </h2>

                  <h3 className="t4">{roundHeader}</h3>
                  <p>{selectedRoundHeader}</p>

                  {course.course_contact_name !== EMPTY[language] ? (
                    <span>
                      <h3 className="t4">
                        {i18n.messages[language === 'en' ? 0 : 1].courseInformation.course_contact_name}
                      </h3>
                      <p>{course.course_contact_name}</p>
                    </span>
                  ) : (
                    ''
                  )}

                  <h3 className="t4">{i18n.messages[language === 'en' ? 0 : 1].courseInformation.course_examiners}</h3>
                  <span dangerouslySetInnerHTML={{ __html: course.course_examiners }} />

                  <h3 className="t4">{translate.round_responsibles}</h3>
                  <span dangerouslySetInnerHTML={{ __html: round.round_responsibles }} />

                  <h3 className="t4">{translate.round_teacher}</h3>
                  <span dangerouslySetInnerHTML={{ __html: round.round_teacher }} />
                </span>
              ) : (
                ''
              )}
            </Col>
          </section>
        </section>
      </span>
    )
  }
}

export default RoundInformationOneCol
