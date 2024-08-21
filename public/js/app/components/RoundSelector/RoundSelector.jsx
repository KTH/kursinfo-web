import React from 'react'

import { useLanguage } from '../../hooks/useLanguage'
import InfoModal from '../InfoModal'

import DropdownRounds from './DropdownRounds'
import { RoundApplicationButton } from './RoundApplicationButton'
import { SemesterRadioButtons } from './SemesterRadioButtons'

export const RoundSelector = ({ activeSemesters, semesterRoundState }) => {
  const { translation } = useLanguage()
  const {
    hasActiveSemesters,
    showRoundData,
    selectedSemester,
    activeSemesterOnlyHasOneRound,
    hasOnlyOneRound,
    roundsForSelectedSemester,
    activeRound,
  } = semesterRoundState

  const showSemesterRadioButton = hasActiveSemesters
  const showRoundsDropdown = !!selectedSemester && !activeSemesterOnlyHasOneRound

  return (
    <div className="roundSelector">
      <div>
        <h2>
          {translation.courseLabels.header_dropdown_menue}
          <InfoModal
            title={translation.courseLabels.header_dropdown_menue}
            infoText={translation.courseLabels.syllabus_info}
            type="html"
            closeLabel={translation.courseLabels.label_close}
            ariaLabel={translation.courseLabels.header_dropdown_menu_aria_label}
          />
        </h2>
        {hasActiveSemesters ? (
          !hasOnlyOneRound && <p>{translation.courseLabels.header_dropdown_menu_navigation}</p>
        ) : (
          <p>
            <i>{translation.courseLabels.lable_no_rounds}</i>
          </p>
        )}
      </div>

      <div className="roundSelector__selectAndApplicationButton">
        <div>
          {showSemesterRadioButton && (
            <SemesterRadioButtons activeSemesters={activeSemesters} semesterRoundState={semesterRoundState} />
          )}

          {showRoundsDropdown && (
            <DropdownRounds
              roundsForSelectedSemester={roundsForSelectedSemester}
              semesterRoundState={semesterRoundState}
            />
          )}
        </div>
        <div>
          <RoundApplicationButton courseRound={activeRound} showRoundData={showRoundData} />
        </div>
      </div>
    </div>
  )
}
