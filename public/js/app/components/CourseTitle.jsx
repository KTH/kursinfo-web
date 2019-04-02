import { Component } from 'inferno'
// import Button from 'inferno-bootstrap/dist/Button'

import i18n from '../../../../i18n'
import { EMPTY } from '../util/constants'

class CourseTitle extends Component {

  render () {
    const title = this.props.courseTitleData
    title.course_credits = title.course_credits !== EMPTY[this.props.language] && title.course_credits.toString().indexOf('.') < 0 ? title.course_credits + '.0' : title.course_credits
    return (
      <div id='course-title'>
        <h1>
          <span property='aiiso:code'>{title.course_code}</span>
          <span property='teach:courseTitle'> {title.course_title}</span>
          <span content={title.course_credits} datatype='xsd:decimal' property='teach:ects'> {this.props.language === 0 ? title.course_credits : title.course_credits.toString().replace('.', ',')}&nbsp;{this.props.language === 0 ? 'credits' : 'hp'} </span>
        </h1>
        <h2 className='secondTitle'>
          <span property='teach:courseTitle'>{title.course_other_title}</span>
        </h2>
      </div>
    )
  }
}

export default CourseTitle
