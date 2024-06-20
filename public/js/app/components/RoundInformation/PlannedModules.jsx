import React from 'react'
import { usePlannedModules } from '../../hooks/usePlannedModules'

export const PlannedModules = ({ courseCode, courseRound, selectedSemester }) => {
  const { plannedModules } = usePlannedModules({
    courseCode,
    semester: selectedSemester,
    applicationCode: courseRound.round_application_code,
    showRoundData: true, // TODO(karl): showRoundData kommer aldrig vara false
  })
  return <span dangerouslySetInnerHTML={{ __html: plannedModules }} />
}
