import React from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { useMissingInfo } from '../hooks/useMissingInfo'

// TODO(karl): Förenkla denna. Är väl bara concat av några strängar, behöver det vara en component? Kan vara en liten util
// men kanske viktigare: kolla om gör vi samma sak för label i dropdownen?
export const SingleRoundLabel = ({ round }) => {
  const { translation } = useLanguage()
  const { isMissingInfoLabel } = useMissingInfo()

  return (
    <p>
      {`${translation.courseInformation.course_short_semester[round.round_course_term[1]]}
${round.round_course_term[0]}  
${!isMissingInfoLabel(round.round_short_name) ? round.round_short_name : ''}     
${
  round.round_funding_type === 'UPP' || round.round_funding_type === 'PER'
    ? translation.courseRoundInformation.round_type[round.round_funding_type]
    : translation.courseRoundInformation.round_category[round.round_category]
}
`}
    </p>
  )
}
