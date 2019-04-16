/*
1. Manager change apart info : "updateApart"
  - Manager click "Update Info" > Mutable fields by manager
    - Aparts DB : address, floorPlan, rentPrice

2. Residents move out early : "updateMoveOutDate"
  - Manager click "Early Move Out" > Enter move out date 
    > System automatically calculate early move out fee
    > Update payment in resident DB

3. Residents renew : "updateRenew"
  - Manager click "Renew" > Enter leaseTerm
    > Enter new rentPrice > Schedule to change rentPrice when new lease start
*/

import React, { Component } from 'react'
import styled from 'styled-components'
import { Container, Form, Col } from "react-bootstrap";
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
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleAddressChange = (e) => {
    e.persist()
    this.setState(prevState => ({
      address: {
        ...prevState.address,
        [e.target.id]: e.target.value
      }
    }))
  }

  handlePlanChange = (e) => {
    e.persist()
    this.setState(prevState => ({
      floorPlan: {
        ...prevState.floorPlan,
        [e.target.id]: e.target.value
      }
    }))
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleSubmit = async (e) => {
    e.preventDefault()

    this.setState({ isLoading: true })

    try {
      await API.put('apt', `/aparts/info/${this.state.apartId}`, {
        body: this.state
      })
      this.props.history.push(`/aparts?apartId=${this.state.apartId}`)
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
      this.state &&
      <StyledContainer>
        <Form onSubmit={this.handleSubmit}>
          <h1>Address</h1>
          <hr />
          <Form.Row>
            <Form.Group as={Col} md={12} controlId="street">
              <Form.Label>Street address</Form.Label>
              <Form.Control
                onChange={this.handleAddressChange}
                value={this.state.address.street || ""} />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} md={6} controlId="city">
              <Form.Label>City</Form.Label>
              <Form.Control
                onChange={this.handleAddressChange}
                value={this.state.address.city || ""} />
            </Form.Group>

            <Form.Group as={Col} md={3} controlId="state">
              <Form.Label>State</Form.Label>
              <Form.Control
                onChange={this.handleAddressChange}
                value={this.state.address.state || ""} />
            </Form.Group>

            <Form.Group as={Col} md={3} controlId="zipcode">
              <Form.Label>Zipcode</Form.Label>
              <Form.Control
                onChange={this.handleAddressChange}
                value={this.state.address.zipcode || ""} />
            </Form.Group>
          </Form.Row>

          <h1>Floor Plan</h1>
          <hr />
          <Form.Row>
            <Form.Group as={Col} md={4} controlId="name">
              <Form.Label>Plan Name</Form.Label>
              <Form.Control
                onChange={this.handlePlanChange}
                value={this.state.floorPlan.name || ""} />
            </Form.Group>

            <Form.Group as={Col} md={4} controlId="roomCount">
              <Form.Label>Room Count</Form.Label>
              <Form.Control
                onChange={this.handlePlanChange}
                value={this.state.floorPlan.roomCount || ""} />
            </Form.Group>

            <Form.Group as={Col} md={4} controlId="sqft">
              <Form.Label>Sqft.</Form.Label>
              <Form.Control
                onChange={this.handlePlanChange}
                value={this.state.floorPlan.sqft || ""} />
            </Form.Group>
          </Form.Row>

          <h1>Rent Price</h1>
          <hr />
          <Form.Row>
            <Form.Group as={Col} md={12} controlId="rentPrice">
              <Form.Label>Rent Price</Form.Label>
              <Form.Control
                onChange={this.handleChange}
                value={this.state.rentPrice || ""} />
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
