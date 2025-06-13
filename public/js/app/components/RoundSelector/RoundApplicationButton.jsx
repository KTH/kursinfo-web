import React from 'react'
import { useLanguage } from '../../hooks/useLanguage'

const RoundApplicationButton = ({ courseRound, showRoundData }) => {
  const {
    translation: { courseRoundInformation },
  } = useLanguage()
  const showApplicationLink = courseRound && showRoundData && courseRound.show_application_link

  return !showApplicationLink ? null : (
    <a className="kth-button next" href={courseRound.round_application_link}>
      {courseRoundInformation.round_application_link}
    </a>
  )
}

export { RoundApplicationButton }
