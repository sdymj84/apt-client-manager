import React, { Component } from 'react'
import { Form, Modal, Col, Button, Dropdown } from 'react-bootstrap'
import styled from 'styled-components'
import LoaderButton from '../../components/LoaderButton'

const StyledModal = styled(Modal)`
  .form-label {
    margin-right: 1em;
  }
  .modal-footer {
    flex-wrap: wrap;
  }
  .renew-textbox {
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

export class RenewModal extends Component {
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
    return this.state.confirmText === "Renew"
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
        <Form onSubmit={props.handleRenewSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Renew</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Row>
              <Form.Group as={Col} md={6} controlId="newLeaseTerm">
                <Form.Label>Lease Term (6-12 Months)</Form.Label>
                <Dropdown
                  onSelect={props.handleRenewChange}
                  drop='right'>
                  <Dropdown.Toggle variant="outline-secondary">
                    {`${props.newLeaseTerm} Months `}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {[6, 7, 8, 9, 10, 11, 12].map(newLeaseTerm =>
                      <Dropdown.Item
                        eventKey="newLeaseTerm"
                        key={newLeaseTerm}>{newLeaseTerm}
                      </Dropdown.Item>)}
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
            </Form.Row>
          </Modal.Body>
          <Modal.Footer>
            <Warning><div>Please enter <strong>Renew</strong> in below text field to proceed.</div>
              <div style={{ color: 'red' }}>This cannot be undone.</div></Warning>
            <Form.Control
              className="renew-textbox"
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
            <LoaderButton type="submit"
              block
              variant="outline-danger"
              onClick={() => {
                this.emptyConfirmText()
              }}
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

export default RenewModal
