import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { SyllabusInformation } from '../SyllabusInformation'
import { WebContextProvider } from '../../context/WebContext'

describe('Component <SyllabusInformation>', () => {
  test.each(['AF1745 (Spring 2023–)', 'SH2020 (Autumn 2022-Spring 2024'])(
    `renders syllabus information if SyllabusName "%s" is given`,
    syllabusName => {
      render(
        <WebContextProvider configIn={{ lang: 'en' }}>
          <SyllabusInformation syllabusName={syllabusName} />
        </WebContextProvider>
      )

      expect(
        screen.getByText(
          `Headings with content from the Course syllabus ${syllabusName} are denoted with an asterisk ( )`
        )
      ).toBeInTheDocument()
    }
  )

  test('does not render syllabus information if no syllabusName is given', () => {
    render(
      <WebContextProvider configIn={{ lang: 'en' }}>
        <SyllabusInformation syllabusName={''} />
      </WebContextProvider>
    )

    expect(screen.queryByText(`Headings with content from the Course syllabus`)).not.toBeInTheDocument()
  })
})
