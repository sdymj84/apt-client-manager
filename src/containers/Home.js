import React, { Component } from 'react'
import styled from 'styled-components'
import { Container, Button, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaUserAlt, FaUserPlus } from "react-icons/fa";
import { GiAutoRepair, GiHouse } from "react-icons/gi";
import { Link } from "react-router-dom";

const StyledContainer = styled(Container)`
  text-align: center;

  .icon-container {
    margin: auto;
    max-width: 500px;
    cursor: pointer;
    
    p {
      font-size: 1.5em;
      font-weight: bold;
    }
    
    div {
      margin-bottom: 20px;
    }

    .icon {
      font-size: 7em;
    }

    hr {
      margin: 0;
      padding: 0;
    }
  }
`

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 0;

  h2 {
    font-family: "Open Sans", sans-serif;
  }
  p {
    color: #999;
  }
`

const StyledLink = styled(Link)`
  color: #333333;
  text-decoration: none;

  :hover, :active {
    color: ${props => props.theme.hoverColor};
    text-decoration: none;
  }
`


export class Home extends Component {
  renderLander() {
    return (
      <StyledContainer>
        <FlexContainer>
          <div>
            <h2>SAVOY Apartment Management Portal</h2>
          </div>
        </FlexContainer>
        <div>
          <LinkContainer to='/login'>
            <Button variant="outline-secondary" size="lg">EMPLOYEE LOG IN</Button>
          </LinkContainer>
        </div>
      </StyledContainer>
    )
  }

  renderManager() {
    return (
      <StyledContainer>
        <FlexContainer>
          <div>
            <h2>Welcome Manager</h2>
          </div>
        </FlexContainer>
        <Row className="icon-container">
          <Col sm={6}>
            <div>
              <StyledLink to='/new-resident'>
                <FaUserPlus className="icon" />
                <hr />
                <p>New Resident</p>
              </StyledLink>
            </div>
          </Col>
          <Col sm={6}>
            <div>
              <StyledLink to='//maintanance'>
                <GiAutoRepair className="icon" />
                <hr />
                <p>Maintanance</p>
              </StyledLink>
            </div>
          </Col>
          <Col sm={6}>
            <div>
              <StyledLink to='/resident'>
                <FaUserAlt className="icon" />
                <hr />
                <p>User Info</p>
              </StyledLink>
            </div>
          </Col>
          <Col sm={6}>
            <div>
              <StyledLink to='/apart'>
                <GiHouse className="icon" />
                <hr />
                <p>Apartment</p>
              </StyledLink>
            </div>
          </Col>
        </Row>
      </StyledContainer>
    )
  }

  render() {
    console.log(this.props)
    return (
      this.props.isAuthenticated
        ? this.renderManager()
        : this.renderLander()
    )
  }
}

export default Home
