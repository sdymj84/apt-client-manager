/*  
1. Select whom you want to announce
  * Dropdown menu
  - All
  - Pet Owners
  - Specific Buildings 
  - Specific Units
2. Enter building number or units in input field
3. Enter announcement message in textarea
4. Submit
5. Query the list and get array of apartId
6. Loop apartIds and update each Apart DB to update announcement property

(this 5,6 steps look like bad practice but there's no batch update operator on DynamoDB
maybe I should've used Relational DB)

*/

import React, { Component } from 'react'
import styled from 'styled-components'
import { Container, Row, Col, Form, Dropdown, Button, Badge } from "react-bootstrap";
import LoaderButton from '../../components/LoaderButton'
import { API } from 'aws-amplify'

const StyledContainer = styled(Container)`
  margin-top: 3em;
  .to-dropdown button  {
    width: 100%;
  }
  .btn-add-recipient {
    margin-bottom: 1em;
  }
`

const RecipientsContainer = styled.div`
  border: 1px solid ${props => props.theme.boxBorder};
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 1em;
  .badge {
    padding: 6px 10px;
    margin: 3px;
  }
`

const BadgeCloseButton = styled(Button)`
  font-size: 10px;
  padding: 0 3px;
  margin: 0 -4px 0 5px;
  border: 1px solid white;
`

export class Announcement extends Component {
  constructor(props) {
    super(props)
    this.state = {
      recipients: [],
      recipient: "To Whom..",
      recipientDetail: "",
      announcement: "",
      isLoading: false,
    }
  }

  validateForm = () => {
    return this.state.announcement.length > 0
  }

  validateNumber = (e) => {
    return e.target.value.match(/^[0-9]+$|^$/)
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleDropdownChange = (e) => {
    this.setState({ recipient: e })
  }

  handleRecipientBadgeClose = (i) => {
    console.log(i)
    this.setState(prevState => ({
      recipients: prevState.recipients.filter((recipient, j) =>
        j !== i
      )
    }))
  }

  handleRecipientSubmit = (e) => {
    e.preventDefault()
    this.setState(prevState => ({
      recipients: [...prevState.recipients, prevState.recipientDetail],
      recipientDetail: ""
    }))
  }

  handleAnnouncementSubmit = async (e) => {
    e.preventDefault()

    this.setState({ isLoading: true })

    // 1. If "All", get aparts list from server 
    //    > save ids in recipients array

    // 2. If "Building/Unit", do nothing because they are already saved in recipients array

    // 3. If "Pet Owner", get aparts list and filter by pet from server 
    //    > save ids in recipients array

    try {
      switch (this.state.recipient) {
        case "All":
          const result = await API.get('apt', '/aparts/list/')
          console.log(result)
          // this.setState({
          //   recipients: result.map(item => item.apartId)
          // })
          break;
        case "Pet Owners":
          console.log("get aparts list and filter by pet from server > save ids in recipients array")
          break;
        default:
          break;
      }
    } catch (e) {
      console.log(e, e.response)
    }



    // Loop recipients array and update announcement for each recipient
    this.state.recipients.map((recipient, i) => {
      try {
        // await API.get('apt', '/')
      } catch (e) {

      }
    })

    this.setState({ isLoading: false })
  }

  render() {
    return (
      <StyledContainer>
        <h1>Make Announcement</h1>
        <hr />

        {/*==================================================
          Set Recipients
        ===================================================*/}
        <Form onSubmit={this.handleRecipientSubmit}>
          <Row>
            <Col sm={4}>
              <Dropdown
                className="to-dropdown"
                onSelect={this.handleDropdownChange}>
                <Dropdown.Toggle
                  variant={`outline-${this.props.theme.buttonTheme}`}>
                  {this.state.recipient}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="All">All</Dropdown.Item>
                  <Dropdown.Item eventKey="Building/Unit">Building/Unit</Dropdown.Item>
                  <Dropdown.Item eventKey="Pet Owners">Pet Owners</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>

            <Col sm={6}>
              <Form.Group controlId="recipientDetail">
                <Form.Control
                  placeholder="Building/Unit number"
                  type="text"
                  disabled={(this.state.recipient !== "Building/Unit")}
                  onChange={(e) => this.validateNumber(e) && this.handleChange(e)}
                  value={this.state.recipientDetail}>
                </Form.Control>
              </Form.Group>
            </Col>

            <Col sm={2}>
              <Button
                className="btn-add-recipient"
                block
                type="submit"
                variant={`outline-${this.props.theme.buttonTheme}`}
                disabled={(this.state.recipient !== "Building/Unit")}>
                Add
              </Button>
            </Col>
          </Row>
        </Form>

        {this.state.recipients.length
          ? <RecipientsContainer>
            {this.state.recipients.map((recipient, i) =>
              <Badge key={i}
                variant={`${this.props.theme.buttonTheme}`}>
                {recipient}
                <BadgeCloseButton
                  variant={`${this.props.theme.buttonTheme}`}
                  onClick={() => this.handleRecipientBadgeClose(i)}
                >X</BadgeCloseButton>
              </Badge>
            )}
          </RecipientsContainer>
          : null
        }



        {/*==================================================
          Write Announcement
        ===================================================*/}
        <Form onSubmit={this.handleAnnouncementSubmit}>
          <Form.Group controlId="announcement">
            <Form.Control
              as="textarea" rows={10}
              onChange={this.handleChange}
              value={this.state.announcement}>
            </Form.Control>
          </Form.Group>

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
        </Form>
      </StyledContainer >
    )
  }
}

export default Announcement
