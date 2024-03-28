import { renderHook } from '@testing-library/react'
import { useLanguage } from '../useLanguage'
import { useRoundUtils } from '../useRoundUtils'
import translationSv from '../../../../../i18n/messages.se'
import translationEn from '../../../../../i18n/messages.en'

jest.mock('../useLanguage')

const POSSIBLE_ROUND_CATEGORIES = {
  PU: { round_category: 'PU', sv: 'programstuderande', en: 'programme students' },
  VU: { round_category: 'VU', sv: 'fristående studerande', en: 'single courses students' },
  PU_AND_VU: {
    round_category: 'pu_and_vu',
    sv: 'programstuderande och fristående studerande',
    en: 'programme and single courses students',
  },
}

const FUNDING_TYPES_WITH_SPECIAL_HANDLING = {
  PER: { round_funding_type: 'PER', sv: 'kurser för KTHs personal', en: 'course for KTH staff' },
  UPP: { round_funding_type: 'UPP', sv: 'uppdragsutbildning', en: 'contract education' },
  SAP: { round_funding_type: 'SAP', sv: 'Study Abroad Programme', en: 'Study Abroad Programme' },
}

describe('useRoundUtils', () => {
  describe('swedish', () => {
    beforeEach(() => {
      useLanguage.mockReturnValue({
        translation: translationSv,
        languageIndex: 1,
      })
    })

    test.each([
      FUNDING_TYPES_WITH_SPECIAL_HANDLING.PER,
      FUNDING_TYPES_WITH_SPECIAL_HANDLING.UPP,
      FUNDING_TYPES_WITH_SPECIAL_HANDLING.SAP,
    ])('handles special case regardless of round category', ({ round_funding_type, sv }) => {
      const { result } = renderHook(() => useRoundUtils())

      expect(
        result.current.createRoundLabel({
          round_short_name: 'someShortName',
          round_category: POSSIBLE_ROUND_CATEGORIES.PU,
          round_funding_type,
        })
      ).toStrictEqual(`someShortName ${sv}`)

      expect(
        result.current.createRoundHeader({
          round_short_name: 'someShortName',
          round_category: POSSIBLE_ROUND_CATEGORIES.VU,
          round_funding_type,
          round_course_term: ['2024', '2'],
        })
      ).toStrictEqual(`HT 2024 someShortName ${sv}`)
    })

    test.each([POSSIBLE_ROUND_CATEGORIES.PU, POSSIBLE_ROUND_CATEGORIES.VU, POSSIBLE_ROUND_CATEGORIES.PU_AND_VU])(
      'handles default case, displaying round category',
      ({ round_category, sv }) => {
        const { result } = renderHook(() => useRoundUtils())

        expect(
          result.current.createRoundLabel({
            round_short_name: 'someShortName',
            round_category,
            round_funding_type: 'someNonSpecialFundingType',
          })
        ).toStrictEqual(`someShortName ${sv}`)

        expect(
          result.current.createRoundHeader({
            round_short_name: 'someShortName',
            round_category,
            round_funding_type: 'someNonSpecialFundingType',
            round_course_term: ['2024', '2'],
          })
        ).toStrictEqual(`HT 2024 someShortName ${sv}`)
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
          round_category: POSSIBLE_ROUND_CATEGORIES.PU.round_category,
          round_funding_type: 'someNonSpecialFundingType',
          round_course_term,
        })
      ).toStrictEqual(
        `${expectedSemesterString} ${round_course_term[0]} someShortName ${POSSIBLE_ROUND_CATEGORIES.PU.sv}`
      )
    })
  })

  describe('english', () => {
    beforeEach(() => {
      useLanguage.mockReturnValue({
        translation: translationEn,
        languageIndex: 0,
      })
    })

    test.each([
      FUNDING_TYPES_WITH_SPECIAL_HANDLING.PER,
      FUNDING_TYPES_WITH_SPECIAL_HANDLING.UPP,
      FUNDING_TYPES_WITH_SPECIAL_HANDLING.SAP,
    ])('handles special case regardless of round category', ({ round_funding_type, en }) => {
      const { result } = renderHook(() => useRoundUtils())

      expect(
        result.current.createRoundLabel({
          round_short_name: 'someShortName',
          round_category: POSSIBLE_ROUND_CATEGORIES.PU,
          round_funding_type,
        })
      ).toStrictEqual(`someShortName ${en}`)

      expect(
        result.current.createRoundHeader({
          round_short_name: 'someShortName',
          round_category: POSSIBLE_ROUND_CATEGORIES.VU,
          round_funding_type,
          round_course_term: ['2024', '2'],
        })
      ).toStrictEqual(`Autumn 2024 someShortName ${en}`)
    })

    test.each([POSSIBLE_ROUND_CATEGORIES.PU, POSSIBLE_ROUND_CATEGORIES.VU, POSSIBLE_ROUND_CATEGORIES.PU_AND_VU])(
      'handles default case, displaying round category',
      ({ round_category, en }) => {
        const { result } = renderHook(() => useRoundUtils())

        expect(
          result.current.createRoundLabel({
            round_short_name: 'someShortName',
            round_category,
            round_funding_type: 'someNonSpecialFundingType',
          })
        ).toStrictEqual(`someShortName ${en}`)

        expect(
          result.current.createRoundHeader({
            round_short_name: 'someShortName',
            round_category,
            round_funding_type: 'someNonSpecialFundingType',
            round_course_term: ['2024', '2'],
          })
        ).toStrictEqual(`Autumn 2024 someShortName ${en}`)
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
          round_category: POSSIBLE_ROUND_CATEGORIES.PU.round_category,
          round_funding_type: 'someNonSpecialFundingType',
          round_course_term,
        })
      ).toStrictEqual(
        `${expectedSemesterString} ${round_course_term[0]} someShortName ${POSSIBLE_ROUND_CATEGORIES.PU.en}`
      )
    })
  })
})
