import React from 'react'

import { useLanguage } from '../../hooks/useLanguage'

const semesterToLabel = (translation, semester) =>
  `${translation.courseInformation.course_short_semester[semester.semesterNumber]}${semester.year}`

export const SemesterRadioButtons = ({ activeSemesters, semesterRoundState }) => {
  const { translation } = useLanguage()
  const { selectedSemester, setSelectedSemester } = semesterRoundState
  return (
    <fieldset>
      <legend>Termin</legend>
      <div>
        {activeSemesters.map(item => (
          <span key={item.semester}>
            <input
              type="radio"
              name="semester"
              id={`semester-option-${item.semester}`}
              value={item.semester}
              checked={`${selectedSemester}` === `${item.semester}`}
              onChange={e => setSelectedSemester(e.target.value)}
            />
            <label htmlFor={`semester-option-${item.semester}`}>{semesterToLabel(translation, item)}</label>
          </span>
        ))}
      </div>
    </fieldset>
  )
}
