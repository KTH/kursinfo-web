import React, { Component } from 'react'

class CourseSection extends Component {
  render() {
    const header = this.props.sectionHeader || ''
    const courseData = this.props.courseData || []
    const sectionId = this.props.sectionId || ''
    const style = this.props.class
    return (
      <section className="col-12" id={sectionId} aria-labelledby={`${sectionId}-header`}>
        <div>
          {header.length > 0 ? (
            <h2 id={`${sectionId}-header`} className={style}>
              {header}
            </h2>
          ) : (
            ''
          )}
          {courseData.map((data, index) => {
            if (!data.text) return null
            return (
              <span key={data.header + '-' + index} className="word-break">
                <h3>{data.header}</h3>
                <p dangerouslySetInnerHTML={{ __html: data.text }} />
              </span>
            )
          })}
        </div>
      </section>
    )
  }
}

export default CourseSection
