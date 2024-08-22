/* eslint-disable react/no-danger */
import React from 'react'
import { FaAsterisk } from 'react-icons/fa'
import InfoModal from './InfoModal'

const syllabusMarker = (data, syllabusMarkerAriaLabel) => (
  <h3>
    {data.header}
    {data.syllabusMarker && (
      <sup>
        <FaAsterisk className="syllabus-marker-icon" aria-label={syllabusMarkerAriaLabel} />
      </sup>
    )}
    {data.infoModal && (
      <InfoModal
        title={data.header}
        infoText={data.infoModal.description}
        type="html"
        closeLabel={data.infoModal.closeLabel}
        ariaLabel={data.infoModal.ariaLabel}
      />
    )}
  </h3>
)

// eslint-disable-next-line arrow-body-style
const CourseSection = ({ sectionHeader: header = '', courseData = [], sectionId = '', syllabusMarkerAriaLabel }) => {
  return (
    <div id={sectionId} aria-labelledby={`${sectionId}-header`}>
      {header.length ? <h2 id={`${sectionId}-header`}>{header}</h2> : null}
      {courseData.map(data =>
        data.text ? (
          <React.Fragment key={data.header || data.text}>
            {data.header && syllabusMarker(data, syllabusMarkerAriaLabel)}
            <div className="course-section-content-wrapper" dangerouslySetInnerHTML={{ __html: data.text }} />
          </React.Fragment>
        ) : null
      )}
    </div>
  )
}

export default CourseSection
