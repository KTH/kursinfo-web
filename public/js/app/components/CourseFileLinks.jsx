import { Component } from 'inferno'
import Row from 'inferno-bootstrap/dist/Row'
import Col from 'inferno-bootstrap/dist/Col'
import i18n from '../../../../i18n'
import { EMPTY } from '../util/constants'

class CourseFileLinks extends Component {
  render () {
    const translate = i18n.messages[this.props.language].courseRoundInformation
    const round = this.props.courseRound
    return (
      <Row id='courseLinks'>
        {/* ---LINK TO ROUND PM/MEMO IF ROUND HAS ONE-- */}
        <Col sm='12' xs='12'>
          <a id='memoLink' className='pdf-link'>
          {i18n.messages[this.props.language].courseLabels.no_memo}
          </a>
        </Col>
        {/* ---LINK TO ROUND SCHEDULE-- */}
        <Col sm='12' xs='12'>
          <i className='icon-schedule'></i>
          {this.props.scheduleUrl !== EMPTY[this.props.language]
            ? <a target='_blank' href={this.props.scheduleUrl} >
              {i18n.messages[this.props.language].courseLabels.label_schedule}
            </a>
            : <span>{i18n.messages[this.props.language].courseLabels.no_schedule}</span>
        }
        </Col>
      </Row>
    )
  }
}

export default CourseFileLinks
