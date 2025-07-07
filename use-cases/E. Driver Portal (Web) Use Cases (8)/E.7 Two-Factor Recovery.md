# Use Case: E.7 Two-Factor Recovery <MVP>

## Core Scenario

**Primary actor**  
– Driver

**Trigger event**  
– Driver clicks “Can’t access code?” on login screen.

**Pre-conditions**  
– Driver has lost authenticator device but can access registered email.

## Main success flow

**Step one**  
Driver clicks “Can’t access code?” on login.

**Step two**  
System sends a one-time recovery link to the driver’s registered email.

**Step three**  
Driver opens the link, sets new TOTP seed or generates backup codes.

**Step four**  
System confirms success and redirects driver to login screen.

**Post-conditions**  
– Driver regains two-factor authentication access with new codes or seed.

## Standard Alternate / Error Paths

**A-1**  
– Condition / Branch: Recovery email not delivered.  
– Expected behaviour: Driver retries after 5 minutes or contacts support.

**A-2**  
– Condition / Branch: Recovery link expired or invalid.  
– Expected behaviour: System informs driver and allows requesting a new recovery link.

## Edge & Stretch Scenarios

**E-1**  
– Category: Connectivity  
– Scenario: Device goes offline during recovery link validation  
– Release tag: Stretch

**E-2**  
– Category: Permissions  
– Scenario: User denies email notifications  
– Release tag: Stretch

**E-3**  
– Category: Accessibility  
– Scenario: Switch to high-contrast mode during recovery flow  
– Release tag: Stretch

**E-4**  
– Category: Performance  
– Scenario: System slow sending recovery emails  
– Release tag: Stretch

---

## Acceptance Criteria

Given driver lost authenticator device but can access email  
When driver clicks "Can't access code?"  
Then system sends one-time recovery link to registered email  

Given driver opens valid recovery link  
When driver sets new TOTP seed or backup codes  
Then system confirms and redirects to login  

Given recovery email not delivered  
When driver retries after 5 minutes  
Then system resends recovery email or offers support contact  

---

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Driver
    participant System
    participant EmailService

    Driver->>System: Click "Can't access code?"
    System->>EmailService: Send recovery link to email
    EmailService-->>Driver: Delivery of recovery email
    Driver->>System: Opens recovery link
    System->>Driver: Show options to set new TOTP seed / backup codes
    Driver->>System: Submit new TOTP seed / backup codes
    System->>Driver: Confirm success and redirect to login
    alt Email not delivered
        Driver->>System: Retry sending after 5 min
        System->>EmailService: Resend recovery email
    end
