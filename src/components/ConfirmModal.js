import React from 'react'
import { Button, Modal } from "react-bootstrap";


const ConfirmModal = ({ modalProps }) => {
  const mp = modalProps
  return (
    <Modal show={mp.modalShow}>
      <Modal.Body>{mp.modalMessage}</Modal.Body>
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
    </Modal>
  )
}

export default ConfirmModal


