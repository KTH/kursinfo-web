import React from 'react'
import { Button } from 'reactstrap'
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
      <h2 id="applicationInformationHeader" className="right-column-header">
        {courseLabels.header_select_course}
      </h2>

      <h3 className="t4">{roundHeader}</h3>
      <p>{selectedRoundHeader}</p>

      <h3 className="t4">{courseRoundInformation.round_application_code}</h3>
      <p>{round ? round.round_application_code : missingInfoLabel}</p>
      {showApplicationLink && (
        <Button
          name={courseRoundInformation.round_application_link}
          color="primary"
          className="next"
          onClick={openApplicationLink}
        >
          {courseRoundInformation.round_application_link}
        </Button>
      )}
    </span>
  )
}

export default RoundApplicationInfo
