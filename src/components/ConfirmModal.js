import React from 'react'
import { Button, Modal } from "react-bootstrap";
import styled from 'styled-components'

const StyledModal = styled(Modal)`
  font-size: 1.2em;
`

const ConfirmModal = (props) => {
  return (
    <StyledModal show={props.modalShow}>
      <Modal.Body
        dangerouslySetInnerHTML={{ __html: props.modalMessage }}
      ></Modal.Body>
      <Modal.Footer>
        <Button variant={`outline-${props.theme.buttonTheme}`}
          onClick={props.handleModalNo}>
          NO
            </Button>
        <Button variant={`${props.theme.buttonTheme}`}
          onClick={props.handleModalYes}>
          YES
            </Button>
      </Modal.Footer>
    </StyledModal>
  )
}

export default ConfirmModal


