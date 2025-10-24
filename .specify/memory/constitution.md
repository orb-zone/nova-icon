<!-- Sync Impact Report
Version change: 1.1.0 → 1.2.0 (Added distribution policy - JSR.io publishing)
Modified principles: None
Added sections: Distribution & Publishing
Removed sections: None
Templates requiring updates: Update package setup templates to reference JSR instead of npm
Follow-up TODOs: RATIFICATION_DATE unknown
-->

# nova-icon Constitution

## Core Principles

### I. Library-First
Every feature starts as a standalone library; Libraries must be self-contained, independently testable, documented; Clear purpose required - no organizational-only libraries.

### II. CLI Interface
Every library exposes functionality via CLI; Text in/out protocol: stdin/args → stdout, errors → stderr; Support JSON + human-readable formats.

### III. Test-First (NON-NEGOTIABLE)
TDD mandatory: Tests written → User approved → Tests fail → Then implement; Red-Green-Refactor cycle strictly enforced.

### IV. Integration Testing
Focus areas requiring integration tests: New library contract tests, Contract changes, Inter-service communication, Shared schemas.

### V. Simplicity
Start simple, YAGNI principles; Avoid unnecessary complexity in code and architecture.

## Technology Stack Requirements
Use TypeScript 5 for development; Bun for runtime, building, and testing; TailwindCSS for styling in web components; SVG animations via CSS custom properties and transitions for reliable cross-browser compatibility.

## Development Workflow
Code review required for all changes; Testing gates must pass before merge, including unit tests, integration tests, and accessibility checks (e.g., prefers-reduced-motion); Deployment via automated builds and tests; Follow SVG animation best practices for consistent implementation.

## Distribution & Publishing
All packages must be published to JSR.io (JavaScript Registry), NOT npm; JSR provides native TypeScript support, automatic documentation generation, and modern ESM-first distribution; Package structure must include TypeScript source files for JSR publication; Use `jsr publish` for releases; Installation via `npx jsr add @orb-zone/package-name` or `deno add @orb-zone/package-name`.

## Governance
Constitution supersedes all other practices; Amendments require documentation, approval, migration plan; All PRs/reviews must verify compliance.

**Version**: 1.2.0 | **Ratified**: TODO(RATIFICATION_DATE): Original adoption date unknown | **Last Amended**: 2025-10-24
