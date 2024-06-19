import React from 'react'
import { usePlannedModules } from '../../hooks/usePlannedModules'

export const PlannedModules = ({
  courseCode,
  courseRound,
  selectedSemester,
  showRoundData, // TODO: showRoundData kommer aldrig vara false
}) => {
  const { plannedModules } = usePlannedModules({
    courseCode,
    semester: selectedSemester,
    applicationCode: courseRound.round_application_code,
    showRoundData,
  })
  return <span dangerouslySetInnerHTML={{ __html: plannedModules }} />
}
