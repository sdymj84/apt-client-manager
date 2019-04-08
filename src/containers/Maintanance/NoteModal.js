import React, { Component } from 'react'
import styled from 'styled-components'
import { Modal, Form } from "react-bootstrap";
import LoaderButton from '../../components/LoaderButton'

const StyledModal = styled(Modal)`
  .form-group {
    width: 100%;
  }
  .form-group div {
    margin: 0;
  }
`

export class NoteModal extends Component {
  render() {
    const props = this.props
    return (
      <StyledModal
        show={props.modalShow}
        onHide={props.modalClose}
        centered>
        <Form onSubmit={props.handleNoteSubmit}>
          <Modal.Body>
            <Form.Group controlId='modalNote'>
              <Form.Control
                as='textarea'
                rows={5}
                onChange={props.handleNoteChange}
                value={props.modalNote} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Form.Group>
              <LoaderButton
                block
                variant={`outline-${props.theme.buttonTheme}`}
                disabled={!props.validateForm()}
                type="submit"
                isLoading={props.isLoading}
                text="Save"
                loadingText="Saving..."
              />
            </Form.Group>
          </Modal.Footer>
        </Form>
      </StyledModal>
    )
  }
}

export default NoteModal


