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
    }
  }

  handleChange = (e) => {
    e.target.value.match(/^[0-9]+$|^$/) &&
      this.setState({
        [e.target.id]: e.target.value
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
    return (
      <StyledContainer>
        <StyledForm inline>
          <Form.Control size="lg" type="text"
            placeholder="Apt Number" id="apartId"
            value={this.state.apartId}
            onChange={this.handleChange} />
          <Button type="submit" size="lg"
            onClick={this.handleCheckClick}>
            CHECK
          </Button>
        </StyledForm>

        {this.state.isExpanded &&
          <StyledExpandedForm>
            <h1>Profile</h1>
            <hr />
            <Form.Row>
              <Form.Group as={Col} lg={6} controlId="firstName">
                <Form.Label>firstName</Form.Label>
                <Form.Control placeholder="First Name" />
              </Form.Group>

              <Form.Group as={Col} lg={6} controlId="lastName">
                <Form.Label>lastName</Form.Label>
                <Form.Control placeholder="Last Name" />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} lg={6} controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
              </Form.Group>

              <Form.Group as={Col} lg={6} controlId="phone">
                <Form.Label>Phone</Form.Label>
                <Form.Control placeholder="1112223333" />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} id="isPrimary">
                <Form.Check type="checkbox" label="Check if this is primary account of the unit" />
              </Form.Group>

              <Form.Group as={Col} id="isPet">
                <Form.Check type="checkbox" label="Check if there's pet" />
              </Form.Group>
            </Form.Row>

            <hr />
            <h3>Emergency Contact</h3>
            <Form.Row>
              <Form.Group as={Col} md={4} controlId="firstName">
                <Form.Label>firstName</Form.Label>
                <Form.Control placeholder="First Name" />
              </Form.Group>

              <Form.Group as={Col} md={4} controlId="lastName">
                <Form.Label>lastName</Form.Label>
                <Form.Control placeholder="Last Name" />
              </Form.Group>

              <Form.Group as={Col} md={4} controlId="phone">
                <Form.Label>Phone</Form.Label>
                <Form.Control placeholder="1112223333" />
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

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </StyledExpandedForm>
        }

      </StyledContainer>
    )
  }
}

export default New
