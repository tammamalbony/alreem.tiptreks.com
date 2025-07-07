# Use Case: E.5 Earnings Dashboard (distance-only) <MVP>

## Core Scenario

**Primary actor**  
– Logged-in Driver

**Trigger event**  
– Driver selects "Earnings" from the menu/dashboard.

**Pre-conditions**  
– Completed rides exist for the driver.

## Main success flow

**Step one**  
Driver selects "Earnings" option.

**Step two**  
System queries last 7 days distances and renders a bar chart plus total kilometers.

**Step three**  
Driver changes the period filter (Week / Month). System updates the chart accordingly.

**Post-conditions**  
– Driver sees an updated earnings dashboard with distance traveled for the selected period.

## Standard Alternate / Error Paths

**A-1**  
– Condition / Branch: Zero rides exist for selected period.  
– Expected behaviour: System shows message “Drive to start earning.”

**A-2**  
– Condition / Branch: System fails to fetch ride data.  
– Expected behaviour: System shows error message and prompts driver to retry.

## Edge & Stretch Scenarios

**E-1**  
– Category: Connectivity  
– Scenario: Device goes offline during data fetch  
– Release tag: Stretch

**E-2**  
– Category: Permissions  
– Scenario: User denies access to data permissions  
– Release tag: Stretch

**E-3**  
– Category: Accessibility  
– Scenario: Switch to high-contrast mode mid-ride  
– Release tag: Stretch

**E-4**  
– Category: Performance  
– Scenario: Large payload arrives during sync  
– Release tag: Stretch

---

## Acceptance Criteria

Given completed rides exist  
When driver selects "Earnings"  
Then system displays bar chart and total km for last 7 days

Given no rides exist  
When driver selects "Earnings"  
Then system displays message "Drive to start earning."

Given driver changes period filter  
When new period is selected  
Then chart updates to reflect new data

---

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Driver
    participant System

    Driver->>System: Select "Earnings"
    System->>System: Query last 7 days distances
    alt Rides exist
        System->>Driver: Render bar chart + total km
        Driver->>System: Change period (Week / Month)
        System->>System: Query distances for new period
        System->>Driver: Update chart with new data
    else Zero rides
        System->>Driver: Show message "Drive to start earning."
    end
