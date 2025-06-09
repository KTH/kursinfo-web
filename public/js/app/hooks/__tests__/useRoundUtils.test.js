import { renderHook } from '@testing-library/react'
import { useLanguage } from '../useLanguage'
import { useRoundUtils } from '../useRoundUtils'
import translationSv from '../../../../../i18n/messages.se'
import translationEn from '../../../../../i18n/messages.en'

jest.mock('../useLanguage')

const FUNDING_TYPES_SWEDISH = [
  ['UPP', 'uppdragsutbildning'],
  ['IND', 'programstuderande'],
  ['EXA', 'programstuderande'],
  ['SÖ', 'programstuderande'],
  ['LHS', 'programstuderande'],
  ['PER', 'kurser för KTHs personal'],
  ['ORD', 'programstuderande'],
  ['B', 'programstuderande'],
  ['FOR', 'programstuderande'],
  ['GYM', 'programstuderande'],
  ['EIS', 'programstuderande'],
  ['SU', 'programstuderande'],
  ['BDR', 'programstuderande'],
  ['UFH', 'programstuderande'],
  ['KPL', 'programstuderande'],
  ['UPS', 'programstuderande'],
  ['SAP', 'Study Abroad Programme'],
  ['FOA', 'fristående studerande'],
  ['MH', 'fristående studerande'],
  ['LL', 'fristående studerande'],
]

const FUNDING_TYPES_ENGLISH = [
  ['UPP', 'contract education'],
  ['IND', 'programme students'],
  ['EXA', 'programme students'],
  ['SÖ', 'programme students'],
  ['LHS', 'programme students'],
  ['PER', 'course for KTH staff'],
  ['ORD', 'programme students'],
  ['B', 'programme students'],
  ['FOR', 'programme students'],
  ['GYM', 'programme students'],
  ['EIS', 'programme students'],
  ['SU', 'programme students'],
  ['BDR', 'programme students'],
  ['UFH', 'programme students'],
  ['KPL', 'programme students'],
  ['UPS', 'programme students'],
  ['SAP', 'Study Abroad Programme'],
  ['FOA', 'single courses students'],
  ['MH', 'single courses students'],
  ['LL', 'single courses students'],
]

describe('useRoundUtils', () => {
  describe('swedish', () => {
    beforeEach(() => {
      useLanguage.mockReturnValue({
        translation: translationSv,
        languageIndex: 1,
      })
    })

    test.each(FUNDING_TYPES_SWEDISH)(
      'for funding type "%s", displays correct suffix "%s"',
      (round_funding_type, expectedSuffix) => {
        const { result } = renderHook(() => useRoundUtils())

        expect(
          result.current.createRoundLabel({
            round_short_name: 'someShortName',
            round_funding_type,
          })
        ).toStrictEqual(`someShortName ${expectedSuffix}`)

        expect(
          result.current.createRoundHeader({
            round_short_name: 'someShortName',
            round_funding_type,
            round_course_term: ['2024', '2'],
          })
        ).toStrictEqual(`HT 2024 someShortName ${expectedSuffix}`)
      }
    )

    test.each([
      [['2024', '2'], 'HT'],
      [['2024', '1'], 'VT'],
      [['2020', '2'], 'HT'],
    ])('displays correct year and semester', (round_course_term, expectedSemesterString) => {
      const { result } = renderHook(() => useRoundUtils())

      expect(
        result.current.createRoundHeader({
          round_short_name: 'someShortName',
          round_funding_type: 'LL',
          round_course_term,
        })
      ).toStrictEqual(`${expectedSemesterString} ${round_course_term[0]} someShortName fristående studerande`)
    })
  })

  describe('english', () => {
    beforeEach(() => {
      useLanguage.mockReturnValue({
        translation: translationEn,
        languageIndex: 0,
      })
    })

    test.each(FUNDING_TYPES_ENGLISH)(
      'for funding type "%s", displays correct suffix "%s"',
      (round_funding_type, expectedSuffix) => {
        const { result } = renderHook(() => useRoundUtils())

        expect(
          result.current.createRoundLabel({
            round_short_name: 'someShortName',
            round_funding_type,
          })
        ).toStrictEqual(`someShortName ${expectedSuffix}`)

        expect(
          result.current.createRoundHeader({
            round_short_name: 'someShortName',
            round_funding_type,
            round_course_term: ['2024', '2'],
          })
        ).toStrictEqual(`Autumn 2024 someShortName ${expectedSuffix}`)
      }
    )

    test.each([
      [['2024', '2'], 'Autumn'],
      [['2024', '1'], 'Spring'],
      [['2020', '2'], 'Autumn'],
    ])('displays correct year and semester', (round_course_term, expectedSemesterString) => {
      const { result } = renderHook(() => useRoundUtils())

      expect(
        result.current.createRoundHeader({
          round_short_name: 'someShortName',
          round_funding_type: 'LL',
          round_course_term,
        })
      ).toStrictEqual(`${expectedSemesterString} ${round_course_term[0]} someShortName single courses students`)
    })
  })
})
