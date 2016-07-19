1. the command processInvoiceRecords in ms.shipping_accounts is invoked.
2. Invoice (Forward Shipments): 
  1. get the corresponding shipment
  2. add history entry
  3. calculate and add adjustment entry (credit or debit)
  4. update price in shipment
3. Invoice (Return Shipment): 
  1. calculate and add adjustment entry (debit)
  2. insert a new shipment record in ms.shipment with price as given in the invoice
4. Entry Tax:
  1. It is assumed that the invoice for the shipment has been already processed
  2. get the corresponding shipment
  3. add history entry
  4. calculate and add adjustment entry (debit)
  5. add the extra charge to the price in shipment and update
5. NOTE: No actions is taken for error_records and orphan_records

