content = """
# Ride-Hailing Platform – End-to-End Sequence Diagram

This detailed sequence shows how **passenger**, **driver**, **admin**, and **backend micro-services** collaborate during a complete ride lifecycle.  
Icons & groupings make it friendlier for product owners and non-engineers.

---

## Legend
| Symbol | Actor / Service |
|--------|-----------------|
| 📱 | Passenger Mobile App |
| 🚗 | Driver Mobile App |
| 🛠️ | Admin / Back-Office Portal |
| ⛓️ Backend | Micro-services cluster (blue box) |

---

```mermaid
%% =======================================================================
%%  Ride-Hailing – End-to-End Sequence (Markdown generated)
%% =======================================================================
sequenceDiagram
    autonumber

    %% ==== Actors ====
    participant P  as 📱 Passenger App
    participant D  as 🚗 Driver App
    participant BOS as 🛠️ Admin Portal

    box "⛓️  Backend"
        participant Auth  as Auth Service
        participant Profile as Profile Service
        participant Ride   as Ride Service
        participant Match  as Matching Engine
        participant Map    as Maps & ETA Svc
        participant Pay    as Payment Svc
        participant Notif  as Push / SMS Svc
        participant Rating as Rating Svc
        participant Support as Support & Ticket Svc
        participant Audit  as Audit Log
    end

    %% -------------------------------------------------------------------
    %% 0. Registration / Login
    %% -------------------------------------------------------------------
    P->>Auth: Sign-Up(email, pwd)
    Auth->>Profile: createRider()
    Profile-->>Auth: riderId
    Auth-->>P: JWT + Refresh
    Note over P: Rider now authenticated

    %% -------------------------------------------------------------------
    %% 1. Creating Ride Request
    %% -------------------------------------------------------------------
    P->>Profile: getSavedPlaces()
    P->>Ride: requestRide(origin, dest, prefs, promoCode)
    Ride->>Auth: validateJWT
    Auth-->>Ride: OK
    Ride->>Map: calcETA(origin, dest)
    Map-->>Ride: {dist, estTime}
    Ride->>Match: queueRequest(reqId, prefs)

    %% -------------------------------------------------------------------
    %% 2. Driver Matching
    %% -------------------------------------------------------------------
    loop Notify nearest drivers
        Match->>D: rideOffer(reqId)
        alt Driver declines / timeout
            Match-->>Audit: recordDecline
        else Driver accepts
            D-->>Match: accept(reqId)
            Match->>Ride: assignDriver(driverId)
            Ride-->>P: showDriver(driverProfile, ETA)
            Notif-->>P: push "Driver on the way"
        end
    end

    %% -------------------------------------------------------------------
    %% 3. Pickup
    %% -------------------------------------------------------------------
    D->>Ride: arrived(reqId)
    Ride-->>P: "Driver arrived" + vibrate
    Notif-->>P: push "Your driver has arrived"
    Note over P,D: Passenger boards

    %% -------------------------------------------------------------------
    %% 4. Trip In-Progress
    %% -------------------------------------------------------------------
    D->>Ride: startTrip(reqId, odometer, time)
    Ride->>Map: startNav(driverGPS)
    Ride-->>P: liveMap(driverGPS)
    loop Every 5 s
        D->>Ride: updateLocation(gps)
        Ride->>Map: updatePolyline(gps)
        Ride-->>P: refreshMap(gps)
    end

    %% -------------------------------------------------------------------
    %% 5. Drop-Off & Payment
    %% -------------------------------------------------------------------
    D->>Ride: completeTrip(reqId, km, duration)
    Ride->>Pay: calcFare(km, duration, surge, promo)
    Pay-->>Ride: fareBreakdown
    Ride-->>P: showFare(fareBreakdown)
    P->>Pay: pay(token, fare)
    Pay-->>Ride: paymentOK
    Pay-->>D: addToPayout(balance)
    Notif-->>D: push "Trip completed – €12.40 earned"

    %% -------------------------------------------------------------------
    %% 6. Rating & Feedback
    %% -------------------------------------------------------------------
    par Passenger rates driver
        P->>Rating: rateDriver(5★, comment)
    and Driver rates rider
        D->>Rating: rateRider(5★)
    end
    Rating-->>Audit: logRatings

    %% -------------------------------------------------------------------
    %% 7. Support / Dispute (optional)
    %% -------------------------------------------------------------------
    P->>Support: openTicket(reqId, issue)
    BOS->>Support: assignTicket(agentId)
    Support-->>BOS: ticketDetails
    BOS->>Support: resolve(refund €3)
    Support->>Pay: refund(€3, riderId)
    Pay-->>Support: refundOK
    Support-->>P: "Refund processed"
```