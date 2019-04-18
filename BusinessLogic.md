### Early Move Out (Do after resident sign it)
- if moveOutDate is earlier than leaseEndDate
  -> broke contract fee : + 1 month rent price
- if moveOutDate is later than two months from now
  -> nothing to do
- if moveOutDate is earlier than two months from now
  -> remaining payment balance is two months rent price


### If resident do nothing when it's already passed two months before move out date (= lease end date)
- Automatically adjust move out date to two months later from today
  (ex. leaseEndDate 6/1, today 4/2 => update moveOutDate to 6/2)

  ### Logic (Function that triggers everyday)
  - Loop through all aparts and check below for each apart
  - moveOutConfirmed is false && (moveOutDate < (today + 60))
      - YES (Didn't sign for move out and less than 60 days to move out date) : 

          On 5/1, resident come to office and say, 
          "I need to move out on 6/1 which I was supposed to move out.
          I was traveling overseas so couldn't see any notice from you guys."
          and office says,
          "Ok, you can do that but 60 days notice rule already applied
          on the system. we tried to reach you via email, phone 
          and left note at your door to notify you.
          It's your fault not responded to that.
          Thus, whenever you move out, you need to pay until 7/1 
          which is 60 days from today.
          I'll update your moveOutDtate to 7/1.
          You will be deleted from the system if your payment balance is 0 on 7/1"

        - Manager action
          1. Click "Move Out" button
          2. Set date to 7/1
          3. Update
        - Logic
          1. moveOutDate get updated to 7/1
          2. moveOutConfirmed = true (now it no longer changes)
      
      - NO (Signed for move out or not reached 60 days to move out days) : 
      
        Do nothing

### Renew (Do after resident sign it)
- Show modal with one input field (number between 6-12)
- Message : "Please enter Renew in below text field to proceed.
This cannot be undone.
- Submit with new leaseTerm
- Update apart db : leaseTerm, leaseStartDate, leaseEndDate