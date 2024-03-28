/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { WebContextProvider } from '../../context/WebContext'

import BankIdAlert from '../BankIdAlert'

const contextEn = { browserConfig: {}, lang: 'en' }
const contextSv = { ...contextEn, lang: 'sv' }

describe('Comoponent <BankIdAlert>', () => {
  test('renders a BankIdAlert in english with appropriate inputs', () => {
    const propsWithRoundSelected = {
      tutoringForm: 'DST',
      fundingType: 'LL',
      roundSpecified: true,
    }
    render(
      <WebContextProvider configIn={contextEn}>
        <BankIdAlert {...propsWithRoundSelected} />
      </WebContextProvider>
    )

    const expectedAlert = screen.getByText(
      new RegExp(
        `You could meet obstacles if you're required to pay fees or if you do not have a Swedish Mobile BankID.`,
        'i'
      )
    )
    expect(expectedAlert).toBeInTheDocument()

    const link = screen.getByRole('link', {
      name: 'Students not located in Sweden may have problems attending a course at KTH.',
    })
    expect(link).toBeInTheDocument()
  })

  test('renders BankIdAlert in swedish with appropriate inputs', () => {
    const propsWithRoundSelected = {
      tutoringForm: 'DST',
      fundingType: 'LL',
      roundSpecified: true,
    }
    render(
      <WebContextProvider configIn={contextSv}>
        <BankIdAlert {...propsWithRoundSelected} />
      </WebContextProvider>
    )

    const expectedAlert = screen.getByText(
      `Du behöver ett KTH-konto för att läsa en kurs på KTH, kontot aktiveras med Mobilt BankID eller genom att besöka KTH:s campus. Det enda sättet att starta en kurs utan att besöka campus, är om du har Mobilt BankID.`
    )
    expect(expectedAlert).toBeInTheDocument()
  })

  test('does not render BankIdAlert for a Swedish non-distance course', () => {
    const propsWithRoundSelected = {
      tutoringForm: 'NML',
      fundingType: 'LL',
      roundSpecified: true,
    }
    render(
      <WebContextProvider configIn={contextSv}>
        <BankIdAlert {...propsWithRoundSelected} />
      </WebContextProvider>
    )

    const expectedAlert = screen.queryByText(
      `Du behöver ett KTH-konto för att läsa en kurs på KTH, kontot aktiveras med Mobilt BankID eller genom att besöka KTH:s campus. Det enda sättet att starta en kurs utan att besöka campus, är om du har Mobilt BankID.`
    )
    expect(expectedAlert).not.toBeInTheDocument()
  })

  test('does not render BankIdAlert without roundSpecified', () => {
    const propsWithoutRoundSelected = {
      tutoringForm: 'NML',
      fundingType: 'LL',
      roundSpecified: false,
    }
    render(
      <WebContextProvider configIn={contextSv}>
        <BankIdAlert {...propsWithoutRoundSelected} />
      </WebContextProvider>
    )

    const expectedAlert = screen.queryByText(
      `Du behöver ett KTH-konto för att läsa en kurs på KTH, kontot aktiveras med Mobilt BankID eller genom att besöka KTH:s campus. Det enda sättet att starta en kurs utan att besöka campus, är om du har Mobilt BankID.`
    )
    expect(expectedAlert).not.toBeInTheDocument()
  })

  test('does not render BankIdAlert with non LL fundingType', () => {
    const propsWithWrongFundingType = {
      tutoringForm: 'DST',
      fundingType: 'VV',
      roundSpecified: true,
    }
    render(
      <WebContextProvider configIn={contextSv}>
        <BankIdAlert {...propsWithWrongFundingType} />
      </WebContextProvider>
    )

    const expectedAlert = screen.queryByText(
      `Du behöver ett KTH-konto för att läsa en kurs på KTH, kontot aktiveras med Mobilt BankID eller genom att besöka KTH:s campus. Det enda sättet att starta en kurs utan att besöka campus, är om du har Mobilt BankID.`
    )
    expect(expectedAlert).not.toBeInTheDocument()
  })
})
