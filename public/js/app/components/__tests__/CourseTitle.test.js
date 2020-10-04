import React from 'react'
import { render } from '@testing-library/react'

import CourseTitle from '../CourseTitle'

describe('Component <CourseTitle>', () => {
  test('renders a course title', () => {
    render(<CourseTitle />)
  })
})
