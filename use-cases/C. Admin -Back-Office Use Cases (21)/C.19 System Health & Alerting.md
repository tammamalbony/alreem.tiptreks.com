# C.19 – System Health & Alerting <MVP / Phase-2>

---

## Core Scenario

### Primary actor  
DevOps Engineer

### Trigger event  
Need to monitor system health and configure alert thresholds.

### Pre-conditions  
* Metrics and alert hooks are already configured in the system.

---

## Main success flow

1. DevOps Engineer opens DevOps › Health Dashboard.  
2. Views metrics such as CPU usage, DB latency, and error rates.  
3. Clicks Set Alert, defines threshold values.  
4. System stores alert configuration in Prometheus/Grafana.

---

## Post-conditions  

* Alerts are active and will trigger when thresholds are breached.

---

## Standard Alternate / Error Paths  

| ID  | Condition / Branch          | Expected behaviour                                  |
|------|----------------------------|---------------------------------------------------|
| A‑1  | Deletes alert               | System disables alert and stops paging notifications.|

---

## Edge & Stretch Scenarios  

| ID  | Category       | Scenario                                        | Release tag |
|------|----------------|------------------------------------------------|-------------|
| E‑1  | Connectivity   | Device goes offline while viewing dashboard    | Stretch     |
| E‑2  | Permissions    | User lacks permission to modify alerts         | Stretch     |
| E‑3  | Accessibility  | Switch to high-contrast mode mid-dashboard view| Stretch     |
| E‑4  | Performance    | Large volume of metrics causes dashboard lag   | Stretch     |

---

## Acceptance-Criteria Stencil (G/W/T)

Given metrics and alert hooks configured  
When DevOps Engineer sets alert thresholds  
Then system stores the alert config and triggers alerts on breach  

Given alert exists  
When alert is deleted  
Then system disables alert and stops paging  

---

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Engineer as DevOps Engineer
    participant UI as Health Dashboard UI
    participant Sys as Monitoring System (Prometheus/Grafana)

    Engineer->>UI: Open DevOps › Health Dashboard
    UI-->>Engineer: Display CPU, DB latency, error rates

    Engineer->>UI: Click Set Alert
    UI->>Engineer: Show alert threshold form

    Engineer->>UI: Define thresholds and submit
    UI->>Sys: Store alert configuration
    Sys-->>UI: Confirm alert saved
    UI-->>Engineer: Show success message

    alt Deletes alert
        Engineer->>UI: Delete alert
        UI->>Sys: Remove alert configuration
        Sys-->>UI: Confirm alert removed
        UI-->>Engineer: Show confirmation and stop paging
    end
