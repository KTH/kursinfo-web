import React from 'react'
import { useWebContext } from '../context/WebContext'

const formatLongSemesterName = (semesterItem, translation) =>
  `${translation.courseInformation.course_short_semester[semesterItem[1]]}${semesterItem[0]}`

const DropdownSemesters = ({ semesterList, label = '', translation, useStartSemesterFromQuery }) => {
  const [context, setWebContext] = useWebContext()

  const dropdownID = 'semesterDropdown'
  const { hasStartPeriodFromQuery, semesterSelectedIndex } = context

  const showSelectPlaceholder = (!hasStartPeriodFromQuery && !useStartSemesterFromQuery) || !useStartSemesterFromQuery

  if (semesterList && semesterList.length < 1) {
    return ''
  }

  const selectedSemester = !showSelectPlaceholder ? semesterList[semesterSelectedIndex] : null

  const selectedOptionValue = selectedSemester
    ? formatLongSemesterName(selectedSemester, translation)
    : label.placeholder

  async function handleSemesterDropdownSelect(e) {
    e.preventDefault()
    const { activeSemesters } = context
    const eventTarget = e.target
    const selectedOption = eventTarget[eventTarget.selectedIndex]

    const selectInfo = selectedOption.id.split('_')
    const newIndex = Number(selectInfo[1])
    const activeSemester = activeSemesters[newIndex] ? activeSemesters[newIndex][2].toString() : ''
    const showRoundData =
      context.courseData.roundList[activeSemester] && context.courseData.roundList[activeSemester].length === 1

    const newContext = {
      activeRoundIndex: 0,
      activeSemesterIndex: newIndex >= 0 ? newIndex : context.defaultIndex,
      activeSemester: activeSemester || (activeSemesters.length > 0 ? activeSemesters[context.defaultIndex][2] : 0),
      activeSyllabusIndex: context.activeSemestersIndexesWithValidSyllabusesIndexes[newIndex] || 0,
      showRoundData,
      roundDisabled: newIndex === -1,
      semesterSelectedIndex: eventTarget.selectedIndex,
      roundSelectedIndex: 0,
    }
    setWebContext({ ...context, ...newContext })
  }

  return (
    <div className="semester-dropdowns">
      <form>
        <label className="form-control-label" htmlFor={dropdownID}>
          {label.label_dropdown}
        </label>
        <div className="form-group">
          <div className="select-wrapper">
            <select
              className="form-select"
              id={dropdownID}
              aria-label={label.placeholder}
              onChange={handleSemesterDropdownSelect}
              defaultValue={selectedOptionValue} // selects value
            >
              {showSelectPlaceholder && (
                <option id={dropdownID + '_-1_0'} value={label.placeholder}>
                  {label.placeholder}
                </option>
              )}
              {semesterList.map((semesterItem, index) => {
                const longSemesterName = formatLongSemesterName(semesterItem, translation)
                return (
                  <option key={longSemesterName} id={dropdownID + '_' + index + '_0'} value={longSemesterName}>
                    {longSemesterName}
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

export default DropdownSemesters
