jest.mock('../useLanguage')
import { renderHook } from '@testing-library/react'
import { useFormatCredits } from '../useFormatCredits'
import { useLanguage } from '../useLanguage'
import { INFORM_IF_IMPORTANT_INFO_IS_MISSING } from '../../util/constants'

describe('formatCredits', () => {
  beforeEach(() => {
    useLanguage.mockReturnValue({
      isLanguageEnglish: true,
      languageIndex: 0,
    })
  })

  test('returns empty string if credits are not set', () => {
    const { result } = renderHook(() => useFormatCredits())

    expect(result.current.formatCredits(undefined, 'hp')).toStrictEqual('')
  })

  test('if credits contains missing info text, does return empty text', () => {
    const { result } = renderHook(() => useFormatCredits())

    expect(result.current.formatCredits(INFORM_IF_IMPORTANT_INFO_IS_MISSING[0], 'hp')).toStrictEqual('')
  })

  test('if credits contains random string, does return empty text', () => {
    const { result } = renderHook(() => useFormatCredits())

    expect(result.current.formatCredits('someRandomString', 'hp')).toStrictEqual('')
  })

  test('if credits contains string number, does not return empty text', () => {
    const { result } = renderHook(() => useFormatCredits())

    expect(result.current.formatCredits('9', 'hp')).not.toStrictEqual('')
  })

  describe('swedish locale', () => {
    beforeEach(() => {
      useLanguage.mockReturnValue({
        isLanguageEnglish: false,
        languageIndex: 1,
      })
    })
    test.each([
      [7.5, 'hp', '7,5'],
      [8.5, 'hp', '8,5'],
      [8.5, 'someUnit', '8,5'],
      ['8.5', 'someUnit', '8,5'],
    ])(
      'formats credits according to swedish locale and creditUnit',
      (credits, creditUnitAbbr, expectedFormattedCredits) => {
        const { result } = renderHook(() => useFormatCredits())

        expect(result.current.formatCredits(credits, creditUnitAbbr)).toStrictEqual(
          `${expectedFormattedCredits} ${creditUnitAbbr}`
        )
      }
    )

    test.each([
      [7.0, '7,0'],
      [5.0, '5,0'],
      ['5.0', '5,0'],
    ])('formats credits according to swedish locale even with .0', (credits, expectedFormattedCredits) => {
      const { result } = renderHook(() => useFormatCredits())

      expect(result.current.formatCredits(credits, 'hp')).toStrictEqual(`${expectedFormattedCredits} hp`)
    })
  })

  describe('english locale', () => {
    test.each([7.5, 8.5, 9.5, '9.5'])('formats credits according to english locale', credits => {
      const { result } = renderHook(() => useFormatCredits())

      expect(result.current.formatCredits(credits, 'hp')).toStrictEqual(`${credits} credits`)
    })

    test.each([
      [7.0, '7.0'],
      [5.0, '5.0'],
      ['5.0', '5.0'],
    ])('formats credits according to english locale even with .0', (credits, expectedFormattedCredits) => {
      const { result } = renderHook(() => useFormatCredits())

      expect(result.current.formatCredits(credits, 'hp')).toStrictEqual(`${expectedFormattedCredits} credits`)
    })
  })
})
