import React from 'react'
import styled from 'styled-components'
import { Card, Image, Row, Col, Form } from "react-bootstrap";

const StyledCard = styled(Card)`

`

const RequestCard = () => {
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
      </Card.Body>
    </StyledCard>
  )
}

export default RequestCard
