import { Component } from 'inferno'

class CourseSection extends Component {
  render () {
    const props = this.props
    return (
      <section className='col-12' id={props.sectionId} aria-labelledBy={`${props.sectionId}-header`}>
        <div >
          {props.sectionHeader.length > 0 ? <h3 id={`${props.sectionId}-header`} className={props.class}>{props.sectionHeader}</h3> : ''}
          {props.courseData.map((data, index) =>
            <span className='word-break'>
              {props.headerType === '4' ? <h4>{data.header}</h4> : <h4>{data.header}</h4>}
              <p dangerouslySetInnerHTML={{ __html: data.text}} />
            </span>
          )}
        </div>
      </section>
    )
  }
}

export default CourseSection
