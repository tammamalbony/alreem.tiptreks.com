# C.6 Resolve Disputes & Support Tickets – Use Case (MVP)

## Core Scenario

### Primary Actor  
Support Agent

### Trigger Event  
Support Agent selects an **Open** ticket in the Support Console.

### Pre‑conditions  
* Ticket exists in **Open** state.  
* Support Agent is authenticated with **Support‑Agent** role.  
* Ride associated with the ticket is completed and recorded.

### Main Success Flow  
1. Support Agent opens the ticket list and selects a ticket.  
2. System displays ticket details, chat transcript, ride metadata, fare, and GPS trace.  
3. Support Agent chooses **Adjust Fare** or **Issue Refund** (or adds offline note only).  
4. System presents an amount/percentage input; agent confirms.  
5. Support Agent adds a resolution note and clicks **Close Ticket**.  
6. System validates inputs and writes a ticket resolution record.  
7. System updates the ride record and, if applicable, triggers payment adjustment or refund.  
8. System emails both rider and driver with the resolution summary.  
9. Ticket status changes to **Closed**, and UI shows confirmation.

### Post‑conditions  
* Ticket state is **Closed** with an immutable audit trail.  
* Ride record reflects any fare adjustments or refund transactions.  
* Notification emails have been delivered to rider and driver.

---

## Standard Alternate / Error Paths

| ID | Condition / Branch | Expected Behaviour |
|----|--------------------|--------------------|
| A‑1 | **Needs escalation** – Agent determines higher‑level review required | Agent sets **Priority = High** and assigns ticket to **Ops Lead**; ticket remains open. |
| A‑2 | **Policy violation detected** | Agent flags driver; system triggers **C.15 – Driver Suspension Flow** before closing ticket. |

---

## Edge & Stretch Scenarios

| ID | Category | Scenario | Release Tag |
|----|----------|----------|-------------|
| E‑1 | Connectivity | Agent loses network after editing note; changes auto‑saved to local storage and resubmitted on reconnect. | Stretch |
| E‑2 | Permissions | User lacking **Support‑Agent** role attempts to open ticket; access is denied with guidance to request role. | Stretch |
| E‑3 | Accessibility | Agent switches to high‑contrast mode while viewing GPS trace; UI re‑renders with accessible colours. | Stretch |
| E‑4 | Performance | Ticket with >1 000 chat messages loads; UI streams messages incrementally to stay responsive. | Stretch |

---

## Acceptance‑Criteria (G / W / T)

1. **Happy path**  
   *Given* a Support Agent is viewing an **Open** ticket for Ride #123  
   *When* they issue a refund of **€4.50**, add a note “Partial refund for delay”, and click **Close Ticket**  
   *Then* the ride record shows a –€4.50 adjustment, both parties receive an email, and the ticket status becomes **Closed** within 5 seconds.

2. **Escalation**  
   *Given* an agent opens a ticket requiring Ops review  
   *When* they set **Priority = High** and assign **Ops Lead**  
   *Then* the ticket remains **Open**, and Ops Lead receives a notification within 1 minute.

---

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Agent as Support Agent
    participant UI as Support UI
    participant TicketSvc as Ticket Service
    participant RideSvc as Ride Service
    participant Payment as Payment Service
    participant Email as Email Service
    participant OpsLead as Ops Lead

    Agent->>UI: Open ticket list
    UI->>TicketSvc: GET /tickets?state=open
    TicketSvc-->>UI: 200 (list)
    Agent->>UI: Select ticket #456
    UI->>TicketSvc: GET /tickets/456
    TicketSvc->>RideSvc: GET /rides/123 (for GPS & fare)
    RideSvc-->>TicketSvc: 200 (ride data)
    TicketSvc-->>UI: 200 (ticket + ride)

    Agent->>UI: Adjust Fare (€4.50) & add note
    UI->>TicketSvc: POST /tickets/456/actions {type:"adjustFare",amount:4.5,note:"Partial refund"}
    TicketSvc->>Payment: POST /refunds {rideId:123,amount:4.5}
    Payment-->>TicketSvc: 201 Refund
    TicketSvc->>RideSvc: PATCH /rides/123 {fareAdjustment:-4.5}
    RideSvc-->>TicketSvc: 200 OK
    TicketSvc->>Email: POST /send {template:"refund",to:[rider,driver]}
    Email-->>TicketSvc: 202 Accepted

    Agent->>UI: Close Ticket
    UI->>TicketSvc: PATCH /tickets/456 {status:"closed"}
    TicketSvc-->>UI: 200 Closed
    UI-->>Agent: Confirmation banner

    alt Needs escalation
        Agent->>UI: Set Priority=High & assign Ops Lead
        UI->>TicketSvc: PATCH /tickets/456 {priority:"high",assignee:"OpsLead"}
        TicketSvc->>OpsLead: Notify (new high‑priority ticket)
    end
```

---

*Last updated: 07 July 2025*
