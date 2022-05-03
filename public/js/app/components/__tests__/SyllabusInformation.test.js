import React from 'react'
import { render } from '@testing-library/react'

import SyllabusInformation from '../SyllabusInformation'
import i18n from '../../../../../i18n'

const [translationEN, translationSV] = i18n.messages

describe('Component <SyllabusInformation>', () => {
  test('renders syllabus information in English', () => {
    render(<SyllabusInformation translation={translationEN} />)
  })
  test('renders syllabus information in Swedish', () => {
    render(<SyllabusInformation translation={translationSV} />)
  })
})
