import React, { useEffect, useState, useRef } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import InfoModal from '../InfoModal'
import { CourseMemoLink } from './CourseMemoLink'
import { CourseScheduleLink } from './CourseScheduleLink'
import { PlannedModules } from './PlannedModules'

// Calculates if a "Show more" button should be displayed, and creates props for content and button elements.
const useShowMoreContent = content => {
  const ref = useRef(null)
  const [hasMoreContent, setHasMoreContent] = useState(false)
  const [contentHeight, setHeight] = useState(undefined)
  const { translation } = useLanguage()

  const showMoreContent = hasMoreContent && !!contentHeight
  const hideMoreContent = hasMoreContent && !showMoreContent
  useEffect(() => {
    if (ref.current) {
      const el = ref.current
      const isOverflowing = el.clientHeight < el.scrollHeight
      setHasMoreContent(isOverflowing)
    }
  }, [content])

  const contentProps = {
    ref,
    style: { maxHeight: contentHeight }, // set max height for animation from the max value specified in css to actual content height
    className: `roundInformation__infoGridItemContent ${hideMoreContent ? 'hidden' : ''}`,
  }

  const showMoreButtonProps = hasMoreContent
    ? {
        onClick: () => {
          setHeight(showMoreContent ? undefined : ref.current.scrollHeight)
        },
        children: showMoreContent ? translation.showMoreContent.hide : translation.showMoreContent.show,
        className: 'roundInformation__infoGridItemShowMoreButton',
      }
    : undefined

  return { contentProps, showMoreButtonProps }
}

const Item = ({ children, html, title, infoModalContent }) => {
  const { translation } = useLanguage()
  const { contentProps, showMoreButtonProps } = useShowMoreContent(html ?? children)

  return (
    <div>
      <dt>
        {title}
        {infoModalContent && (
          <InfoModal
            infoText={infoModalContent}
            title={title}
            type="html"
            closeLabel={translation.courseLabels.label_close}
          />
        )}
      </dt>
      <dd className="roundInformation__infoGridItem">
        {html ? (
          <div {...contentProps} dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <div {...contentProps}>{children}</div>
        )}
        {showMoreButtonProps && <button {...showMoreButtonProps} />}
      </dd>
    </div>
  )
}

function RoundInformationInfoGrid({ courseCode, courseRound, selectedSemester }) {
  const { translation } = useLanguage()

  return (
    <dl className="roundInformation__infoGrid">
      <Item title={translation.courseRoundInformation.round_course_place}>
        <p>{courseRound.round_course_place}</p>
      </Item>
      <Item title={translation.courseRoundInformation.round_start_date}>
        <div>
          {courseRound.round_start_date} - {courseRound.round_end_date}
        </div>
      </Item>
      <Item title={translation.courseRoundInformation.round_periods} html={courseRound.round_periods} />
      <Item title={translation.courseRoundInformation.round_pace_of_study}>
        <p>{` ${courseRound.round_study_pace}%`}</p>
      </Item>
      <Item title={translation.courseRoundInformation.round_application_code}>
        <p>{courseRound.round_application_code}</p>
      </Item>
      <Item title={translation.courseRoundInformation.round_tutoring_form}>
        <p>
          {`${translation.courseRoundInformation.round_tutoring_form_label[courseRound.round_tutoring_form]} ${
            translation.courseRoundInformation.round_tutoring_time_label[courseRound.round_tutoring_time]
          }`}
        </p>
      </Item>
      <Item title={translation.courseRoundInformation.round_tutoring_language}>
        <p>{courseRound.round_tutoring_language}</p>
      </Item>
      <Item title={translation.courseLabels.label_course_memo}>
        <CourseMemoLink courseCode={courseCode} courseRound={courseRound} />
      </Item>
      <Item
        title={translation.courseRoundInformation.round_max_seats}
        infoModalContent={
          courseRound.round_seats &&
          `<p>${translation.courseLabels.round_seats_default_info} ${
            courseRound.round_selection_criteria !== '<p></p>' && courseRound.round_selection_criteria !== ''
              ? `${translation.courseLabels.round_seats_info}</p>${courseRound.round_selection_criteria}`
              : '</p>'
          }`
        }
      >
        <p>{courseRound.round_seats || translation.courseRoundInformation.round_no_seats_limit}</p>
      </Item>
      <Item title={translation.courseRoundInformation.round_target_group} html={courseRound.round_target_group} />
      <Item title={translation.courseRoundInformation.round_time_slots}>
        <PlannedModules courseCode={courseCode} courseRound={courseRound} selectedSemester={selectedSemester} />
      </Item>
      <Item title={translation.courseLabels.label_schedule}>
        <CourseScheduleLink courseRound={courseRound} />
      </Item>
      <Item
        title={translation.courseRoundInformation.round_part_of_programme}
        html={courseRound.round_part_of_programme}
      />
    </dl>
  )
}

export { RoundInformationInfoGrid }
