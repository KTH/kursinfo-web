/* eslint-disable react/no-danger */
import React from 'react'
import { FaAsterisk } from 'react-icons/fa'

const syllabusMarker = (data, syllabusMarkerAriaLabel) => (
  <h3>
    {data.header}
    {data.syllabusMarker && (
      <sup>
        <FaAsterisk className="syllabus-marker-icon" aria-label={syllabusMarkerAriaLabel} />
      </sup>
    )}
  </h3>
)

const CourseSection = ({ header = '', courseData = [], sectionId = '', class: style, syllabusMarkerAriaLabel }) => {
  return (
    <section className="col-12" id={sectionId} aria-labelledby={`${sectionId}-header`}>
      {header.length ? (
        <h2 id={`${sectionId}-header`} className={style}>
          {header}
        </h2>
      ) : null}
      {courseData.map((data) =>
        data.text ? (
          <span key={data.header} className="word-break">
            {data.header && syllabusMarker(data, syllabusMarkerAriaLabel)}
            <p dangerouslySetInnerHTML={{ __html: data.text }} />
          </span>
        ) : null
      )}
    </section>
  )
}

export default CourseSection
