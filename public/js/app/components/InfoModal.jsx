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
      this.toggle = this.toggle.bind(this);
    }
    toggle() {
      this.setState({
        modal: !this.state.modal
      })
    }
    render() {
      const fadeModal = (this.props.hasOwnProperty('fade') ? this.props.fade : true)
      return (
        <Button className = "btn-info-modal" onClick={this.toggle}>{this.props.buttonLabel}
          <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} fade={fadeModal}>
            <ModalHeader toggle={this.toggle}>Info</ModalHeader>
            <ModalBody>
              <p>{this.props.infoText}</p>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.toggle}>Close</Button>
            </ModalFooter>
          </Modal>
        </Button>
      )
    }
  }

  export default InfoModal