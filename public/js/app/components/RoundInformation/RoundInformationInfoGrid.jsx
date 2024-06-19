import React from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { useMissingInfo } from '../../hooks/useMissingInfo'
import { CourseMemoLink } from './CourseMemoLink'
import { CourseScheduleLink } from './CourseScheduleLink'
import { PlannedModules } from './PlannedModules'

const Item = ({ children, title }) => (
  <div>
    <h4>{title}</h4>
    {children}
  </div>
)

function RoundInformationInfoGrid({ courseCode, courseRound, selectedSemester }) {
  const { translation } = useLanguage()
  const { missingInfoLabel } = useMissingInfo()
  return (
    <div className="roundInformation__infoGrid">
      <Item title={translation.courseRoundInformation.round_course_place}>
        <p>{courseRound ? courseRound.round_course_place : missingInfoLabel}</p>
      </Item>
      <Item title={translation.courseRoundInformation.round_start_date}>
        <div>{courseRound ? courseRound.round_start_date : missingInfoLabel}</div>
        <div>{courseRound ? courseRound.round_end_date : missingInfoLabel}</div>
      </Item>
      <Item title={translation.courseRoundInformation.round_periods}>
        <span dangerouslySetInnerHTML={{ __html: courseRound.round_periods }} />
      </Item>
      <Item title={translation.courseRoundInformation.round_pace_of_study}>
        <p>{courseRound ? ` ${courseRound.round_study_pace}%` : missingInfoLabel}</p>
      </Item>
      <Item title={translation.courseRoundInformation.round_application_code}>
        <p>{courseRound ? ` ${courseRound.round_application_code}` : missingInfoLabel}</p>
      </Item>
      <Item title={translation.courseRoundInformation.round_tutoring_form}>
        <p>
          {`${courseRound ? translation.courseRoundInformation.round_tutoring_form_label[courseRound.round_tutoring_form] : missingInfoLabel} ${
            courseRound
              ? translation.courseRoundInformation.round_tutoring_time_label[courseRound.round_tutoring_time]
              : missingInfoLabel
          }`}
        </p>
      </Item>
      <Item title={translation.courseRoundInformation.round_tutoring_language}>
        <p>{courseRound ? courseRound.round_tutoring_language : missingInfoLabel}</p>
      </Item>
      <Item title={translation.courseLabels.label_course_memo}>
        <CourseMemoLink courseCode={courseCode} courseRound={courseRound} />
      </Item>
      <Item title={translation.courseRoundInformation.round_max_seats}>TODO: round_max_seats</Item>
      <Item title={translation.courseRoundInformation.round_part_of_programme}>
        <span dangerouslySetInnerHTML={{ __html: courseRound.round_part_of_programme }} />
      </Item>
      <Item title={translation.courseRoundInformation.round_target_group}>
        <span dangerouslySetInnerHTML={{ __html: courseRound.round_target_group }} />
      </Item>
      <Item title={translation.courseRoundInformation.round_time_slots}>
        <PlannedModules
          showRoundData={true}
          courseCode={courseCode}
          courseRound={courseRound}
          selectedSemester={selectedSemester}
        />
      </Item>
      <Item title={translation.courseLabels.label_schedule}>
        <CourseScheduleLink courseRound={courseRound} />
      </Item>
    </div>
  )
}

export { RoundInformationInfoGrid }
