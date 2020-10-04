import React from 'react'
import { Provider } from 'mobx-react'
import { render } from '@testing-library/react'

import CourseSectionList from '../CourseSectionList'

describe('Component <CourseSectionList>', () => {
  test('renders a course section list', () => {
    const routerStore = {}
    render(
      <Provider routerStore={routerStore}>
        <CourseSectionList />
      </Provider>
    )
  })
})
