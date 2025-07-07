# C.11 CRUD Admin Accounts & Roles – Use Case (MVP)

## Core Scenario

### Primary Actor  
Super‑Admin

### Trigger Event  
Super‑Admin needs to onboard a new admin, update a role, or revoke access.

### Pre‑conditions  
* Super‑Admin is authenticated with valid session.  
* Access granted to System › Admin Users panel.  
* Admin roles and templates are predefined in the system.

---

## Main Success Flow  

1. Super‑Admin opens **System › Admin Users**.  
2. Clicks **Add User**, fills in *email address* and selects a *role template*.  
3. Clicks **Create**.  
4. System stores the user and sends an invitation email with a temporary password.  
5. New user appears in the admin list with “Invite Sent” status.

---

## Post‑conditions  

* New admin account is created with assigned role.  
* Invite email delivered.  
* Access controls and audit logs updated.  
* The system ensures there is always at least one active Super‑Admin.

---

## Standard Alternate / Error Paths  

| ID | Condition / Branch | Expected Behaviour |
|----|--------------------|--------------------|
| A‑1 | Edit existing user | Super‑Admin clicks user row → updates role or toggles **Disabled**. Changes are saved immediately. |
| A‑2 | Attempt delete of last Super‑Admin | System blocks the delete with error: “At least one Super‑Admin must remain active.” |

---

## Edge & Stretch Scenarios  

| ID | Category | Scenario | Release Tag |
|----|----------|----------|-------------|
| E‑1 | Connectivity | Admin drops internet while saving a role change | Stretch |
| E‑2 | Permissions | Non‑Super‑Admin tries to access Admin Users panel | Stretch |
| E‑3 | Accessibility | Keyboard‑only user navigates and completes Add User flow | Stretch |
| E‑4 | Performance | Bulk invite of 100 admins is submitted | Stretch |

---

## Acceptance‑Criteria (G / W / T)

1. **Add New Admin**  
   *Given* Super‑Admin is on Admin Users panel  
   *When* they fill in email and role, then click Create  
   *Then* system saves user and sends invite email

2. **Edit Role or Disable**  
   *Given* an existing admin is listed  
   *When* Super‑Admin clicks and edits the user  
   *Then* changes apply instantly and log entry is created

3. **Prevent Delete of Last Super‑Admin**  
   *Given* only one Super‑Admin exists  
   *When* a delete attempt is made  
   *Then* system prevents the action with an error message

---

## Sequence Diagram

```mermaid
sequenceDiagram
    participant SA as Super‑Admin
    participant UI as Admin Panel
    participant Auth as Auth Service
    participant DB as Admin DB
    participant Email as Email Service
    participant Audit as Audit Logger

    SA->>UI: Open Admin Users Panel
    UI->>DB: GET /admin-users
    DB-->>UI: 200 OK (user list)

    SA->>UI: Click Add User → fill form
    UI->>DB: POST /admin-users {email, role}
    DB-->>UI: 201 Created (user ID)

    UI->>Email: POST /send-invite {email, temp_pw}
    Email-->>UI: 202 Accepted

    UI->>Audit: Log "User created"
    UI-->>SA: User added, invite sent

    alt Edit existing user
        SA->>UI: Edit role or disable
        UI->>DB: PATCH /admin-users/456
        DB-->>UI: 200 OK
        UI->>Audit: Log "User edited"
    else Attempt delete last Super-Admin
        SA->>UI: Delete user
        UI->>DB: DELETE /admin-users/001
        DB-->>UI: 403 Forbidden
        UI-->>SA: Error: Must retain at least 1 Super-Admin
    end
