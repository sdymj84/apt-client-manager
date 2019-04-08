import React, { Component } from 'react'
import styled from 'styled-components'
import { Card, Row, Col, Button, Modal, Image } from "react-bootstrap";
import { Link } from 'react-router-dom'
import { Storage } from 'aws-amplify'

const StyledCard = styled(Card)`
  .card-header .card-footer {
    background-color: ${props => props.theme.cardTheme}
  }
  .card-title {
    margin-bottom: 0;
    font-size: 1.6em;
    padding: 5px;
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
    console.log(this.state.attachmentUrl)
    return (
      <StyledCard>
        <Card.Header>
          <Card.Title>#{request.apartId}</Card.Title>
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
              {/* <a href={this.state.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer">
                {this.formatFilename(request.attachment)}
              </a> */}
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
          <StyledButton variant="outline-primary">Complete</StyledButton>
        </Card.Footer>

        <Modal
          centered
          show={this.state.modalShow}
          onHide={this.modalClose}>
          <Image src={this.state.attachmentUrl} fluid></Image>
        </Modal>
      </StyledCard>
    )
  }
}

export default RequestCard
