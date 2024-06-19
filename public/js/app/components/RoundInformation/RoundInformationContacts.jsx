import React from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { useMissingInfo } from '../../hooks/useMissingInfo'
import { useCourseEmployees } from '../../hooks/useCourseEmployees'

function RoundInformationContacts({ courseCode, courseData, courseRound, selectedSemester }) {
  const { translation } = useLanguage()
  const { missingInfoLabel } = useMissingInfo()
  const { courseRoundEmployees } = useCourseEmployees({
    courseCode,
    selectedSemester,
    applicationCode: courseRound?.round_application_code,
  })

  return (
    <div className="roundInformation__contacts">
      <div>
        <h4>{translation.courseInformation.course_examiners}</h4>
        <span dangerouslySetInnerHTML={{ __html: courseRoundEmployees.examiners || missingInfoLabel }} />
      </div>

      <div>
        <h4>{translation.courseRoundInformation.round_responsibles}</h4>
        <span
          dangerouslySetInnerHTML={{
            __html: courseRoundEmployees.responsibles || missingInfoLabel,
          }}
        />
      </div>

      <div>
        <h4>{translation.courseRoundInformation.round_teacher}</h4>
        <span dangerouslySetInnerHTML={{ __html: courseRoundEmployees.teachers || missingInfoLabel }} />
      </div>

      {courseData.course_contact_name !== missingInfoLabel && (
        <div>
          <h4>{translation.courseInformation.course_contact_name}</h4>
          <p>{courseData.course_contact_name}</p>
        </div>
      )}
    </div>
  )
}

export { RoundInformationContacts }
