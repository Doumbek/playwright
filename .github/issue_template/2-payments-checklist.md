---
name: "✅ Payments checklist"
about: "Verification checklist for the Payments area"
title: "Payments checklist — release [X]"
labels: checklist, payments
---

<!--
Instructions:
1. Replace [X] in the title above with the actual release/version number.
2. Go through each item below and check it off as you verify it manually.
3. If an item fails, leave it unchecked and add a comment describing the issue,
   linking to a bug report if one is created.
4. Close this issue once all items are verified (or explicitly triaged).
-->

## Checkout

- [ ] User able to complete checkout with a valid card
- [ ] Invalid card is rejected with a clear error
- [ ] Order total reflects applied discounts/promo codes

## Refunds

- [ ] User able to request a refund
- [ ] Refunded order status updates correctly
- [ ] Refund amount matches the original charge

## Invoices / receipts

- [ ] Receipt is generated after successful payment
- [ ] Receipt is accessible from order history
