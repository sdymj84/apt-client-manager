


# Notes
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