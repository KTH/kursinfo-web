/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { WebContextProvider } from '../../context/WebContext'
import i18n from '../../../../../i18n'

import BankIdAlert from '../BankIdAlert'

const context = { browserConfig: {} }
const TRANSLATION_ENGLISH_INDEX = 0
const TRANSLATION_SWEDISH_INDEX = 1

describe('Comoponent <BankIdAlert>', () => {
  test('renders a BankIdAlert in english with appropriate inputs', () => {
    const translation = i18n.messages[TRANSLATION_ENGLISH_INDEX]

    const propsWithRoundSelected = {
      tutoringForm: 'DST',
      fundingType: 'LL',
      contextLang: 'en',
      roundSpecified: true,
      translation: translation,
    }
    render(
      <WebContextProvider configIn={context}>
        <BankIdAlert {...propsWithRoundSelected} />
      </WebContextProvider>
    )

    const alert = screen.getByText(
      new RegExp(
        `You could meet obstacles if you're required to pay fees or if you do not have a Swedish Mobile BankID.`,
        'i'
      )
    )
    expect(alert).toBeInTheDocument()

    const link = screen.getByRole('link', {
      name: 'Students not located in Sweden may have problems attending a course at KTH.',
    })
    expect(link).toBeInTheDocument()
  })

  test('renders BankIdAlert in swedish with appropriate inputs', () => {
    const translation = i18n.messages[TRANSLATION_SWEDISH_INDEX]

    const propsWithRoundSelected = {
      tutoringForm: 'DST',
      fundingType: 'LL',
      contextLang: 'sv',
      roundSpecified: true,
      translation: translation,
    }
    render(
      <WebContextProvider configIn={context}>
        <BankIdAlert {...propsWithRoundSelected} />
      </WebContextProvider>
    )

    const alert = screen.getByText(
      `Du behöver ett KTH-konto för att läsa en fristående kurs, som aktiveras med Mobilt BankID eller genom att besöka KTH:s campus. Det enda sättet att starta en kurs utan att besöka campus, är om du har Mobilt BankID.`
    )
    expect(alert).toBeInTheDocument()
  })

  test('does not render BankIdAlert for a Swedish non-distance course', () => {
    const translation = i18n.messages[TRANSLATION_SWEDISH_INDEX]

    const propsWithRoundSelected = {
      tutoringForm: 'NML',
      fundingType: 'LL',
      contextLang: 'sv',
      roundSpecified: true,
      translation: translation,
    }
    render(
      <WebContextProvider configIn={context}>
        <BankIdAlert {...propsWithRoundSelected} />
      </WebContextProvider>
    )

    const alert = screen.queryByText(
      `Du behöver ett KTH-konto för att läsa en fristående kurs, som aktiveras med Mobilt BankID eller genom att besöka KTH:s campus. Det enda sättet att starta en kurs utan att besöka campus, är om du har Mobilt BankID.`
    )
    expect(alert).not.toBeInTheDocument()
  })

  test('does not render BankIdAlert without roundSpecified', () => {
    const translation = i18n.messages[TRANSLATION_SWEDISH_INDEX]

    const propsWithoutRoundSelected = {
      tutoringForm: 'NML',
      fundingType: 'LL',
      contextLang: 'sv',
      roundSpecified: false,
      translation: translation,
    }
    render(
      <WebContextProvider configIn={context}>
        <BankIdAlert {...propsWithoutRoundSelected} />
      </WebContextProvider>
    )

    const alert = screen.queryByText(
      `Du behöver ett KTH-konto för att läsa en fristående kurs, som aktiveras med Mobilt BankID eller genom att besöka KTH:s campus. Det enda sättet att starta en kurs utan att besöka campus, är om du har Mobilt BankID.`
    )
    expect(alert).not.toBeInTheDocument()
  })

  test('does not render BankIdAlert with non LL fundingType', () => {
    const translation = i18n.messages[TRANSLATION_SWEDISH_INDEX]

    const propsWithWrongFundingType = {
      tutoringForm: 'DST',
      fundingType: 'VV',
      contextLang: 'sv',
      roundSpecified: true,
      translation: translation,
    }
    render(
      <WebContextProvider configIn={context}>
        <BankIdAlert {...propsWithWrongFundingType} />
      </WebContextProvider>
    )

    const alert = screen.queryByText(
      `Du behöver ett KTH-konto för att läsa en fristående kurs, som aktiveras med Mobilt BankID eller genom att besöka KTH:s campus. Det enda sättet att starta en kurs utan att besöka campus, är om du har Mobilt BankID.`
    )
    expect(alert).not.toBeInTheDocument()
  })
  test('does not render BankIdAlert without contextLang', () => {
    const translation = i18n.messages[TRANSLATION_SWEDISH_INDEX]

    const propsWithoutUserLang = {
      tutoringForm: 'DST',
      fundingType: 'LL',
      contextLang: undefined,
      roundSpecified: true,
      translation: translation,
    }

    render(
      <WebContextProvider configIn={context}>
        <BankIdAlert {...propsWithoutUserLang} />
      </WebContextProvider>
    )

    const alert = screen.queryByText(
      `Du behöver ett KTH-konto för att läsa en fristående kurs, som aktiveras med Mobilt BankID eller genom att besöka KTH:s campus. Det enda sättet att starta en kurs utan att besöka campus, är om du har Mobilt BankID.`
    )
    expect(alert).not.toBeInTheDocument()
  })
})
