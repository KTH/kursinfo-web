import React from 'react'
import { render, fireEvent, waitFor, waitForElementToBeRemoved, screen } from '@testing-library/react'

import InfoModal from '../InfoModal'

import '@testing-library/jest-dom/extend-expect'

const { queryByText, getByRole, getAllByRole } = screen

describe('Component without data <InfoModal> 1I', () => {
  test('renders an info modal', () => {
    render(<InfoModal />)
  })
})

describe('Component <InfoModal> with html text 2I', () => {
  beforeEach(() =>
    render(
      <InfoModal
        title="Valid for"
        infoText="<p>• A course goes different course offerings. To see information about a specific course offering, choose semester and course offering.</p>"
        type="html"
        closeLabel="Close"
        ariaLabel="Information about choosing semester and course offering"
      />
    )
  )

  test('renders modal button with aria label', done => {
    const modalBtn = getByRole('button')
    expect(modalBtn).toBeInTheDocument()
    expect(modalBtn).toHaveAttribute('aria-label', 'Information about choosing semester and course offering')

    done()
  })

  test('renders modal 2 close buttons if modal is open', async () => {
    const modalBtn = getByRole('button')

    // Open modal
    fireEvent.click(modalBtn)
    await waitFor(() => {
      const allBtns = getAllByRole('button')
      expect(allBtns[1]).toHaveTextContent('×')
      expect(allBtns[2]).toHaveTextContent('Close')
    })
  })

  test('renders modal heading and text included as html if modal is open', async () => {
    const modalBtn = getByRole('button')

    // Open modal
    fireEvent.click(modalBtn)
    await waitFor(() => {
      const heading = getByRole('heading', { level: 5 })
      expect(heading).toHaveTextContent('Valid for')

      const stringFromHtml = queryByText(
        '• A course goes different course offerings. To see information about a specific course offering, choose semester and course offering.'
      )
      expect(stringFromHtml).toBeInTheDocument()
    })
  })
})

describe('Component <InfoModal> and its functionality 3I', () => {
  beforeEach(() =>
    render(
      <InfoModal
        title="Valid for"
        infoText="<p>• A course goes different course offerings. To see information about a specific course offering, choose semester and course offering.</p>"
        type="html"
        closeLabel="Close"
        ariaLabel="Information about choosing semester and course offering"
      />
    )
  )

  test('open modal and close by clicking ×', async () => {
    const modalBtn = getByRole('button')

    // Open modal i
    fireEvent.click(modalBtn)
    await waitFor(() => {
      expect(queryByText('Valid for')).toBeInTheDocument()
    })

    // Close modal using ×
    const modalCrossBtn = getAllByRole('button')[1]
    fireEvent.click(modalCrossBtn)
    setTimeout(async () => waitForElementToBeRemoved(() => queryByText('Valid for')), 1000)
  })

  xtest('open modal and close by clicking button "Close"', async () => {
    const modalBtn = getByRole('button')

    // Open modal i
    fireEvent.click(modalBtn)
    await waitFor(() => {
      expect(queryByText('Valid for')).toBeInTheDocument()
    })

    // Close modal using "Close"
    const modalCloseBtn = getAllByRole('button')[2]
    fireEvent.click(modalCloseBtn)

    setTimeout(async () => waitForElementToBeRemoved(() => queryByText('Valid for')), 1000)
  })
})

describe('Component <InfoModal> with non-html text 4I', () => {
  beforeEach(() =>
    render(
      <InfoModal
        title="Valid for"
        infoText="• A course goes different course offerings. To see information about a specific course offering, choose semester and course offering."
        closeLabel="Close"
      />
    )
  )

  test('renders modal heading if modal is open', async () => {
    const modalBtn = getByRole('button')

    // Open modal
    fireEvent.click(modalBtn)
    await waitFor(() => {
      const heading = getByRole('heading', { level: 5 })
      expect(heading).toHaveTextContent('Valid for')

      const string = queryByText(
        '• A course goes different course offerings. To see information about a specific course offering, choose semester and course offering.'
      )
      expect(string).toBeInTheDocument()
    })
  })
})
