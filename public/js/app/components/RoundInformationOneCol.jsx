/* eslint-disable react/no-danger */
import React from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { useMissingInfo } from '../hooks/useMissingInfo'
import { useRoundUtils } from '../hooks/useRoundUtils'
import { usePlannedModules } from '../hooks/usePlannedModules'
import { useCourseEmployees } from '../hooks/useCourseEmployees'
import CourseFileLinks from './CourseFileLinks'
import InfoModal from './InfoModal'
import RoundApplicationInfo from './RoundApplicationInfo'

function RoundInformationOneCol({
  memoStorageURI,
  semesterRoundState,
  courseRound = { round_course_term: [] },
  courseData: course,
  courseCode,
}) {
  const { showRoundData, selectedSemester } = semesterRoundState
  const { translation } = useLanguage()
  const { missingInfoLabel } = useMissingInfo()
  const { createRoundHeader } = useRoundUtils()

  const roundHeader = translation.courseRoundInformation.round_header

  const selectedRoundHeader = createRoundHeader(courseRound)

  const { courseRoundEmployees } = useCourseEmployees({
    courseCode,
    selectedSemester,
    applicationCode: courseRound?.round_application_code,
  })

  const { plannedModules } = usePlannedModules({
    courseCode,
    semester: selectedSemester,
    applicationCode: courseRound.round_application_code,
    showRoundData,
  })

  return (
    <section
      id="roundInformationOneCol"
      aria-label={
        showRoundData
          ? `${translation.courseRoundInformation.round_information_aria_label} ${selectedRoundHeader}`
          : null
      }
    >
      {showRoundData && <h2 id="courseRoundInformationHeader">{translation.courseRoundInformation.header_round}</h2>}
      {/** ************************************************************************************************************ */}
      {/*                                  Round information  - first part                                         */}
      {/** ************************************************************************************************************ */}
      <div id="roundFirstPart">
        <div id="roundKeyInformation">
          <>
            {showRoundData ? (
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
          {showRoundData && (
            <div className="info-box">
              <h3>{translation.courseRoundInformation.round_target_group}</h3>
              <span dangerouslySetInnerHTML={{ __html: courseRound.round_target_group }} />

              <h3>{translation.courseRoundInformation.round_part_of_programme}</h3>
              <span dangerouslySetInnerHTML={{ __html: courseRound.round_part_of_programme }} />

              <h3>{translation.courseRoundInformation.round_periods}</h3>
              <span dangerouslySetInnerHTML={{ __html: courseRound.round_periods }} />

              <h3>{translation.courseRoundInformation.round_start_date}</h3>
              <div>
                <div>{courseRound ? courseRound.round_start_date : missingInfoLabel}</div>
                <div>{courseRound ? courseRound.round_end_date : missingInfoLabel}</div>
              </div>

              <h3>{translation.courseRoundInformation.round_pace_of_study}</h3>
              <p>{courseRound ? ` ${courseRound.round_study_pace}%` : missingInfoLabel}</p>

              <h3>{translation.courseRoundInformation.round_tutoring_form}</h3>
              <p>
                {`${courseRound ? translation.courseRoundInformation.round_tutoring_form_label[courseRound.round_tutoring_form] : missingInfoLabel} ${
                  courseRound
                    ? translation.courseRoundInformation.round_tutoring_time_label[courseRound.round_tutoring_time]
                    : missingInfoLabel
                }`}
              </p>

              <h3>{translation.courseRoundInformation.round_tutoring_language}</h3>
              <p>{courseRound ? courseRound.round_tutoring_language : missingInfoLabel}</p>
              <h3>{translation.courseRoundInformation.round_course_place}</h3>
              <p>{courseRound ? courseRound.round_course_place : missingInfoLabel}</p>
              <h3>
                {translation.courseRoundInformation.round_max_seats}
                {courseRound && courseRound.round_seats && (
                  <InfoModal
                    closeLabel={translation.courseLabels.label_close}
                    infoText={`<p>${translation.courseLabels.round_seats_default_info} ${
                      courseRound.round_selection_criteria !== '<p></p>' && courseRound.round_selection_criteria !== ''
                        ? `${translation.courseLabels.round_seats_info}</p>${courseRound.round_selection_criteria}`
                        : '</p>'
                    }`}
                    title={translation.courseRoundInformation.round_max_seats}
                    type="html"
                  />
                )}
              </h3>
              {courseRound && (
                <p> {courseRound.round_seats || translation.courseRoundInformation.round_no_seats_limit} </p>
              )}

              <h3>{translation.courseRoundInformation.round_time_slots}</h3>
              <span dangerouslySetInnerHTML={{ __html: plannedModules }} />
              <CourseFileLinks
                courseCode={course.course_code}
                scheduleUrl={courseRound ? courseRound.round_schedule : missingInfoLabel}
                courseRound={courseRound}
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
          round={courseRound}
          showRoundData={showRoundData}
          fundingType={courseRound.round_funding_type}
        />
      </div>

      {/** ************************************************************************************************************ */}
      {/*                                     Round - contact information                                               */}
      {/** ************************************************************************************************************ */}
      {showRoundData && (
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
