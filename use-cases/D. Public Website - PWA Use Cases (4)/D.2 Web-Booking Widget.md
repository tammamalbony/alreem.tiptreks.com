# D.2 – Web-Booking Widget <MVP / Phase-2>

---

## Core Scenario

### Primary actor  
Visitor (not required to log in)

### Trigger event  
Visitor opens the Book a Ride widget on the website.

### Pre-conditions  
* Widget script loaded  
* Geolocation permission optional

---

## Main success flow

1. Visitor opens the Book a Ride widget.  
2. Visitor enters Destination (mandatory) → autocomplete list appears.  
3. Visitor optionally enters Pickup location; if left blank and consent given, system uses current location.  
4. System calls `/quote` API → returns distance and price with note “Pay driver on arrival.”  
5. Visitor clicks “Request Ride” → system prompts for phone number.  
6. Visitor enters phone number → receives OTP → verifies OTP.  
7. System creates ride request and shows “Driver on the way – watch your phone.”

---

## Post-conditions  

* Ride request is created and active with assigned driver notification to visitor.

---

## Standard Alternate / Error Paths  

| ID  | Condition / Branch          | Expected behaviour                                   |
|------|----------------------------|----------------------------------------------------|
| A‑1  | Geolocation denied          | User must manually type pickup location.           |
| A‑2  | Phone already linked to account | System prompts user to login instead of OTP sign-up. |
| A‑3  | Wrong OTP                  | System shows error message and offers resend option. |

---

## Edge & Stretch Scenarios  

| ID  | Category       | Scenario                                            | Release tag |
|------|----------------|-----------------------------------------------------|-------------|
| E‑1  | Connectivity   | Device goes offline during OTP verification          | Stretch     |
| E‑2  | Permissions    | User denies geolocation permission on first launch  | Stretch     |
| E‑3  | Accessibility  | Switch to high-contrast mode during widget use       | Stretch     |
| E‑4  | Performance    | Large API response delay during quote retrieval      | Stretch     |

---

## Acceptance-Criteria Stencil (G/W/T)

Given widget script loaded and visitor opens widget  
When visitor enters destination  
Then autocomplete list appears  

Given visitor denies geolocation  
When pickup location needed  
Then user must enter pickup manually  

Given visitor enters phone  
When OTP sent and verified  
Then ride request created and confirmation shown  

Given wrong OTP entered  
When visitor attempts to verify  
Then error message shown and resend option provided  

---

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Visitor as Visitor
    participant Widget as Booking Widget
    participant System as Backend System
    participant SMS as OTP Service

    Visitor->>Widget: Open Book a Ride widget
    Visitor->>Widget: Enter Destination
    Widget->>System: Request autocomplete suggestions
    System-->>Widget: Return autocomplete list
    Widget->>Visitor: Show autocomplete suggestions

    Visitor->>Widget: Enter Pickup (optional)
    alt Pickup blank + consent granted
        Widget->>System: Request current location (geolocation)
        System-->>Widget: Return current location
    else Pickup manually entered or no consent
        Widget->>Visitor: Use manual pickup input
    end

    Widget->>System: Call /quote with pickup & destination
    System-->>Widget: Return distance & price info

    Visitor->>Widget: Click "Request Ride"
    Widget->>Visitor: Prompt for phone number
    Visitor->>Widget: Enter phone number

    Widget->>System: Check phone status
    alt Phone linked to account
        System-->>Widget: Prompt login
    else New or unlinked phone
        Widget->>SMS: Send OTP
        SMS-->>Visitor: Deliver OTP
        Visitor->>Widget: Enter OTP
        Widget->>SMS: Verify OTP
        alt OTP valid
            SMS-->>Widget: Confirm verified
            Widget->>System: Create ride request
            System-->>Widget: Confirm ride created
            Widget->>Visitor: Show "Driver on the way"
        else OTP invalid
            SMS-->>Widget: OTP error
            Widget->>Visitor: Show error + resend option
        end
    end
