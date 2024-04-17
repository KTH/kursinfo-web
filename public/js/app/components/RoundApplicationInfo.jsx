import React from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { useMissingInfo } from '../hooks/useMissingInfo'

const RoundApplicationInfo = ({
  roundHeader,
  selectedRoundHeader,
  round,
  showRoundData,
  courseHasRound,
  fundingType,
}) => {
  const {
    translation: { courseRoundInformation, courseLabels },
  } = useLanguage()
  const { missingInfoLabel, isMissingInfoLabel } = useMissingInfo()

  const openApplicationLink = ev => {
    ev.preventDefault()
    window.open(round.round_application_link)
  }

  const showApplicationLink =
    showRoundData &&
    courseHasRound &&
    fundingType === 'LL' &&
    round &&
    !isMissingInfoLabel(round.round_application_link)

  return (
    <span>
      <h2 id="applicationInformationHeader">{courseLabels.header_select_course}</h2>
      <div className={`info-box ${courseHasRound && showRoundData ? '' : 'yellow'}`}>
        <h3>{roundHeader}</h3>
        <p>{selectedRoundHeader}</p>

        <h3>{courseRoundInformation.round_application_code}</h3>
        <p>{round ? round.round_application_code : missingInfoLabel}</p>
        {showApplicationLink && (
          <button
            className="kth-button next"
            name={courseRoundInformation.round_application_link}
            onClick={openApplicationLink}
          >
            {courseRoundInformation.round_application_link}
          </button>
        )}
      </div>
    </span>
  )
}

export default RoundApplicationInfo
