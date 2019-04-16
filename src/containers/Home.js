import React, { Component } from 'react'
import styled from 'styled-components'
import { Container, Button, Row, Col, Badge } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaUserPlus } from "react-icons/fa";
import { GiAutoRepair, GiHouse } from "react-icons/gi";
import { GoMegaphone } from 'react-icons/go'
import { Link } from "react-router-dom";
import { API } from 'aws-amplify'

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
  color: ${props => props.theme.iconColor};
  text-decoration: none;

  :hover, :active {
    color: ${props => props.theme.hoverColor};
    text-decoration: none;
  }
`
const StyledBadge = styled(Badge)`
  position: absolute;
  font-size: 1.5em;
  right: 50px;
  top: 5px;
`

export class Home extends Component {
  _isMounted = false
  state = {
    requestsCount: 0
  }

  componentDidMount = async () => {
    this._isMounted = true
    if (this.props.isAuthenticated) {
      try {
        const result = await API.get('apt', '/requests/list')
        this._isMounted && this.setState({ requestsCount: result.Count })
      } catch (e) {
        console.log(e, e.response)
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false
  }
  

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
            <Button variant={`outline-${this.props.theme.buttonTheme}`} size="lg">EMPLOYEE LOG IN</Button>
          </LinkContainer>
        </div>
      </StyledContainer>
    )
  }

  renderManager() {
    const { requestsCount } = this.state
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
              <StyledLink to='/maintanances'>
                <GiAutoRepair className="icon" />
                {requestsCount ?
                  <StyledBadge variant="info">{requestsCount}</StyledBadge> : null}
                <hr />
                <p>Maintanance</p>
              </StyledLink>
            </div>
          </Col>
          <Col sm={6}>
            <div>
              <StyledLink to='/announcement'>
                <GoMegaphone className="icon" />
                <hr />
                <p>Announcement</p>
              </StyledLink>
            </div>
          </Col>
          <Col sm={6}>
            <div>
              <StyledLink to='/aparts'>
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
    return (
      this.props.isAuthenticated
        ? this.renderManager()
        : this.renderLander()
    )
  }
}

export default Home
