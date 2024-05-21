import React from 'react'
import { useLanguage } from '../hooks/useLanguage'

const DROPDOWN_ID = 'semesterDropdown'

const formatLongSemesterName = (semesterItem, translation) =>
  `${translation.courseInformation.course_short_semester[semesterItem.semesterNumber]}${semesterItem.year}`

const DropdownSemesters = ({ semesterList, semesterRoundState }) => {
  const { translation } = useLanguage()

  const label = translation.courseLabels.label_semester_select

  const { selectedSemester, setSelectedSemester } = semesterRoundState

  if (!semesterList || (semesterList && semesterList.length < 1)) {
    return ''
  }

  function handleSemesterDropdownSelect({ target }) {
    const { value } = target

    setSelectedSemester(value)
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
              aria-label={label.placeholder}
              onChange={handleSemesterDropdownSelect}
              value={selectedSemester}
            >
              <SemesterOptions semesterList={semesterList} />
            </select>
          </div>
        </div>
      </form>
    </div>
  )
}

const SemesterOptions = ({ semesterList }) => {
  const { translation } = useLanguage()

  return semesterList.map(semesterItem => {
    const longSemesterName = formatLongSemesterName(semesterItem, translation)
    return (
      <option key={longSemesterName} value={semesterItem.semester}>
        {longSemesterName}
      </option>
    )
  })
}

export default DropdownSemesters
