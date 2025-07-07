content = """
# Ride-Hailing Platform – **Asynchronous Event Flow (Sequence Diagram)**

This sequence diagram shows **publish/subscribe** interactions passing through an **Event Bus**.  
Each message is asynchronous (non-blocking), indicated by the double-arrow `->>` syntax in Mermaid.

```mermaid
sequenceDiagram
    autonumber

    %% ========== Participants ==========
    participant P as 📱 Passenger App
    participant D as 🚗 Driver App
    participant BOS as 🛠️ Admin Portal
    participant Match as Matching Engine
    participant Ride as Ride Service
    participant Pay as Payment Service
    participant Notif as Notification Svc
    participant Rating as Rating Svc
    participant Support as Support Svc
    participant Bus as 📨 Event Bus

    %% ========== 1. Ride Request ==========
    P->>Bus: RideRequested
    Bus->>Match: RideRequested

    %% ========== 2. Driver Assigned ==========
    Match->>Bus: DriverAssigned
    Bus->>D: DriverAssigned
    Bus->>Notif: push(DriverAssigned)

    %% ========== 3. Trip Started ==========
    D->>Bus: TripStarted
    Bus->>Ride: TripStarted
    Bus->>Notif: push(TripStarted)

    %% ========== 4. Live Location Updates (loop) ==========
    loop Every 5 s until completed
        D->>Bus: TripLocationUpdate
        Bus->>Ride: TripLocationUpdate
    end

    %% ========== 5. Trip Completed & Fare ==========
    D->>Bus: TripCompleted(km, duration)
    Bus->>Ride: TripCompleted
    Ride->>Bus: FareCalculated(total)
    Bus->>Pay: FareCalculated
    Pay->>Bus: PaymentCaptured
    Bus->>P: PaymentCaptured
    Bus->>D: PaymentCaptured
    Bus->>Notif: push(PaymentCaptured)

    %% ========== 6. Ratings ==========
    par Passenger rates
        P->>Bus: RatingSubmitted(driver★)
    and Driver rates
        D->>Bus: RatingSubmitted(rider★)
    end
    Bus->>Rating: RatingSubmitted

    %% ========== 7. Support Ticket ==========
    P->>Bus: SupportTicketRaised(issue)
    Bus->>Support: SupportTicketRaised
    Support->>Bus: TicketUpdated(status=Assigned)
    Bus->>BOS: TicketUpdated
