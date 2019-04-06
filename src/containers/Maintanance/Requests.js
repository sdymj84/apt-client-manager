import React, { Component } from 'react'
import styled from 'styled-components'
import { Container, CardColumns, Image, Row, Col, Form } from "react-bootstrap";
import RequestCard from './RequestCard';


const StyledContainer = styled(Container)`
  margin-top: 2em;
  .card-columns .card {
    margin-bottom: 2em;
  }

  @media (min-width: 576px) {
    .card-columns {
      column-count: 1;
    }
  }

  .card-columns {
    @media (min-width: 576px) {
      column-count: 1;
    }
    @media (min-width: 992px) {
      column-count: 2;
    }
  }
  
`

export class Requests extends Component {
  render() {
    const childProps = {
      theme: this.props.theme
    }
    return (
      <StyledContainer>
        <CardColumns>
          <RequestCard props={childProps} />
          <RequestCard props={childProps} />
          <RequestCard props={childProps} />
        </CardColumns>
      </StyledContainer>
    )
  }
}

export default Requests
