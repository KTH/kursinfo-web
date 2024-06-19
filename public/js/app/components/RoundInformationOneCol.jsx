import React from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { useRoundUtils } from '../hooks/useRoundUtils'
import InfoModal from './InfoModal'
import RoundApplicationInfo from './RoundApplicationInfo'

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

          {/* ---COURSE ROUND INFORMATION--- */}
          {showRoundData && (
            <div className="info-box">
              <h3>
                {translation.courseRoundInformation.round_max_seats}
                {courseRound && courseRound.round_seats && (
                  <InfoModal
                    closeLabel={translation.courseLabels.label_close}
                    infoText={`<p>${translation.courseLabels.round_seats_default_info} ${
                      courseRound.round_selection_criteria !== '<p></p>' && courseRound.round_selection_criteria !== ''
                        ? `${translation.courseLabels.round_seats_info}</p>${courseRound.round_selection_criteria}`
                        : '</p>'
                    }`}
                    title={translation.courseRoundInformation.round_max_seats}
                    type="html"
                  />
                )}
              </h3>
              {courseRound && (
                <p> {courseRound.round_seats || translation.courseRoundInformation.round_no_seats_limit} </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/** ************************************************************************************************************ */}
      {/*                                     Round - application information                                           */}
      {/** ************************************************************************************************************ */}
      <div id="roundApply">
        <RoundApplicationInfo
          roundHeader={roundHeader}
          selectedRoundHeader={selectedRoundHeader}
          round={courseRound}
          showRoundData={showRoundData}
          fundingType={courseRound.round_funding_type}
        />
      </div>
    </section>
  )
}

export default RoundInformationOneCol
