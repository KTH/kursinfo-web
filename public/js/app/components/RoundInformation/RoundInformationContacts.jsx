import React from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { useMissingInfo } from '../../hooks/useMissingInfo'

function RoundInformationContacts({ courseRoundEmployees }) {
  const { translation } = useLanguage()
  const { missingInfoLabel } = useMissingInfo()

  return (
    <div className="roundInformation__contacts">
      <div>
        <dt>{translation.courseInformation.course_examiners}</dt>
        <dd dangerouslySetInnerHTML={{ __html: courseRoundEmployees.examiners || missingInfoLabel }} />
      </div>

      <div>
        <dt>{translation.courseRoundInformation.round_responsibles}</dt>
        <dd
          dangerouslySetInnerHTML={{
            __html: courseRoundEmployees.responsibles || missingInfoLabel,
          }}
        />
      </div>

      <div>
        <dt>{translation.courseRoundInformation.round_teacher}</dt>
        <dd dangerouslySetInnerHTML={{ __html: courseRoundEmployees.teachers || missingInfoLabel }} />
      </div>
    </div>
  )
}

export { RoundInformationContacts }
