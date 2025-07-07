# C.18 – Configure Retention Windows <MVP / Phase-2>

---

## Core Scenario

### Primary actor  
Data Engineer

### Trigger event  
Need to configure data retention policies for ride and chat data.

### Pre-conditions  
* User has Data-Admin role.  
* Access to Settings › Data Retention page.

---

## Main success flow

1. Data Engineer opens Settings › Data Retention.  
2. Sets retention periods (e.g., Ride data = 180 days, Chat data = 90 days).  
3. Clicks Save.

---

## Post-conditions  

* System updates scheduled cron tasks to drop partitions older than configured thresholds.

---

## Standard Alternate / Error Paths  

| ID  | Condition / Branch          | Expected behaviour                                  |
|------|----------------------------|---------------------------------------------------|
| A‑1  | Retention value < legal minimum | System blocks save and shows warning message.    |

---

## Edge & Stretch Scenarios  

| ID  | Category       | Scenario                                        | Release tag |
|------|----------------|------------------------------------------------|-------------|
| E‑1  | Connectivity   | Device goes offline while saving settings      | Stretch     |
| E‑2  | Permissions    | User lacks permission to access retention settings | Stretch     |
| E‑3  | Accessibility  | Switch to high-contrast mode mid-configuration | Stretch     |
| E‑4  | Performance    | Large number of partitions triggers UI delay   | Stretch     |

---

## Acceptance-Criteria Stencil (G/W/T)

Given user has Data-Admin role  
When user sets retention windows and clicks Save  
Then system updates cron tasks with new retention settings  

Given retention value below legal minimum  
When user attempts to save  
Then system blocks save and displays warning  

---

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Engineer as Data Engineer
    participant UI as Retention Settings UI
    participant Sys as System Backend
    participant Cron as Cron Service

    Engineer->>UI: Open Settings › Data Retention
    UI-->>Engineer: Display current retention settings

    Engineer->>UI: Set Ride=180 days, Chat=90 days
    Engineer->>UI: Click Save

    UI->>Sys: Validate retention values
    alt Values below legal minimum
        Sys-->>UI: Return validation error
        UI-->>Engineer: Show warning message, block save
    else Valid values
        Sys->>Cron: Update cron tasks with new retention windows
        Sys-->>UI: Confirm save success
        UI-->>Engineer: Show success message
    end
