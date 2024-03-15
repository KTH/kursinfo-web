import React from 'react'
import { render, fireEvent, waitFor, waitForElementToBeRemoved, screen } from '@testing-library/react'

import InfoModal from '../InfoModal'

import '@testing-library/jest-dom'

describe('Component without data <InfoModal> 1I', () => {
  test('renders modal button', () => {
    render(<InfoModal />)
    const modalBtn = screen.getByRole('button')
    expect(modalBtn).toBeInTheDocument()
  })
})

const renderInfoModal = () =>
  render(
    <InfoModal
      title="Valid for"
      infoText="<p>• A course goes different course offerings. To see information about a specific course offering, choose semester and course offering.</p>"
      type="html"
      closeLabel="Close"
      ariaLabel="Information about choosing semester and course offering"
    />
  )

describe('Component <InfoModal> with html text 2I', () => {
  test('renders modal button with aria label', () => {
    renderInfoModal()
    const modalBtn = screen.getByRole('button')
    expect(modalBtn).toBeInTheDocument()
    expect(modalBtn).toHaveAttribute('aria-label', 'Information about choosing semester and course offering')
  })

  test('renders modal 2 close buttons if modal is open', async () => {
    renderInfoModal()
    const modalBtn = screen.getByRole('button')

    // Open modal
    fireEvent.click(modalBtn)
    await waitFor(() => {
      const allBtns = screen.getAllByRole('button')
      expect(allBtns[1]).toHaveTextContent('×')
    })
    const allBtns = screen.getAllByRole('button')
    expect(allBtns[2]).toHaveTextContent('Close')
  })

  test('renders modal heading and text included as html if modal is open', async () => {
    renderInfoModal()
    const modalBtn = screen.getByRole('button')

    // Open modal
    fireEvent.click(modalBtn)
    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 5 })
      expect(heading).toHaveTextContent('Valid for')
    })

    const stringFromHtml = screen.queryByText(
      '• A course goes different course offerings. To see information about a specific course offering, choose semester and course offering.'
    )
    expect(stringFromHtml).toBeInTheDocument()
  })
})

describe('Component <InfoModal> and its functionality 3I', () => {
  test('open modal and close by clicking ×', async () => {
    renderInfoModal()
    const modalBtn = screen.getByRole('button')

    // Open modal i
    fireEvent.click(modalBtn)
    await waitFor(() => {
      expect(screen.getByText('Valid for')).toBeInTheDocument()
    })

    // Close modal using ×
    const modalCrossBtn = screen.getByRole('button', { name: '×' })
    fireEvent.click(modalCrossBtn)
    setTimeout(async () => waitForElementToBeRemoved(() => screen.queryByText('Valid for')), 1000)
  })

  test('open modal and close by clicking button "Close"', async () => {
    renderInfoModal()
    const modalBtn = screen.getByRole('button')

    // Open modal i
    fireEvent.click(modalBtn)
    await waitFor(() => {
      expect(screen.getByText('Valid for')).toBeInTheDocument()
    })

    // Close modal using "Close"
    const modalCloseBtn = screen.getByRole('button', { name: /close/i })
    fireEvent.click(modalCloseBtn)

    setTimeout(async () => waitForElementToBeRemoved(() => screen.queryByText('Valid for')), 1000)
  })
})

describe('Component <InfoModal> with non-html text 4I', () => {
  test('renders modal heading if modal is open', async () => {
    render(
      <InfoModal
        title="Valid for"
        infoText="• A course goes different course offerings. To see information about a specific course offering, choose semester and course offering."
        closeLabel="Close"
      />
    )
    const modalBtn = screen.getByRole('button')

    // Open modal
    fireEvent.click(modalBtn)
    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 5 })
      expect(heading).toHaveTextContent('Valid for')
    })

    const string = screen.queryByText(
      '• A course goes different course offerings. To see information about a specific course offering, choose semester and course offering.'
    )
    expect(string).toBeInTheDocument()
  })
})
