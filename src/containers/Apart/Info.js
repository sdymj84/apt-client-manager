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
import { Container, Image, Row, Col, Form } from "react-bootstrap";
import LoaderButton from '../../components/LoaderButton'
import { API } from 'aws-amplify'
import UnitInfo from './UnitInfo'
import ConfirmModal from '../../components/ConfirmModal'
import AlertModal from '../../components/AlertModal'
import queryString from 'query-string'


const StyledContainer = styled(Container)`
  margin-top: 30px; 
  max-width: 700px;
  .btn-container {
    text-align: right;
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
  max-width: 500px;
  margin: 2em auto 3em auto;
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
      modalShow: false,
      modalAlertShow: false,
      modalMessage: "",
      indexToDelete: "",
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
      modalShow: true,
      modalMessage: "Are you sure to delete this resident?",
      indexToDelete: i
    })
  }

  handleModalAlertClose = () => {
    this.setState({ modalAlertShow: false })
  }

  handleModalNo = () => {
    this.setState({ modalShow: false })
  }

  handleModalYes = async () => {
    this.setState(prevState => {
      const isDeleting = prevState.isDeleting
      isDeleting[prevState.indexToDelete] = true
      return {
        modalShow: false,
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

  render() {
    const { apart } = this.state
    return (
      <StyledContainer >
        <StyledApartList>
          <Row>
            <Col sm={4} className="apt-img">
              <Image src="https://s3.us-east-2.amazonaws.com/apt-api-dev-attachmentsbucket-15cyis9p1flj3/public/savoy-main.jpg" fluid />
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
        <div>
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
        </div>

        {this.state.isExpanded && apart &&
          <UnitInfo
            state={this.state}
            handleDeleteClick={this.handleDeleteClick}
            apartRef={this.apartRef}
            theme={this.props.theme}
          />
        }

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

      </StyledContainer >
    )
  }
}

export default ApartInfo
