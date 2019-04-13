/*
1. Manager change apart info : "updateApart"
  - Manager click "Update Info" > Mutable fields by manager
    - Aparts DB : address, floorPlan, rentPrice

2. Residents move out early : "updateMoveOutDate"
  - Manager click "Early Move Out" > Enter move out date 
    > System automatically calculate early move out fee
    > Update payment in resident DB

3. Residents renew
  - Manager click "Renew" > Enter leaseTerm
    > Enter new rentPrice > Schedule to change rentPrice when new lease start
*/

import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import { Container, Button, Form, Col } from "react-bootstrap";
import { API } from 'aws-amplify'
import LoaderButton from '../../components/LoaderButton'
import ConfirmModal from '../../components/ConfirmModal'
import AlertModal from '../../components/AlertModal'


/*===============================================================
  Styles
===============================================================*/
const StyledContainer = styled(Container)`
  margin-top: 3em;
  max-width: 700px;
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


export class EditApartInfo extends Component {
  constructor(props) {
    super(props)
    this.state = this.props.apart
  }


  /*===============================================================
    Form Validation
  ===============================================================*/
  validateNumber = (e) => {
    return e.target.value.match(/^[0-9]+$|^$/)
  }


  /*===============================================================
    Event Handlers
  ===============================================================*/
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

  handleSubmit = async (e) => {
    e.preventDefault()

    this.setState({ isLoading: true })

    try {
      await API.put('apt', `/residents/${this.state.residentId}`, {
        body: this.state
      })
      this.props.updateResident(this.state.residentId)
      this.props.history.push('/resident')
    } catch (e) {
      console.log(e, e.response)
      this.setState({ isLoading: false })
    }
  }



  /*===============================================================
    Render
  ===============================================================*/
  render() {
    return (
      <StyledContainer>
        <Form onSubmit={this.handleSubmit}>
          <h1>Apart Info</h1>
          <hr />
          <Form.Row>
            <Form.Group as={Col} md={6} controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                onChange={this.handleChange}
                value={this.state.firstName || ""} />
            </Form.Group>

            <Form.Group as={Col} md={6} controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                onChange={this.handleChange}
                value={this.state.lastName || ""} />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} controlId="isPrimary">
              <Form.Check type="checkbox"
                disabled
                label="Check if this is primary account of the unit"
                onChange={this.handleChange}
                checked={this.state.isPrimary} />
            </Form.Group>

            <Form.Group as={Col} controlId="isPet">
              <Form.Check type="checkbox"
                disabled
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
                value={this.state.erContact.firstName || ""} />
            </Form.Group>

            <Form.Group as={Col} md={4} controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                onChange={this.handleErChange}
                value={this.state.erContact.lastName || ""} />
            </Form.Group>

            <Form.Group as={Col} md={4} controlId="phone">
              <Form.Label>Phone</Form.Label>
              <Form.Control placeholder="1112223333"
                onChange={(e) => this.validateNumber(e) && this.handleErChange(e)}
                value={this.state.erContact.phone || ""} />
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
                    value={vehicle.year || ""} />
                </Form.Group>

                <Form.Group as={Col} md={4} controlId="make">
                  <Form.Label>Make</Form.Label>
                  <Form.Control placeholder="Honda"
                    onChange={(e) => this.handleVehiclesChange(e, i)}
                    value={vehicle.make || ""} />
                </Form.Group>

                <Form.Group as={Col} md={4} controlId="model">
                  <Form.Label>Model</Form.Label>
                  <Form.Control placeholder="Accord"
                    onChange={(e) => this.handleVehiclesChange(e, i)}
                    value={vehicle.model || ""} />
                </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col} md={4} controlId="color">
                  <Form.Label>Color</Form.Label>
                  <Form.Control
                    onChange={(e) => this.handleVehiclesChange(e, i)}
                    value={vehicle.color || ""} />
                </Form.Group>

                <Form.Group as={Col} md={4} controlId="licensePlate">
                  <Form.Label>License Plate</Form.Label>
                  <Form.Control
                    onChange={(e) => this.handleVehiclesChange(e, i)}
                    value={vehicle.licensePlate || ""} />
                </Form.Group>

                <Form.Group as={Col} md={4} controlId="state">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    onChange={(e) => this.handleVehiclesChange(e, i)}
                    value={vehicle.state || ""} />
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
              type="submit"
              isLoading={this.state.isLoading}
              text="Submit"
              loadingText="Submitting…"
            />
          </Form.Group>
        </Form>

        <ConfirmModal
          modalShow={this.state.modalShow}
          modalMessage={this.state.modalMessage}
          handleModalYes={this.handleModalYes}
          handleModalNo={this.handleModalNo}
          theme={this.props.theme} />
        <AlertModal
          modalShow={this.state.modalAlertShow}
          modalClose={this.handleModalAlertClose}
          modalMessage={this.state.modalMessage}
          theme={this.props.theme} />

      </StyledContainer>
    )
  }
}

export default EditApartInfo
