# Casino-jackpot

*Backend*

Setup: Initialized a Node.js server using Express and TypeScript.
Challenge: Faced issues with ts-node-dev and ES Modules compatibility.
Solution: Migrated to tsx for better support of modern TypeScript features.
Status: Server is running locally on port 5000 with CORS and Cookie-parser configured.

Architecture Overview

1. Session Module
Each session is a stateful entity containing:
id – UUID
credits – Current balance (starts at 10)
active – Boolean flag
createdAt – Timestamp

 Architecture Decisions
 Separation of Concerns
 * Controller – Handles HTTP layer & cookie lifecycle
 * Service – Contains business logic
 * Store – Manages persistence

 Storage Abstraction
 * Defined a SessionStore interface.
 * Current implementation: In-Memory Store
 * Future-ready for:Redis, PostgreSQL or MongoDB whiout changes required in business logic to switch storage engines.

 Dependency Injection (DI)
 SessionService receives:SessionStore, SlotMachineService
 This allows: Easy mocking for unit tests and Full decoupling between modules

 Async-First Design
All operations are asynchronous to support:
* Real database integration
* High latency environments
* Scalability

Slot Machine Module
Encapsulated game engine responsible for:
1.  Symbols & Rewards
Symbol	Reward
C	10
L	20
O	30
W	40
Winning Rule: All three symbols must match.

Server-Side Cheat Algorithm
To maintain the house edge, a re-roll mechanism is applied server-side only.
Balance-Based Logic:
a. < 40 Credits → 100% fair random
b. 40–60 Credits → 30% chance to re-roll winning result
c. > 60 Credits → 60% chance to re-roll winning result

The 1-credit cost is deducted before evaluation.
The client is never aware of re-roll.
Only winning combinations may be re-evaluated.
This ensures profitability while maintaining fair-play perception.

3️. Cashout Feature
Allows the player to Withdraw remaining credits, Close the active session and Clear session cookie.
its Validates active session, Returns final payout and Deletes session from storage
4. Global Error Handling

Implemented centralized error management using:
 Custom HttpError Class that allows throwing controlled errors with status codes: throw new HttpError(400, "No credits left");
 Global Error Middleware Handles all application errors , Returns proper HTTP status codes, Prevents leaking internal stack traces, Ensures consistent API responses

 API Endpoints
Fully documented via Swagger (OpenAPI 3.0).
Accessible at: /api-docs

Method	Endpoint	Description
POST	/session	- Creates new session (10 credits)
GET	/session -	Returns current session state
POST	/session/roll -	Executes spin & applies cheat logic
POST	/session/cashout -	Cashes out credits & closes session
