import React from 'react'
import { Button, Modal } from "react-bootstrap";
import styled from 'styled-components'

const StyledModal = styled(Modal)`
  font-size: 1.1em;
`

const AlertModal = (props) => {
  return (
    <StyledModal
      show={props.modalShow}
      onHide={props.modalClose}>
      <Modal.Header closeButton >
        <Modal.Title>Alert</Modal.Title>
      </Modal.Header>
      <Modal.Body
        dangerouslySetInnerHTML={{ __html: props.modalMessage }}
      ></Modal.Body>
      <Modal.Footer>
        <Button
          variant={`outline-${props.theme.buttonTheme}`}
          onClick={props.modalClose}>
          OK
        </Button>
      </Modal.Footer>
    </StyledModal>
  )
}

export default AlertModal


