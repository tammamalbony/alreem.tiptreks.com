# E.4 – View Ride History & Filters <MVP / Phase‑2>

---

## Core Scenario

### Primary actor  
Logged‑in Driver

### Trigger event  
Driver selects **Ride History** from the navigation menu.

### Pre‑conditions  
* Driver is authenticated (valid session)  
* At least **one completed ride** exists in the system  

---

## Main success flow

1. Driver opens **Ride History**.  
2. System fetches rides and displays a paginated table showing **date, pickup, drop‑off, distance (km)**.  
3. Driver sets filters (date range, ride status) → table refreshes with matching rides.  
4. Driver clicks a table row → modal appears with ride details: map trace, rider rating, fare, etc.  

---

## Post‑conditions  
* Driver can review past rides with filters applied.  
* Detailed view provides route map and ratings.

---

## Standard Alternate / Error Paths

| ID  | Condition / Branch          | Expected behaviour                                           |
|-----|-----------------------------|--------------------------------------------------------------|
| A‑1 | No rides match filter       | Show empty‑state illustration “No rides for selected range.” |
| A‑2 | Map service fails to load   | Modal shows details minus map, plus “Map unavailable.”       |

---

## Edge & Stretch Scenarios

| ID  | Category       | Scenario                                   | Release tag |
|-----|----------------|--------------------------------------------|-------------|
| E‑1 | Connectivity   | Device goes offline during filter request  | Stretch     |
| E‑2 | Permissions    | Browser blocks geolocation for map tiles   | Stretch     |
| E‑3 | Accessibility  | Driver toggles high‑contrast mid‑view      | Stretch     |
| E‑4 | Performance    | Very large ride history slows table render | Stretch     |

---

## Acceptance‑Criteria Stencil (G / W / T)

*Given* driver is logged in with completed rides  
*When* Ride History is opened  
*Then* a table of rides with columns date, pickup, drop‑off, km is shown  

*Given* the driver selects a date range and status filter  
*When* **Apply Filters** is clicked  
*Then* the table refreshes with matching rides  

*Given* the driver clicks a ride row  
*When* ride details modal loads successfully  
*Then* map trace and rider rating are displayed  

*Given* no rides match the filter  
*When* filters are applied  
*Then* an empty‑state illustration appears  

---

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Driver as Driver (Web)
    participant Browser as Browser
    participant API as Rides API
    participant Map as Map Service

    Driver->>Browser: Click "Ride History"
    Browser->>API: GET /rides?driverId
    API-->>Browser: Return ride list
    Browser->>Driver: Render table (date, pickup, drop-off, km)

    Driver->>Browser: Set filters (date range, status)\nClick "Apply"
    Browser->>API: GET /rides?filters
    API-->>Browser: Filtered list
    alt No rides
        Browser->>Driver: Show empty‑state illustration
    else Rides found
        Browser->>Driver: Refresh table
        Driver->>Browser: Click ride row
        Browser->>API: GET /rides/{rideId}
        API-->>Browser: Ride detail (route, rating, fare)
        Browser->>Map: Load map tiles / polyline
        Map-->>Browser: Map data
        Browser->>Driver: Show modal with map & rating
    end
