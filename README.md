# Casino-jackpot

## Backend

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
POST	/session	- Creates new session (10 credits).

GET	/session -	Returns current session state.

POST	/session/roll -	Executes spin & applies cheat logic.

POST	/session/cashout -	Cashes out credits & closes session.

### Testing
- Integration tests: `session.test.ts` — covers all API endpoints and edge cases
- Unit tests: `slot.service.test.ts` — covers cheat algorithm with boundary conditions (39, 40, 60, 61 credits)

Run tests: `npm test`

-------------------------------------------------------------------------------------------------

## Frontend

Setup
Initialized a React application using Vite with TypeScript for fast development and modern tooling.
Tech Stack: React 18, TypeScript, Vite
Structure: Organized as part of the mono-repo under /client

Architecture Overview
Component Structure
The UI is split into small, focused components following the Single Responsibility Principle:

App.tsx – Root component, orchestrates game state and animation hooks
SlotBoard – Renders the three slot cells in a row
SlotCell – Individual slot cell; handles spinning animation when value is "X"
Controls – Roll and Cash Out buttons with disabled state management
CreditsDisplay – Displays the current credit balance

Custom Hooks
Business logic and side effects are encapsulated in two dedicated hooks:

useGame – Manages all server communication and game state (credits, slots, session lifecycle). Initializes a session on mount via POST /session.
useSlotAnimation – Manages the visual animation layer independently from the server state. Decouples what the user sees from what the server returns, enabling a staged reveal animation (slot 1 → slot 2 → slot 3) with configurable delays.

Separation of Concerns
A deliberate architectural decision was made to separate game state from display state:

useGame holds the true server state
useSlotAnimation holds the display state shown to the user

This allows the spin animation to play out naturally even after the API response has already returned, providing a better user experience.
API Layer
All server calls are abstracted in api.ts, keeping components and hooks free of fetch logic. Each function maps to a single endpoint and throws on non-OK responses, enabling clean error handling upstream.
Optimistic UI
When a roll is initiated, the credit counter is decremented immediately on the client (before the server responds). If the request fails, the credit is restored — keeping the UI responsive and consistent.
Error Handling
Errors from the API are caught at the hook level and surfaced via an error state field, displayed inline in the UI without crashing the application.

Game Flow

On mount → POST /session creates a new session with 10 credits
User clicks Roll → animation starts, API call is made, slots reveal sequentially
If credits reach 0 → buttons are disabled, "Start New Game" button appears
User clicks Cash Out → POST /session/cashout is called, payout is shown via alert, session ends

Key Challenges & Solutions

Challenge: Keeping the animation in sync with async API responses without blocking the UI.
Solution: useSlotAnimation starts the spin immediately and independently schedules the staged reveal using setTimeout, regardless of when the API responds.
Challenge: Preventing stale credit display during animation.
Solution: Credits are updated optimistically on spin start and corrected once the server response arrives at the end of the animation sequence.

