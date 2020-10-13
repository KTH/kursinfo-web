import React from 'react'
import { Provider } from 'mobx-react'
import { render } from '@testing-library/react'

import CoursePage from '../CoursePage'

describe('Component <CoursePage>', () => {
  test('renders a course page', () => {
    const routerStore = {
      browserConfig: {},
      sellingText: { en: '', sv: '' },
      imageFromAdmin: '',
      activeSyllabusIndex: 0,
      courseData: {
        syllabusList: [{ course_valid_from: [], course_valid_to: [] }],
        syllabusSemesterList: [],
        courseInfo: { course_recruitment_text: '', course_application_info: '' }
      }
    }
    render(
      <Provider routerStore={routerStore}>
        <CoursePage />
      </Provider>
    )
  })
})
