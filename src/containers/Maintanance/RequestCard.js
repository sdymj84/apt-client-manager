import React from 'react'
import styled from 'styled-components'
import { Card, Row, Col, Button } from "react-bootstrap";
import { Link } from 'react-router-dom'

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
`

const StyledButton = styled(Button)`
  margin: 0 5px;
`

const RequestCard = ({ request, ...rest }) => {
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
            <Link to={rest.handleOpenAttachment}>
              {request.attachment}
            </Link>
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
    </StyledCard>
  )
}

export default RequestCard
