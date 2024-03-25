import React from 'react'
import { Alert } from 'reactstrap'
import { useLanguage } from '../hooks/useLanguage'

const BankIdAlert = ({ tutoringForm, fundingType, roundSpecified }) => {
  const { isLanguageEnglish, translation } = useLanguage()
  const distanceCourse = tutoringForm === 'DST'

  const standaloneCourse = fundingType === 'LL'

  // Svenska sidan + fristående kurser som ges på distans
  const case1 = !isLanguageEnglish && distanceCourse && standaloneCourse && roundSpecified

  // Engelska sidan + fristående kurser
  const case2 = isLanguageEnglish && standaloneCourse && roundSpecified

  const showAlert = case1 || case2

  return (
    showAlert && (
      <section className="bankIdAlert">
        <Alert color="info">
          <p dangerouslySetInnerHTML={{ __html: translation.bankIdAlertText }}></p>
        </Alert>
      </section>
    )
  )
}

export default BankIdAlert
