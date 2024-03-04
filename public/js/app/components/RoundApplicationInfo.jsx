import React from 'react'
import { Button } from 'reactstrap'
import i18n from '../../../../i18n'
import { INFORM_IF_IMPORTANT_INFO_IS_MISSING } from '../util/constants'

const LABEL_MISSING_INFO = { en: INFORM_IF_IMPORTANT_INFO_IS_MISSING[0], sv: INFORM_IF_IMPORTANT_INFO_IS_MISSING[1] }

const RoundApplicationInfo = ({
  roundHeader,
  selectedRoundHeader,
  userLanguage,
  round,
  showRoundData,
  courseHasRound,
  fundingType,
}) => {
  const { courseRoundInformation, courseLabels } = i18n.messages[userLanguage]

  const openApplicationLink = ev => {
    ev.preventDefault()
    window.open(round.round_application_link)
  }

  const showApplicationLink =
    showRoundData &&
    courseHasRound &&
    fundingType === 'LL' &&
    round &&
    round.round_application_link !== LABEL_MISSING_INFO[userLanguage]

  return (
    <span>
      <h2 id="applicationInformationHeader" className="right-column-header">
        {courseLabels.header_select_course}
      </h2>

      <h3 className="t4">{roundHeader}</h3>
      <p>{selectedRoundHeader}</p>

      <h3 className="t4">{courseRoundInformation.round_application_code}</h3>
      <p>{round ? round.round_application_code : LABEL_MISSING_INFO[userLanguage]}</p>
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