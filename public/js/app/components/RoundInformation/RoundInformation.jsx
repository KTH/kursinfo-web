import React, { useEffect, useMemo, useState } from 'react'

import Alert from '../../components-shared/Alert'
import BankIdAlert from '../../components/BankIdAlert'
import { useLanguage } from '../../hooks/useLanguage'
import { useRoundUtils } from '../../hooks/useRoundUtils'
import { useCourseEmployees } from '../../hooks/useCourseEmployees'
import { usePlannedModules } from '../../hooks/usePlannedModules'
import { RoundInformationInfoGrid } from './RoundInformationInfoGrid'
import { RoundInformationContacts } from './RoundInformationContacts'

function RoundInformation({ courseCode, courseRound, semesterRoundState }) {
  const { translation } = useLanguage()

  const { createRoundHeader } = useRoundUtils()
  const selectedRoundHeader = createRoundHeader(courseRound)
  const { selectedSemester } = semesterRoundState

  const memoizedCourseRound = useMemo(() => courseRound, [courseRound])

  const memoizedParams = useMemo(
    () => ({
      courseCode,
      selectedSemester,
      applicationCode: memoizedCourseRound?.round_application_code,
    }),
    [courseCode, selectedSemester, memoizedCourseRound?.round_application_code]
  )

  const {
    courseRoundEmployees,
    isError: courseEmployeesError,
    isLoading: courseEmployeesLoading,
  } = useCourseEmployees(memoizedParams)

  const {
    plannedModules,
    isError: plannedModulesError,
    isLoading: plannedModulesIsLoading,
  } = usePlannedModules(memoizedParams)

  const isLoading = courseEmployeesLoading || plannedModulesIsLoading
  const isError = courseEmployeesError || plannedModulesError

  const [isLoaderVisible, setIsLoaderVisible] = useState(false)

  useEffect(() => {
    let timer
    if (isLoading) {
      setIsLoaderVisible(true)
    } else {
      timer = setTimeout(() => {
        setIsLoaderVisible(false)
      }, 300)
    }
    return () => clearTimeout(timer)
  }, [isLoading])

  return (
    <div className={`roundInformation ${!isError && isLoaderVisible ? 'shimmer-effect' : 'fadeIn'}`}>
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
      <RoundInformationContacts courseRoundEmployees={courseRoundEmployees ?? {}} />
    </div>
  )
}

export { RoundInformation }
