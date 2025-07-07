# C.20 – Role & Permission Templates <MVP / Phase-2>

---

## Core Scenario

### Primary actor  
RBAC Administrator

### Trigger event  
Need to create or update role templates with specific permissions.

### Pre-conditions  
* User is authenticated with Super-Admin scope.

---

## Main success flow

1. RBAC Administrator opens System › Roles.  
2. Clicks New Role, names it (e.g., “Support Tier 1”), and selects permission checkboxes.  
3. Saves role.  
4. Role becomes available for assignment (e.g., selectable in use case C.11 CRUD Admin Accounts & Roles).

---

## Post-conditions  

* New or updated role template is saved and ready for use.

---

## Standard Alternate / Error Paths  

| ID  | Condition / Branch                   | Expected behaviour                                   |
|------|------------------------------------|----------------------------------------------------|
| A‑1  | Attempt to remove permission needed by own session | System blocks action and shows error message        |

---

## Edge & Stretch Scenarios  

| ID  | Category       | Scenario                                       | Release tag |
|------|----------------|------------------------------------------------|-------------|
| E‑1  | Connectivity   | Device goes offline during role creation      | Stretch     |
| E‑2  | Permissions    | User denies permission elevation request      | Stretch     |
| E‑3  | Accessibility  | Switch to high-contrast mode mid-role editing | Stretch     |
| E‑4  | Performance    | Large number of permissions slow UI response  | Stretch     |

---

## Acceptance-Criteria Stencil (G/W/T)

Given user has Super-Admin scope  
When RBAC Administrator creates or updates role templates  
Then role is saved and available for assignment  

Given role includes permissions required by current session  
When attempt to remove those permissions  
Then system disallows the removal with a warning  

---

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Admin as RBAC Administrator
    participant UI as System Roles UI
    participant Sys as Backend Role Service

    Admin->>UI: Open System › Roles
    UI-->>Admin: Display existing roles and New Role button

    Admin->>UI: Click New Role
    UI->>Admin: Show role creation form

    Admin->>UI: Enter role name "Support Tier 1"
    Admin->>UI: Select permissions
    Admin->>UI: Click Save

    UI->>Sys: Save role template with permissions
    Sys-->>UI: Confirm save success
    UI-->>Admin: Show success message, role selectable elsewhere

    alt Remove permission required by own session
        Admin->>UI: Attempt to remove required permission
        UI-->>Admin: Block removal, show error
    end
