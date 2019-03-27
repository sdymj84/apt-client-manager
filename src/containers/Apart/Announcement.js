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
import AlertModal from '../../components/AlertModal'


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
      modalShow: false,
      modalMessage: "",
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
    this.setState({
      recipient: e,
      recipientDetail: (e !== "Building/Unit") ? e : ""
    })
  }

  handleModalClose = () => {
    this.setState({ modalShow: false })
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

    if (!this.state.recipients.length) {
      const msg = "<div>Please add recipients by one of followings<ul>" +
        "<li>Dropdown > Select Building/Unit > Enter Building number of Unit number > Press 'Add' button</li>" +
        "<li>Dropdown > Select All or other conditions > Press 'Add' button</li>" +
        "</ul></div>"
      this.setState({
        modalShow: true,
        modalMessage: msg
      })
      return
    }

    this.setState({ isLoading: true })

    // 1. If "All", get aparts list from server 
    //    > save ids in recipients array

    // 2. If "Building/Unit", do nothing because they are already saved in recipients array

    // 3. If "Pet Owner", get aparts list and filter by pet from server 
    //    > save ids in recipients array


    // Loop recipients array and update announcement for each recipient
    const done = this.state.recipients.map(async (recipient, i) => {
      try {
        switch (recipient) {
          case "All":
            await this.getFilteredListAndUpdate('All', '/aparts/list')
            break
          case "Pet Owners":
            await this.getFilteredListAndUpdate('Pet Owners', '/aparts/list?isPet=true')
            break
          default:
            await this.getUnitListAndUpdate(recipient)
            break
        }
      } catch (e) {
        console.log(e, e.response)
      }
    })
    Promise.all(done).then(() => {
      const msg = "Successfully announced." +
        "Any remaining recipients are invalid building/unit numbers."
      this.setState({
        isLoading: false,
        modalShow: true,
        modalMessage: msg
      })
    })
  }

  getFilteredListAndUpdate = async (condition, apiPath) => {
    const result = await API.get('apt', apiPath)
    result.Items.map(async item => {
      console.log(condition, item.apartId)
      await this.updateAnnouncement(item.apartId)
        && this.setState(prevState => ({
          recipients: prevState.recipients.filter(recipient =>
            recipient !== condition)
        }))
    })
  }

  getUnitListAndUpdate = async (recipient) => {
    console.log("Building/Unit", recipient)
    const units = await this.getUnitList(recipient)
    const done = units.length && units.map(async unit => {
      await this.updateAnnouncement(unit.apartId)
    })
    Promise.all(done).then(() => {
      this.setState(prevState => ({
        recipients: prevState.recipients.filter(stateRecipient =>
          stateRecipient !== recipient)
      }))
    })
  }

  getUnitList = async (apartId) => {
    try {
      const apart = await API.get('apt', `/aparts/list/${apartId}`)
      if (!apart.Items.length) throw new Error(`${apartId} is invalid unit number.`)
      return apart.Items
    } catch (e) {
      console.log(e, e.response)
      return false
    }
  }

  updateAnnouncement = async (apartId) => {
    try {
      await API.put('apt', `/aparts/${apartId}`, {
        body: {
          announcement: this.state.announcement
        }
      })
      this.setState(prevState => ({
        recipients: prevState.recipients.filter(recipient =>
          recipient !== apartId)
      }))
      return true
    } catch (e) {
      console.log(e, e.response)
      return false
    }
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
                  placeholder={`${this.state.recipient}`}
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
                disabled={this.state.recipient === "To Whom.."}
                variant={`outline-${this.props.theme.buttonTheme}`}>
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

        <AlertModal
          modalShow={this.state.modalShow}
          modalClose={this.handleModalClose}
          modalMessage={this.state.modalMessage}
          theme={this.props.theme}
        />
      </StyledContainer >
    )
  }
}

export default Announcement
