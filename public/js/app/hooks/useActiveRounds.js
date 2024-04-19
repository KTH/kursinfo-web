const { useState, useMemo, useCallback, useEffect } = require('react')
const { getValidSyllabusForSemester } = require('./getValidSyllabusForSemester')

const UNSET_VALUE = undefined

const getElementOrEmpty = (arr, index) => {
  if (!arr || arr.length === 0 || index === undefined) {
    return {}
  }
  return arr[index]
}

const useActiveRounds = ({
  initiallySelectedRoundIndex,
  initiallySelectedSemester,
  roundList,
  syllabusList,
  activeSemesters,
}) => {
  const [selectedRoundIndex, setSelectedRoundIndex] = useState(initiallySelectedRoundIndex)
  const [selectedSemester, setSelectedSemester] = useState(initiallySelectedSemester)

  const isSetSelectedRoundIndex = useMemo(() => selectedRoundIndex !== UNSET_VALUE, [selectedRoundIndex])

  const resetSelectedRoundIndex = useCallback(() => setSelectedRoundIndex(UNSET_VALUE), [setSelectedRoundIndex])

  useEffect(() => resetSelectedRoundIndex(), [resetSelectedRoundIndex, roundList])

  const activeSemesterOnlyHasOneRound = useMemo(
    () =>
      roundList !== undefined &&
      Object.hasOwnProperty.call(roundList, selectedSemester) &&
      roundList[selectedSemester] &&
      roundList[selectedSemester].length === 1,
    [roundList, selectedSemester]
  )

  const showRoundData = useMemo(() => {
    if (isSetSelectedRoundIndex || activeSemesterOnlyHasOneRound) {
      return true
    }

    return false
  }, [isSetSelectedRoundIndex, activeSemesterOnlyHasOneRound])

  const roundsForActiveSemester = useMemo(() => {
    if (!roundList) {
      return []
    }

    return roundList[selectedSemester]
  }, [roundList, selectedSemester])

  const firstRoundInActiveSemester = useMemo(
    () => getElementOrEmpty(roundsForActiveSemester, 0),
    [roundsForActiveSemester]
  )

  const activeRound = useMemo(
    () => getElementOrEmpty(roundsForActiveSemester, selectedRoundIndex),
    [roundsForActiveSemester, selectedRoundIndex]
  )

  const hasActiveSemesters = useMemo(() => activeSemesters && activeSemesters.length > 0, [activeSemesters])

  const activeSyllabus = useMemo(
    () => getValidSyllabusForSemester(syllabusList, selectedSemester),
    [syllabusList, selectedSemester]
  )

  const hasSyllabus = useMemo(() => syllabusList && syllabusList.length > 0, [syllabusList])

  const setSelectedSemesterAsNumber = useCallback(
    newActiveSemester => {
      setSelectedSemester(Number(newActiveSemester))
      resetSelectedRoundIndex()
    },
    [resetSelectedRoundIndex]
  )

  return {
    selectedRoundIndex,
    activeRound,
    selectedSemester,
    isSetSelectedRoundIndex,
    showRoundData,
    activeSemesterOnlyHasOneRound,
    firstRoundInActiveSemester,
    hasActiveSemesters,
    activeSyllabus,
    setSelectedRoundIndex,
    resetSelectedRoundIndex,
    setSelectedSemester: setSelectedSemesterAsNumber,
    hasSyllabus,
  }
}

module.exports = {
  useActiveRounds,
}
