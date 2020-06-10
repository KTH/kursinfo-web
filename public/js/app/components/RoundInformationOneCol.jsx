import { Component } from 'inferno'
import Row from 'inferno-bootstrap/dist/Row'
import Col from 'inferno-bootstrap/dist/Col'
import Button from 'inferno-bootstrap/dist/Button'


import { EMPTY } from '../util/constants'
import i18n from '../../../../i18n'

import CourseFileLinks from './CourseFileLinks.jsx'
import InfoModal from './InfoModal.jsx'

class RoundInformationOneCol extends Component {
  constructor (props) {
    super(props)
    this.openApplicationLink = this.openApplicationLink.bind(this)
  }

  openApplicationLink (event) {
    event.preventDefault()
    window.open(this.props.courseRound.round_application_link)
  }

  render () {
    const { fade, courseHasRound, memoStorageURI, canGetMemoFiles, showRoundData, language } = this.props
    const round = this.props.courseRound
    const course = this.props.courseData
    const translate = i18n.messages[language].courseRoundInformation
    const roundHeader = translate.round_header
    const selectedRoundHeader = `
      ${i18n.messages[language].courseInformation.course_short_semester[round.round_course_term[1]]} 
      ${round.round_course_term[0]}  
      ${round.round_short_name !== EMPTY[language] ? round.round_short_name : ''}     
      ${translate.round_category[round.round_category]}
    `

    return (
      <div id='roundInformationOneCol' className='key-info'>
        <Row id='roundFirstPart'>
          {/** *************************************************************************************************************/}
          {/*                                  Round information  - first part                                         */}
          {/** *************************************************************************************************************/}
          <Col sm='12' id='roundKeyInformation'>
            <div className={` fade-container ${fade === true ? ' fadeOutIn' : ''}`} key='fadeDiv1'>

              {/* ---COURSE ROUND HEADER--- */}
              {courseHasRound && showRoundData
                ? <div style='border-bottom:1px solid #fff;'>
                  <h4>{roundHeader} </h4>
                  <p>{selectedRoundHeader}</p>
                </div>
                : ''
              }

              {/* ---COURSE ROUND INFORMATION--- */}
              {courseHasRound && showRoundData
                ? <span>
                  <h4>{translate.round_target_group}</h4>
                  <span dangerouslySetInnerHTML={{ __html: round.round_target_group }}></span>

                  <h4>{translate.round_part_of_programme}</h4>
                  <span dangerouslySetInnerHTML={{ __html: round.round_part_of_programme }}></span>

                  <h4>{translate.round_periods}</h4>
                  <span dangerouslySetInnerHTML={{ __html: round.round_periods }}></span>

                  <h4>{translate.round_start_date}</h4>
                  <p className='clear-margin-bottom'><i class='fas fa-hourglass-start'></i>{round ? round.round_start_date : EMPTY[this.props.language]}</p>
                  <p><i class='fas fa-hourglass-end'></i>{round ? round.round_end_date : EMPTY[language]}</p>

                  <h4>{translate.round_course_place}</h4>
                  <p>{round ? round.round_course_place : EMPTY[language]}</p>
                </span>
                :
              //* ---SELECT A ROUND BOX --- *//
                <span className='text-center2'>
                  <h4>{i18n.messages[language].courseLabels.header_no_round_selected}</h4>
                  <p>{i18n.messages[language].courseLabels.no_round_selected}</p>
                </span>
              }

              {/** *************************************************************************************************************/}
              {/*                                            Round  information                                               */}
              {/** *************************************************************************************************************/}
              {courseHasRound && showRoundData
                ? <span>
                  <h4>{translate.round_tutoring_form}</h4>
                  <p>{round ? translate.round_tutoring_form_label[round.round_tutoring_form] : EMPTY[language]}                                                               {round ? translate.round_tutoring_time_label[round.round_tutoring_time] : EMPTY[this.props.language]}</p>

                  <h4>{translate.round_tutoring_language}</h4>
                  <p>{round ? round.round_tutoring_language : EMPTY[language]}</p>

                  <h4>
                    {translate.round_max_seats}
                    {round && round.round_seats !== EMPTY[language]
                      ? <InfoModal infoText={i18n.messages[language].courseLabels.round_seats_info} />
                      : ''}
                  </h4>
                  <p>{round ? round.round_seats : EMPTY[language]}</p>

                  <h4>{translate.round_time_slots}</h4>
                  <p dangerouslySetInnerHTML={{ __html: round.round_time_slots }}></p>
                  <p dangerouslySetInnerHTML={{ __html: round.round_comment }}></p>
                  <CourseFileLinks
                    language={language}
                    courseHasRound={this.props.courseHasRound}
                    courseCode={course.course_code}
                    scheduleUrl={round ? round.round_schedule : EMPTY[language]}
                    courseRound={round}
                    canGetMemoFiles={canGetMemoFiles}
                    memoStorageURI={memoStorageURI}
                  />
                </span>
              : ''}

            </div>
          </Col>
        </Row>
        <Row id='roundApply'>
          <Col>
            {/** *************************************************************************************************************/}
            {/*                                     Round - application information                                         */}
            {/** *************************************************************************************************************/}
            {courseHasRound && showRoundData
              ? <span>
                <h2 className='right-column-header'>{i18n.messages[language].courseLabels.header_select_course}</h2>

                <h4>{roundHeader} </h4>
                <p>{selectedRoundHeader}</p>

                <h4>{translate.round_application_code} </h4>
                <p><b>{round ? round.round_application_code : EMPTY[language]}</b></p>
                {round && round.round_application_link !== EMPTY[language]
                  ? <Button name={translate.round_application_link} color='primary' onClick={this.openApplicationLink}>
                    {translate.round_application_link}
                    <div className='icon-back-arrow'></div>
                  </Button>
                  : ''
                }
              </span>
            : ''}
          </Col>
        </Row>
        <Row id='roundContact'>
          <Col>
          {/** *************************************************************************************************************/}
          {/*                                     Round - contact information                                             */}
          {/** *************************************************************************************************************/}
          {courseHasRound && showRoundData
            ? <span>
              <h2 className='right-column-header'>{i18n.messages[language].courseLabels.header_contact}</h2>

              <h4>{roundHeader} </h4>
              <p>{selectedRoundHeader}</p>

              {course.course_contact_name !== EMPTY[language]
                ? <span>
                  <h4>{i18n.messages[language].courseInformation.course_contact_name}</h4>
                  <p>{course.course_contact_name}</p>
                </span>
                : ''}

              <h4>{i18n.messages[language].courseInformation.course_examiners}</h4>
              <span dangerouslySetInnerHTML={{ __html: course.course_examiners }}></span>

              <h4>{translate.round_responsibles}</h4>
              <span dangerouslySetInnerHTML={{ __html: round.round_responsibles }}></span>

              <h4>{translate.round_teacher}</h4>
              <span dangerouslySetInnerHTML={{ __html: round.round_teacher }}></span>
            </span>
            : ''}
          </Col>
        </Row>
      </div>
    )
  }
}

export default RoundInformationOneCol
