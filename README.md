# Apartment Management Portal
### Apartment Management Portal for residents and office workers (managers) which was motivated and referenced by RENTCafé
### Checkout live app here : [[For residents]]( http://apt-client-resident.s3-website.us-east-2.amazonaws.com) [[For managers]](http://apt-client-manager2.s3-website.us-east-2.amazonaws.com)
### Click [[HERE]](https://github.com/sdymj84/apt-client) for github address of Resident app
### Click [[HERE]](https://github.com/sdymj84/apt-client-manager) for github address of Manager app
### Click [[HERE]](https://github.com/sdymj84/apt-api) for github address of Server code
---

## Skills
- React, React Router
- Serverless framework for managing AWS
- AWS Amplify to use AWS services from client
- AWS : DynamoDB, Cognito, S3, Lambda, API Gateway, CloudWatch
- Design : react-bootstrap, styled-components
- ETC : moment, react-datepicker, react-collapsing-table, react-icons, etc.
---

## App Details
### Data Modeling
- 4 Database tables : aparts / residents / maintanaces / payments
- Aparts :
    - Apart info (id, address, price, ..)
    - Resident list
    - Lease data
    - Autopay data
    - Floor plan
- Residents :
    - Info like name, phone, ..
    - Emergency Contact
    - Vehicles
    - Payment info
- Payments :
    - Apart ID, transaction time, title, charge, payment, balance
- Maintanances :
    - Number of info for the issue, attachment

### Move in and out flow
- Manager add resident on the system with all personal info
- Resident get invitation email and redirect to change password
- Manager can edit some apart info
- Resident can edit some resident info
- Manager update resident's moveout date > Fee applied if it's earlier than lease end date
- Check everyday if any resident reached 60 days before move out without confirming move out date > system automatically postpone move out date
- Manager delete resident once moved out

### Payment flow
- Rent and other fees applied on the 1st day of each month automatically by CloudWatch
- Resident can set autopay or pay manually
- When confirming early move out, fee gets added to payments

### Maintanance flow
- Resident post request
- Manager see open requests counts on home page
- Manager set request status to "In Progress" or "Complete" (Completed request doesn't show)
- Maintanance requests is sorted by created time and priority

### Announcement
- Manager make announcement via "Announcement" menu
- Manager can choose which unit to be announced by unit number or filter like who has pet
- Resident see announcement on home page and can dismiss (new announcement will show up again)

### Other details
- Contain all logic and style in each single component file using styled-components
- Deployed on AWS
---

## Notes
- e.target.type === "checkbox" ? e.target.checked : e.target.value
- e.persist() - fix Synthetic Events error

- When adding resident to apart, what info should I add besides id?
  Adding resident process
    - GET apart on apart check
    - POST resident on form submit
    - PUT apart on form submit
- When uknown 500 error occur
  1. event.pathParameters.abc : abc is the same name as you set in aws?


- Error : Cancel All Subscriptions and Asyncs in the componentWillUnmount
    - Error occurs when trying to setState when component is unmounted. solution is to use "_isMounted" property
    1. this._isMounted = false on componentWillUnmount
    2. this._isMounted = true on componentDidMount
    3. and do setState only when isMounted is true

- Link / Button order : if vice versa, link doesn't work and link style is applied
  ```
  <Link to='/somewhere'>
    <Button>CLICK</Button>
  </Link>
  ```
