# D.4 – Handle 404 & Offline States <MVP / Phase-2>

---

## Core Scenario

### Primary actor  
Visitor / Installed PWA User

### Trigger event  
Visitor requests a non-existent route **or** loses internet connectivity.

### Pre-conditions  
* Visitor is using the web app (online or PWA)  
* Service worker is installed  
* Site is served via HTTPS  

---

## Main success flow

### 404 Flow:
1. Visitor navigates to a non-existent route.  
2. Server responds with 404 status.  
3. App displays a custom 404 page with friendly illustration.  
4. Page includes CTAs: “Go Home”, “Book a Ride”, and a search box.  

### Offline Flow:
1. Visitor loses network connectivity.  
2. Service worker intercepts request.  
3. App displays `offline.html` from cache with message: “You’re offline—content will update when connected.”  
4. When connection is restored, service worker fetches and swaps in live content.

---

## Post-conditions  
* Visitor is shown a helpful UI in both 404 and offline scenarios.  
* When online connectivity is restored, content is updated seamlessly.

---

## Standard Alternate / Error Paths

### A‑1  
**Condition / Branch:** Visitor requests route while offline with no cached `offline.html`  
**Expected behaviour:** Browser shows default offline error screen.

### A‑2  
**Condition / Branch:** Visitor clicks “Retry” while still offline  
**Expected behaviour:** Page reloads same offline view without crashing or error loops.

---

## Edge & Stretch Scenarios  

| ID  | Category       | Scenario                                           | Release tag |
|-----|----------------|----------------------------------------------------|-------------|
| E‑1 | Connectivity    | Device goes offline during request                | Stretch     |
| E‑2 | Permissions     | User denies location or geolocation fails         | Stretch     |
| E‑3 | Accessibility   | Switch to high-contrast mode while offline        | Stretch     |
| E‑4 | Performance     | Large image asset missing in offline.html         | Stretch     |

---

## Acceptance-Criteria Stencil (G/W/T)

Given visitor navigates to non-existent route  
When server returns 404  
Then custom 404 page is shown with CTAs  

Given user is offline  
When request is intercepted by service worker  
Then cached `offline.html` is served with friendly message  

Given user is offline and clicks Retry  
When connection is not restored  
Then offline page is reloaded  

Given offline.html is not cached  
When visitor is offline on first visit  
Then browser displays default offline page  

Given user regains connectivity  
When service worker detects network restoration  
Then live content replaces offline content  

---

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Visitor as Visitor / PWA User
    participant Browser as Browser
    participant SW as Service Worker
    participant Server as Web Server

    alt 404 Flow
        Visitor->>Browser: Navigate to non-existent route
        Browser->>Server: Request route
        Server-->>Browser: Respond with 404
        Browser->>Visitor: Render custom 404 page with CTAs
    end

    alt Offline Flow with cache
        Visitor->>Browser: Navigate while offline
        Browser->>SW: Intercept request
        SW-->>Browser: Serve offline.html from cache
        Browser->>Visitor: Show offline message
        Note over SW,Visitor: Connection restored
        SW->>Server: Fetch live content
        Server-->>SW: Return updated content
        SW->>Browser: Swap in live content
    else Offline Flow without cache
        Visitor->>Browser: Navigate while offline
        Browser->>SW: Intercept request
        SW-->>Browser: No cached response
        Browser->>Visitor: Show browser default offline page
    end

    alt Retry while still offline
        Visitor->>Browser: Click "Retry"
        Browser->>SW: Attempt fetch
        SW-->>Browser: Still offline
        Browser->>Visitor: Reload offline.html
    end
