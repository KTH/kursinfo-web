import React from 'react'
import { useRoundUtils } from '../hooks/useRoundUtils'
import { useLanguage } from '../hooks/useLanguage'

const DROPDOWN_ID = 'roundsDropdown'
const EMPTY_OPTION = -1

const RoundOptions = ({ roundsForSelectedSemester }) => {
  const { createRoundLabel } = useRoundUtils()

  return roundsForSelectedSemester.map((round, roundIndex) => {
    const optionLabel = createRoundLabel(round)

    const uniqueKey = `${optionLabel}${round.round_application_code}${round.round_start_date}`

    return (
      <option key={uniqueKey} value={roundIndex}>
        {optionLabel}
      </option>
    )
  })
}

const DropdownRounds = ({ semesterRoundState }) => {
  const { setSelectedRoundIndex, resetSelectedRoundIndex, selectedRoundIndex, roundsForSelectedSemester } =
    semesterRoundState
  const { translation } = useLanguage()
  const label = translation.courseLabels.label_round_select

  const selectOptionValue = selectedRoundIndex ?? EMPTY_OPTION

  const handleDropdownSelect = React.useCallback(
    ({ target }) => {
      const { value } = target
      const selectedOption = parseInt(value)
      const isEmptyOption = selectedOption === EMPTY_OPTION

      if (isEmptyOption) {
        resetSelectedRoundIndex()
      } else {
        setSelectedRoundIndex(selectedOption)
      }
    },
    [setSelectedRoundIndex, resetSelectedRoundIndex]
  )

  return (
    <div className="semester-dropdowns">
      <form>
        <label className="form-control-label" htmlFor={DROPDOWN_ID}>
          {label.label_dropdown}
        </label>
        <div className="form-group">
          <div className="select-wrapper">
            <select className="form-select" id={DROPDOWN_ID} onChange={handleDropdownSelect} value={selectOptionValue}>
              <option value={EMPTY_OPTION}>{label.placeholder}</option>
              <RoundOptions roundsForSelectedSemester={roundsForSelectedSemester} />
            </select>
          </div>
        </div>
      </form>
    </div>
  )
}
export default DropdownRounds
