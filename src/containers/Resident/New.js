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
  - notifications { voiceCall, text, email }
  -> Submit -> Step 3
3. 

*/

import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import { Container, Button, Form, Col, Modal } from "react-bootstrap";
import Amplify, { API, Auth } from 'aws-amplify'
import LoaderButton from '../../components/LoaderButton'
import { resident, manager } from '../../aws-export'

const StyledContainer = styled(Container)`
  margin-top: 3em;
`

const StyledForm = styled(Form)`
  max-width: 500px;
  margin: auto;
  div {
    margin: 10px;
  }
`

const StyledExpandedForm = styled(Form)`
  margin-top: 1em;
  width: 100%;
  h1 {
    margin-top: 2em;
  }
  h3 {
    margin-top: 1em;
  }
  button {
    margin: 1em 0;
  }
`

export class New extends Component {
  constructor(props) {
    super(props)

    this.state = {
      modalExpandShow: false,
      modalSubmittedShow: false,
      residentId: "",
      apartId: "",
      regiNum: "",
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
      vehicles: [{
        year: "",
        make: "",
        model: "",
        color: "",
        licensePlate: "",
        state: "",
      }],
      notifications: {
        isVoiceCallSub: false,
        isTextSub: false,
        isEmailSub: false,
      },
      leaseTerm: 12,
    }
  }

  validateForm = () => {
    return this.state.email.length > 0
      && this.state.firstName.length > 0
      && this.state.lastName.length > 0
  }

