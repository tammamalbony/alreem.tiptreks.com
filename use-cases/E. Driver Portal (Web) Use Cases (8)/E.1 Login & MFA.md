# E.1 – Login & MFA <MVP / Phase‑2>

---

## Core Scenario

### Primary actor  
Driver (Web)

### Trigger event  
Driver opens the portal URL and attempts to sign in.

### Pre‑conditions  
* Driver account is **Active**  
* Browser is online  

---

## Main success flow

1. Driver opens the portal URL and sees the email / password form.  
2. Driver enters credentials and clicks **Log In**.  
3. System validates credentials and displays 6‑digit TOTP prompt.  
4. Driver enters code and clicks **Verify**.  
5. System validates TOTP, issues session cookie, and redirects to **Dashboard**.  

---

## Post‑conditions  
* Authenticated session is established (session cookie stored).  
* Driver is landed on the Dashboard.

---

## Standard Alternate / Error Paths

| ID  | Condition / Branch      | Expected behaviour                                 |
|-----|-------------------------|----------------------------------------------------|
| A‑1 | Wrong email or password | System shows error “Email or password incorrect.”  |
| A‑2 | TOTP expired / invalid  | System shows error, keeps form for another retry. |

---

## Edge & Stretch Scenarios

| ID  | Category       | Scenario                                              | Release tag |
|-----|----------------|-------------------------------------------------------|-------------|
| E‑1 | Connectivity   | Device goes offline after entering credentials        | Stretch     |
| E‑2 | Permissions    | Driver refuses browser prompt for clipboard TOTP paste| Stretch     |
| E‑3 | Accessibility  | Driver switches to high‑contrast mode mid‑flow        | Stretch     |
| E‑4 | Performance    | Slow network delays TOTP validation (>5 s)            | Stretch     |

---

## Acceptance‑Criteria Stencil (G / W / T)

*Given* driver account is active and browser is online  
*When* driver opens the portal  
*Then* email / password form is displayed  

*Given* driver submits correct credentials  
*When* system validates them  
*Then* TOTP prompt is displayed  

*Given* driver submits correct TOTP within validity period  
*When* system validates the code  
*Then* session cookie is issued and driver lands on Dashboard  

*Given* driver submits incorrect credentials  
*When* validation fails  
*Then* error “Email or password incorrect.” appears  

*Given* driver submits expired or invalid TOTP  
*When* validation fails  
*Then* error message appears and driver can retry  

---

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Driver as Driver (Web)
    participant Browser as Browser
    participant Auth as Auth Service

    Note over Driver,Browser: Driver opens portal URL

    Driver->>Browser: View login form
    Driver->>Browser: Enter email & password\nClick "Log In"
    Browser->>Auth: Validate credentials
    alt Invalid credentials
        Auth-->>Browser: 401 Unauthorized
        Browser->>Driver: Show error "Email or password incorrect."
    else Valid credentials
        Auth-->>Browser: Credentials OK
        Browser->>Driver: Prompt 6‑digit TOTP

        Driver->>Browser: Enter TOTP\nClick "Verify"
        Browser->>Auth: Validate TOTP
        alt TOTP expired / invalid
            Auth-->>Browser: 401 TOTP invalid
            Browser->>Driver: Show error "Code expired, try again."
        else TOTP valid
            Auth-->>Browser: Issue session cookie
            Browser->>Driver: Redirect to Dashboard
        end
    end
