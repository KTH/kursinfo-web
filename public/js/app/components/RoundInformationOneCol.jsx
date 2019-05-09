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
    // console.log("this.props", this.props)
    const translate = i18n.messages[this.props.language].courseRoundInformation
    const round = this.props.courseRound
    const course = this.props.courseData
    const roundHeader = translate.round_header
    const selectedRoundHeader = `
      ${i18n.messages[this.props.language].courseInformation.course_short_semester[round.round_course_term[1]]} 
      ${round.round_course_term[0]}  
      ${round.round_short_name !== EMPTY[this.props.language] ? round.round_short_name : ''}     
      ${round.round_type}
    `

    return (
      <div id='roundInformationOneCol' className='key-info'>
        <Row id='roundFirstPart'>
          {/** *************************************************************************************************************/}
          {/*                                  Round information  - first part                                         */}
          {/** *************************************************************************************************************/}
          <Col sm='12' id='roundKeyInformation'>
            <div className={` fade-container ${this.props.fade === true ? ' fadeOutIn' : ''}`} key='fadeDiv1'>

              {/* ---COURSE ROUND HEADER--- */}
              {this.props.courseHasRound && this.props.showRoundData
                ? <div style='border-bottom:1px solid #fff;'>
                  <h4>{roundHeader} </h4>
                  <p>{selectedRoundHeader}</p>
                </div>
                : ''
              }

              {/* ---COURSE ROUND INFORMATION--- */}
              {this.props.courseHasRound && this.props.showRoundData
                ? <span>
                  <h4>{translate.round_target_group}</h4>
                  <span dangerouslySetInnerHTML={{ __html: round.round_target_group }}></span>

                  <h4>{translate.round_part_of_programme}</h4>
                  <span dangerouslySetInnerHTML={{ __html: round.round_part_of_programme }}></span>

                  <h4>{translate.round_periods}</h4>
                  <span dangerouslySetInnerHTML={{ __html: round.round_periods }}></span>

                  <h4>{translate.round_start_date}</h4>
                  <p className='clear-margin-bottom'><i class='fas fa-hourglass-start'></i>{round ? round.round_start_date : EMPTY[this.props.language]}</p>
                  <p><i class='fas fa-hourglass-end'></i>{round ? round.round_end_date : EMPTY[this.props.language]}</p>

                  <h4>{translate.round_course_place}</h4>
                  <p>{round ? round.round_course_place : EMPTY[this.props.language]}</p>
                </span>
                :
              //* ---SELECT A ROUND BOX --- *//
                <span className='text-center2'>
                  <h4>{i18n.messages[this.props.language].courseLabels.header_no_round_selected}</h4>
                  <p>{i18n.messages[this.props.language].courseLabels.no_round_selected}</p>
                </span>
              }

              {/** *************************************************************************************************************/}
              {/*                                            Round  information                                               */}
              {/** *************************************************************************************************************/}
              {this.props.courseHasRound && this.props.showRoundData
                ? <span>
                  <h4>{translate.round_tutoring_form}</h4>
                  <p>{round ? translate.round_tutoring_form_label[round.round_tutoring_form] : EMPTY[this.props.language]}                               {round ? translate.round_tutoring_time_label[round.round_tutoring_time] : EMPTY[this.props.language]}</p>

                  <h4>{translate.round_tutoring_language}</h4>
                  <p>{round ? round.round_tutoring_language : EMPTY[this.props.language]}</p>

                  <h4>
                    {translate.round_max_seats}
                    {round && round.round_seats !== EMPTY[this.props.language]
                      ? <InfoModal infoText={i18n.messages[this.props.language].courseLabels.round_seats_info} />
                      : ''}
                  </h4>
                  <p>{round ? round.round_seats : EMPTY[this.props.language]}</p>

                  <h4>{translate.round_time_slots}</h4>
                  <p dangerouslySetInnerHTML={{ __html: round.round_time_slots }}></p>
                  <p dangerouslySetInnerHTML={{ __html: round.round_comment }}></p>
                  <CourseFileLinks
                    language={this.props.language}
                    courseHasRound={this.props.courseHasRound}
                    courseCode={course.course_code}
                    scheduleUrl={round ? round.round_schedule : EMPTY[this.props.language]}
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
            {this.props.courseHasRound && this.props.showRoundData
              ? <span>
                <h3 className='right-column-header'>{i18n.messages[this.props.language].courseLabels.header_select_course}</h3>

                <h4>{roundHeader} </h4>
                <p>{selectedRoundHeader}</p>

                <h4>{translate.round_application_code} </h4>
                <p><b>{round ? round.round_application_code : EMPTY[this.props.language]}</b></p>
                {round && round.round_application_link !== EMPTY[this.props.language]
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
          {this.props.courseHasRound && this.props.showRoundData
            ? <span>
              <h3 className='right-column-header'>{i18n.messages[this.props.language].courseLabels.header_contact}</h3>

              <h4>{roundHeader} </h4>
              <p>{selectedRoundHeader}</p>

              {course.course_contact_name !== EMPTY[this.props.language]
                ? <span>
                  <h4>{i18n.messages[this.props.language].courseInformation.course_contact_name}</h4>
                  <p>{course.course_contact_name}</p>
                </span>
                : ''}

              <h4>{i18n.messages[this.props.language].courseInformation.course_examiners}</h4>
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
