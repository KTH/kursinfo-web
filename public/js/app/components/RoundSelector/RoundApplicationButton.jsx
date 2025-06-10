import React from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { useMissingInfo } from '../../hooks/useMissingInfo'
import { useWebContext } from '../../context/WebContext'

export const ongoingRegistrationPeriod = (startDate, periods) => {
  const registrationDates = { HT: '03-15', VT: '09-15', ST: '02-15' }

  const matchedPeriod = periods.find(
    period =>
      startDate >= period.Giltighetsperiod.Startdatum &&
      startDate <= period.Giltighetsperiod.Slutdatum &&
      ['HT', 'VT'].includes(period.Kod.slice(0, 2))
  )

  const code = matchedPeriod?.Kod
  const semester = code?.slice(0, 2)
  const year = code?.slice(2, 6)

  let dateString

  if (!semester || !year) {
    // Default to summer semester
    const summerPeriod = periods.find(
      period =>
        startDate >= period.Giltighetsperiod.Startdatum &&
        startDate <= period.Giltighetsperiod.Slutdatum &&
        period.Kod.startsWith('ST')
    )
    const summerYear = summerPeriod?.Kod?.slice(2, 6) || new Date(startDate).getFullYear()
    dateString = `${summerYear}-${registrationDates.ST}`
  } else {
    dateString = `${year}-${registrationDates[semester]}`
  }

  // Check if date falls on a weekend
  const date = new Date(dateString)
  const day = date.getDay()

  if (day === 6) {
    date.setDate(date.getDate() + 2)
  } else if (day === 0) {
    date.setDate(date.getDate() + 1)
  }
  const [firstRegistrationDate] = date.toISOString().split('T')

  const currentDate = new Date()
  const [formattedCurrentDate] = currentDate.toISOString().split('T')

  return formattedCurrentDate >= firstRegistrationDate && formattedCurrentDate < startDate
}

const RoundApplicationButton = ({ courseRound, showRoundData }) => {
  const {
    translation: { courseRoundInformation },
  } = useLanguage()
  const { isMissingInfoLabel } = useMissingInfo()
  const context = useWebContext()
  const { periods } = context

  const registrationOngoing = ongoingRegistrationPeriod(courseRound.round_start_date, periods.data.Period)
  // console.log(`COURSE ROUND: ${JSON.stringify(courseRound, null, 4)}`)

  const fundingType = courseRound.round_funding_type
  const showApplicationLink =
    showRoundData &&
    fundingType === 'LL' &&
    courseRound &&
    !isMissingInfoLabel(courseRound.round_application_link) &&
    registrationOngoing

  return !showApplicationLink ? null : (
    <a className="kth-button next" href={courseRound.round_application_link}>
      {courseRoundInformation.round_application_link}
    </a>
  )
}

export { RoundApplicationButton }
