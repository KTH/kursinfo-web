import React from 'react'
import { useRoundUtils } from '../../hooks/useRoundUtils'
import { RoundInformationInfoGrid } from './RoundInformationInfoGrid'
import { RoundInformationContacts } from './RoundInformationContacts'

function RoundInformation({ courseRound = { round_course_term: [] } }) {
  const { createRoundHeader } = useRoundUtils()
  const selectedRoundHeader = createRoundHeader(courseRound)

  return (
    <div className="roundInformation">
      <h3>{selectedRoundHeader}</h3>

      <RoundInformationInfoGrid />
      <RoundInformationContacts />
    </div>
  )
}

export { RoundInformation }
