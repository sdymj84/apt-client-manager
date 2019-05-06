import React, { Component } from 'react'
import styled from 'styled-components'
import { Container, Form, Row, Col } from 'react-bootstrap'
import LoaderButton from '../../components/LoaderButton';
import { API } from 'aws-amplify'


const StyledContainer = styled(Container)`
  margin-top: 3em;
  max-width: 700px;
  margin-bottom: 10em;
`

const StyledForm = styled(Form)`
  h3 {
    margin-top: 1em;
  }
  #nextApartId {
    margin: 1em 0;
  }
`

export class AddUnits extends Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {
      apartId: "",
      nextApartId: "",
      address: {
        street: "",
        apt: "",
        city: "",
        state: "",
        zipcode: "",
      },
      floorPlan: {
        name: "",
        roomCount: "",
        sqft: "",
      },
      rentPrice: "",
      announcement: "",
      builtIn: "",
      isLoading: false,
    }
  }

  componentDidMount() {
    this._isMounted = true
    this.getApartInfo()
  }

  getApartInfo = async () => {
    try {
      const aparts = await API.get('apt', `/aparts/list`)
      const lastUnit = aparts.Items.length
        && aparts.Items[aparts.Items.length - 1]

      this._isMounted && lastUnit && this.setState({
        apartId: lastUnit.apartId,
        nextApartId: Number(lastUnit.apartId) < 1000
          ? '0' + (Number(lastUnit.apartId) + 1).toString()
          : (Number(lastUnit.apartId) + 1).toString(),
        address: lastUnit.address,
        floorPlan: lastUnit.floorPlan,
        rentPrice: lastUnit.rentPrice,
        announcement: lastUnit.announcement,
        builtIn: lastUnit.builtIn,
      })
    } catch (e) {
      console.log(e, e.response)
    }
  }

  componentWillUnmount() {
    this._isMounted = false
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

    await this.setState(prevState => ({
      isLoading: true,
      address: {
        ...prevState.address,
        apt: prevState.nextApartId
      }
    }))

    try {
      await API.post('apt', `/aparts`, {
        body: {
          ...this.state,
          apartId: this.state.nextApartId,
        }
      })
    } catch (e) {
      console.log(e, e.response)
    }

    this.getApartInfo()
    this.setState({ isLoading: false })
  }


  render() {
    return (
      <StyledContainer>
        <h1>Add Units</h1>
        <p>Retrieved info from most recently added unit -
          {' ' + this.state.apartId}</p>
        <hr />
        <h3>Address</h3>
        <StyledForm onSubmit={this.handleSubmit}>
          <Row>
            <Col>
              <Form.Group controlId="street">
                <Form.Label>Street</Form.Label>
                <Form.Control
                  type="text"
                  required
                  onChange={this.handleAddressChange}
                  value={this.state.address.street} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={4}>
              <Form.Group controlId="city">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  required
                  onChange={this.handleAddressChange}
                  value={this.state.address.city} />
              </Form.Group>
            </Col>
            <Col sm={4}>
              <Form.Group controlId="state">
                <Form.Label>State</Form.Label>
                <Form.Control
                  type="text"
                  required
                  onChange={this.handleAddressChange}
                  value={this.state.address.state} />
              </Form.Group>
            </Col>
            <Col sm={4}>
              <Form.Group controlId="zipcode">
                <Form.Label>Zipcode</Form.Label>
                <Form.Control
                  type="text"
                  required
                  onChange={this.handleAddressChange}
                  value={this.state.address.zipcode} />
              </Form.Group>
            </Col>
          </Row>

          <h3>Floor Plan</h3>
          <Row>
            <Col sm={6}>
              <Form.Group controlId="name">
                <Form.Label>Name of Floor Plan</Form.Label>
                <Form.Control
                  type="text"
                  required
                  onChange={this.handlePlanChange}
                  value={this.state.floorPlan.name} />
              </Form.Group>
            </Col>
            <Col sm={3}>
              <Form.Group controlId="roomCount">
                <Form.Label>Room Count</Form.Label>
                <Form.Control
                  type="text"
                  required
                  onChange={this.handlePlanChange}
                  value={this.state.floorPlan.roomCount} />
              </Form.Group>
            </Col>
            <Col sm={3}>
              <Form.Group controlId="sqft">
                <Form.Label>Sqft.</Form.Label>
                <Form.Control
                  type="text"
                  required
                  onChange={this.handlePlanChange}
                  value={this.state.floorPlan.sqft} />
              </Form.Group>
            </Col>
          </Row>

          <h3>Others</h3>
          <Row>
            <Col>
              <Form.Group controlId="rentPrice">
                <Form.Label>Rent Price</Form.Label>
                <Form.Control
                  type="text"
                  required
                  onChange={this.handleChange}
                  value={this.state.rentPrice} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="builtIn">
                <Form.Label>Built In Year</Form.Label>
                <Form.Control
                  type="text"
                  required
                  onChange={this.handleChange}
                  value={this.state.builtIn} />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group controlId="announcement">
                <Form.Label>Announcement</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  onChange={this.handleChange}
                  value={this.state.announcement} />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col sm={6}>
              <Form.Group controlId="nextApartId">
                <Form.Control
                  type="text"
                  required
                  placeholder="Unit No. to save"
                  onChange={this.handleChange}
                  value={this.state.nextApartId} />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <LoaderButton
                block
                type="submit"
                isLoading={this.state.isLoading}
                text={`Save on ${this.state.nextApartId}`}
                loadingText={`Saving on ${this.state.nextApartId}...`}
                variant="outline-secondary" />
            </Col>
          </Row>
        </StyledForm>

      </StyledContainer>
    )
  }
}

export default AddUnits
