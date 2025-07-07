# C.16 – GDPR Data-Erasure Workflow <MVP / Phase-2>

---

## Core Scenario

### Primary actor  
Privacy Officer

### Trigger event  
Verified data erasure request received from user.

### Pre-conditions  
* Verified user request for data erasure exists.  
* Officer is authenticated with compliance role.

---

## Main success flow

1. Officer opens Compliance › Erasure Requests in the system.  
2. Officer clicks **Create Request**, selects the user, and submits the erasure request.  
3. System marks the user status as **Pending Deletion** and starts a 30-day grace period timer.  
4. After 30 days, a background job deletes or anonymizes the user’s personally identifiable information (PII) and logs the completion of the process.

---

## Post-conditions  

* User’s PII is deleted or anonymized.  
* System logs completed erasure event.  
* User status updated to reflect data erasure.

---

## Standard Alternate / Error Paths  

| ID  | Condition / Branch                   | Expected behaviour                                         |
|------|------------------------------------|------------------------------------------------------------|
| A‑1  | User revokes request during grace period | Officer cancels deletion; user status restored.             |
| A‑2  | Linked disputes exist on user data | System blocks erasure, alerts officer for manual review.    |

---

## Edge & Stretch Scenarios  

| ID  | Category        | Scenario                                     | Release tag |
|------|-----------------|----------------------------------------------|-------------|
| E‑1  | Connectivity    | Device goes offline during request creation  | Stretch     |
| E‑2  | Permissions     | Officer lacks compliance permissions          | Stretch     |
| E‑3  | Accessibility   | Switch to high-contrast mode mid-operation    | Stretch     |
| E‑4  | Performance     | Large volume of erasure requests processed simultaneously | Stretch     |

---

## Acceptance-Criteria Stencil (G/W/T)

Given verified user data erasure request  
When officer submits deletion request  
Then system marks user Pending Deletion and starts 30-day timer  

Given user revokes erasure request before timer expires  
When officer cancels request  
Then system restores user status and halts deletion  

Given linked disputes exist for user data  
When deletion requested  
Then system blocks deletion and alerts officer  

---

## Sequence Diagram

```mermaid
sequenceDiagram
    participant PO as Privacy Officer
    participant UI as Compliance UI
    participant Sys as System Backend
    participant BG as Background Job
    participant Logger as Audit Log

    PO->>UI: Open Erasure Requests
    UI-->>PO: Display Erasure Requests list

    PO->>UI: Click Create Request
    UI-->>PO: Show user selection
    PO->>UI: Select user and Submit
    UI->>Sys: POST /erasure-request {userID}
    Sys-->>UI: 200 OK
    Sys->>Sys: Mark user Pending Deletion
    Sys->>Sys: Start 30-day grace timer
    Sys->>Logger: Log request creation
    UI-->>PO: Confirmation message

    Note over BG, Sys: After 30 days
    BG->>Sys: Trigger erasure job
    Sys->>Sys: Delete/Anonymize PII
    Sys->>Logger: Log erasure completion

    alt User Revokes Request
        PO->>UI: Cancel erasure request
        UI->>Sys: DELETE /erasure-request/{userID}
        Sys-->>UI: 200 OK
        Sys->>Sys: Restore user status
        Sys->>Logger: Log cancellation
        UI-->>PO: Cancellation confirmation
    else Linked Disputes Exist
        Sys->>UI: Block erasure, alert officer
        UI-->>PO: Show dispute alert
    end
