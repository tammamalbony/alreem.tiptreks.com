# E.2 – Profile & Document Management <MVP / Phase-2>

---

## Core Scenario

### Primary actor  
Logged-in Driver

### Trigger event  
Driver navigates to their Profile from the side navigation.

### Pre-conditions  
* Driver has a **valid session** (authenticated)
* Backend is reachable

---

## Main success flow

1. Driver clicks **Profile** in side-nav.  
2. System shows personal info + document list (license, insurance, etc.)  
3. Driver either edits a text field or clicks **Upload** next to a document.  
4. Driver selects a file → system previews it and validates type/size.  
5. Driver clicks **Save** → system stores the document, sets status to **Pending Verification**, and shows a toast notification.  

---

## Post-conditions  
* Profile data or document is updated.
* Document status is set to “Pending Verification”.

---

## Standard Alternate / Error Paths

| ID  | Condition / Branch                | Expected behaviour                                    |
|-----|----------------------------------|-------------------------------------------------------|
| A‑1 | Uploaded file > 5 MB or invalid  | Inline error “File too large or unsupported format.” |
| A‑2 | Verification rejected by ops     | Email + banner “Please re-submit.” shown to driver   |

---

## Edge & Stretch Scenarios

| ID  | Category       | Scenario                                           | Release tag |
|-----|----------------|----------------------------------------------------|-------------|
| E‑1 | Connectivity   | Device goes offline during upload                  | Stretch     |
| E‑2 | Permissions    | Camera access denied (for live doc capture option) | Stretch     |
| E‑3 | Accessibility  | Driver switches to screen reader during edit       | Stretch     |
| E‑4 | Performance    | Large profile image causes UI lag on preview       | Stretch     |

---

## Acceptance-Criteria Stencil (G / W / T)

*Given* a valid session and available profile data  
*When* the driver opens Profile  
*Then* the system shows personal info and documents  

*Given* a supported file is selected  
*When* the driver clicks Save  
*Then* the system stores the document and marks it "Pending Verification"  

*Given* an unsupported file is selected  
*When* validation occurs  
*Then* an inline error message is shown  

*Given* a document is rejected  
*When* the driver returns to Profile  
*Then* an email and banner appear asking for re-submission  

---

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Driver as Driver (Web)
    participant Browser as Browser
    participant Server as Backend Service

    Driver->>Browser: Clicks "Profile"
    Browser->>Server: Fetch profile + docs
    Server-->>Browser: Return profile data
    Browser->>Driver: Display personal info & doc list

    alt Driver edits text
        Driver->>Browser: Update text fields
        Browser->>Server: Save text updates
        Server-->>Browser: OK
        Browser->>Driver: Show "Saved" toast
    else Driver uploads document
        Driver->>Browser: Selects file
        Browser->>Browser: Preview + validate size/type
        alt Invalid file
            Browser->>Driver: Show inline error
        else Valid file
            Driver->>Browser: Clicks "Save"
            Browser->>Server: Upload file
            Server-->>Browser: Store & mark Pending Verification
            Browser->>Driver: Show "Document submitted" toast
        end
    end

    alt Verification rejected (async)
        Server-->>Driver: Send email + banner “Please re-submit.”
    end
