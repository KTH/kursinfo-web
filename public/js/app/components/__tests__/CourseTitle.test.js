import React from 'react'

import CourseTitle from '../CourseTitle'

import i18n from '../../../../../i18n'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

const { getByText, queryByText, getByRole } = screen
const translationEN = i18n.messages[0]
const translationSV = i18n.messages[1]

describe('Component <CourseTitle>', () => {
  test('renders a course title', () => {
    render(<CourseTitle />)
  })

  test('renders a course title with data and use correct credit unit in English', (done) => {
    const courseTitleData = {
      course_code: 'KIP1111',
      course_title: 'Project in Plasma Physics',
      course_credits: '9',
      course_credits_text: 'hp'
    }
    render(
      <CourseTitle
        key="title"
        courseTitleData={courseTitleData}
        language={'en'}
        pageTitle={translationEN.courseLabels.sideMenu.page_before_course}
      />
    )

    const pageTitle = queryByText('Before course selection')
    expect(pageTitle).toBeInTheDocument()

    const courseTitle = queryByText('KIP1111 Project in Plasma Physics 9.0 credits')
    expect(courseTitle).toBeInTheDocument()

    const adminLink = getByRole('link')
    expect(adminLink).toBeInTheDocument()
    expect(adminLink.href).toBe('http://localhost/kursinfoadmin/kurser/kurs/KIP1111?l=en')

    const adminLinkName = queryByText('Administer About course')
    expect(adminLinkName).toBeInTheDocument()

    done()
  })

  test('renders a course title with data and use correct credit unit in Swedish', (done) => {
    const courseTitleData = {
      course_code: 'KIP1111',
      course_title: 'Projekt i plasmafysik',
      course_credits: '9',
      course_credits_text: 'hp'
    }
    render(
      <CourseTitle
        key="title"
        courseTitleData={courseTitleData}
        language={'sv'}
        pageTitle={translationSV.courseLabels.sideMenu.page_before_course}
      />
    )

    const pageTitle = queryByText('Inför kursval')
    expect(pageTitle).toBeInTheDocument()

    const courseTitle = queryByText('KIP1111 Projekt i plasmafysik 9,0 hp')
    expect(courseTitle).toBeInTheDocument()

    const adminLink = getByRole('link')
    expect(adminLink).toBeInTheDocument()
    expect(adminLink.href).toBe('http://localhost/kursinfoadmin/kurser/kurs/KIP1111?l=sv')

    const adminLinkName = queryByText('Administrera Om kursen')
    expect(adminLinkName).toBeInTheDocument()
    done()
  })
})
