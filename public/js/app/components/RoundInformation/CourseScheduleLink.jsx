import React from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { useMissingInfo } from '../../hooks/useMissingInfo'

export const CourseScheduleLink = ({ courseRound }) => {
  const { translation } = useLanguage()
  const { isMissingInfoLabel } = useMissingInfo()

  const showScheduleLink = courseRound.round_schedule && !isMissingInfoLabel(courseRound.round_schedule)

  return showScheduleLink ? (
    <a href={courseRound.round_schedule}>{translation.courseLabels.label_link_schedule}</a>
  ) : (
    <i>{translation.courseLabels.no_schedule_published}</i>
  )
}
