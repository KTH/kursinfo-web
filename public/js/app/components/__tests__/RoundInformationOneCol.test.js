import React from 'react'
import { Provider } from 'mobx-react'
import { render } from '@testing-library/react'

import RoundInformationOneCol from '../RoundInformationOneCol'

describe('Component <RoundInformationOneCol>', () => {
  test('renders a course information column', () => {
    const routerStore = { browserConfig: {}, sellingText: { en: '', sv: '' }, imageFromAdmin: '' }
    render(
      <Provider routerStore={routerStore}>
        <RoundInformationOneCol />
      </Provider>
    )
  })
})
