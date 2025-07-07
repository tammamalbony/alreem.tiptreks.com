# C.17 – Audit Log & Access Review <MVP / Phase-2>

---

## Core Scenario

### Primary actor  
Compliance Auditor

### Trigger event  
Auditor needs to review system audit logs for compliance or investigation.

### Pre-conditions  
* Audit logging is enabled and capturing system events.  
* Auditor is authenticated with appropriate access rights.

---

## Main success flow

1. Auditor opens System › Audit Log in the application.  
2. Auditor applies filters by date, actor, or action (e.g., “Fare adjusted”).  
3. Auditor exports the filtered audit records as a CSV file for offline review.

---

## Post-conditions  

* Audit log data filtered and exported successfully.  
* Exported CSV file is available for auditor use.

---

## Standard Alternate / Error Paths  

| ID  | Condition / Branch          | Expected behaviour                          |
|------|----------------------------|---------------------------------------------|
| A‑1  | No records match the filter | System displays “0 results” message.        |

---

## Edge & Stretch Scenarios  

| ID  | Category       | Scenario                                | Release tag |
|------|----------------|-----------------------------------------|-------------|
| E‑1  | Connectivity   | Device goes offline during export       | Stretch     |
| E‑2  | Permissions    | Auditor lacks permission to view logs   | Stretch     |
| E‑3  | Accessibility  | Switch to high-contrast mode mid-review | Stretch     |
| E‑4  | Performance    | Large log export causes UI delay         | Stretch     |

---

## Acceptance-Criteria Stencil (G/W/T)

Given audit logging is enabled  
When auditor filters logs by date, actor, or action  
Then system displays matching audit records  

Given no records match filter criteria  
When auditor applies filter  
Then system shows “0 results”  

Given audit records displayed  
When auditor clicks export  
Then system generates CSV file with filtered records  

---

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Auditor as Compliance Auditor
    participant UI as Audit Log UI
    participant Sys as System Backend
    participant Export as Export Service

    Auditor->>UI: Open Audit Log
    UI-->>Auditor: Display audit log interface

    Auditor->>UI: Apply filters (date, actor, action)
    UI->>Sys: GET /audit-log?filters
    Sys-->>UI: Return filtered records
    UI-->>Auditor: Display filtered records

    alt No matching records
        UI-->>Auditor: Show “0 results” message
    end

    Auditor->>UI: Export filtered records
    UI->>Export: Request CSV export with filters
    Export-->>UI: Provide CSV download link
    UI-->>Auditor: CSV export ready for download
