import { Component } from 'inferno'
import Col from 'inferno-bootstrap/dist/Col'
import Row from 'inferno-bootstrap/dist/Row'
import i18n from '../../../../i18n'

import { EMPTY } from '../util/constants'

const formatCredits = (credits, creditUnitAbbr, languageIndex) => {
  credits = credits !== EMPTY[languageIndex] && credits.toString().indexOf('.') < 0 ? credits + '.0' : credits
  const localeCredits = languageIndex === 0 ? credits : credits.toString().replace('.', ',')
  const creditUnit = languageIndex === 0 ? 'credits' : creditUnitAbbr
  return `${localeCredits} ${creditUnit}`
}

const adminLink = (courseCode, languageIndex) => {
  return `/kursinfoadmin/kurser/kurs/${courseCode}?l=${languageIndex === 0 ? 'en' : 'sv'}`
}

class CourseTitle extends Component {

  render () {
    const title = this.props.courseTitleData
    const languageIndex = this.props.language
    const adminLinkLabel = i18n.messages[languageIndex].courseLabels.label_edit
    return (
      <div id='course-title'>
        <Row>
          <header className='pageTitle col'>
            <span id='page-course-title' role='heading' aria-level='1'>
              <span className='t1'>{this.props.pageTitle}</span>
              <span className='t4'>{title.course_code} {title.course_title} {formatCredits(title.course_credits, title.course_credits_text, languageIndex)}</span>
            </span>
            <a className='right-link' href={adminLink(title.course_code, languageIndex)} style={{fontSize: '16px', align: 'baseline'}}>
              {adminLinkLabel}
            </a>
          </header>
        </Row>
      </div>
      // <div id='course-title'>
      //   <Row>
      //     <Col>
      //       <h1 className="course-header-title mb-0">{this.props.pageTitle}</h1>
      //     </Col>
      //   </Row>
      //   <Row className="pb-3">
      //     <Col className="text-left" xs="12" lg="6">
      //       <h4 className="secondTitle">
      //         {title.course_code} {title.course_title} {formatCredits(title.course_credits, title.course_credits_text, languageIndex)}
      //       </h4>
      //     </Col>
      //     <Col className="text-lg-right" xs="12" lg="6">
      //       <a
      //         id="admin-link"
      //         className="course-header-admin-link"
      //         title={adminLinkLabel}
      //         href={adminLink(title.course_code, languageIndex)}
      //         target="_blank"
      //         rel="noopener noreferrer"
      //       >
      //         {adminLinkLabel}
      //       </a>
      //     </Col>
      //   </Row>
      // </div>
    )
  }
}

export default CourseTitle
