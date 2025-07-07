# C.13 – Analytics & Reports <MVP>

---

## Core Scenario

### Primary Actor  
Data Analyst

### Trigger Event  
Analyst wants to generate operational or performance insights using platform data.

### Pre‑conditions  
- Dashboard embeds are configured  
- Data warehouse and analytics layer is operational  
- User has permission to access Analytics tab

---

## Main Success Flow

1. Analyst opens **Analytics** tab  
2. Selects **Rides**, **Last 30 days**, and groups data by **City**  
3. System renders chart  
4. Analyst optionally clicks **Export to CSV**

---

## Post‑conditions

- A visualization is generated  
- Analyst can use insights or share exported CSV  
- System logs the export event (for audit / quota tracking)

---

## Standard Alternate / Error Paths

| ID  | Condition / Branch            | Expected Behaviour                                       |
|-----|-------------------------------|----------------------------------------------------------|
| A‑1 | Heavy query load              | System displays a loading spinner until timeout or completion |
| A‑2 | Export fails (e.g., network)  | System shows retry option with error toast               |

---

## Edge & Stretch Scenarios

| ID  | Category     | Scenario                                     | Release Tag |
|-----|--------------|-----------------------------------------------|-------------|
| E‑1 | Connectivity | Network drops during CSV export               | Stretch     |
| E‑2 | Permissions  | Analyst tries to view a restricted report     | Stretch     |
| E‑3 | Accessibility | Analyst uses keyboard navigation on graphs   | Stretch     |
| E‑4 | Performance  | Rendering thousands of data points stalls UI | Stretch     |

---

## Acceptance‑Criteria (G/W/T)

**1. Generate Reports**  
*Given* analyst has dashboard access  
*When* they select a time range and group filter  
*Then* system renders the chart with requested breakdown

**2. Handle Export**  
*Given* analyst views a chart  
*When* they click Export  
*Then* CSV file downloads successfully or a retry prompt appears

**3. Query Timeout**  
*Given* the selected query is large  
*When* it exceeds time limit  
*Then* system shows a timeout message with retry suggestion

---

## Sequence Diagram

```mermaid
sequenceDiagram
    participant DA as Data Analyst
    participant UI as Analytics UI
    participant DWH as Data Warehouse
    participant CSV as Export Service

    DA->>UI: Open Analytics tab
    DA->>UI: Select "Rides", "Last 30 days", "Group by City"

    UI->>DWH: Run query
    DWH-->>UI: Return aggregated chart data

    UI-->>DA: Render visualization

    DA->>UI: Click "Export CSV"
    UI->>CSV: Request CSV generation
    CSV-->>UI: Return CSV file
    UI-->>DA: Download initiated