  validateUnitForm = () => {
    return this.state.apartId.length > 0;
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

  handleErChange = (e) => {
    e.persist()
    this.setState(prevState => ({
      erContact: {
        ...prevState.erContact,
        [e.target.id]: e.target.value
      }
    }))
  }

  handleNotiChange = (e) => {
    e.persist()
    this.setState(prevState => ({
      notifications: {
        ...prevState.notifications,
        [e.target.id]: e.target.checked
      }
    }))
  }

  handleVehiclesChange = (e, i) => {
    e.persist()   // To fix Synthetic Events error
    this.setState(prevState => {
      const vehicles = prevState.vehicles.map((vehicle, j) => {
        if (i === j) {
          return {
            ...vehicle,
            [e.target.id]: e.target.value
          }
        } else {
          return { ...vehicle }
        }
      })
      return { vehicles }
    })
  }

  handleAddVehicleClick = () => {
    if (this.state.vehicles.length === 4) {
      alert("You reached the maximum number of vehicles you can have.")
      return
    }
    const newVehicle = {
      year: "",
      make: "",
      model: "",
      color: "",
      licensePlate: "",
      state: ""
    }

    this.setState(prevState => ({
      vehicles: [...prevState.vehicles, newVehicle]
    }))
  }

  handleRemoveVehicleClick = () => {
    this.setState(prevState => {
      const vehicles = prevState.vehicles
      vehicles.pop()
      return { vehicles }
    })
  }

  handleCheckClick = async (e) => {
    e.preventDefault()
    this.setState({ isLoading: true })
    try {
      const apt = await API.get('apt', `/aparts/${this.state.apartId}`)
      if (!apt) throw new Error("You entered invalid unit number")
      const msg = !apt.residentId.length
        ? "This unit is currently vacant.\nWould you like to add new resident on this unit?"
        : `Current residents : ${apt.residentId}\nWould you like to add new resident on this unit?`
      this.setState({ isLoading: false })
      window.confirm(msg)
        && this.setState({ isExpanded: true })
    } catch (e) {
      alert(e.message)
      this.setState({ isExpanded: false, isLoading: false })
      console.log(e, e.response)
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault()

    this.setState({ isLoading: true })
    const regiNum = 'Apt' + Math.floor(100000 + Math.random() * 900000).toString()
    const credentials = {
      username: this.state.email,
      password: regiNum,
    }

    try {
      const residentId = await this.residentSignUp(credentials)
      await this.setState({ residentId, regiNum })
      await this.createResidentDB()
      // window.confirm("Resident is successfully added.\n \
      //   Would you like to add more resident in this unit?")
    } catch (e) {
      Amplify.configure(manager)
      this.setState({ isLoading: false })
    }
  }

  residentSignUp = async (credentials) => {
    try {
      Amplify.configure(resident)
      const newResident = await Auth.signUp(credentials)
      Amplify.configure(manager)

      console.log(newResident)
      return newResident.userSub
    } catch (e) {
      console.log("Error while signing in : ", e, e.response)
    }
  }

  createResidentDB = async () => {
    try {
      console.log(this.state)
      await API.post('apt', '/residents', {
        body: this.state
      })
      console.log("New resident is successfully added")
    } catch (e) {
      console.log("Error while creating Resident DB : ", e, e.response)
    }
  }


  render() {
    return (
      <StyledContainer>
        <StyledForm inline>
          <Form.Control size="lg" type="text"
            placeholder="Apt Number" id="apartId"
            value={this.state.apartId}
            onChange={(e) => this.validateNumber(e) && this.handleChange(e)} />
          <LoaderButton type="submit" size="lg"
            variant={`outline-${this.props.theme.buttonTheme}`}
            onClick={this.handleCheckClick}
            disabled={!this.validateUnitForm()}
            isLoading={this.state.isLoading}
            text="Check"
            loadingText="Checking..">
          </LoaderButton>
        </StyledForm>

        {this.state.isExpanded &&
          <StyledExpandedForm onSubmit={this.handleSubmit}>
            <h1>Profile</h1>
            <hr />
            <Form.Row>
              <Form.Group as={Col} md={6} controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  onChange={this.handleChange}
                  value={this.state.firstName} />
              </Form.Group>

              <Form.Group as={Col} md={6} controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
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


            <h3>Emergency Contact</h3>
            <hr />
            <Form.Row>
              <Form.Group as={Col} md={4} controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  onChange={this.handleErChange}
                  value={this.state.erContact.firstName} />
              </Form.Group>

              <Form.Group as={Col} md={4} controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  onChange={this.handleErChange}
                  value={this.state.erContact.lastName} />
              </Form.Group>

              <Form.Group as={Col} md={4} controlId="phone">
                <Form.Label>Phone</Form.Label>
                <Form.Control placeholder="1112223333"
                  onChange={(e) => this.validateNumber(e) && this.handleErChange(e)}
                  value={this.state.erContact.phone} />
              </Form.Group>
            </Form.Row>


            <h1>Vehicles</h1>
            {this.state.vehicles.map((vehicle, i) => {
              return <Fragment key={i}>
                <hr />
                <Form.Row>
                  <Form.Group as={Col} md={4} controlId="year">
                    <Form.Label>Year</Form.Label>
                    <Form.Control placeholder="YYYY"
                      onChange={(e) => this.validateNumber(e) && this.handleVehiclesChange(e, i)}
                      value={vehicle.year} />
                  </Form.Group>

                  <Form.Group as={Col} md={4} controlId="make">
                    <Form.Label>Make</Form.Label>
                    <Form.Control placeholder="Honda"
                      onChange={(e) => this.handleVehiclesChange(e, i)}
                      value={vehicle.make} />
                  </Form.Group>

                  <Form.Group as={Col} md={4} controlId="model">
                    <Form.Label>Model</Form.Label>
                    <Form.Control placeholder="Accord"
                      onChange={(e) => this.handleVehiclesChange(e, i)}
                      value={vehicle.model} />
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} md={4} controlId="color">
                    <Form.Label>Color</Form.Label>
                    <Form.Control
                      onChange={(e) => this.handleVehiclesChange(e, i)}
                      value={vehicle.color} />
                  </Form.Group>

                  <Form.Group as={Col} md={4} controlId="licensePlate">
                    <Form.Label>License Plate</Form.Label>
                    <Form.Control
                      onChange={(e) => this.handleVehiclesChange(e, i)}
                      value={vehicle.licensePlate} />
                  </Form.Group>

                  <Form.Group as={Col} md={4} controlId="state">
                    <Form.Label>State</Form.Label>
                    <Form.Control
                      onChange={(e) => this.handleVehiclesChange(e, i)}
                      value={vehicle.state} />
                  </Form.Group>
                </Form.Row>
              </Fragment>
            })}

            <Form.Row>
              <Form.Group as={Col}>
                <Button
                  block
                  variant={`outline-${this.props.theme.buttonTheme}`}
                  onClick={this.handleAddVehicleClick}
                >Add Another Vehicle
              </Button>
              </Form.Group>

              {this.state.vehicles.length > 1 &&
                <Form.Group as={Col}>
                  <Button
                    block
                    variant={`outline-${this.props.theme.buttonTheme}`}
                    onClick={this.handleRemoveVehicleClick}
                  >Remove Last Vehicle
                  </Button>
                </Form.Group>}
            </Form.Row>



            <h1>User Settings</h1>
            <hr />
            <Form.Row>
              <Form.Group as={Col} controlId="isEmailSub">
                <Form.Check type="checkbox" label="Allow Email Notifications"
                  onChange={this.handleNotiChange}
                  checked={this.state.notifications.isEmailSub} />
              </Form.Group>

              <Form.Group as={Col} controlId="isTextSub">
                <Form.Check type="checkbox" label="Allow Text Notifications"
                  onChange={this.handleNotiChange}
                  checked={this.state.notifications.isTextSub} />
              </Form.Group>

              <Form.Group as={Col} controlId="isVoiceCallSub">
                <Form.Check type="checkbox" label="Allow Voice call"
                  onChange={this.handleNotiChange}
                  checked={this.state.notifications.isVoiceCallSub} />
              </Form.Group>
            </Form.Row>

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
