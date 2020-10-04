import React from 'react'
import { Provider } from 'mobx-react'
import { render } from '@testing-library/react'

import CoursePage from '../CoursePage'

describe('Component <CoursePage>', () => {
  test('renders a course page', () => {
    const routerStore = { browserConfig: {} }
    render(
      <Provider routerStore={routerStore}>
        <CoursePage />
      </Provider>
    )
  })
})
