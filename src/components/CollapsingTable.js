import React from 'react'
import styled from 'styled-components'
import ReactCollapsingTable from 'react-collapsing-table'


const StyledTable = styled.div`
  .react-collapsible-theme .react-collapsible td {
    font-size: 16px;
    padding: 0.5rem .8rem .5rem 0;
  }
  .react-collapsible-theme .react-collapsible-page {
    font-size: 17px;
    margin: 10px 0;
  }
  .react-collapsible-theme .react-collapsible-search input {
    width: 16rem;
  }
  .react-collapsible-theme .react-collapsible .child-content {
    flex-basis: 100%;
  }
  .react-collapsible-theme .react-collapsible .child-label {
    flex-basis: 100%;
  }
  .react-collapsible-theme .react-collapsible .child-label, .react-collapsible-theme .react-collapsible thead {
    font-size: 0.9em;
    letter-spacing: 0;
  }
`

const CollapsingTable = ({ ...props }) => {
  return (
    <StyledTable>
      <ReactCollapsingTable
        {...props}
      />
    </StyledTable>
  )
}

export default CollapsingTable
