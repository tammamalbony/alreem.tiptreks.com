content = """
# Mobile Apps ↔ API Gateway – Sequence Diagram

This diagram focuses on how the **Passenger & Driver mobile apps** interact with the **API-Gateway façade**, highlighting **rate-limiting** and **JWT injection** steps.

```mermaid
sequenceDiagram
    autonumber
    participant P as 📱 Passenger App
    participant D as 🚗 Driver App
    participant GW as 🛡️ API Gateway
    participant Svc as ⛓️ Downstream Service

    Note over GW: Functions: <br/>• Rate-Limiting <br/>• JWT Injection <br/>• Routing

    %% -------- Passenger Request --------
    P->>GW: HTTPS Request<br/>(/ride/request)
    GW->>GW: Check Rate-Limit (per-IP / per-Token)
    alt JWT present?
        GW->>GW: Validate & Refresh JWT
    else No JWT or Expired
        GW-->>P: 401 Unauthorized
    end
    GW->>GW: Add JWT header
    GW->>Svc: Forward Request + JWT
    Svc-->>GW: 200 OK / JSON
    GW-->>P: Response

    %% -------- Driver Request (parallel) --------
    par Driver Flow
        D->>GW: HTTPS Request<br/>(/driver/goOnline)
        GW->>GW: Check Rate-Limit
        GW->>GW: Validate JWT
        GW->>GW: Add JWT header
        GW->>Svc: Forward Request + JWT
        Svc-->>GW: 200 OK
        GW-->>D: Response
    end
