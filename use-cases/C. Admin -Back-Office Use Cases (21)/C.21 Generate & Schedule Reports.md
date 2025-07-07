# C.21 – Generate & Schedule Reports <MVP / Phase-2>

---

## Core Scenario

### Primary actor  
Operations Analyst

### Trigger event  
Need to generate and schedule recurring reports for distribution.

### Pre-conditions  
* Report templates exist.

---

## Main success flow

1. Operations Analyst opens Analytics › Scheduled Reports.  
2. Clicks New Schedule → selects report template (e.g., “Monthly Ride KPIs”), sets schedule (1st of month), adds recipients.  
3. Clicks Create → system stores cron job and sends test email.

---

## Post-conditions  

* Scheduled report job is saved and test email is sent successfully.

---

## Standard Alternate / Error Paths  

| ID  | Condition / Branch              | Expected behaviour                                  |
|------|-------------------------------|---------------------------------------------------|
| A‑1  | Analyst clicks Run Now          | System queues immediate report generation          |
| A‑2  | Email bounce on scheduled send | System logs failure and shows alert badge          |

---

## Edge & Stretch Scenarios  

| ID  | Category       | Scenario                                       | Release tag |
|------|----------------|------------------------------------------------|-------------|
| E‑1  | Connectivity   | Device goes offline during scheduling          | Stretch     |
| E‑2  | Permissions    | User lacks rights to schedule reports           | Stretch     |
| E‑3  | Accessibility  | Switch to high-contrast mode mid-scheduling    | Stretch     |
| E‑4  | Performance    | Large recipient list slows scheduling process  | Stretch     |

---

## Acceptance-Criteria Stencil (G/W/T)

Given report templates exist  
When Operations Analyst creates a scheduled report  
Then system saves cron job and sends a test email  

Given scheduled report sends email  
When email bounces  
Then system logs failure and shows alert badge  

---

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Analyst as Operations Analyst
    participant UI as Analytics Scheduled Reports UI
    participant Sys as Report Scheduling Service
    participant Email as Email Service

    Analyst->>UI: Open Analytics › Scheduled Reports
    UI-->>Analyst: Display scheduled reports list and New Schedule button

    Analyst->>UI: Click New Schedule
    UI->>Analyst: Show schedule creation form

    Analyst->>UI: Select "Monthly Ride KPIs", set schedule, add recipients
    Analyst->>UI: Click Create

    UI->>Sys: Store cron job for scheduled report
    Sys-->>UI: Confirm cron job stored

    Sys->>Email: Send test email to recipients
    Email-->>Sys: Confirm email sent
    UI-->>Analyst: Show success message

    alt Analyst clicks Run Now
        Analyst->>UI: Click Run Now
        UI->>Sys: Queue immediate report generation
        Sys-->>UI: Confirm queued
        UI-->>Analyst: Show queued confirmation
    end

    alt Email bounce detected
        Email->>Sys: Email bounce notification
        Sys->>UI: Log failure and show alert badge
    end
