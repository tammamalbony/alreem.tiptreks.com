# D.1 – Browse Marketing Content <MVP / Phase-2>

---

## Core Scenario

### Primary actor  
Visitor / Prospective Rider or Driver

### Trigger event  
User navigates to marketing content via homepage or deep-linked SEO page.

### Pre-conditions  
* Browser online  
* Public site DNS resolves

---

## Main success flow

1. Visitor lands on Home or deep-linked SEO page (e.g., FAQ, Blog).  
2. System serves Server-Side Rendered (SSR) HTML with meta tags and JSON-LD for SEO.  
3. User scrolls or navigates via header links (e.g., How It Works, Driver Sign-Up).  
4. Images lazy-load; responsive layout adapts to viewport size.

---

## Post-conditions  

* Visitor successfully browses marketing content with SEO-optimized pages and responsive UX.

---

## Standard Alternate / Error Paths  

| ID  | Condition / Branch               | Expected behaviour                               |
|------|--------------------------------|------------------------------------------------|
| A‑1  | Slow connection                 | System serves critical CSS + skeleton first; images load later |
| A‑2  | Broken link                    | Route user to D.4 (404 page)                     |

---

## Edge & Stretch Scenarios  

| ID  | Category       | Scenario                                         | Release tag |
|------|----------------|-------------------------------------------------|-------------|
| E‑1  | Connectivity   | Device goes offline during page navigation       | Stretch     |
| E‑2  | Permissions    | User denies cookies or tracking permission       | Stretch     |
| E‑3  | Accessibility  | Switch to high-contrast mode mid-browse          | Stretch     |
| E‑4  | Performance    | Large page assets slow loading                     | Stretch     |

---

## Acceptance-Criteria Stencil (G/W/T)

Given browser online and DNS resolves  
When user navigates to marketing content page  
Then system serves SSR HTML with meta tags and JSON-LD  

Given slow connection  
When user loads page  
Then system serves critical CSS + skeleton first, images lazy-load after  

Given broken link  
When user clicks broken link  
Then system routes to D.4 (404 page)

---

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Visitor as Visitor
    participant Browser as Browser
    participant Server as Web Server
    participant CDN as CDN

    Visitor->>Browser: Navigate to Home or deep-linked SEO page
    Browser->>Server: Request SSR HTML with meta tags + JSON-LD
    Server->>CDN: Check cached content
    CDN-->>Server: Return cached SSR HTML (if any)
    Server-->>Browser: Serve SSR HTML + meta tags + JSON-LD
    Browser->>Visitor: Render initial page

    Visitor->>Browser: Scroll / Click header links
    Browser->>Server: Request new page HTML (via SSR)
    Server-->>Browser: Return page HTML
    Browser->>Visitor: Render page, lazy-load images
