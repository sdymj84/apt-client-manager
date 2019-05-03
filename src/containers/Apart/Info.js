/* Logic Flow
1. Show Savoy apartment info
2. Enter apart number to show unit info
  -> Look up Apart DB : API GET /aparts/{id}
  -> Get residents info who live in the unit
  -> Get residents info and store both of apart, resident in state
3. Swap primary resident to residents[0]
4. Render apart, resident info

*/

import React, { Component } from 'react'
import styled from 'styled-components'
import { Container, Image, Row, Col, Form, Button } from "react-bootstrap";
import LoaderButton from '../../components/LoaderButton'
import { API } from 'aws-amplify'
import UnitInfo from './UnitInfo'
import ConfirmModal from '../../components/ConfirmModal'
import AlertModal from '../../components/AlertModal'
import queryString from 'query-string'
import moment from 'moment'
import { Link } from 'react-router-dom'


const StyledContainer = styled(Container)`
  margin-top: 30px; 
  max-width: 700px;
  .btn-container {
    text-align: right;
  }
  .form-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .btn-add-units {
    margin: 2em 0 2em 2rem;
    button {
      height: 80px;
    }
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

const StyledForm = styled(Form)`
  width: 70%;
  margin: 2em 0;
`



export class ApartInfo extends Component {
  constructor(props) {
    super(props)

    this.apartRef = React.createRef()
    this.unitSearchRef = React.createRef()
    this._isMounted = false
    this.state = {
      apartId: "",
      isLoading: false,
      isDeleting: [],
      isExpanded: false,
      residents: [],
      apart: "",
      payments: "",
      modalMoveOutShow: false,
      modalRenewShow: false,
      modalConfirmShow: false,
      modalAlertShow: false,
      modalMessage: "",
      indexToDelete: "",
      moveOutDate: new Date(),
      moveOutMessage: [],
      newLeaseTerm: "",
      earlyMoveOutFee: "",
    }
  }

  componentDidMount = () => {
    this._isMounted = true
    const values = queryString.parse(this.props.location.search)
    if (values.apartId) {
      this._isMounted && this.setState({
        apartId: values.apartId
      }, () => { this.getApartInfo("check") })
    } else {
      this.unitSearchRef.current.focus()
    }
  }

  componentWillUnmount() {
    this._isMounted = false
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
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleCheckClick = async (e) => {
    e.preventDefault()
    this.getApartInfo("check")
  }

  handleDeleteClick = (i) => {
    this.setState({
      modalConfirmShow: true,
      modalMessage: "Are you sure to delete this resident?",
      indexToDelete: i
    })
  }

  handleMoveOutModalShow = () => {
    this.setState({ modalMoveOutShow: true })
  }

  handleMoveOutModalClose = () => {
    this.setState({ modalMoveOutShow: false })
  }

  handleRenewModalShow = () => {
    this.setState({ modalRenewShow: true })
  }

  handleRenewModalClose = () => {
    this.setState({ modalRenewShow: false })
  }

  handleModalAlertClose = () => {
    this.setState({ modalAlertShow: false })
  }

  handleModalNo = () => {
    this.setState({ modalConfirmShow: false })
  }

  handleModalYes = async () => {
    this.setState(prevState => {
      const isDeleting = prevState.isDeleting
      isDeleting[prevState.indexToDelete] = true
      return {
        modalConfirmShow: false,
        isDeleting
      }
    })

    const { apartId, residentId } = this.state.residents[this.state.indexToDelete]

    try {
      await API.put('apt', `/aparts/${apartId}/remove/${residentId}`)
      this.getApartInfo("delete")
      await API.del('apt', `/residents/${residentId}`)
    } catch (e) {
      console.log(e, e.response)
    }

    const deletingUser = this.state.residents[this.state.indexToDelete]
    deletingUser && this.setState(prevState => ({
      isDeleting: prevState.isDeleting.map(isDel => false),
      modalAlertShow: true,
      modalMessage: "<div>The resident has been deleted from database.</div>"
        + "<div>The system, however, does not support deleting from AWS User Pool.</div>"
        + "<div>Please go to AWS Cognito UserPool console and manually delete the user.</div>"
        + `<br/><div>userID: ${deletingUser.residentId}</div>`
        + `<div>email: ${deletingUser.email}</div>`
        + "<br/><div>Press OK only after you've deleted the user from UserPool.</div>"
    }))

  }

  // show or refresh user info (expanded cards)
  getApartInfo = async (action) => {
    this.setState({ isLoading: true })
    try {
      const apart = await API.get('apt', `/aparts/${this.state.apartId}`)
      if (!apart) throw new Error("You entered invalid unit number")
      const residents = apart.residents.map(async resident => {
        const result = await API.get('apt', `/residents/${resident.id}`)
        this.setState(prevState => ({
          isDeleting: [...prevState.isDeleting, false]
        }))
        return result
      })
      let payments = await API.get('apt', `/payments/${this.state.apartId}`)
      payments = payments.Items

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
          apart,
          payments,
          moveOutDate: apart.leaseEndDate
        })

        this.props.updateApartProps(apart)

        action === "check" && window.scrollTo({
          top: this.apartRef.current.offsetTop,
          left: 0,
          behavior: 'smooth'
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

  handleDateChange = (date) => {
    /* 
      Calculate balance
      1. if moveOutDate is earlier than leaseEndDate
        -> broke contract fee : + 1 month rent price
      2. if moveOutDate is later than two months from now
        -> nothing to do
      3. if moveOutDate is earlier than two months from now
        -> remaining payment balance is two months rent price
    */

    const today = moment().startOf('date')
    const sixtyDaysFromNow = moment().add(60, 'days')
    const moveOutDate = moment(date)
    const leaseEndDate = moment(this.state.apart.leaseEndDate)
    const rentPrice = this.state.apart.rentPrice
    const diffDays = moveOutDate.diff(today, 'days')
    const oneDayProrated = Math.round(rentPrice / 0.3) / 100
    let extraPayment = 0
    let earlyMoveOutFee = 0
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    })

    const moveOutMessage = []
    if (moveOutDate < leaseEndDate) {
      moveOutMessage.push(`<div><strong>Lease Contract ends ${leaseEndDate.format('L')}</strong></div>
      <div>One month rent will be charged due to early move out</div>
      <hr />
      <div className="total-payment">Amount : ${formatter.format(Number(rentPrice))}</div>`)
    }

    if (diffDays < 60) {
      extraPayment = oneDayProrated * (60 - diffDays)

      moveOutMessage.push(`<div><strong>60 days notice rule</strong></div>
      <div>You need to pay until ${sixtyDaysFromNow.format('L')} (60 days from now)</div>
      <div>1 day prorated value : ${formatter.format(oneDayProrated)}</div>
      <div>Additional days you need to pay : ${60 - diffDays}</div>
      <hr />
      <div className="total-payment">Amount : ${formatter.format(Number(extraPayment))}`)
    }

    if (moveOutDate < leaseEndDate || diffDays < 60) {
      earlyMoveOutFee = Number(rentPrice) + Number(extraPayment)
      moveOutMessage.push(`<div class="total-container">
      <div><strong>
      Total : ${formatter.format(earlyMoveOutFee)}
      </strong></div></div>`)
    }

    this.setState({
      moveOutDate: date,
      moveOutMessage,
      earlyMoveOutFee,
    })
  }

  handleMoveOutSubmit = async () => {
    this.setState({ isLoading: true })

    try {
      await API.put('apt', `/aparts/earlyMoveOut/${this.state.apartId}`, {
        body: {
          moveOutDate: this.state.moveOutDate
        }
      })
      // Add earlyMoveOutFee to payments db with apartId
      await this.addCharge(this.state.apartId)
    } catch (e) {
      console.log(e, e.response)
      this.setState({ isLoading: false })
    }

    this.getApartInfo("check")
    this.handleMoveOutModalClose()
  }

  addCharge = async (apartId) => {
    try {
      await API.post('apt', '/payments', {
        body: {
          apartId,
          title: "Early Move Out Fee",
          charge: this.state.earlyMoveOutFee,
          payment: 0,
        }
      })
    } catch (e) {
      console.log(e, e.response)
    }
  }

  handleRenewChange = (key, e) => {
    // this.setState({ newLeaseTerm: e.target.value })
    e.persist()
    this.setState({
      [key]: e.target.text
    })
  }

  handleRenewSubmit = async (e) => {
    e.preventDefault()
    const nlt = this.state.newLeaseTerm
    if (nlt < 6 || nlt > 12) {
      return
    }

    this.setState({ isLoading: true })

    const newLeaseStartDate = this.state.apart.leaseEndDate
    const newLeaseEndDate = moment(newLeaseStartDate).add(nlt, 'months')

    try {
      await API.put('apt', `/aparts/renew/${this.state.apartId}`, {
        body: {
          newLeaseTerm: this.state.newLeaseTerm,
          newLeaseStartDate: newLeaseStartDate,
          newLeaseEndDate: newLeaseEndDate,
        }
      })
    } catch (e) {
      console.log(e, e.response)
      this.setState({ isLoading: false })
    }

    this.getApartInfo("check")
    this.handleRenewModalClose()
  }

  render() {
    const { apart } = this.state
    return (
      <StyledContainer >
        <StyledApartList>
          <Row>
            <Col sm={4} className="apt-img">
              <Image src="https://s3.us-east-2.amazonaws.com/apt-api-dev-attachmentsbucket-11ysd3am6wave/public/savoy-main.jpeg" fluid />
            </Col>
            <Col sm={8} className="apt-desc">
              <div>
                <p className="apt-name">SAVOY</p>
                <ul className="apt-desc-list">
                  <li>7100 W. 141ST ST.  OVERLAND PARK, KS 66223</li>
                  <li>(833) 218-7587</li>
                  <li>20 Units, Built in 2002</li>
                </ul>
              </div>
            </Col>
          </Row>
        </StyledApartList>
        <div className='form-wrapper'>
          <StyledForm>
            <Form.Control size="lg" type="text"
              placeholder="Apt Number" id="apartId"
              value={this.state.apartId}
              ref={this.unitSearchRef}
              onChange={(e) => this.validateNumber(e) && this.handleChange(e)} />
            <LoaderButton type="submit"
              block
              variant={`outline-${this.props.theme.buttonTheme}`}
              onClick={this.handleCheckClick}
              disabled={!this.validateUnitForm()}
              isLoading={this.state.isLoading}
              text="Check"
              loadingText="Checking..">
            </LoaderButton>
          </StyledForm>
          <Link to='/add-units' className="btn-add-units">
            <Button
              variant="outline-primary">Add Units</Button>
          </Link>
        </div>

        {this.state.isExpanded && apart &&
          <UnitInfo
            state={this.state}

            isLoading={this.state.isLoading}
            modalMoveOutShow={this.state.modalMoveOutShow}
            modalRenewShow={this.state.modalRenewShow}
            moveOutDate={this.state.moveOutDate}
            moveOutMessage={this.state.moveOutMessage}

            handleDeleteClick={this.handleDeleteClick}
            apartRef={this.apartRef}
            theme={this.props.theme}
            leaseEndDate={apart.leaseEndDate}
            newLeaseTerm={this.state.newLeaseTerm}
            handleMoveOutModalShow={this.handleMoveOutModalShow}
            handleRenewModalShow={this.handleRenewModalShow}
            handleMoveOutModalClose={this.handleMoveOutModalClose}
            handleRenewModalClose={this.handleRenewModalClose}
            handleDateChange={this.handleDateChange}
            handleRenewChange={this.handleRenewChange}
            handleMoveOutSubmit={this.handleMoveOutSubmit}
            handleRenewSubmit={this.handleRenewSubmit}
          />
        }

        <ConfirmModal
          modalShow={this.state.modalConfirmShow}
          modalMessage={this.state.modalMessage}
          handleModalYes={this.handleModalYes}
          handleModalNo={this.handleModalNo}
          theme={this.props.theme} />
        <AlertModal
          modalShow={this.state.modalAlertShow}
          modalClose={this.handleModalAlertClose}
          modalMessage={this.state.modalMessage}
          theme={this.props.theme} />

      </StyledContainer >
    )
  }
}

export default ApartInfo
