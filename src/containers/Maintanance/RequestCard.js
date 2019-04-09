import React, { Component } from 'react'
import styled from 'styled-components'
import { Card, Row, Col, Button, Modal, Image, Badge } from "react-bootstrap";
import { Storage } from 'aws-amplify'

const StyledCard = styled(Card)`
  .card-header .card-footer {
    background-color: ${props => props.theme.cardTheme}
  }
  .card-title {
    margin-bottom: 0;
    font-size: 1.6em;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .badge {
      font-size: 0.55em;
      padding: 8px;
      margin: 3px;
    }
  }
  .card-footer {
    display: flex;
    justify-content: flex-end;
  }
  .attachment {
    color: blue;
    cursor: pointer;
    :hover {
      text-decoration: underline;
    }
  }
`

const StyledButton = styled(Button)`
  margin: 0 5px;
`

const StyledModal = styled(Modal)`
`


export class RequestCard extends Component {
  state = {
    attachmentUrl: "",
    modalShow: false,
  }

  modalClose = () => {
    this.setState({ modalShow: false })
  }

  componentDidMount = async () => {
    const { attachment } = this.props.request
    try {
      const attachmentUrl = attachment && await Storage.get(attachment)
      this.setState({ attachmentUrl })
    } catch (e) {
      console.log(e, e.response)
    }
  }

  formatFilename = (filename) => {
    return filename.replace(/^\w+-/, "")
  }

  render() {
    const { request, ...rest } = this.props
    return (
      <StyledCard>
        <Card.Header>
          <Card.Title>
            #{request.apartId}
            <div className="badge-container">
              {request.priority === "HIGH" && <Badge variant="danger">HIGH</Badge>}
              {request.requestStatus === 0
                ? <Badge variant="success">OPEN</Badge>
                : <Badge variant="warning">IN PROGRESS</Badge>}
            </div>
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col>Where</Col>
            <Col>{request.where}</Col>
          </Row>
          <hr />
          <Row>
            <Col>Description</Col>
            <Col>{request.description}</Col>
          </Row>
          <hr />
          <Row>
            <Col>Permission To Enter</Col>
            <Col>{request.permissionToEnter}</Col>
          </Row>
          <hr />
          <Row>
            <Col>Access Instruction</Col>
            <Col>{request.accessInst}</Col>
          </Row>
          <hr />
          <Row>
            <Col>Attachment</Col>
            <Col>
              <div className="attachment" onClick={() => this.setState({ modalShow: true })}>
                {this.formatFilename(request.attachment)}
              </div>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col>Maintanance Note</Col>
            <Col>{request.maintananceNote}</Col>
          </Row>
        </Card.Body>
        <Card.Footer>
          <StyledButton
            theme={rest.theme}
            variant={`outline-${rest.theme.buttonTheme}`}
            onClick={rest.handleNoteClick}>
            Note
        </StyledButton>
          <StyledButton
            variant="outline-primary"
            onClick={rest.handleButtonClick}>
            {request.requestStatus === 0 ? 'Start Work' : 'Complete'}
          </StyledButton>
        </Card.Footer>

        <StyledModal
          centered
          show={this.state.modalShow}
          onHide={this.modalClose}>
          <Image src={this.state.attachmentUrl} fluid />
        </StyledModal>
      </StyledCard>
    )
  }
}

export default RequestCard
