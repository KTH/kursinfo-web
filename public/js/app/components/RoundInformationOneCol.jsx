import React from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { useRoundUtils } from '../hooks/useRoundUtils'

function RoundInformationOneCol({ semesterRoundState, courseRound = { round_course_term: [] } }) {
  const { showRoundData } = semesterRoundState
  const { translation } = useLanguage()
  const { createRoundHeader } = useRoundUtils()

  const roundHeader = translation.courseRoundInformation.round_header

  const selectedRoundHeader = createRoundHeader(courseRound)

  return (
    <section
      id="roundInformationOneCol"
      aria-label={
        showRoundData
          ? `${translation.courseRoundInformation.round_information_aria_label} ${selectedRoundHeader}`
          : null
      }
    >
      {showRoundData && <h2 id="courseRoundInformationHeader">{translation.courseRoundInformation.header_round}</h2>}
      {/** ************************************************************************************************************ */}
      {/*                                  Round information  - first part                                         */}
      {/** ************************************************************************************************************ */}
      <div id="roundFirstPart">
        <div id="roundKeyInformation">
          <>
            {showRoundData ? (
              //* ---COURSE ROUND HEADER --- *//
              <div className="info-box round-header-info-box">
                <h3 id="roundHeader">{roundHeader}</h3>
                <p id="selectedRoundHeader">{selectedRoundHeader}</p>
              </div>
            ) : (
              //* ---SELECT A ROUND BOX --- *//
              <div className="info-box yellow">
                <h3>{translation.courseLabels.header_no_round_selected}</h3>
                <p>{translation.courseLabels.no_round_selected}</p>
              </div>
            )}
          </>
        </div>
      </div>
    </section>
  )
}

export default RoundInformationOneCol
