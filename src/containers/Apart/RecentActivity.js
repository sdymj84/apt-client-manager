import React from 'react'
import styled from 'styled-components'
import { Container } from 'react-bootstrap'
import CollapsingTable from '../../components/CollapsingTable';
import moment from 'moment'

const StyledContainer = styled(Container)`
  padding: 0;
  button {
    margin-right: 5px;
  }
  .react-collapsible-theme .react-collapsible td, .react-collapsible-theme .react-collapsible thead th {
    min-width: 0;
  }
`

const RecentActivity = ({ payments }) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  let rows = []
  payments.forEach(payment => {
    rows.push({
      date: moment(Date(payment.transactedAt)).format('L'),
      paymentAndCharges: payment.title,
      charges: formatter.format(payment.charge),
      payments: formatter.format(payment.payment),
      balance: formatter.format(payment.balance),
    })
  })
  const recentActivity = {
    rows,
    columns: [{
      accessor: 'date',
      label: 'Date',
      position: 1,
      minWidth: 100,
    }, {
      accessor: 'paymentAndCharges',
      label: 'Payments and Charges',
      position: 2,
      minWidth: 200,
    }, {
      accessor: 'charges',
      label: 'Charges',
      position: 3,
      minWidth: 200,
    }, {
      accessor: 'payments',
      label: 'Payments',
      position: 4,
      minWidth: 200,
    }, {
      accessor: 'balance',
      label: 'Balance',
      position: 5,
      minWidth: 200,
    }]
  }

  return (
    <StyledContainer>
      <CollapsingTable
        showSearch={true}
        showPagination={true}
        rows={recentActivity.rows}
        columns={recentActivity.columns}
      />
    </StyledContainer>
  )
}

export default RecentActivity
