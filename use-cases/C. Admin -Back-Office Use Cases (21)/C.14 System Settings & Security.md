# C.14 – System Settings & Security <MVP>

---

## Core Scenario

### Primary Actor  
Security Admin

### Trigger Event  
Admin needs to rotate an API key or tighten the platform password policy.

### Pre‑conditions  
* User is authenticated with **Super‑Admin** scope.  
* Security settings module is enabled and reachable.  

---

## Main Success Flow

1. Security Admin opens **System › Security**.  
2. Chooses either **Rotate API Key** *or* **Edit Password Policy** (e.g., set *min = 12 chars*).  
3. Clicks **Save**.  
4. System validates inputs, persists new settings, and logs the action in the audit trail.  
5. Dependent services retrieve the updated configuration within 60 s.

---

## Post‑conditions  

* New API key is active (old one revoked) **OR** new password rules are enforced at next login/reset.  
* An audit record (who, what, when, IP) is stored and immutable.  
* Security metrics dashboard reflects the change.

---

## Standard Alternate / Error Paths  

| ID | Condition / Branch                                 | Expected Behaviour                                  |
|----|----------------------------------------------------|-----------------------------------------------------|
| A‑1 | Weaker password policy (< 12 chars) entered       | Inline validation blocks Save; tooltip explains min 12 chars. |
| A‑2 | API key rotation fails (downstream registry offline) | System shows error banner and rolls back change.    |

---

## Edge & Stretch Scenarios  

| ID | Category      | Scenario                                                | Release Tag |
|----|---------------|----------------------------------------------------------|-------------|
| E‑1 | Connectivity  | Admin’s connection drops after clicking Save            | Stretch     |
| E‑2 | Permissions   | Non‑Super‑Admin tries to open System › Security         | Stretch     |
| E‑3 | Accessibility | Admin toggles high‑contrast mode mid‑form              | Stretch     |
| E‑4 | Performance   | Large settings payload (≥1 MB) causes slow load        | Stretch     |

---

## Acceptance‑Criteria (G/W/T)

1. **Rotate API Key**  
   *Given* a Super‑Admin is on the Security page  
   *When* they click **Rotate** and confirm  
   *Then* a new key is generated, old key revoked, and an audit entry recorded.

2. **Set Stronger Password Policy**  
   *Given* current minimum length is 8 chars  
   *When* Admin sets **12** and presses Save  
   *Then* system accepts the change; future password resets require ≥ 12 chars.

3. **Reject Weak Policy**  
   *Given* min length is 12 chars  
   *When* Admin enters **6** and clicks Save  
   *Then* form highlights the field with error “Minimum 12 characters required”.

---

## Sequence Diagram

```mermaid
sequenceDiagram
    participant SA as Security Admin
    participant UI as Admin UI
    participant SecSvc as Security Service
    participant AuthSvc as Auth Service
    participant Audit as Audit Trail

    SA->>UI: Open System › Security
    UI->>SecSvc: GET /settings/security
    SecSvc-->>UI: 200 Current settings
    UI-->>SA: Render form

    alt Rotate API Key
        SA->>UI: Click "Rotate Key"
        UI->>SecSvc: POST /apikeys/rotate
        SecSvc-->>UI: 201 New key
        SecSvc->>AuthSvc: Propagate new key
        SecSvc->>Audit: Log "API key rotated"
        UI-->>SA: Success banner
    else Update Password Policy
        SA->>UI: Set min length = 12, click Save
        UI->>SecSvc: PATCH /password-policy {min:12}
        SecSvc-->>UI: 200 OK
        SecSvc->>Audit: Log "Password policy updated"
        UI-->>SA: Policy saved
    else Invalid Policy
        SA->>UI: Set min length = 6, click Save
        UI-->>SA: Inline error "Minimum 12 characters"
    end
