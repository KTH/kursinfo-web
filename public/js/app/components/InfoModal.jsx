/* eslint-disable react/no-danger */
import React, { useState } from 'react'
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from 'reactstrap'

function InfoModal(props) {
  const [modal, setModal] = useState(false)
  const { ariaLabel, buttonLabel, className, closeLabel, fadeModal, infoText, parentTag = 'h3', title, type } = props

  function toggle() {
    setModal(!modal)
  }

  function keepFocus() {
    const modalEl = document.querySelector('.modal.fade.show')
    if (modalEl) {
      modalEl.addEventListener(
        'keydown',
        event => {
          const topCloseButton = modalEl.querySelector('.close')
          const bottomCloseButton = modalEl.querySelector('.btn.btn-secondary')
          if (event.code === 'Tab') {
            if (event.shiftKey) {
              event.preventDefault()
              topCloseButton.focus()
            }
            if (event.target === modalEl) {
              topCloseButton.tabIndex = 1
              bottomCloseButton.tabIndex = 2
            } else if (event.target === topCloseButton) {
              topCloseButton.tabIndex = 1
              bottomCloseButton.tabIndex = 2
            } else if (event.target === bottomCloseButton) {
              topCloseButton.tabIndex = 2
              bottomCloseButton.tabIndex = 1
            }
          } else if (
            event.code === 'Enter' &&
            (event.target === topCloseButton || event.target === bottomCloseButton)
          ) {
            toggle()
          }
        },
        true
      )
    }
  }

  return (
    <button
      type="button"
      className={`info-modal ${parentTag === 'h2' ? 'info-modal-h2-top-fix' : ''}`}
      onClick={toggle}
      aria-label={ariaLabel}
    >
      {buttonLabel}
      <Modal isOpen={modal} toggle={toggle} onOpened={keepFocus} className={className} fade={fadeModal}>
        <ModalHeader
          className="h-4"
          toggle={toggle}
          close={
            <button className="close" onClick={toggle}>
              ×
            </button>
          }
        >
          {title || ''}
        </ModalHeader>
        <ModalBody>
          {type && type === 'html' ? <div dangerouslySetInnerHTML={{ __html: infoText }} /> : <p>{infoText}</p>}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            {closeLabel || 'Close'}
          </Button>
        </ModalFooter>
      </Modal>
    </button>
  )
}

export default InfoModal
