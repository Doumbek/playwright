---
name: "✅ Authorization checklist"
about: "Verification checklist for the Authorization area"
title: "Authorization checklist — release [X]"
labels: checklist, authorization
---

<!--
Instructions:
1. Replace [X] in the title above with the actual release/version number.
2. Go through each item below and check it off as you verify it manually.
3. If an item fails, leave it unchecked and add a comment describing the issue,
   linking to a bug report if one is created.
4. Close this issue once all items are verified (or explicitly triaged).
-->

## Login / Logout

- [ ] User able to login as admin
- [ ] User able to login as regular user
- [ ] User able to logout
- [ ] Invalid credentials are rejected with a clear error

## Session handling

- [ ] Session persists after page refresh
- [ ] Session expires after logout
- [ ] Concurrent login from a second device behaves as expected

## Password recovery

- [ ] "Forgot password" flow sends a reset link
- [ ] Reset link allows setting a new password
- [ ] Expired/used reset link is rejected
