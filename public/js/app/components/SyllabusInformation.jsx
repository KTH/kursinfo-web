import React from 'react'
import { Col } from 'reactstrap'

const SyllabusInformation = ({ routerStore = {}, syllabusList = {}, syllabusSemesterList = {}, translation = {} }) => {
  return (
    <Col sm="12">
      {/* --- ACTIVE SYLLABUS LINK---  */}
      <div key="fade-2" className={` fade-container ${routerStore.syllabusInfoFade === true ? ' fadeOutIn' : ''}`}>
        {syllabusSemesterList.length > 0 ? (
          <span>{`${translation.courseLabels.label_course_syllabus} ${translation.courseLabels.label_syllabus_link}${
            routerStore.courseCode
          }${` (${translation.courseInformation.course_short_semester[syllabusList.course_valid_from[1]]}${
            syllabusList.course_valid_from[0]
          }–${
            syllabusList.course_valid_to.length > 0
              ? translation.courseInformation.course_short_semester[syllabusList.course_valid_to[1]] +
                '' +
                syllabusList.course_valid_to[0]
              : ''
          })`}`}</span>
        ) : (
          ''
        )}
      </div>
    </Col>
  )
}

export default SyllabusInformation
