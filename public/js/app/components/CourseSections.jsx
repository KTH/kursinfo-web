import React, { Component } from 'react'

class CourseSection extends Component {
  render() {
    const props = this.props
    return (
      <section className='col-12' id={props.sectionId} aria-labelledby={`${props.sectionId}-header`}>
        <div >
          {props.sectionHeader.length > 0 ? <h2 id={`${props.sectionId}-header`} className={props.class}>{props.sectionHeader}</h2> : ''}
          {props.courseData.map((data, index) =>
            <span key={data.header + '-' + index} className='word-break'>
              <h3>{data.header}</h3>
              <p dangerouslySetInnerHTML={{ __html: data.text}} />
            </span>
          )}
        </div>
      </section>
    )
  }
}

export default CourseSection
