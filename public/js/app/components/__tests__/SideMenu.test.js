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
    expect(links[0]).toHaveTextContent('Course and programme directory')

    expect(links[1].href).toBe('http://localhost/student/kurser/kurs/KIP1111?l=en')
    expect(links[1]).toHaveTextContent('Before course selection')

    expect(links[2].href).toBe('http://localhost/kurs-pm/KIP1111?l=en')
    expect(links[2]).toHaveTextContent('Prepare and take course')

    expect(links[3].href).toBe('http://localhost/kursutveckling/KIP1111?l=en')
    expect(links[3]).toHaveTextContent('Course development')

    expect(links[4].href).toBe('http://localhost/kursutveckling/KIP1111/arkiv?l=en')
    expect(links[4]).toHaveTextContent('Archive')

    const navs = screen.getAllByRole('navigation')
    expect(navs.length).toBe(2)
    expect(navs[0]).toHaveAccessibleName('About course KIP1111')
    expect(navs[1]).toHaveAccessibleName('About course KIP1111')
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
    expect(links[0]).toHaveTextContent('Kurs- och programkatalogen')

    expect(links[1].href).toBe('http://localhost/student/kurser/kurs/KIP1111')
    expect(links[1]).toHaveTextContent('Inför kursval')

    expect(links[2].href).toBe('http://localhost/kurs-pm/KIP1111')
    expect(links[2]).toHaveTextContent('Förbereda och gå kurs')

    expect(links[3].href).toBe('http://localhost/kursutveckling/KIP1111?l=sv')
    expect(links[3]).toHaveTextContent('Kursens utveckling')

    expect(links[4].href).toBe('http://localhost/kursutveckling/KIP1111/arkiv?l=sv')
    expect(links[4]).toHaveTextContent('Arkiv')

    const navs = screen.getAllByRole('navigation')
    expect(navs.length).toBe(2)
    expect(navs[0]).toHaveAccessibleName('Om kursen KIP1111')
    expect(navs[1]).toHaveAccessibleName('Om kursen KIP1111')
  })
})
