import React, { useEffect } from 'react'
import { useRoundUtils } from '../hooks/useRoundUtils'
import { useLanguage } from '../hooks/useLanguage'

const DROPDOWN_ID = 'roundsDropdown'
const EMPTY_OPTION = -1

const RoundOptions = ({ courseRoundList }) => {
  const { createRoundLabel } = useRoundUtils()

  return courseRoundList.map((round, roundIndex) => {
    const optionLabel = createRoundLabel(round)

    const uniqueKey = `${optionLabel}${round.round_application_code}${round.round_start_date}`

    return (
      <option key={uniqueKey} value={roundIndex}>
        {optionLabel}
      </option>
    )
  })
}

const DropdownRounds = ({ courseRoundList, semesterRoundState }) => {
  const { setSelectedRoundIndex, resetSelectedRoundIndex } = semesterRoundState

  const { translation } = useLanguage()
  const label = translation.courseLabels.label_round_select

  const [selectedOptionIndex, setSelectedOptionIndex] = React.useState(EMPTY_OPTION)

  useEffect(() => {
    setSelectedOptionIndex(EMPTY_OPTION)
  }, [courseRoundList])

  const handleDropdownSelect = React.useCallback(
    ({ target }) => {
      const { value } = target

      const selectedOption = parseInt(value)

      const isEmptyOption = selectedOption === EMPTY_OPTION

      const newActiveRoundIndex = isEmptyOption ? 0 : selectedOption

      if (isEmptyOption) {
        resetSelectedRoundIndex()
      } else {
        setSelectedRoundIndex(newActiveRoundIndex)
      }

      setSelectedOptionIndex(selectedOption)
    },
    [setSelectedRoundIndex, resetSelectedRoundIndex, setSelectedOptionIndex]
  )

  if (!courseRoundList || courseRoundList.length < 2) {
    return null
  }

  return (
    <div className="semester-dropdowns">
      <form>
        <label className="form-control-label" htmlFor={DROPDOWN_ID}>
          {label.label_dropdown}
        </label>
        <div className="form-group">
          <div className="select-wrapper">
            <select
              className="form-select"
              id={DROPDOWN_ID}
              onChange={handleDropdownSelect}
              value={selectedOptionIndex}
            >
              (<option value={EMPTY_OPTION}>{label.placeholder}</option>
              )
              <RoundOptions courseRoundList={courseRoundList} />
            </select>
          </div>
        </div>
      </form>
    </div>
  )
}
export default DropdownRounds
