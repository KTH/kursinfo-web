import React from 'react'
import { useWebContext } from '../context/WebContext'
import { useRoundUtils } from '../hooks/useRoundUtils'

const DropdownRounds = ({ courseRoundList, label = '' }) => {
  const [context, setWebContext] = useWebContext()
  const { roundDisabled } = context
  const [roundSelectedIndex, setRoundSelectIndex] = React.useState(0)

  const { createRoundLabel } = useRoundUtils()

  const dropdownID = 'roundsDropdown'

  async function handleDropdownSelect(e) {
    e.preventDefault()

    const eTarget = e.target
    const selectedOption = eTarget[eTarget.selectedIndex]

    const selectInfo = selectedOption.id.split('_')

    const newContext = {
      activeRoundIndex: eTarget.selectedIndex === 0 ? 0 : selectInfo[1],
      showRoundData: eTarget.selectedIndex !== 0,
      roundSelectedIndex: eTarget.selectedIndex,
    }
    setWebContext({ ...context, ...newContext })

    setRoundSelectIndex(eTarget.selectedIndex)
  }

  if (courseRoundList && courseRoundList.length < 2) {
    return ''
  }
  return (
    <div className="col-12 semester-dropdowns">
      <form>
        <label className="form-control-label" htmlFor={dropdownID}>
          {label.label_dropdown}
        </label>
        <div className="form-group">
          <div className="select-wrapper">
            <select
              className="form-select"
              id={dropdownID}
              aria-label=""
              onChange={handleDropdownSelect}
              disabled={roundDisabled}
            >
              (
              <option id={dropdownID + '_-1_0'} defaultValue={roundSelectedIndex === 0} value={label.placeholder}>
                {label.placeholder}
              </option>
              )
              {courseRoundList.map((round, index) => {
                const isChosen = roundSelectedIndex - 1 === index
                const optionLabel = createRoundLabel(round)

                // Key must be unique, otherwise it will not update course rounds list for some courses, ex.FLH3000
                const uniqueKey = `${optionLabel}${round.round_application_code}${round.round_start_date}`

                return (
                  <option
                    key={uniqueKey}
                    id={dropdownID + '_' + index + '_0'}
                    defaultValue={isChosen}
                    value={optionLabel}
                  >
                    {optionLabel}
                  </option>
                )
              })}
            </select>
          </div>
        </div>
      </form>
    </div>
  )
}
export default DropdownRounds
