import React from 'react'
import Alert from '../components-shared/Alert'
import { useLanguage } from '../hooks/useLanguage'

const BankIdAlert = ({ tutoringForm, fundingType }) => {
  const { isEnglish, translation } = useLanguage()
  const distanceCourse = tutoringForm === 'DST'

  const standaloneCourse = fundingType === 'LL'

  // Svenska sidan + fristående kurser som ges på distans
  const case1 = !isEnglish && distanceCourse && standaloneCourse

  // Engelska sidan + fristående kurser
  const case2 = isEnglish && standaloneCourse

  const showAlert = case1 || case2

  return (
    showAlert && (
      <Alert type="info">
        <p dangerouslySetInnerHTML={{ __html: translation.bankIdAlertText }}></p>
      </Alert>
    )
  )
}

export default BankIdAlert
