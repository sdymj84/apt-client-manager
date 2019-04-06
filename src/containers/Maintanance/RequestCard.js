import React from 'react'
import styled from 'styled-components'
import { Card, Row, Col, Button } from "react-bootstrap";

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

const RequestCard = ({ props }) => {
  return (
    <StyledCard>
      <Card.Header>
        <Card.Title>#401</Card.Title>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col>Where</Col>
          <Col>Kitchen</Col>
        </Row>
        <hr />
        <Row>
          <Col>Description</Col>
          <Col>Freezer light is off</Col>
        </Row>
        <hr />
        <Row>
          <Col>Permission To Enter</Col>
          <Col>YES</Col>
        </Row>
        <hr />
        <Row>
          <Col>Access Instruction</Col>
          <Col>Pass main room and follow the hallway</Col>
        </Row>
        <hr />
        <Row>
          <Col>Attachment</Col>
          <Col>photo.jpg</Col>
        </Row>
        <hr />
        <Row>
          <Col>Maintanance Note</Col>
          <Col>Need hammer</Col>
        </Row>
      </Card.Body>
      <Card.Footer>
        <StyledButton
          theme={props.theme}
          variant={`outline-${props.theme.buttonTheme}`}>
          Note
        </StyledButton>
        <StyledButton variant="outline-primary">Complete</StyledButton>
      </Card.Footer>
    </StyledCard>
  )
}

export default RequestCard
