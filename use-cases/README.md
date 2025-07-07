<details>
<summary><strong>A. Passenger (Rider) Use Cases (16)</strong></summary>

| ID   | Title                                 |
|------|---------------------------------------|
| A.1  | Register / Sign Up                    |
| A.2  | Login / Authenticate                  |
| A.3  | Forgot / Reset Password               |
| A.4  | Edit Profile & Preferences            |
| A.5  | Request a Ride                        |
| A.6  | Wait for Driver (Ads + Progress Bar)  |
| A.7  | Track Driver & Trip Status            |
| A.8  | Cancel Ride                           |
| A.9  | Rate & Review Driver                  |
| A.10 | View Ride History                     |
| A.11 | Safety Centre (SOS & Share Trip)      |
| A.12 | In-App Support Chat (Rider)           |
| A.13 | Manage Favourite Locations            |
| A.14 | Modify Destination Before Pickup      |
| A.15 | Share Live Trip Link                  |
| A.16 | Manage Notification Preferences       |

</details>

<details>
<summary><strong>B. Driver Use Cases (13)</strong></summary>

| ID   | Title                             |
|------|-----------------------------------|
| B.1  | Driver Onboarding & Vehicle Setup |
| B.2  | Go Online / Offline               |
| B.3  | Accept / Decline Ride             |
| B.4  | Navigate to Pickup & Start Trip   |
| B.5  | Complete Trip & End Ride          |
| B.6  | Earnings Dashboard (Distance-Only) |
| B.7  | View Ride History & Filters       |
| B.8  | Profile & Document Management     |
| B.9  | In-App Support Chat (Driver)      |
| B.10 | Change Password / MFA Recovery    |
| B.11 | Safety Incident Reporting         |
| B.12 | Rate & Review Rider               |
| B.13 | Export Distance Log (CSV)         |

</details>

<details>
<summary><strong>C. Admin / Back-Office Use Cases (21)</strong></summary>

| ID   | Title                                               |
|------|-----------------------------------------------------|
| C.1  | Approve / Reject Driver Applications                |
| C.2  | Show / Hide Driver Details to Clients               |
| C.3  | Assign Driver Manually / Forward to Fleet           |
| C.4  | Configure Pricing Parameters (base + per-km + per-minute) |
| C.5  | Enable / Disable Auto-Assignment                    |
| C.6  | Resolve Disputes & Support Tickets                  |
| C.7  | Promotion & Campaign Management                     |
| C.8  | Block-List Management                               |
| C.9  | Spam Filtering & Content Moderation                 |
| C.10 | Enhanced Support & Ticket Workflows                 |
| C.11 | CRUD Admin Accounts & Roles                         |
| C.12 | Content Management (Blog / FAQ / Banners)           |
| C.13 | Analytics & Reports                                 |
| C.14 | System Settings & Security                          |
| C.15 | Suspend / Reinstate Driver                          |
| C.16 | GDPR Data-Erasure Workflow                          |
| C.17 | Audit Log & Access Review                           |
| C.18 | Configure Retention Windows                         |
| C.19 | System Health & Alerting                            |
| C.20 | Role & Permission Templates                         |
| C.21 | Generate & Schedule Reports                         |

</details>

<details>
<summary><strong>D. Public Website / PWA Use Cases (4)</strong></summary>

| ID   | Title                      |
|------|----------------------------|
| D.1  | Browse Marketing Content   |
| D.2  | Web-Booking Widget         |
| D.3  | Install PWA & Receive Push |
| D.4  | Handle 404 & Offline States|

</details>

<details>
<summary><strong>E. Driver Portal (Web) Use Cases (8)</strong></summary>

| ID   | Title                         |
|------|-------------------------------|
| E.1  | Login & MFA                   |
| E.2  | Profile & Document Management |
| E.3  | Availability Scheduling       |
| E.4  | View Ride History & Filters   |
| E.5  | Earnings Dashboard            |
| E.6  | Support Centre                |
| E.7  | Two-Factor Recovery           |
| E.8  | Download & Print Documents    |

</details>

<details>
<summary><strong>F. Cross-Cutting / System-Wide Use Cases (3)</strong></summary>

| ID   | Title                                    |
|------|------------------------------------------|
| F.1  | Localization / Language Switch           |
| F.2  | Accessibility Settings (contrast, font, screen-reader) |
| F.3  | Notifications Center (view & dismiss past pushes) |

</details>

---

## Suggested component-level diagrams for the ride-hailing platform

<details>
<summary><strong>Component Diagram Modules</strong></summary>

1. **Mobile Apps ↔ API Gateway**  
   - Passenger & Driver apps  
   - API-Gateway façade  
   - Rate-limiting  
   - JWT injection  

2. **Authentication & Identity**  
   - Auth service  
   - MFA  
   - Password reset  
   - Social-login adapters  

3. **User Profile & Preferences**  
   - Profile service  
   - Favorites  
   - Notification settings  
   - GDPR store  

4. **Ride Request & Matching**  
   - Ride service  
   - Matching engine  
   - Surge calculator  
   - ETA/maps adapter  

5. **Driver Dispatch & Navigation**  
   - Driver status service  
   - Route-planner  
   - Telemetry collector  

6. **Trip Lifecycle Management**  
   - State-machine  
   - Odometer tracker  
   - Cancellation handler  

7. **Payment, Pricing & Payouts**  
   - Fare calculator  
   - Promo/discount engine  
   - Payment gateway  
   - Driver wallet  

8. **Rating & Feedback**  
   - Rating service  
   - Sentiment filter  
   - Reputation scorer  

9. **Notification Delivery**  
   - Push gateway  
   - SMS/email adapters  
   - Templating service  

10. **Support & Ticketing**  
    - Ticket service  
    - Chatbot  
    - Agent console  
    - SLA timer  

11. **Admin / Back-Office Portal**  
    - RBAC layer  
    - Driver-approval workflow  
    - Content CMS  

12. **Analytics & Reporting**  
    - Event sink  
    - OLAP store  
    - Dashboard renderer  
    - Export scheduler  

13. **Audit & Compliance**  
    - Audit log  
    - Access-review tool  
    - GDPR erasure workflow  

14. **Configuration & Pricing Management**  
    - Feature-flag service  
    - Pricing rule store  
    - Dynamic config API  

15. **Promotion & Campaign Manager**  
    - Voucher generator  
    - Segmentation engine  
    - Campaign scheduler  

16. **Maps & Geolocation Services**  
    - Map tile proxy  
    - Geocoder  
    - Distance-matrix cache  

17. **Event Bus & Streaming**  
    - Kafka/NATS cluster  
    - Schema registry  
    - DLQ & retry orchestrator  

18. **Monitoring & Alerting**  
    - Metrics collector  
    - Log shipper  
    - APM  
    - On-call PagerDuty  

19. **System Health & Self-Healing**  
    - Circuit-breaker  
    - Auto-scaler  
    - Chaos injector  

20. **Developer / Partner API**  
    - OAuth2 server  
    - Rate-limiter  
    - API documentation portal  


</details>
