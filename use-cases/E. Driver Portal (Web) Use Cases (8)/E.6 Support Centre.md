# Use Case: E.6 Support Centre <MVP>

## Core Scenario

**Primary actor**  
– Driver

**Trigger event**  
– Driver clicks "Support" button/link.

**Pre-conditions**  
– Driver is logged in.

## Main success flow

**Step one**  
Driver clicks "Support."

**Step two**  
System displays FAQ accordion and “Contact Support” button.

**Step three**  
Driver clicks “Contact Support” button → chat widget opens.

**Step four**  
Messages exchanged in real-time; system generates a ticket ID.

**Post-conditions**  
– Support interaction is established; ticket ID is recorded.

## Standard Alternate / Error Paths

**A-1**  
– Condition / Branch: Out-of-hours support.  
– Expected behaviour: Bot collects message and promises reply by email.

**A-2**  
– Condition / Branch: Chat system failure or network issues.  
– Expected behaviour: System shows error message and fallback contact options.

## Edge & Stretch Scenarios

**E-1**  
– Category: Connectivity  
– Scenario: Device goes offline during chat session  
– Release tag: Stretch

**E-2**  
– Category: Permissions  
– Scenario: User denies notification permissions  
– Release tag: Stretch

**E-3**  
– Category: Accessibility  
– Scenario: Switch to high-contrast mode during chat  
– Release tag: Stretch

**E-4**  
– Category: Performance  
– Scenario: Large message payload during chat sync  
– Release tag: Stretch

---

## Acceptance Criteria

Given driver is logged in  
When driver clicks "Support"  
Then FAQ accordion and “Contact Support” button are displayed

Given driver clicks “Contact Support”  
When within support hours  
Then chat widget opens and messages exchange in real-time with ticket ID generated

Given driver clicks “Contact Support”  
When outside support hours  
Then bot collects message and promises reply by email

---

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Driver
    participant System
    participant SupportBot
    participant SupportAgent

    Driver->>System: Click "Support"
    System->>Driver: Show FAQ + "Contact Support" button
    Driver->>System: Click "Contact Support"
    alt Within support hours
        System->>Driver: Open chat widget
        Driver->>SupportAgent: Send message
        SupportAgent->>Driver: Reply message
        System->>System: Generate ticket ID
    else Out-of-hours
        System->>SupportBot: Bot collects message
        SupportBot->>Driver: Promise reply by email
    end
