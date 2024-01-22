import React from 'react'
import { Alert } from 'reactstrap'

const BankIdAlert = ({ tutoringForm, fundingType, contextLang, roundSpecified, translation }) => {
  const distanceCourse = tutoringForm === 'DST'

  const standaloneCourse = fundingType === 'LL'

  // Svenska sidan + fristående kurser som ges på distans
  const case1 = contextLang === 'sv' && distanceCourse && standaloneCourse && roundSpecified

  // Engelska sidan + fristående kurser
  const case2 = contextLang === 'en' && standaloneCourse && roundSpecified

  return (
    case1 ||
    (case2 && (
      <section className="bankIdAlert">
        <Alert color="info">
          <p dangerouslySetInnerHTML={{ __html: translation.bankIdAlertText }}></p>
        </Alert>
      </section>
    ))
  )
}

export default BankIdAlert
