# Casino-jackpot

Development Journey - Backend
Setup: Initialized a Node.js server using Express and TypeScript.

Challenge: Faced issues with ts-node-dev and ES Modules compatibility.

Solution: Migrated to tsx for better support of modern TypeScript features.

Status: Server is running locally on port 5000 with CORS and Cookie-parser configured.

 Session Module Implementation
 
Feature Overview
Each session is a stateful entity containing:
id: Unique identifier (UUID).
credits: Current balance for the session.
active: Boolean flag indicating if the session is playable.
createdAt: Timestamp for auditing and cleanup.

Architecture Decisions
Separation of Concerns:
Controller: Handles the HTTP layer and cookie management.
Service: Contains pure business logic.
Store: Manages data persistence.

Storage Abstraction: Defined a SessionStore interface. This allows the system to switch from the current In-Memory store to a persistent Redis or Database implementation without touching the business logic.

Dependency Injection (DI): The SessionService receives its store instance via the constructor, making the code  testable and modular.

Async-first Design: All operations are asynchronous, ensuring the architecture is ready for real-world, high-latency database integrations.

Session HTTP Integration
SessionController: Acts as the entry point; it communicates with the service and manages the session cookie lifecycle.
session.routes.ts: Decoupled routing file that defines the feature’s API surface.

 API Documentation (Swagger)
Interactive UI: Integrated Swagger (OpenAPI 3.0) to provide a live testing environment for the API.
Endpoint: Accessible at /api-docs when the server is running.
Purpose: Facilitates smooth integration with the Frontend and serves as a "living document" for the API contract.
