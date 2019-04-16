import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import { Container, CardColumns, Card } from "react-bootstrap";
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

const StyledCard = styled(Card)`
  text-align: center;
  margin-top: 5em;
`

export class Requests extends Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {
      modalNote: [],
      modalShow: false,
      requests: "",
      indexToUpdate: "",
      isLoading: false,
    }
  }

  componentDidMount = () => {
    this._isMounted = true
    this._isMounted && this.refresh()
  }

  componentWillUnmount() {
    this._isMounted = false
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

  handleButtonClick = async (i) => {
    this.setState({ isLoading: true })
    const request = this.state.requests[i]

    try {
      await API.put('apt', `/requests/updateStatus/${request.requestId}`, {
        body: {
          requestedAt: request.requestedAt,
          requestStatus: request.requestStatus
        }
      })
      this.setState({ isLoading: false })
      this.refresh()
    } catch (e) {
      console.log(e, e.response)
    }
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
    const request = this.state.requests[this.state.indexToUpdate]

    this.setState({ isLoading: true })

    try {
      await API.put('apt', `/requests/updateNote/${request.requestId}`, {
        body: {
          requestedAt: request.requestedAt,
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
      const result = await API.get('apt', '/requests/list')
      let requests = result.Items

      // Sort by requestedAt
      requests.sort((a, b) =>
        (a.requestedAt > b.requestedAt) ?
          1 : (a.requestedAt < b.requestedAt) ? -1 : 0)

      // Sort by priority
      requests.sort((a, b) => (a.priority < b.priority) ? -1
        : (a.priority > b.priority) ? 1 : 0)

      this._isMounted && this.setState({ requests })
    } catch (e) {
      console.log(e, e.response)
    }
  }

  render() {
    const noRequest = (
      <StyledCard>
        <Card.Body>
          Good Job! No Request at this moment.
        </Card.Body>
      </StyledCard>
    )
    return (
      <StyledContainer>
        {this.state.requests
          ? <Fragment>
            {this.state.requests.length === 0 && noRequest}
            <CardColumns>
              {this.state.requests.map((request, i) =>
                <RequestCard
                  key={request.requestId}
                  request={request}
                  theme={this.props.theme}
                  handleButtonClick={() => this.handleButtonClick(i)}
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
