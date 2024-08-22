/* eslint-disable testing-library/no-node-access */
import React from 'react'

import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import CourseSections from '../CourseSection'
import i18n from '../../../../../i18n'

const [translationEN] = i18n.messages

describe('Component <CourseSections>', () => {
  test('render text with a syllabus marker correctly', () => {
    const mockData = [{ header: 'First test header', text: 'Text for test from test syllabus', syllabusMarker: true }]
    render(
      <CourseSections
        sectionHeader={'Section with all test headers and texts'}
        headerType="3"
        courseData={mockData}
        sectionId="firstSection"
        syllabusMarkerAriaLabel={translationEN.courseLabels.syllabus_marker_aria_label}
      />
    )

    const header = screen.getByText(mockData[0].header)
    expect(header).toBeInTheDocument()
    expect(header.querySelector('sup')).toBeInTheDocument()
    expect(header.querySelector('sup').querySelector('svg')).toBeInTheDocument()

    const syllabusText = screen.getByText(mockData[0].text)
    expect(syllabusText).toBeInTheDocument()
  })

  test('render text without a syllabus marker correctly', () => {
    const mockData = [{ header: 'Test header chosen by user', text: 'Text for test not from syllabys' }]
    render(
      <CourseSections
        sectionHeader={'Section with all test headers and texts'}
        headerType="3"
        courseData={mockData}
        sectionId="freeSection"
        syllabusMarkerAriaLabel={translationEN.courseLabels.syllabus_marker_aria_label}
      />
    )
    const header = screen.getByText(mockData[0].header)
    expect(header).toBeInTheDocument()
    const syllabusText = screen.getByText(mockData[0].text)
    expect(syllabusText).toBeInTheDocument()

    expect(header.querySelector('sup')).toBeNull()
  })

  test('render array of several headers with text correctly', () => {
    const mockData = [
      { header: 'First test header', text: 'Text for test from test syllabus', syllabusMarker: true },
      { header: 'Second test header', text: 'Text for test not from syllabys' },
    ]
    render(
      <CourseSections
        sectionHeader={'Section with all test headers and texts'}
        headerType="3"
        courseData={mockData}
        sectionId="firstSection"
        syllabusMarkerAriaLabel={translationEN.courseLabels.syllabus_marker_aria_label}
      />
    )

    const text1 = screen.getByText(mockData[0].header)
    expect(text1).toBeInTheDocument()
    const syllabusText1 = screen.getByText(mockData[0].text)
    expect(syllabusText1).toBeInTheDocument()

    const text2 = screen.getByText(mockData[1].header)
    expect(text2).toBeInTheDocument()
    const syllabusText2 = screen.getByText(mockData[1].text)
    expect(syllabusText2).toBeInTheDocument()
  })
})
