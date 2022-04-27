import React from 'react'
import { INFORM_IF_IMPORTANT_INFO_IS_MISSING } from '../util/constants'
import { useWebContext } from '../context/WebContext'

const DropdownRounds = ({ courseRoundList, language = 0, label = '', translation }) => {
  const [webContext, setWebContext] = useWebContext()
  const context = React.useMemo(() => webContext, [webContext])

  const dropdownID = 'roundsDropdown'

  function handleDropdownSelect(e) {
    e.preventDefault()

    const eTarget = e.target
    const selectedOption = eTarget[eTarget.selectedIndex]

    const selectInfo = selectedOption.id.split('_')
    const newContext = {
      activeRoundIndex: eTarget.selectedIndex === 0 ? 0 : selectInfo[1],
      showRoundData: eTarget.selectedIndex !== 0,
      roundSelected: eTarget.selectedIndex !== 0,
      roundSelectedIndex: eTarget.selectedIndex,
    }

    setWebContext({ ...context, ...newContext })

    if (context.showRoundData) {
      context.getCourseEmployees()
    }
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
        <div className="form-select form-group">
          <div className="select-wrapper">
            <select
              className="form-control"
              id={dropdownID}
              aria-label=""
              onChange={handleDropdownSelect}
              disabled={context.roundDisabled}
            >
              (
              <option
                id={dropdownID + '_-1_0'}
                defaultValue={context.roundSelectedIndex === 0}
                value={label.placeholder}
              >
                {label.placeholder}
              </option>
              )
              {courseRoundList.map(
                (
                  {
                    round_short_name: roundShortName,
                    round_funding_type: fundingType,
                    round_category: roundCategory,
                    round_application_code: roundApplicationCode,
                    round_start_date: roundStartDate,
                  },
                  index
                ) => {
                  const isChosen = context.roundSelectedIndex - 1 === index
                  const optionLabel = `${
                    roundShortName !== INFORM_IF_IMPORTANT_INFO_IS_MISSING[language] ? `${roundShortName}` : ''
                  },${
                    fundingType === 'UPP' || fundingType === 'PER'
                      ? translation.courseRoundInformation.round_type[fundingType]
                      : translation.courseRoundInformation.round_category[roundCategory]
                  }`
                  // Key must be unique, otherwise it will not update course rounds list for some courses, ex.FLH3000
                  const uniqueKey = `${optionLabel}${roundApplicationCode}${roundStartDate}`
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
                }
              )}
            </select>
          </div>
        </div>
      </form>
    </div>
  )
}
export default DropdownRounds
