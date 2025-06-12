import React from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { useMissingInfo } from '../../hooks/useMissingInfo'

const RoundApplicationButton = ({ courseRound, showRoundData }) => {
  const {
    translation: { courseRoundInformation },
  } = useLanguage()
  const { isMissingInfoLabel } = useMissingInfo()
  const showApplicationLink =
    courseRound &&
    showRoundData &&
    !isMissingInfoLabel(courseRound.round_application_link) &&
    courseRound.round_application_link_conditions

  return !showApplicationLink ? null : (
    <a className="kth-button next" href={courseRound.round_application_link}>
      {courseRoundInformation.round_application_link}
    </a>
  )
}

export { RoundApplicationButton }
