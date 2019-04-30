import React, { Component } from 'react';
import { Container, Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import styled, { createGlobalStyle } from 'styled-components'
import Routes from './Routes'
import { Auth } from 'aws-amplify'
import Theme from './theme'
import { ThemeProvider } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.theme.backgroundColor};
  }
`
const StyledContainer = styled(Container)`
  margin-top: 15px;

  .navbar-brand a {
    color: ${props => props.theme.brandColor};
    text-decoration: none;
    font-weight: bold;
  }
`
const Body = styled.div`
  min-height: 550px;
`
const Footer = styled(Navbar)`
  margin-top: 3em;
  height: 150px;
  justify-content: center;
  align-items: center;
`

class App extends Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {
      isAuthenticating: true,
      isAuthenticated: false,
      uid: null,
      resident: null,
      apart: null,
      theme: Theme.Basic
    }
  }

  componentDidMount = async () => {
    this._isMounted = true

    try {
      await Auth.currentSession()
      this.userHasAuthenticated(true)
    } catch (e) {
      console.log(e, e.response)
    }

    this._isMounted && this.setState({ isAuthenticating: false })
  }

  componentWillUnmount() {
    this._isMounted = false
  }


  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated })
  }

  updateApartProps = apart => {
    this.setState({ apart })
  }

  handleLogout = async () => {
    try {
      await Auth.signOut()
      this.userHasAuthenticated(false)
    } catch (e) {
      console.log(e)
      alert(e.message)
    }
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,
      updateApartProps: this.updateApartProps,
      apart: this.state.apart,
      theme: this.state.theme
    }
    return (
      !this.state.isAuthenticating &&
      <ThemeProvider theme={this.state.theme}>
        <StyledContainer>
          <GlobalStyle />
          <Navbar variant={childProps.theme.navbarTheme}
            bg={childProps.theme.navbarTheme} expand="md">
            <Navbar.Brand>
              <Link to='/'>SAVOY Management</Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
              <Nav className="ml-auto">
                {this.state.isAuthenticated
                  ? <Nav.Link onClick={this.handleLogout}>Manager Logout</Nav.Link>
                  : <LinkContainer to='/login'>
                    <Nav.Link>Manager Login</Nav.Link>
                  </LinkContainer>
                }
              </Nav>
            </Navbar.Collapse>
          </Navbar>

          <Body>
            <Routes childProps={childProps} />
          </Body>

          <Footer variant="light" bg="light" expand="md">
            <div>Designed and developed by Minjun Youn.</div>
          </Footer>
        </StyledContainer>
      </ThemeProvider>
    );
  }
}

export default App;
