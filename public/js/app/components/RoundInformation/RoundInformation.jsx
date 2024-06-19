import React from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { useRoundUtils } from '../../hooks/useRoundUtils'
import { RoundInformationInfoGrid } from './RoundInformationInfoGrid'
import { RoundInformationContacts } from './RoundInformationContacts'

function RoundInformation({ courseCode, courseData, courseRound, semesterRoundState }) {
  const { translation } = useLanguage()

  const { createRoundHeader } = useRoundUtils()
  const selectedRoundHeader = createRoundHeader(courseRound)
  const { selectedSemester } = semesterRoundState

  return (
    <div className="roundInformation">
      <h3>
        {translation.courseRoundInformation.round_header} {selectedRoundHeader}
      </h3>
      <RoundInformationInfoGrid courseCode={courseCode} courseRound={courseRound} selectedSemester={selectedSemester} />

      <h3>{translation.courseLabels.header_contact}</h3>
      <RoundInformationContacts
        courseCode={courseCode}
        courseData={courseData}
        courseRound={courseRound}
        selectedSemester={selectedSemester}
      />
    </div>
  )
}

export { RoundInformation }
