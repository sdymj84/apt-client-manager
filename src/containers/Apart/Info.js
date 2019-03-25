import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import { Container, Image, Row, Col, Form, Card, ListGroup, Button, Badge } from "react-bootstrap";
import LoaderButton from '../../components/LoaderButton'
import { API } from 'aws-amplify'
// import { Link } from 'react-router-dom'
// import moment from 'moment'


/*===============================================================
  Styles
===============================================================*/
const StyledContainer = styled(Container)`
  margin-top: 30px; 
  .unit-form-container {
    display: flex;
    justify-content: flex-end;
  }
  span {
    display: inline-block;
    
    :first-child {
      width: 100%;
      max-width: 300px;
    }
  }

  @media (max-width: 576px) {
    span {
      display: block;
    }
  }

  .list-group-item:first-child {
    border-top: 2px solid #005916;
  }

  .btn-container {
    text-align: right;
  }
  button {
    margin: 0 0 5px 5px;
  }
`

const StyledForm = styled(Form)`
  max-width: 500px;
  margin-top: 1em;
  div {
    margin: 10px;
  }
`

const StyledExpandedForm = styled(Form)`
  margin-top: 2em;
  width: 100%;
  button {
    margin: 1em 0;
  }
`

const StyledCard = styled(Card)`
  margin-bottom: 20px;
  #badge {
    float: right;
    width: 100px;
    padding: 5px;
  }
`

const StyledApartList = styled.div`
  border: 1px solid green;
  border-radius: 4px;
  font-size: 1.1em;
  padding: 5px;
  .apt-img {
    display: flex;
    align-items: center;
  }
  .apt-desc {
    padding: 20px;
  }
  .apt-name {
    font-weight: bold;
  }
  .apt-desc-list {
    list-style-type: circle;
    padding-left: 20px;
  }
`

export class ApartInfo extends Component {
  state = {
    apartId: "",
    isLoading: false,
    isExpanded: false,
    residents: [],
    apart: "",
  }

  /*===============================================================
    Form Validation
  ===============================================================*/
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
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleCheckClick = async (e) => {
    e.preventDefault()
    this.setState({ isLoading: true })
    try {
      const apart = await API.get('apt', `/aparts/${this.state.apartId}`)
      if (!apart) throw new Error("You entered invalid unit number")
      const residents = apart.residents.map(async resident => {
        console.log(resident)
        return await API.get('apt', `/residents/${resident.id}`)
      })
      Promise.all(residents).then((residents) => {
        let primaryIndex = 0
        let primaryResident = {}
        residents.forEach((resident, i) => {
          if (resident.isPrimary === true) {
            primaryIndex = i
            primaryResident = resident
          }
        })
        if (primaryIndex) {
          residents.splice(primaryIndex, 1)
          residents.unshift(primaryResident)
        }
        this.setState({
          isLoading: false,
          isExpanded: true,
          residents,
          apart
        })
      })
    } catch (e) {
      alert(e.message)
      this.setState({
        isExpanded: false,
        isLoading: false
      })
      console.log(e, e.response)
    }
  }

  render() {
    const { apart } = this.state
    return (
      <StyledContainer >
        <StyledApartList>
          <Row>
            <Col sm={4} className="apt-img">
              <Image src="https://place-hold.it/300x300" fluid />
            </Col>
            <Col sm={8} className="apt-desc">
              <div>
                <p className="apt-name">SAVOY</p>
                <ul className="apt-desc-list">
                  <li>5901 College Blvd, Overland Park, KS 66211</li>
                  <li>(913) 888-7777</li>
                  <li>20 Units, Built in 2002</li>
                </ul>
              </div>
            </Col>
          </Row>
        </StyledApartList>
        <div className="unit-form-container">
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
        </div>

        {this.state.isExpanded && apart &&
          <StyledExpandedForm>
            <h1>Apart Info</h1>
            <hr />
            <div className="btn-container">
              <Button variant={`outline-${this.props.theme.buttonTheme}`}>
                Edit Apart Info
              </Button>
            </div>
            <StyledCard border="success">
              <Card.Body>
                <Card.Title>
                  <h1>Unit #{apart.apartId}</h1>
                </Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <span>Address</span>
                    <span>{apart.address.street}, Apt {apart.address.apt}, {apart.address.city}, {apart.address.state} {apart.address.zipcode}</span>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <span>Floor Plan</span>
                    <span>{apart.floorPlan.name} / {apart.floorPlan.roomCount} room(s) / {apart.floorPlan.sqft} sqft.</span>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <span>Rent Price</span>
                    <span>${apart.rentPrice}</span>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <span>Current Residents</span>
                    <span>
                      {apart.residents.map((resident, i) =>
                        <span key={i}>{resident.name}</span>
                      )}
                    </span>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </StyledCard>

            {this.state.residents.map((resident, i) =>
              <StyledCard border="success" key={i}>
                <Card.Body>
                  <Card.Title>
                    {(i === 0) && <Badge id="badge" variant="primary">primary</Badge>}
                    <h1 className="resident-name">{resident.firstName} {resident.lastName}</h1>
                  </Card.Title>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <span>Email</span>
                      <span>{resident.email}</span>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </StyledCard>
            )}
          </StyledExpandedForm>
        }

      </StyledContainer >
    )
  }
}

export default ApartInfo
