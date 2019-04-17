/* Basic props list
  modalShow
  moveOutDate
  handleModalClose
  handleDateChange
  handleMoveOutSubmit
*/

import React, { Component } from 'react'
import { Form, Modal, Col, Button, Alert } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import styled from 'styled-components'
import moment from 'moment'
import LoaderButton from '../../components/LoaderButton'

const StyledModal = styled(Modal)`
  .form-label {
    margin-right: 1em;
  }
  .modal-footer {
    flex-wrap: wrap;
  }
  .move-out-textbox {
    margin-bottom: 1em;
  }
  hr {
    margin: 0.6em 0;
  }
  .total-container {
    display: flex;
    justify-content: flex-end;
  }
`

const Warning = styled.div`
  width: 100%;
  margin-bottom: 1em;
  margin-left: 0.25em;
`

export class EarlyMoveOutModal extends Component {
  state = {
    confirmText: "",
  }

  emptyConfirmText = () => {
    this.setState({ confirmText: "" })
  }

  handleChange = (e) => {
    this.setState({ confirmText: e.target.value })
  }

  validateText = () => {
    return this.state.confirmText === "MoveOut"
  }

  render() {
    const props = this.props
    return (
      <StyledModal
        show={props.modalShow}
        onHide={() => {
          this.emptyConfirmText()
          props.handleModalClose()
        }}>
        <Form onSubmit={props.handleMoveOutSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Early Move Out</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Row>
              <Form.Group as={Col} md={4} controlId="moveOutDate">
                <Form.Label>Move Out Date</Form.Label>
                <Form.Control as={DatePicker}
                  required
                  minDate={new Date()}
                  maxDate={new Date(moment(props.leaseEndDate).subtract(1, 'days'))}
                  onChange={props.handleDateChange}
                  selected={new Date(props.moveOutDate)} />
              </Form.Group>
            </Form.Row>
            {props.moveOutMessage.map((msg, i) =>
              <Alert key={i} variant="danger">
                <div dangerouslySetInnerHTML={{ __html: msg }}></div>
              </Alert>)}
          </Modal.Body>
          <Modal.Footer>
            <Warning>Please enter <strong>MoveOut</strong> in below text field to proceed.</Warning>
            <Form.Control
              className="move-out-textbox"
              type="text"
              onChange={this.handleChange}
              value={this.state.confirmText} />
            <Button
              variant="outline-secondary"
              onClick={() => {
                this.emptyConfirmText()
                props.handleModalClose()
              }}>
              Close
            </Button>
            {/* <Button
              variant="primary"
              onClick={props.handleMoveOutSubmit}
              disabled={!this.validateText()}>
              Save Changes
            </Button> */}
            <LoaderButton type="submit"
              block
              variant="outline-danger"
              onClick={props.handleMoveOutSubmit}
              disabled={!this.validateText()}
              isLoading={props.isLoading}
              text="Update"
              loadingText="Updating..">
            </LoaderButton>
          </Modal.Footer>
        </Form>
      </StyledModal>
    )
  }
}

export default EarlyMoveOutModal
