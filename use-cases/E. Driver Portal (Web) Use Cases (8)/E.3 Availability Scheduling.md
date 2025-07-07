# E.3 – Availability Scheduling <MVP / Phase‑2>

---

## Core Scenario

### Primary actor  
Logged‑in Driver

### Trigger event  
Driver opens the **Availability** tab to update weekly working hours.

### Pre‑conditions  
* Driver’s account is **verified**  
* Valid session is active  
* Browser is online  

---

## Main success flow

1. Driver selects **Availability** tab from the sidebar.  
2. Calendar week‑view loads; existing availability slots are shaded.  
3. Driver drags to create new time‑blocks or clicks existing blocks to delete.  
4. Driver clicks **Save Schedule** → system calls `/availability` API.  
5. System stores the schedule and shows a confirmation toast “Availability updated.”  

---

## Post‑conditions  
* New or updated availability slots are persisted in the backend.  
* UI reflects the latest schedule.

---

## Standard Alternate / Error Paths

| ID  | Condition / Branch          | Expected behaviour                                                       |
|-----|-----------------------------|--------------------------------------------------------------------------|
| A‑1 | Overlapping blocks created  | System auto‑merges overlapping intervals before saving.                 |
| A‑2 | Network error on save       | Unsaved banner appears with **Retry** button; no data is lost locally.  |

---

## Edge & Stretch Scenarios

| ID  | Category       | Scenario                                              | Release tag |
|-----|----------------|-------------------------------------------------------|-------------|
| E‑1 | Connectivity   | Device goes offline while editing slots               | Stretch     |
| E‑2 | Permissions    | Browser blocks local‑storage fallback for draft cache | Stretch     |
| E‑3 | Accessibility  | Driver switches to high‑contrast mode mid‑edit        | Stretch     |
| E‑4 | Performance    | Very large schedule payload slows API (>500 ms)       | Stretch     |

---

## Acceptance‑Criteria Stencil (G / W / T)

*Given* driver’s account is verified and session is valid  
*When* the driver opens the **Availability** tab  
*Then* the week‑view calendar with current slots is displayed  

*Given* the driver adds or deletes slots without overlaps  
*When* **Save Schedule** is clicked  
*Then* the system stores the schedule and shows confirmation  

*Given* the driver adds overlapping slots  
*When* validation runs  
*Then* the system automatically merges them before saving  

*Given* the network request fails during save  
*When* the API returns an error  
*Then* an unsaved banner with **Retry** is shown  

---

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Driver as Driver (Web)
    participant Browser as Browser
    participant API as Availability API

    Driver->>Browser: Click "Availability" tab
    Browser->>API: GET /availability
    API-->>Browser: Return current slots
    Browser->>Driver: Render week view (shaded slots)

    Driver->>Browser: Drag / click to add‑delete blocks
    alt Overlapping blocks detected
        Browser->>Browser: Auto‑merge overlapping intervals
    else No overlaps
        Browser->>Browser: Accept blocks as‑is
    end

    Driver->>Browser: Click "Save Schedule"
    Browser->>API: PUT /availability (new schedule)

    alt Save succeeds
        API-->>Browser: 200 OK
        Browser->>Driver: Toast "Availability updated"
    else Network / server error
        API-->>Browser: Error / Timeout
        Browser->>Driver: Banner "Save failed – Retry?"
    end
