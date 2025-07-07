# C.15 – Suspend / Reinstate Driver <MVP / Phase-2>

---

## Core Scenario

### Primary actor  
Operations Agent

### Trigger event  
Agent identifies a driver requiring suspension or reinstatement.

### Pre-conditions  
* Driver status is not already **Suspended** (for suspension flow).  
* Agent is authenticated with permissions to manage driver status.

---

## Main success flow

1. Agent opens the driver profile page.  
2. Agent clicks **Suspend**.  
3. Agent selects suspension duration (permanent or until specific date) and provides reason, then confirms.  
4. System updates driver status to **Suspended**, logs the action, logs driver out of app, blocks new rides, and sends notification email to driver.  

---

## Post-conditions  

* Driver status is **Suspended** in the system.  
* Driver cannot accept or create new rides.  
* Suspension event recorded with timestamp and reason.  

---

## Standard Alternate / Error Paths  

| ID  | Condition / Branch               | Expected behaviour                                         |
|------|--------------------------------|------------------------------------------------------------|
| A‑1  | Agent chooses to reinstate driver | Agent clicks **Reinstate**; system sets driver status back to **Active** and sends confirmation email. |
| A‑2  | Suspension fails due to system error | System displays error message; agent retries or escalates. |

---

## Edge & Stretch Scenarios  

| ID  | Category        | Scenario                                      | Release tag |
|------|-----------------|-----------------------------------------------|-------------|
| E‑1  | Connectivity    | Device loses connection during suspend action | Stretch     |
| E‑2  | Permissions     | Unauthorized user attempts to suspend driver  | Stretch     |
| E‑3  | Accessibility   | Switch to high-contrast mode mid-operation    | Stretch     |
| E‑4  | Performance    | Large batch suspend operation causes slow response | Stretch     |

---

## Acceptance-Criteria Stencil (G/W/T)

Given driver status is not Suspended  
When agent suspends driver with valid duration and reason  
Then driver status is updated, driver logged out, rides blocked, and email sent  

Given driver is Suspended  
When agent clicks Reinstate  
Then driver status changes to Active and email confirmation is sent  

---

## Sequence Diagram

```mermaid
sequenceDiagram
    participant OA as Operations Agent
    participant UI as Driver Profile UI
    participant Sys as System Backend
    participant Email as Email Service

    OA->>UI: Open driver profile
    UI-->>OA: Display profile

    alt Suspend Driver
        OA->>UI: Click Suspend
        UI-->>OA: Show suspension form
        OA->>UI: Select duration + reason, Confirm
        UI->>Sys: POST /driver/suspend {driverID, duration, reason}
        Sys-->>UI: 200 OK
        Sys->>Sys: Update status to Suspended
        Sys->>Sys: Log suspension event
        Sys->>Sys: Log driver out
        Sys->>Sys: Block new rides
        Sys->>Email: Send suspension email
        UI-->>OA: Show success message
    else Reinstate Driver
        OA->>UI: Click Reinstate
        UI->>Sys: POST /driver/reinstate {driverID}
        Sys-->>UI: 200 OK
        Sys->>Sys: Update status to Active
        Sys->>Email: Send reinstatement email
        UI-->>OA: Show success message
    end
