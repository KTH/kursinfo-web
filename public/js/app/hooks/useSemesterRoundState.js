const { useState, useMemo, useCallback } = require('react')
const { getValidSyllabusForSemester } = require('./getValidSyllabusForSemester')

const UNSET_VALUE = undefined

const getElementOrEmpty = (arr, index) => {
  if (!arr || arr.length === 0 || index === undefined || index >= arr.length) {
    return {}
  }
  return arr[index]
}

const useSemesterRoundState = ({
  initiallySelectedRoundIndex,
  initiallySelectedSemester,
  roundsBySemester,
  syllabusList,
  activeSemesters,
}) => {
  const [selectedRoundIndex, setSelectedRoundIndex] = useState(initiallySelectedRoundIndex)
  const [selectedSemester, setSelectedSemester] = useState(Number(initiallySelectedSemester))

  const isSetSelectedRoundIndex = useMemo(() => selectedRoundIndex !== UNSET_VALUE, [selectedRoundIndex])

  const resetSelectedRoundIndex = useCallback(() => setSelectedRoundIndex(() => UNSET_VALUE), [setSelectedRoundIndex])

  const determineSemesterOnlyHasOneRound = (rounds, semester) =>
    rounds !== undefined &&
    Object.hasOwnProperty.call(rounds, semester) &&
    rounds[semester] &&
    rounds[semester].length === 1

  const activeSemesterOnlyHasOneRound = useMemo(
    () => determineSemesterOnlyHasOneRound(roundsBySemester, selectedSemester),
    [roundsBySemester, selectedSemester]
  )

  const showRoundData = useMemo(() => {
    if (isSetSelectedRoundIndex || activeSemesterOnlyHasOneRound) {
      return true
    }

    return false
  }, [isSetSelectedRoundIndex, activeSemesterOnlyHasOneRound])

  const roundsForActiveSemester = useMemo(() => {
    if (!roundsBySemester) {
      return []
    }

    return roundsBySemester[selectedSemester]
  }, [roundsBySemester, selectedSemester])

  const activeRound = useMemo(() => {
    const index = activeSemesterOnlyHasOneRound ? 0 : selectedRoundIndex

    return getElementOrEmpty(roundsForActiveSemester, index)
  }, [activeSemesterOnlyHasOneRound, roundsForActiveSemester, selectedRoundIndex])

  const hasActiveSemesters = useMemo(() => activeSemesters && activeSemesters.length > 0, [activeSemesters])

  const activeSyllabus = useMemo(() => {
    if (!selectedSemester) return getElementOrEmpty(syllabusList, 0)

    return getValidSyllabusForSemester(syllabusList, selectedSemester)
  }, [syllabusList, selectedSemester])

  /**
   * Is true if the course has a non-empty syllabus
   */
  const hasSyllabus = useMemo(
    () => syllabusList && syllabusList.length > 0 && activeSyllabus !== undefined,
    [activeSyllabus, syllabusList]
  )

  const setSelectedSemesterAsNumber = useCallback(
    newActiveSemester => {
      setSelectedSemester(() => Number(newActiveSemester))
      if (determineSemesterOnlyHasOneRound(roundsBySemester, newActiveSemester)) {
        setSelectedRoundIndex(0)
      } else {
        resetSelectedRoundIndex()
      }
    },
    [resetSelectedRoundIndex, roundsBySemester]
  )

  const roundsForSelectedSemester = roundsBySemester && roundsBySemester[selectedSemester]

  return {
    selectedRoundIndex,
    activeRound,
    roundsForSelectedSemester,
    selectedSemester,
    showRoundData,
    activeSemesterOnlyHasOneRound,
    hasActiveSemesters,
    activeSyllabus,
    setSelectedRoundIndex,
    resetSelectedRoundIndex,
    setSelectedSemester: setSelectedSemesterAsNumber,
    hasSyllabus,
  }
}

module.exports = {
  useSemesterRoundState,
}
