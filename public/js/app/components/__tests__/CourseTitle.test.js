import React from 'react'
import { render, screen } from '@testing-library/react'

import CourseTitle from '../CourseTitle'

import i18n from '../../../../../i18n'
import '@testing-library/jest-dom'

jest.mock('../../context/WebContext')
import { useWebContext } from '../../context/WebContext'

const [translationEN, translationSV] = i18n.messages

describe('Component <CourseTitle>', () => {
  test('renders a course title with data and use correct credit unit in English', () => {
    useWebContext.mockReturnValue([{ lang: 'en' }])

    const courseTitleData = {
      course_code: 'KIP1111',
      course_title: 'Project in Plasma Physics',
      course_credits: '9',
      course_credits_text: 'hp',
    }
    render(
      <CourseTitle
        key="title"
        courseTitleData={courseTitleData}
        pageTitle={translationEN.courseLabels.sideMenu.page_before_course}
      />
    )

    const pageTitle = screen.queryByText('Before course selection')
    expect(pageTitle).toBeInTheDocument()

    const courseTitle = screen.queryByText('KIP1111 Project in Plasma Physics 9.0 credits')
    expect(courseTitle).toBeInTheDocument()

    const adminLink = screen.getByRole('link')
    expect(adminLink).toBeInTheDocument()
    expect(adminLink.href).toBe('http://localhost/kursinfoadmin/kurser/kurs/KIP1111?l=en')

    const adminLinkName = screen.queryByText('Administer About course')
    expect(adminLinkName).toBeInTheDocument()
  })

  test('renders a course title with data and use correct credit unit in Swedish', () => {
    useWebContext.mockReturnValue([{ lang: 'sv' }])

    const courseTitleData = {
      course_code: 'KIP1111',
      course_title: 'Projekt i plasmafysik',
      course_credits: '9',
      course_credits_text: 'hp',
    }
    render(
      <CourseTitle
        key="title"
        courseTitleData={courseTitleData}
        pageTitle={translationSV.courseLabels.sideMenu.page_before_course}
      />
    )

    const pageTitle = screen.queryByText('Inför kursval')
    expect(pageTitle).toBeInTheDocument()

    const courseTitle = screen.queryByText('KIP1111 Projekt i plasmafysik 9,0 hp')
    expect(courseTitle).toBeInTheDocument()

    const adminLink = screen.getByRole('link')
    expect(adminLink).toBeInTheDocument()
    expect(adminLink.href).toBe('http://localhost/kursinfoadmin/kurser/kurs/KIP1111?l=sv')

    const adminLinkName = screen.queryByText('Administrera Om kursen')
    expect(adminLinkName).toBeInTheDocument()
  })
})
