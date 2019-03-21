import React from 'react'
import { Button, Modal } from "react-bootstrap";
import styled from 'styled-components'

const StyledModal = styled(Modal)`
  font-size: 1.2em;
`

const ConfirmModal = ({ modalProps }) => {
  const mp = modalProps
  return (
    <StyledModal show={mp.modalShow}>
      <Modal.Body
        dangerouslySetInnerHTML={{ __html: mp.modalMessage }}
      ></Modal.Body>
      <Modal.Footer>
        <Button variant={`outline-${mp.theme.buttonTheme}`}
          onClick={mp.handleModalNo}>
          NO
            </Button>
        <Button variant={`${mp.theme.buttonTheme}`}
          onClick={mp.handleModalYes}>
          YES
            </Button>
      </Modal.Footer>
    </StyledModal>
  )
}

export default ConfirmModal


