import { Component } from 'inferno'
import Modal from 'inferno-bootstrap/dist/Modal/Modal'
import ModalBody from 'inferno-bootstrap/dist/Modal/ModalBody'
import ModalHeader from 'inferno-bootstrap/dist/Modal/ModalHeader'
import ModalFooter from 'inferno-bootstrap/dist/Modal/ModalFooter'
import Button from 'inferno-bootstrap/dist/Button'

class InfoModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      modal: false
    }
    this.keepFocus = this.keepFocus.bind(this)
    this.toggle = this.toggle.bind(this)

  }

  keepFocus () {
    const modal = document.querySelector('.modal.fade.show')
    if (modal) {
      modal.addEventListener('keydown', (event) => {
        if (event.code === 'Tab') {
          const topCloseButton = modal.querySelector('.close')
          const bottomCloseButton = modal.querySelector('.btn.btn-secondary')
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
        }
      }, true)
    }
  }

  toggle () {
    this.setState({
      modal: !this.state.modal
    })
  }

  render () {
    const fadeModal = (this.props.hasOwnProperty('fade') ? this.props.fade : true)
    return (
      <Button className='btn-info-modal' onClick={this.toggle}>{this.props.buttonLabel}
        <Modal isOpen={this.state.modal} toggle={this.toggle} onOpened={this.keepFocus} className={this.props.className} fade={fadeModal}>
          <ModalHeader toggle={this.toggle}>Info</ModalHeader>
          <ModalBody>
            {this.props.type && this.props.type === 'html'
              ? <p dangerouslySetInnerHTML={{__html: this.props.infoText}}></p>
              : <p>{this.props.infoText}</p>
            }
          </ModalBody>
          <ModalFooter>
            <Button color='secondary' onClick={this.toggle}>Close</Button>
          </ModalFooter>
        </Modal>
      </Button>
    )
  }
}

export default InfoModal
