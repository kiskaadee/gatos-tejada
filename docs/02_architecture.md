# Technical Architecture: Novias del Gato

## Requirements

### Functional Requirements
*   **Dynamic Geolocation:** Interactive map showing Points of Interest (POI) with availability states: *On-Site*, *Moved*, or *Missing*.
*   **Hybrid Reporting System:** Interface to capture GPS coordinates and image metadata when reporting a sighting.
*   **Visual Validation Engine:** Comparison of image embeddings to ensure the photographed object is indeed the selected sculpture.
*   **Personal Catalog:** Persistence layer tracking which sculptures each unique user has visited, unlocking cultural content.

### Non-Functional Requirements
*   **Geographic Integrity (PostGIS):** Precision within 10 meters for proximity queries.
*   **API-First Methodology:** All business logic must reside in endpoints documented via OpenAPI.
*   **Recognition Latency:** Validation of image and location must not exceed 3 seconds.
*   **Basic Offline Availability:** Allow users to record sightings in low-signal areas and sync when connectivity returns.

## Tech Stack
*   **API / Contract:** OpenAPI (Swagger).
*   **Database:** PostgreSQL + PostGIS (Spatial data).
*   **Vector Search Engine:** `pgvector` (PostgreSQL extension) for storing and comparing image embeddings.
*   **Backend:** Python (FastAPI) for high-performance concurrency, business logic, and spatial/vector database routing.
*   **Identity (Auth):** Google OAuth + JWT.
*   **Frontend:** Next.js (PWA) using WebXR/Camera APIs for the Visual Check-in experience.
*   **Infrastructure:** Docker / Modular Monolith.

## Logical Services

### 1. Identity & Profile Service
Manages user lifecycle, SSO, and the `trust_score` used by the reputation engine.

### 2. Integrity & Reputation Engine
Filters malicious traffic and spoofing. Performs **Velocity Checks** (time/distance deltas) and calculates user voting weight.

### 3. Hybrid Recognition Service
Validates "Check-ins" by comparing image vectors and GPS proximity using a `similarity_threshold`.

### 4. Interaction & Collection Service
Manages the many-to-many relationship between users and sculptures (unlocked achievements).

### 5. Crowdsourcing & Ticket Service
Manages asynchronous reports (Tickets) for moved or missing sculptures.

### 6. Location Tracker Service (The Oracle)
The final consumer of corroborated reports. Updates the "Single Source of Truth" (SSOT) for sculpture locations using a **Weighted Voting Algorithm**.

## Architecture Decision Records (ADR)
*   **Separation of Check-in vs. Ticket:** Allows the system to be usable even with incorrect location data, fostering community correction without blocking the fun.
*   **Single Database (pgvector + PostGIS):** Reduces network latency and synchronization complexity between spatial and vector data.
*   **PWA Priority:** Chosen for immediate access (QR/URL) over the friction of app store downloads, especially for tourists.
