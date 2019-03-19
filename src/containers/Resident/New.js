/* Logic Flow
1. Enter apart number to move in
  -> Look up Apart DB : API GET /aparts/{id}
  -> Show the residents' names currently living in the apartment
  -> Show text : Would you like to add new resident on this unit?
  -> Select Yes -> Next page (Step 2)
2. Fill out resident's information
  - email, firstName, lastName, phone, isPrimary
  - isPet, leaseTerm
  - erContact { firstName, lastName, phone }
  - vehicles [{ year, make, model, color, licensePlate, state}]
  - notification { voiceCall, text, email }
  -> Submit -> Step 3
3. 

*/

import React, { Component } from 'react'
import styled from 'styled-components'
import { Container, Button, Form, Col } from "react-bootstrap";
import { API } from 'aws-amplify'
import LoaderButton from '../../components/LoaderButton'

const StyledContainer = styled(Container)`
  margin-top: 3em;
`

const StyledForm = styled(Form)`
  max-width: 500px;
  margin: auto;
  * {
    margin: 10px;
  }
`

const StyledExpandedForm = styled(Form)`
  margin-top: 1em;
  width: 100%;
`

export class New extends Component {
  constructor(props) {
    super(props)

    this.state = {
      apartId: "",
      isExpanded: false,
      isLoading: false,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      isPrimary: false,
      isPet: false,
      erContact: {
        firstName: "",
        lastName: "",
        phone: "",
      },

    }
  }

  validateForm = () => {
    return this.state.email.length > 0 && this.state.firstName.length > 0;
  }

  validateNumber = (e) => {
    return e.target.value.match(/^[0-9]+$|^$/)
  }

  handleChange = (e) => {
    const target = e.target
    const value = target.type === "checkbox" ? target.checked : target.value
    this.setState({
      [target.id]: value
    })
  }

  handleCheckClick = async (e) => {
    e.preventDefault()
    try {
      const apt = await API.get('apt', `/aparts/${this.state.apartId}`)
      if (!apt) throw new Error("You entered invalid unit number")
      const msg = !apt.residentId.length
        ? "This unit is currently vacant.\nWould you like to add new resident on this unit?"
        : `Current residents : ${apt.residentId}\nWould you like to add new resident on this unit?`
      window.confirm(msg)
        && this.setState({ isExpanded: true })
    } catch (e) {
      alert(e.message)
      this.setState({ isExpanded: false })
      console.log(e, e.response)
    }
  }

