# D.3 – Install PWA & Receive Push <MVP / Phase‑2>

---

## Core Scenario

### Primary actor  
Returning Visitor

### Trigger event  
On the visitor’s second visit, the **browser** fires the `beforeinstallprompt` event.

### Pre‑conditions  
* Browser supports PWA features  
* Site is served over HTTPS  

---

## Main success flow

1. On the second visit, the browser fires `beforeinstallprompt` to the page.  
2. Mini‑infobar “Add to Home Screen?” is displayed → visitor taps **Install**.  
3. Browser installs the PWA; app icon appears on the device’s home screen.  
4. At first launch of the installed PWA, the system requests Push‑Notification permission.  
5. Visitor accepts → service‑worker stores VAPID key and a test push “Thanks for subscribing!” arrives.  

---

## Post‑conditions  
* PWA is installed on the device.  
* Push notifications are enabled and verified with a test message.  

---

## Standard Alternate / Error Paths

| ID  | Condition / Branch            | Expected behaviour                                               |
|-----|-------------------------------|------------------------------------------------------------------|
| A‑1 | Visitor dismisses infobar     | Dismissal is recorded; prompt is suppressed for 14 days.         |
| A‑2 | Visitor denies push permission| App shows fallback e‑mail subscription banner.                   |

---

## Edge & Stretch Scenarios

| ID  | Category       | Scenario                                             | Release tag |
|-----|----------------|------------------------------------------------------|-------------|
| E‑1 | Connectivity   | Device goes offline during push‑permission request   | Stretch     |
| E‑2 | Permissions    | Visitor denies location permission on first launch   | Stretch     |
| E‑3 | Accessibility  | Visitor switches to high‑contrast mode mid‑flow      | Stretch     |
| E‑4 | Performance    | Large payload arrives while service‑worker is syncing| Stretch     |

---

## Acceptance‑Criteria Stencil (G / W / T)

*Given* visitor is returning for the second time and browser supports PWA  
*When* `beforeinstallprompt` fires  
*Then* mini‑infobar “Add to Home Screen?” is shown  

*Given* visitor taps **Install**  
*When* browser installs the PWA  
*Then* app icon appears on the home screen  

*Given* visitor opens the PWA for the first time  
*When* system requests push permission  
*Then* visitor sees the permission prompt  

*Given* visitor accepts push permission  
*When* subscription succeeds  
*Then* test push “Thanks for subscribing!” is received  

*Given* visitor dismisses infobar  
*When* prompt is suppressed  
*Then* no install prompt is shown for 14 days  

*Given* visitor denies push permission  
*When* subscription fails  
*Then* fallback e‑mail subscription banner is displayed  

---

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Visitor as Returning Visitor
    participant Browser as Browser
    participant Site as Website
    participant SW as Service Worker
    participant PushService as Push Notification Service

    Note over Visitor,Browser: Visitor returns for the second time

    Browser->>Site: Fire beforeinstallprompt event
    Browser->>Visitor: Show mini‑infobar "Add to Home Screen?"

    alt Visitor taps Install
        Visitor->>Browser: Tap Install
        Browser->>Browser: Install PWA
        Browser->>Visitor: Add icon to home screen

        Visitor->>Browser: Launch PWA (first run)
        Browser->>Site: Request push permission
        Visitor->>Browser: Accept permission
        Browser->>SW: Store VAPID key

        SW->>PushService: Subscribe visitor
        PushService-->>SW: Confirm subscription
        SW->>Visitor: Push "Thanks for subscribing!"
    else Visitor dismisses infobar
        Visitor->>Browser: Dismiss infobar
        Browser->>Site: Record dismissal (suppress 14 d)
    else Visitor denies push permission
        Visitor->>Browser: Deny permission
        Browser->>Site: Show e‑mail subscription fallback
    end
