import React, { useEffect, useState } from 'react'

import Alert from '../../components-shared/Alert'
import BankIdAlert from '../../components/BankIdAlert'
import { useLanguage } from '../../hooks/useLanguage'
import { useRoundUtils } from '../../hooks/useRoundUtils'
import { useCourseEmployees } from '../../hooks/useCourseEmployees'
import { usePlannedModules } from '../../hooks/usePlannedModules'
import { RoundInformationInfoGrid } from './RoundInformationInfoGrid'
import { RoundInformationContacts } from './RoundInformationContacts'

function RoundInformation({ courseCode, courseData, courseRound, semesterRoundState }) {
  const { translation } = useLanguage()

  const { createRoundHeader } = useRoundUtils()
  const selectedRoundHeader = createRoundHeader(courseRound)
  const { selectedSemester } = semesterRoundState

  const [pending, setPending] = useState(true)

  const { courseRoundEmployees, isError: courseEmployeesError } = useCourseEmployees({
    courseCode,
    selectedSemester,
    applicationCode: courseRound?.round_application_code,
  })

  const { plannedModules, isError: plannedModulesError } = usePlannedModules({
    courseCode,
    semester: selectedSemester,
    applicationCode: courseRound.round_application_code,
  })

  useEffect(() => {
    setPending(true)
  }, [courseRound])

  useEffect(() => {
    if ((courseRoundEmployees && plannedModules) || plannedModulesError || courseEmployeesError) {
      setPending(false)
    }
  }, [courseRoundEmployees, plannedModules, plannedModulesError, courseEmployeesError])

  return (
    <div className={`roundInformation ${pending ? 'shimmer-effect' : 'fadeIn'}`}>
      <h3>
        {translation.courseRoundInformation.round_header} {selectedRoundHeader}
      </h3>

      <RoundInformationInfoGrid
        courseCode={courseCode}
        courseRound={courseRound}
        plannedModules={plannedModules ?? {}}
      />

      <BankIdAlert tutoringForm={courseRound.round_tutoring_form} fundingType={courseRound.round_funding_type} />

      {courseRound.round_state !== 'APPROVED' && (
        <Alert type="info">{translation.courseLabels.lable_round_state[courseRound.round_state]}</Alert>
      )}

      <h3>{translation.courseLabels.header_contact}</h3>
      <RoundInformationContacts courseData={courseData} courseRoundEmployees={courseRoundEmployees ?? {}} />
    </div>
  )
}

export { RoundInformation }
