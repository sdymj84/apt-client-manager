/* Logic Flow
1. Enter apart number to move in
  -> Look up Apart DB : API GET /aparts/{id}
  -> Show the residents' names currently living in the apartment
  -> Show text : Would you like to add new resident on this unit?
  -> Select Yes -> Next page (Step 2)
2. Fill out resident's information
  - email, firstName, lastName, phone, isPrimary
  - isPet, leaseTerm
  - erContact { firstName, lastName, phone }
  - vehicles [{ year, make, model, color, licensePlate, state}]
  - notification { voiceCall, text, email }
  -> Submit -> Step 3
3. 

*/

import React, { Component } from 'react'

export class New extends Component {
  render() {
    return (
      <div>

      </div>
    )
  }
}

export default New
