import React, { Fragment } from 'react'
import styled from 'styled-components'
import { Form, Card, ListGroup, Button, Badge, Row, Col } from "react-bootstrap";
import moment from 'moment'
import LoaderButton from '../../components/LoaderButton';


const StyledExpandedForm = styled(Form)`
  margin-top: 2em;
  width: 100%;
  .btn-edit-apart {
    margin: 1em 0;
  }
`

const StyledCard = styled(Card)`
  margin-bottom: 20px;
  .badge-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;

    span:last-child {
      flex-basis: 0;
    }
  }
  .badge {
    width: 100px;
    padding: 5px;
  }

  @media (max-width: 576px) {
    .list-group span {
      display: block;
    }
  }

  .list-group-item:first-child {
    border-top: 2px solid #005916;
  }

  .btn-delete-resident {
    margin: 0;
  }

  .card-footer {
    text-align: right;
    background-color: #eff7f5;
  }

  .row {
    align-items: center;
  }
`

const UnitInfo = ({ state, ...rest }) => {
  const { apart } = state

  const formatPhoneNumber = phoneNumberString => {
    var cleaned = (phoneNumberString).replace(/\D/g, '')
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3]
    }
    return null
  }

  console.log(state)

  return (
    <StyledExpandedForm>
      <h1 ref={rest.apartRef}>Apart Info</h1>
      <hr />
      <div className="btn-container">
        <Button
          className="btn-edit-apart"
          variant={`outline-${rest.theme.buttonTheme}`}>
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
              <Row>
                <Col sm={4}>Address</Col>
                <Col sm={8}>{apart.address.street}, Apt {apart.address.apt}, {apart.address.city}, {apart.address.state} {apart.address.zipcode}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col sm={4}>Floor Plan</Col>
                <Col sm={8}>{apart.floorPlan.name} / {apart.floorPlan.roomCount} room(s) / {apart.floorPlan.sqft} sqft.</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Rent Price</Col>
                <Col>${apart.rentPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Current Residents</Col>
                <Col>
                  {apart.residents.map((resident, i) =>
                    <div key={i}>{resident.name}</div>
                  )}
                </Col>
              </Row>
            </ListGroup.Item>
            {state.residents.length ?
              <Fragment>
                <ListGroup.Item>
                  <Row>
                    <Col>Move In Date</Col>
                    <Col>{moment(state.residents[0].moveInDate).format('L')}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Lease From Date</Col>
                    <Col>{moment(state.residents[0].leaseStartDate).format('L')}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Lease To Date</Col>
                    <Col>{moment(state.residents[0].leaseEndDate).format('L')}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Has Pet</Col>
                    <Col>{state.residents.filter(resident =>
                      resident.isPet === true).length
                      ? "Yes" : "No"}</Col>
                  </Row>
                </ListGroup.Item>
              </Fragment> : null}
          </ListGroup>
        </Card.Body>
      </StyledCard>


      {/*========================================
          Resident List
      =========================================*/}
      {state.residents.map((resident, i) =>
        <StyledCard border="success" key={i}>
          <Card.Body>
            <Card.Title className="badge-container">
              <h1 className="resident-name">{resident.firstName} {resident.lastName}</h1>
              <span>{(i === 0) && <Badge variant="primary">primary</Badge>}
              </span>
            </Card.Title>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col sm={4}>Email</Col>
                  <Col sm={8} className="badge-container">
                    <span>{resident.email}</span>
                    <span>
                      {resident.notifications.isEmailSub
                        ? <Badge variant="success">subscribed</Badge>
                        : <Badge variant="warning">not subscribed</Badge>}
                    </span>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col sm={4}>Phone</Col>
                  <Col sm={8} className="badge-container">
                    <span>{resident.phone && formatPhoneNumber(resident.phone)}</span>
                    <span>
                      {resident.notifications.isVoiceCallSub
                        ? <Badge variant="success">call sub: yes</Badge>
                        : <Badge variant="warning">call sub: no</Badge>}
                      {resident.notifications.isTextSub
                        ? <Badge variant="success">text sub: yes</Badge>
                        : <Badge variant="warning">text sub: no</Badge>}
                    </span>
                  </Col>
                </Row>
              </ListGroup.Item>

              {resident.vehicles.map((vehicle, i) =>
                vehicle.model && <ListGroup.Item key={i}>
                  <Row>
                    <Col sm={4}>Vehicle</Col>
                    <Col sm={8}>
                      <div>{vehicle.year} {vehicle.color} {vehicle.make} {vehicle.model}</div>
                      <div>{vehicle.licensePlate} / {vehicle.state}</div>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Row>
                  <Col sm={4}>Emergency Contact</Col>
                  <Col sm={8}>
                    <div>{resident.erContact.firstName} {resident.erContact.lastName}</div>
                    <div>{resident.erContact.phone &&
                      formatPhoneNumber(resident.erContact.phone)}</div>
                  </Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
          <Card.Footer>
            <LoaderButton
              className="btn-delete-resident"
              variant="outline-danger"
              margin="0"
              isLoading={state.isDeleting[i]}
              text="DELETE"
              loadingText="DELETING.."
              onClick={() => rest.handleDeleteClick(i)}>
            </LoaderButton>
          </Card.Footer>
        </StyledCard>
      )}
    </StyledExpandedForm>
  )
}

export default UnitInfo
