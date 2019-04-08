import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import { Container, CardColumns, Image, Row, Col, Form } from "react-bootstrap";
import RequestCard from './RequestCard';
import NoteModal from './NoteModal'
import { API } from 'aws-amplify';
import { HashLoader } from 'react-spinners'


const StyledContainer = styled(Container)`
  margin-top: 2em;
  .card-columns .card {
    margin-bottom: 2em;
  }

  @media (min-width: 576px) {
    .card-columns {
      column-count: 1;
    }
  }

  .card-columns {
    @media (min-width: 576px) {
      column-count: 1;
    }
    @media (min-width: 992px) {
      column-count: 2;
    }
  }

  .loader-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10em;
  }
  
`

const StyledHashLoader = styled(HashLoader)`
  display: block;
  margin: 0 auto;
  border-color: red;
`

export class Requests extends Component {
  state = {
    modalNote: [],
    modalShow: false,
    requests: "",
    indexToUpdate: "",
    isLoading: false,
  }

  componentDidMount = () => {
    this.refresh()
  }

  validateForm = () => {
    const note = this.state.modalNote[this.state.indexToUpdate]
    return note && note.length > 0
  }

  handleNoteClick = (i) => {
    this.setState({
      modalShow: true,
      indexToUpdate: i
    })
  }

  handleModalClose = () => {
    this.setState({ modalShow: false })
  }

  handleNoteChange = (e) => {
    e.persist()
    this.setState(prevState => {
      const modalNote = prevState.modalNote
      modalNote[prevState.indexToUpdate] = e.target.value
      return { modalNote }
    })
  }

  handleOpenAttachment = () => {
    console.log("open attachment")
  }

  handleNoteSubmit = async (e) => {
    e.persist()
    e.preventDefault()
    const request = this.state.requests.Items[this.state.indexToUpdate]

    this.setState({ isLoading: true })

    try {
      await API.put('apt', `/requests/${request.requestId}`, {
        body: {
          apartId: request.apartId,
          maintananceNote: this.state.modalNote[this.state.indexToUpdate]
        }
      })
      this.setState({
        isLoading: false,
        modalShow: false
      })
      this.refresh()
    } catch (e) {
      console.log(e, e.response)
    }
  }

  refresh = async () => {
    try {
      const requests = await API.get('apt', '/requests/list')
      this.setState({ requests })
    } catch (e) {
      console.log(e, e.response)
    }
  }

  render() {
    return (
      <StyledContainer>
        {this.state.requests
          ? <Fragment>
            <CardColumns>
              {this.state.requests.Items.map((request, i) =>
                <RequestCard
                  key={request.requestId}
                  request={request}
                  theme={this.props.theme}
                  handleOpenAttachment={this.handleOpenAttachment}
                  handleNoteClick={() => this.handleNoteClick(i)}
                />)}
            </CardColumns>

            <NoteModal
              modalShow={this.state.modalShow}
              modalClose={this.handleModalClose}
              modalNote={this.state.modalNote[this.state.indexToUpdate]}
              validateForm={this.validateForm}
              isLoading={this.state.isLoading}
              handleNoteChange={this.handleNoteChange}
              handleModalClose={this.handleModalClose}
              handleNoteSubmit={this.handleNoteSubmit}
              theme={this.props.theme}
            />
          </Fragment>
          : <div className="loader-container">
            <StyledHashLoader
              sizeUnit={"px"}
              size={50}
              color={'#36D7B7'} />
          </div>}
      </StyledContainer>
    )
  }
}

export default Requests
