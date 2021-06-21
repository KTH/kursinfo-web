import React from 'react'
import { render } from '@testing-library/react'

import SyllabusInformation from '../SyllabusInformation'
import i18n from '../../../../../i18n'

const translationEN = i18n.messages[0]
const translationSV = i18n.messages[1]

describe('Component <SyllabusInformation>', () => {
  test('renders syllabus information in English', () => {
    render(<SyllabusInformation translation={translationEN} />)
  })
  test('renders syllabus information in Swedish', () => {
    render(<SyllabusInformation translation={translationSV} />)
  })
})
