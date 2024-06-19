import React from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { useMissingInfo } from '../../hooks/useMissingInfo'

const Item = ({ children, title }) => (
  <div>
    <h4>{title}</h4>
    <p>TODO</p>
    {/* <p>{children}</p> */}
  </div>
)

function RoundInformationInfoGrid({ courseRound }) {
  const { translation } = useLanguage()
  const { missingInfoLabel } = useMissingInfo()
  return (
    <div className="roundInformation__infoGrid">
      <Item title={translation.courseRoundInformation.round_course_place}></Item>
      <Item title={translation.courseRoundInformation.round_start_date}></Item>
      <Item title={translation.courseRoundInformation.round_periods}></Item>
      <Item title={translation.courseRoundInformation.round_pace_of_study}></Item>
      <Item title={translation.courseRoundInformation.round_application_code}></Item>
      <Item title={translation.courseRoundInformation.round_tutoring_form}></Item>
      <Item title={translation.courseRoundInformation.round_tutoring_language}></Item>
      <Item title={translation.courseLabels.label_course_memo}></Item>
      <Item title={translation.courseRoundInformation.round_max_seats}></Item>
      <Item title={translation.courseRoundInformation.round_part_of_programme}></Item>
      <Item title={translation.courseRoundInformation.round_target_group}></Item>
      <Item title={translation.courseRoundInformation.round_time_slots}></Item>
      <Item title={translation.courseLabels.label_schedule}></Item>
    </div>
  )
}

export { RoundInformationInfoGrid }
