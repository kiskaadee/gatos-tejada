# Project Roadmap: Novias del Gato

The project lifecycle is divided into five critical phases, prioritizing backend stability and cultural content quality.

## Phase 1: Strategic Definition & Impact
*   **Goal:** Establish technical success criteria and engagement metrics.
*   **Deliverables:** Final requirements document, "Non-Goals" definition, and initial selection of the 15 original sculptures for the visual recognition dataset.

## Phase 2: API Design & OpenAPI Contracts
*   **Goal:** Create the "Single Source of Truth" (SSOT) via API contracts.
*   **Deliverables:** Complete OpenAPI documentation, Mock servers for frontend/UI parallel work, and relational/spatial database schemas.

## Phase 3: Core Infrastructure & Consensus Engine
*   **Goal:** Build the system's brain.
*   **Deliverables:** PostgreSQL implementation (PostGIS + `pgvector`), Weighted Voting Algorithm logic for mobile location tracking, and report processing services.

## Phase 4: Interaction Layer & Visual Check-ins
*   **Goal:** Implement the user experience and cultural content.
*   **Deliverables:** PWA user interface, Visual Check-in logic (image matching), and "unlockable" cultural assets.

## Phase 5: Audit & Launch
*   **Goal:** Ensure resilience against spoofing and traffic loads.
*   **Deliverables:** Load testing (simulating concurrent users at Cali's "Bulevar del Río"), data accuracy audit, and a controlled Beta launch for a 50-user focus group.
