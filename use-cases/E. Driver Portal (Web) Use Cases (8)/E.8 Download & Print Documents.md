# Use Case: E.8 Download & Print Documents <MVP>

## Core Scenario

**Primary actor**  
– Logged-in Driver

**Trigger event**  
– Driver opens the Documents section.

**Pre-conditions**  
– PDF statements (weekly distance logs, tax letters) are available.

## Main success flow

**Step one**  
Driver opens Documents section.

**Step two**  
System lists available PDFs with date and file size.

**Step three**  
Driver clicks Download → browser downloads the file.

**Step four**  
Driver opens PDF locally and prints if desired.

**Post-conditions**  
– Driver has downloaded and optionally printed the selected document.

## Standard Alternate / Error Paths

**A-1**  
– Condition / Branch: File generation in progress.  
– Expected behaviour: System shows spinner and message “Preparing file…”

**A-2**  
– Condition / Branch: Link expired (older than 7 days).  
– Expected behaviour: System regenerates file on click and proceeds with download.

## Edge & Stretch Scenarios

**E-1**  
– Category: Connectivity  
– Scenario: Device goes offline during download  
– Release tag: Stretch

**E-2**  
– Category: Permissions  
– Scenario: User denies file download permissions  
– Release tag: Stretch

**E-3**  
– Category: Accessibility  
– Scenario: Switch to high-contrast mode mid-download  
– Release tag: Stretch

**E-4**  
– Category: Performance  
– Scenario: Large file payload delays download  
– Release tag: Stretch

---

## Acceptance Criteria

Given PDF statements are available  
When driver opens Documents section  
Then system lists PDFs with date and size  

Given driver clicks Download  
When file is ready  
Then browser downloads the file  

Given file generation is in progress  
When driver clicks Download  
Then system shows spinner + “Preparing file…”  

Given download link expired (> 7 days)  
When driver clicks Download  
Then system regenerates file and downloads

---

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Driver
    participant System
    participant Browser

    Driver->>System: Open Documents section
    System->>Driver: List available PDFs (date + size)
    Driver->>System: Click Download on PDF
    alt File ready
        System->>Browser: Start file download
        Browser-->>Driver: File downloaded
    else File generation in progress
        System->>Driver: Show spinner + "Preparing file..."
        System->>Browser: Start file download when ready
        Browser-->>Driver: File downloaded
    end
    Driver->>Driver: Open PDF locally and print if desired
