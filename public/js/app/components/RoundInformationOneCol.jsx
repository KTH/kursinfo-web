/* eslint-disable react/no-danger */
import React from 'react'
import { useWebContext } from '../context/WebContext'
import { useLanguage } from '../hooks/useLanguage'
import { useMissingInfo } from '../hooks/useMissingInfo'
import { useRoundUtils } from '../hooks/useRoundUtils'
import CourseFileLinks from './CourseFileLinks'
import InfoModal from './InfoModal'
import RoundApplicationInfo from './RoundApplicationInfo'

function RoundInformationOneCol({
  fade,
  courseHasRound,
  memoStorageURI,
  showRoundData,
  courseRound: round = { round_course_term: [] },
  courseData: course,
  testEmployees = null, // used for test
}) {
  const [context] = useWebContext()

  const [courseRoundEmployees, setCourseRoundEmployees] = React.useState({})

  const { roundSelectedIndex, activeSemester = '' } = context
  const { translation } = useLanguage()
  const { missingInfoLabel } = useMissingInfo()
  const { createRoundHeader } = useRoundUtils()

  const roundHeader = translation.courseRoundInformation.round_header

  const selectedRoundHeader = createRoundHeader(round)

  React.useEffect(() => {
    const posibleTestEmployees = async () => {
      if (testEmployees) {
        setCourseRoundEmployees(testEmployees)
      } else {
        const employyes = showRoundData ? await context.getCourseEmployees() : null
        if (employyes) setCourseRoundEmployees(employyes)
      }
    }
    posibleTestEmployees()
  }, [showRoundData, roundSelectedIndex, activeSemester])

  return (
    <section
      id="roundInformationOneCol"
      aria-label={
        courseHasRound && showRoundData
          ? `${translation.courseRoundInformation.round_information_aria_label} ${selectedRoundHeader}`
          : null
      }
    >
      {courseHasRound && showRoundData && (
        <h2 id="courseRoundInformationHeader">{translation.courseRoundInformation.header_round}</h2>
      )}
      {/** ************************************************************************************************************ */}
      {/*                                  Round information  - first part                                         */}
      {/** ************************************************************************************************************ */}
      <div id="roundFirstPart">
        <div id="roundKeyInformation" className={` fade-container ${fade === true ? ' fadeOutIn' : ''}`} key="fadeDiv1">
          <>
            {courseHasRound && showRoundData ? (
              //* ---COURSE ROUND HEADER --- *//
              <div className="info-box round-header-info-box">
                <h3 id="roundHeader">{roundHeader}</h3>
                <p id="selectedRoundHeader">{selectedRoundHeader}</p>
              </div>
            ) : (
              //* ---SELECT A ROUND BOX --- *//
              <div className="info-box yellow">
                <h3>{translation.courseLabels.header_no_round_selected}</h3>
                <p>{translation.courseLabels.no_round_selected}</p>
              </div>
            )}
          </>

          {/* ---COURSE ROUND INFORMATION--- */}
          {courseHasRound && showRoundData && (
            <div className="info-box">
              <h3>{translation.courseRoundInformation.round_target_group}</h3>
              <span dangerouslySetInnerHTML={{ __html: round.round_target_group }} />

              <h3>{translation.courseRoundInformation.round_part_of_programme}</h3>
              <span dangerouslySetInnerHTML={{ __html: round.round_part_of_programme }} />

              <h3>{translation.courseRoundInformation.round_periods}</h3>
              <span dangerouslySetInnerHTML={{ __html: round.round_periods }} />

              <h3>{translation.courseRoundInformation.round_start_date}</h3>
              <div>
                <div>{round ? round.round_start_date : missingInfoLabel}</div>
                <div>{round ? round.round_end_date : missingInfoLabel}</div>
              </div>

              <h3>{translation.courseRoundInformation.round_pace_of_study}</h3>
              <p>{round ? ` ${round.round_study_pace}%` : missingInfoLabel}</p>

              <h3>{translation.courseRoundInformation.round_tutoring_form}</h3>
              <p>
                {`${round ? translation.courseRoundInformation.round_tutoring_form_label[round.round_tutoring_form] : missingInfoLabel} ${
                  round
                    ? translation.courseRoundInformation.round_tutoring_time_label[round.round_tutoring_time]
                    : missingInfoLabel
                }`}
              </p>

              <h3>{translation.courseRoundInformation.round_tutoring_language}</h3>
              <p>{round ? round.round_tutoring_language : missingInfoLabel}</p>
              <h3>{translation.courseRoundInformation.round_course_place}</h3>
              <p>{round ? round.round_course_place : missingInfoLabel}</p>
              <h3>
                {translation.courseRoundInformation.round_max_seats}
                {round && round.round_seats && (
                  <InfoModal
                    parentTag="h3"
                    closeLabel={translation.courseLabels.label_close}
                    infoText={`<p>${translation.courseLabels.round_seats_default_info} ${
                      round.round_selection_criteria !== '<p></p>' && round.round_selection_criteria !== ''
                        ? `${translation.courseLabels.round_seats_info}</p>${round.round_selection_criteria}`
                        : '</p>'
                    }`}
                    title={translation.courseRoundInformation.round_max_seats}
                    type="html"
                  />
                )}
              </h3>
              {round && <p> {round.round_seats || translation.courseRoundInformation.round_no_seats_limit} </p>}

              <h3>{translation.courseRoundInformation.round_time_slots}</h3>
              <span dangerouslySetInnerHTML={{ __html: round.round_time_slots }} />
              <span dangerouslySetInnerHTML={{ __html: round.round_comment }} />
              <CourseFileLinks
                courseHasRound={courseHasRound}
                courseCode={course.course_code}
                scheduleUrl={round ? round.round_schedule : missingInfoLabel}
                courseRound={round}
                memoStorageURI={memoStorageURI}
              />
            </div>
          )}
        </div>
      </div>

      {/** ************************************************************************************************************ */}
      {/*                                     Round - application information                                           */}
      {/** ************************************************************************************************************ */}
      <div id="roundApply">
        <RoundApplicationInfo
          roundHeader={roundHeader}
          selectedRoundHeader={selectedRoundHeader}
          round={round}
          courseHasRound={courseHasRound}
          showRoundData={showRoundData}
          fundingType={round.round_funding_type}
        />
      </div>

      {/** ************************************************************************************************************ */}
      {/*                                     Round - contact information                                               */}
      {/** ************************************************************************************************************ */}
      {courseHasRound && showRoundData && (
        <div id="roundContact">
          <h2>{translation.courseLabels.header_contact}</h2>

          <div className="info-box">
            <span>
              <h3>{roundHeader}</h3>
              <p>{selectedRoundHeader}</p>
            </span>

            {course.course_contact_name !== missingInfoLabel && (
              <span>
                <h3>{translation.courseInformation.course_contact_name}</h3>
                <p>{course.course_contact_name}</p>
              </span>
            )}

            <h3>{translation.courseInformation.course_examiners}</h3>
            <span dangerouslySetInnerHTML={{ __html: courseRoundEmployees.examiners || missingInfoLabel }} />

            <h3>{translation.courseRoundInformation.round_responsibles}</h3>
            <span
              dangerouslySetInnerHTML={{
                __html: courseRoundEmployees.responsibles || missingInfoLabel,
              }}
            />

            <h3>{translation.courseRoundInformation.round_teacher}</h3>
            <span dangerouslySetInnerHTML={{ __html: courseRoundEmployees.teachers || missingInfoLabel }} />
          </div>
        </div>
      )}
    </section>
  )
}

export default RoundInformationOneCol
