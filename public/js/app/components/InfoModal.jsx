/* eslint-disable react/no-danger */
import React, { Component } from 'react'
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from 'reactstrap'

class InfoModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: false
    }
    this.keepFocus = this.keepFocus.bind(this)
    this.toggle = this.toggle.bind(this)
  }

  // eslint-disable-next-line class-methods-use-this
  keepFocus() {
    const modal = document.querySelector('.modal.fade.show')
    if (modal) {
      modal.addEventListener(
        'keydown',
        (event) => {
          const topCloseButton = modal.querySelector('.close')
          const bottomCloseButton = modal.querySelector('.btn.btn-secondary')
          if (event.code === 'Tab') {
            if (event.shiftKey) {
              event.preventDefault()
              topCloseButton.focus()
            }
            if (event.target === modal) {
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
            this.toggle()
          }
        },
        true
      )
    }
  }

  toggle() {
    this.setState((prevState) => ({
      modal: !prevState.modal
    }))
  }

  render() {
    const { ariaLabel, buttonLabel, className, closeLabel, fadeModal, infoText, title, type } = this.props
    const { modal } = this.state
    return (
      <Button className="btn-info-modal" onClick={this.toggle} aria-label={ariaLabel}>
        {buttonLabel}
        <Modal isOpen={modal} toggle={this.toggle} onOpened={this.keepFocus} className={className} fade={fadeModal}>
          <ModalHeader className='h-4' toggle={this.toggle}>{title || ''}</ModalHeader>
          <ModalBody>
            {type && type === 'html' ? <p dangerouslySetInnerHTML={{ __html: infoText }} /> : <p>{infoText}</p>}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>
              {closeLabel || 'Close'}
            </Button>
          </ModalFooter>
        </Modal>
      </Button>
    )
  }
}

export default InfoModal
