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

const CourseSection = ({ sectionHeader: header = '', courseData = [], sectionId = '', syllabusMarkerAriaLabel }) => (
  <div id={sectionId} aria-labelledby={`${sectionId}-header`}>
    {header.length ? <h2 id={`${sectionId}-header`}>{header}</h2> : null}
    {courseData.map(data =>
      data.text ? (
        <span key={data.header || data.text} className="word-break">
          {data.header && syllabusMarker(data, syllabusMarkerAriaLabel)}
          <div dangerouslySetInnerHTML={{ __html: data.text }} />
        </span>
      ) : null
    )}
  </div>
)

export default CourseSection
