import React from 'react'
import { render, screen } from '@testing-library/react'

import SideMenu from '../SideMenu'

import i18n from '../../../../../i18n'
import '@testing-library/jest-dom'
import { WebContextProvider } from '../../context/WebContext'

const [translationEN, translationSV] = i18n.messages

describe('Component <SideMenu>', () => {
  test('renders a side menu for a course and with labels. English', () => {
    render(
      <WebContextProvider configIn={{ lang: 'en' }}>
        <SideMenu courseCode={'KIP1111'} labels={translationEN.courseLabels.sideMenu} />
      </WebContextProvider>
    )

    const links = screen.getAllByRole('link')
    expect(links.length).toBe(5)

    expect(links[0].href).toBe('http://localhost/student/kurser/kurser-inom-program?l=en')
    expect(links[0].title).toBe('Course and programme directory')

    expect(links[1].href).toBe('http://localhost/student/kurser/kurs/KIP1111?l=en')
    expect(links[1].title).toBe('Before course selection')

    expect(links[2].href).toBe('http://localhost/kurs-pm/KIP1111?l=en')
    expect(links[2].title).toBe('Prepare and take course')

    expect(links[3].href).toBe('http://localhost/kursutveckling/KIP1111?l=en')
    expect(links[3].title).toBe('Course development')

    expect(links[4].href).toBe('http://localhost/kursutveckling/KIP1111/arkiv?l=en')
    expect(links[4].title).toBe('Archive')

    expect(screen.getByText('About course KIP1111')).toBeInTheDocument()
  })

  test('renders a side menu for a course and with labels. Swedish', () => {
    render(
      <WebContextProvider configIn={{ lang: 'sv' }}>
        <SideMenu courseCode={'KIP1111'} labels={translationSV.courseLabels.sideMenu} />
      </WebContextProvider>
    )

    const links = screen.getAllByRole('link')
    expect(links.length).toBe(5)

    expect(links[0].href).toBe('http://localhost/student/kurser/kurser-inom-program')
    expect(links[0].title).toBe('Kurs- och programkatalogen')

    expect(links[1].href).toBe('http://localhost/student/kurser/kurs/KIP1111')
    expect(links[1].title).toBe('Inför kursval')

    expect(links[2].href).toBe('http://localhost/kurs-pm/KIP1111')
    expect(links[2].title).toBe('Förbereda och gå kurs')

    expect(links[3].href).toBe('http://localhost/kursutveckling/KIP1111?l=sv')
    expect(links[3].title).toBe('Kursens utveckling')

    expect(links[4].href).toBe('http://localhost/kursutveckling/KIP1111/arkiv?l=sv')
    expect(links[4].title).toBe('Arkiv')

    expect(screen.getByText('Om kursen KIP1111')).toBeInTheDocument()
  })
})