  render() {
    console.log(this.state)
    return (
      <StyledContainer>
        <StyledForm inline>
          <Form.Control size="lg" type="text"
            placeholder="Apt Number" id="apartId"
            value={this.state.apartId}
            onChange={(e) => this.validateNumber(e) && this.handleChange(e)} />
          <Button type="submit" size="lg"
            variant={`outline-${this.props.theme.buttonTheme}`}
            onClick={this.handleCheckClick}>
            CHECK
          </Button>
        </StyledForm>

        {this.state.isExpanded &&
          <StyledExpandedForm>
            <h1>Profile</h1>
            <hr />
            <Form.Row>
              <Form.Group as={Col} md={6} controlId="firstName">
                <Form.Label>firstName</Form.Label>
                <Form.Control placeholder="First Name"
                  onChange={this.handleChange}
                  value={this.state.firstName} />
              </Form.Group>

              <Form.Group as={Col} md={6} controlId="lastName">
                <Form.Label>lastName</Form.Label>
                <Form.Control placeholder="Last Name"
                  onChange={this.handleChange}
                  value={this.state.lastName} />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} lg={6} controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="email@savoy.com"
                  onChange={this.handleChange}
                  value={this.state.email} />
              </Form.Group>

              <Form.Group as={Col} lg={6} controlId="phone">
                <Form.Label>Phone</Form.Label>
                <Form.Control placeholder="1112223333"
                  onChange={(e) => this.validateNumber(e) && this.handleChange(e)}
                  value={this.state.phone} />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="isPrimary">
                <Form.Check type="checkbox"
                  label="Check if this is primary account of the unit"
                  onChange={this.handleChange}
                  checked={this.state.isPrimary} />
              </Form.Group>

              <Form.Group as={Col} controlId="isPet">
                <Form.Check type="checkbox"
                  label="Check if there's pet"
                  onChange={this.handleChange}
                  checked={this.state.isPet} />
              </Form.Group>
            </Form.Row>

            <hr />
            <h3>Emergency Contact</h3>
            <Form.Row>
              <Form.Group as={Col} md={4} controlId="firstName">
                <Form.Label>firstName</Form.Label>
                <Form.Control placeholder="First Name"
                  onChange={this.handleChange}
                  value={this.state.erContact.firstName} />
              </Form.Group>

              <Form.Group as={Col} md={4} controlId="lastName">
                <Form.Label>lastName</Form.Label>
                <Form.Control placeholder="Last Name"
                  onChange={this.handleChange}
                  value={this.state.erContact.lastName} />
              </Form.Group>

              <Form.Group as={Col} md={4} controlId="phone">
                <Form.Label>Phone</Form.Label>
                <Form.Control placeholder="1112223333"
                  onChange={(e) => this.validateNumber(e) && this.handleChange(e)}
                  value={this.state.erContact.phone} />
              </Form.Group>
            </Form.Row>

            <hr />
            <h1>Vehicles</h1>
            <Form.Row>
              <Form.Group as={Col} md={4} controlId="year">
                <Form.Label>Year</Form.Label>
                <Form.Control placeholder="2015"
                  onChange={(e) => this.validateNumber(e) && this.handleChange(e)}
                  value={this.state} />
              </Form.Group>

              <Form.Group as={Col} md={4} controlId="make">
                <Form.Label>Make</Form.Label>
                <Form.Control placeholder="Honda" />
              </Form.Group>

              <Form.Group as={Col} md={4} controlId="model">
                <Form.Label>Model</Form.Label>
                <Form.Control placeholder="Accord" />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} md={4} controlId="color">
                <Form.Label>Color</Form.Label>
                <Form.Control placeholder="White" />
              </Form.Group>

              <Form.Group as={Col} md={4} controlId="licensePlate">
                <Form.Label>License Plate</Form.Label>
                <Form.Control placeholder="ABC123" />
              </Form.Group>

              <Form.Group as={Col} md={4} controlId="state">
                <Form.Label>State</Form.Label>
                <Form.Control placeholder="California" />
              </Form.Group>
            </Form.Row>

            <hr />
            <h1>User Settings</h1>
            <Form.Row>
              <Form.Group as={Col} id="isEmailSub">
                <Form.Check type="checkbox" label="Allow Email Notifications"
                  onChange={this.handleChange}
                  checked={this.state.isEmailSub} />
              </Form.Group>

              <Form.Group as={Col} id="isTextSub">
                <Form.Check type="checkbox" label="Allow Text Notifications"
                  onChange={this.handleChange}
                  checked={this.state.isTextSub} />
              </Form.Group>

              <Form.Group as={Col} id="isVoiceCallSub">
                <Form.Check type="checkbox" label="Allow Voice call"
                  onChange={this.handleChange}
                  checked={this.state.isVoiceCallSub} />
              </Form.Group>
            </Form.Row>



            {/* - isPet, leaseTerm
                - erContact { firstName, lastName, phone }
                - vehicles [{ year, make, model, color, licensePlate, state}]
                - notification { voiceCall, text, email } 
            */}

            {/* <Form.Group controlId="address1">
              <Form.Label>Address</Form.Label>
              <Form.Control placeholder="1234 Main St" />
            </Form.Group>

            <Form.Group controlId="address2">
              <Form.Label>Address 2</Form.Label>
              <Form.Control placeholder="Apartment, studio, or floor" />
            </Form.Group>

            <Form.Row>
              <Form.Group as={Col} xs={12} sm={4} controlId="city">
                <Form.Label>City</Form.Label>
                <Form.Control />
              </Form.Group>

              <Form.Group as={Col} xs={12} sm={4} controlId="state">
                <Form.Label>State</Form.Label>
                <Form.Control as="select">
                  <option>Choose...</option>
                  <option>...</option>
                </Form.Control>
              </Form.Group>

              <Form.Group as={Col} xs={12} sm={4} controlId="zipcode">
                <Form.Label>Zip</Form.Label>
                <Form.Control />
              </Form.Group>
            </Form.Row> */}

            <Form.Group>
              <LoaderButton
                block
                variant={`outline-${this.props.theme.buttonTheme}`}
                disabled={!this.validateForm()}
                type="submit"
                isLoading={this.state.isLoading}
                text="Submit"
                loadingText="Submitting…"
              />
            </Form.Group>
          </StyledExpandedForm>
        }

      </StyledContainer>
    )
  }
}

export default New
