import React from 'react'
import { render, screen, within } from '@testing-library/react'
import '@testing-library/jest-dom'

import { RoundInformationContacts } from '../RoundInformation/RoundInformationContacts'
import { useCourseEmployees } from '../../hooks/useCourseEmployees'
import { useLanguage } from '../../hooks/useLanguage'

import translationEn from '../../../../../i18n/messages.en'

jest.mock('../../hooks/useCourseEmployees')
jest.mock('../../hooks/useLanguage')

useLanguage.mockReturnValue({ translation: translationEn, languageIndex: 0 })
useCourseEmployees.mockReturnValue({ courseRoundEmployees: { examiners: '', responsibles: '', teachers: '' } })

// Helpers to get element directly after headings
// eslint-disable-next-line testing-library/no-node-access
const nextSibling = element => element.nextSibling
const withinNextSibling = element => within(nextSibling(element))

describe('Component <RoundInformationContacts>', () => {
  describe('examiners, responsibles and teachers', () => {
    test('shoud show headers with "missing info" text when data is missing', () => {
      render(<RoundInformationContacts courseRoundEmployees={{}} />)
      const examinerLabel = screen.getByText('Examiner')
      expect(nextSibling(examinerLabel)).toHaveTextContent('No information inserted')

      const responsibleLabel = screen.getByText('Course coordinator')
      expect(nextSibling(responsibleLabel)).toHaveTextContent('No information inserted')

      const teacherLabel = screen.getByText('Teachers')
      expect(nextSibling(teacherLabel)).toHaveTextContent('No information inserted')
    })

    test('shoud show headers with data inserted as html', () => {
      render(
        <RoundInformationContacts
          courseRoundEmployees={{
            examiners: '<p class="person"><a href="/profile/testexaminers/">Test examiners</a></p>',
            responsibles: '<p class="person"><a href="/profile/testresponsibles/">Test responsibles</a></p>',
            teachers: '<p class="person"><a href="/profile/testteachers/">Test teachers</a></p>',
          }}
        />
      )
      const examinerLabel = screen.getByText('Examiner')
      const examinerLink = withinNextSibling(examinerLabel).getByRole('link')
      expect(examinerLink).toHaveTextContent('Test examiners')
      expect(examinerLink).toHaveAttribute('href', '/profile/testexaminers/')

      const responsibleLabel = screen.getByText('Course coordinator')
      const responsibleLink = withinNextSibling(responsibleLabel).getByRole('link')
      expect(responsibleLink).toHaveTextContent('Test responsibles')
      expect(responsibleLink).toHaveAttribute('href', '/profile/testresponsibles/')

      const teacherLabel = screen.getByText('Teachers')
      const teacherLink = withinNextSibling(teacherLabel).getByRole('link')
      expect(teacherLink).toHaveTextContent('Test teachers')
      expect(teacherLink).toHaveAttribute('href', '/profile/testteachers/')
    })
  })
})
