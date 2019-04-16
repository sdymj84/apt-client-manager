/* 
      Calculate balance
      1. if moveOutDate is earlier than leaseEndDate
        -> broke contract fee : + 1 month rent price
      2. if moveOutDate is later than two months from now
        -> nothing to do
      3. if moveOutDate is earlier than two months from now
        -> remaining payment balance is two months rent price
    */

export const 