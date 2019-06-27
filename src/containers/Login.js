import React, { Component } from 'react'
import { Form, Row, Col, Container } from "react-bootstrap";
import { Auth } from "aws-amplify";
import { Redirect } from "react-router-dom";
import LoaderButton from "../components/LoaderButton.js";
import styled from 'styled-components'
import posed from 'react-pose'

const PosedDiv = posed.div({
  visible: {
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      delay: 100,
    }
  },
  hidden: {
    scale: 0,
  }
})

const StyledContainer = styled(Container)`
  margin-top: 5em;
  max-width: 500px;
`

export class Login extends Component {
  state = {
    email: "",
    password: "",
    isLoading: false,
    isVisible: false,
  }

  componentDidMount() {
    this.setState({ isVisible: true })
  }


  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleTestLogin = () => {
    this.setState({
      email: "admin@savoy.com",
      password: "Test123$"
    })
  }

  handleSubmit = async (e) => {
    e.preventDefault()

    this.setState({ isLoading: true })

    try {
      await Auth.signIn(this.state.email, this.state.password)
      this.props.userHasAuthenticated(true)
    } catch (e) {
      console.log(e)
      alert(e.message)
      this.setState({ isLoading: false })
    }
  }

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to='/' />
    }

    return (
      <StyledContainer>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group as={Row} controlId="email">
            <Form.Label column sm={2}>
              Email
              </Form.Label>
            <Col sm={10}>
              <Form.Control type="email" placeholder="Email"
                onChange={this.handleChange}
                value={this.state.email}
                autoFocus />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="password">
            <Form.Label column sm={2}>
              Password
            </Form.Label>
            <Col sm={10}>
              <Form.Control type="password" placeholder="Password"
                onChange={this.handleChange}
                value={this.state.password} />
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Col sm={{ span: 10, offset: 2 }}>
              <LoaderButton
                block
                variant={`outline-${this.props.theme.buttonTheme}`}
                disabled={!this.validateForm()}
                type="submit"
                isLoading={this.state.isLoading}
                text="Login"
                loadingText="Logging in…"
              />
            </Col>
          </Form.Group>

          <PosedDiv pose={this.state.isVisible ? "visible" : "hidden"}>
            <Form.Group as={Row}>
              <Col sm={{ span: 10, offset: 2 }}>
                <LoaderButton
                  block
                  variant={`outline-success`}
                  type="submit"
                  onClick={this.handleTestLogin}
                  isLoading={this.state.isLoading}
                  text="Login with test account (Auto login)"
                  loadingText="Logging in…"
                />
              </Col>
            </Form.Group>
          </PosedDiv>

        </Form>
      </StyledContainer>
    )
  }
}

export default Login